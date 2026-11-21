import { SearchResult } from '../types/search.types';

/**
 * Deduplicates search results by URL, keeping the highest relevance score.
 */
export function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen = new Map<string, SearchResult>();

  for (const result of results) {
    const existing = seen.get(result.url);
    if (!existing || (result.relevanceScore ?? 0) > (existing.relevanceScore ?? 0)) {
      seen.set(result.url, result);
    }
  }

  return Array.from(seen.values());
}

/**
 * Deduplicates an array of strings (e.g. related topics).
 */
export function deduplicateStrings(items: string[]): string[] {
  return [...new Set(items.map(s => s.trim().toLowerCase()))].map(
    s => s.charAt(0).toUpperCase() + s.slice(1)
  );
}
