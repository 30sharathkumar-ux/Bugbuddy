import { SearchResult, RankedSource } from '../types/search.types';
import { ExtractedContent } from '../types/debug.types';
import logger from '../utils/logger';

export class SourceRankingService {
  private readonly maxSources: number;

  constructor() {
    this.maxSources = parseInt(process.env.MAX_RESEARCH_SOURCES ?? '15', 10);
  }

  rank(results: SearchResult[], extracted: ExtractedContent[]): RankedSource[] {
    const scoreMap = new Map<string, number>(
      extracted.map(e => [e.url, e.relevanceScore])
    );

    // Trusted domains get a boost
    const trustedDomains = [
      'stackoverflow.com', 'github.com', 'docs.', 'developer.mozilla.org',
      'medium.com', 'dev.to', 'npmjs.com', 'pypi.org',
    ];

    const scored = results.map(result => {
      let score = scoreMap.get(result.url) ?? 0.3;

      const isTrusted = trustedDomains.some(d => result.url.includes(d));
      if (isTrusted) score = Math.min(score + 0.2, 1);

      // Slight penalty for very short snippets
      if (result.snippet.length < 50) score = Math.max(score - 0.1, 0);

      return { ...result, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, this.maxSources).map((s, idx) => ({
      title: s.title,
      url: s.url,
      snippet: s.snippet,
      source: s.source,
      score: s.score,
      rank: idx + 1,
    }));
  }
}

export const sourceRankingService = new SourceRankingService();
