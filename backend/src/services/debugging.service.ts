import { geminiService } from './gemini.service';
import { queryGeneratorService } from './query-generator.service';
import { retrievalService } from './retrieval.service';
import { contentExtractorService } from './content-extractor.service';
import { sourceRankingService } from './source-ranking.service';
import { DebugRequest, DebugResponse, ResearchSource } from '../types/debug.types';
import { RankedSource } from '../types/search.types';
import { deduplicateStrings } from '../utils/deduplicate';
import logger from '../utils/logger';

export class DebuggingService {
  async debug(request: DebugRequest): Promise<DebugResponse> {
    logger.info('Starting debug pipeline', { error: request.errorMessage.substring(0, 100) });

    // 1. Generate search queries (with 30s timeout, falls back automatically)
    const queries = await queryGeneratorService.generateQueries(request);

    // 2. Retrieve search results (parallel SerpAPI + You.com)
    const rawResults = await retrievalService.retrieve(queries);

    // 3. Extract and score content
    const extracted = contentExtractorService.extractAndScore(rawResults, request.errorMessage);

    // 4. Rank sources — cap at 5 for Gemini context to avoid huge prompts
    const rankedSources = sourceRankingService.rank(rawResults, extracted);
    const topSources = rankedSources.slice(0, 5);

    // 5. Build Gemini analysis prompt with top sources
    const analysisResult = await this.analyzeWithGemini(request, topSources);

    return {
      ...analysisResult,
      researchSources: rankedSources.slice(0, 8).map(s => ({
        title: s.title,
        url: s.url,
        snippet: s.snippet,
        relevance: s.score,
      })),
      timestamp: new Date().toISOString(),
    };
  }

  private async analyzeWithGemini(
    request: DebugRequest,
    sources: RankedSource[]
  ): Promise<Omit<DebugResponse, 'researchSources' | 'timestamp'>> {
    // Keep each source snippet concise — trim to 200 chars
    const sourceContext = sources
      .map((s, i) => `[${i + 1}] ${s.title}\n${s.snippet.slice(0, 200)}\nURL: ${s.url}`)
      .join('\n\n');

    // Trim the error message to 500 chars to avoid huge prompts
    const errorTrimmed = request.errorMessage.slice(0, 500);

    const prompt = `You are an expert software debugger. Analyze the error and provide a debugging guide.

ERROR: ${errorTrimmed}
${request.language ? `LANGUAGE: ${request.language}` : ''}
${request.framework ? `FRAMEWORK: ${request.framework}` : ''}
${request.additionalContext ? `CONTEXT: ${request.additionalContext}` : ''}

RESEARCH SOURCES (use to inform analysis):
${sourceContext}

Respond ONLY with a JSON object matching this structure (no extra text):
{
  "success": true,
  "errorType": "short error category",
  "rootCause": "1-2 sentence explanation",
  "solutions": [
    {
      "title": "Solution title",
      "explanation": "Explanation",
      "steps": [
        { "stepNumber": 1, "title": "Step", "description": "What to do", "codeExample": "optional" }
      ],
      "codeFixExample": "optional code",
      "confidence": "high"
    }
  ],
  "relatedTopics": ["topic1", "topic2"],
  "estimatedFixTime": "5-10 minutes"
}

Provide 2-3 solutions ordered by likelihood of success. Keep responses concise.`;

    try {
      const result = await geminiService.generateJSON<Omit<DebugResponse, 'researchSources' | 'timestamp'>>(
        prompt,
        'debug-analysis'
      );
      result.relatedTopics = deduplicateStrings(result.relatedTopics ?? []);
      return result;
    } catch (error) {
      logger.error('Gemini analysis failed', { error });
      return {
        success: false,
        errorType: 'Unknown',
        rootCause: 'AI analysis timed out or failed. The search results above still contain relevant sources.',
        solutions: [],
        relatedTopics: [],
        estimatedFixTime: undefined,
      };
    }
  }
}

export const debuggingService = new DebuggingService();
