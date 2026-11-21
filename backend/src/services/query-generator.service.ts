import { geminiService } from './gemini.service';
import { DebugRequest } from '../types/debug.types';
import { SearchQuery } from '../types/search.types';
import logger from '../utils/logger';

export class QueryGeneratorService {
  async generateQueries(request: DebugRequest): Promise<SearchQuery> {
    const { errorMessage, codeSnippet, language, framework, additionalContext } = request;

    const context = [
      language && `Language: ${language}`,
      framework && `Framework: ${framework}`,
      additionalContext && `Context: ${additionalContext}`,
    ]
      .filter(Boolean)
      .join('\n');

    const prompt = `You are an expert software debugger. Given the following error, generate search queries to find solutions.

Error: ${errorMessage}
${codeSnippet ? `\nCode snippet:\n${codeSnippet}` : ''}
${context ? `\n${context}` : ''}

Return a JSON object with:
- "primary": the best single search query (string)
- "alternatives": array of 3-4 alternative search queries (string[])

Focus on: error type, root cause, library/framework specifics, and common fixes.`;

    try {
      return await geminiService.generateJSON<SearchQuery>(prompt);
    } catch (error) {
      logger.error('Query generation failed, using fallback', { error });
      return {
        primary: `${errorMessage} fix solution`,
        alternatives: [
          `how to fix ${errorMessage}`,
          `${language ?? 'programming'} error ${errorMessage}`,
          `${errorMessage} stack overflow`,
        ],
      };
    }
  }
}

export const queryGeneratorService = new QueryGeneratorService();
