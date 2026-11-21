import { SearchResult } from '../types/search.types';
import { ExtractedContent } from '../types/debug.types';
import logger from '../utils/logger';

export class ContentExtractorService {
  /**
   * Extracts and scores content from search results.
   * In a production system this would fetch and parse HTML. For now we score
   * based on snippet length and keyword overlap with the error message.
   */
  extractAndScore(results: SearchResult[], errorMessage: string): ExtractedContent[] {
    const errorTokens = this.tokenize(errorMessage);

    return results
      .map(result => {
        const content = `${result.title} ${result.snippet}`;
        const relevanceScore = this.scoreRelevance(content, errorTokens);
        return {
          url: result.url,
          title: result.title,
          content,
          relevanceScore,
        };
      })
      .filter(c => c.content.length > 20);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\W+/)
      .filter(t => t.length > 2);
  }

  private scoreRelevance(content: string, errorTokens: string[]): number {
    if (errorTokens.length === 0) return 0.5;
    const contentLower = content.toLowerCase();
    const matches = errorTokens.filter(t => contentLower.includes(t)).length;
    const base = matches / errorTokens.length;
    // Bonus for longer, richer snippets
    const lengthBonus = Math.min(content.length / 2000, 0.2);
    return Math.min(base + lengthBonus, 1);
  }
}

export const contentExtractorService = new ContentExtractorService();
