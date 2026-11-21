import { serpApiService } from './serpapi.service';
import { youComService } from './youcom.service';
import { SearchResult, SearchQuery } from '../types/search.types';
import { deduplicateResults } from '../utils/deduplicate';
import logger from '../utils/logger';

export class RetrievalService {
  private readonly maxResults: number;

  constructor() {
    this.maxResults = parseInt(process.env.MAX_SEARCH_RESULTS ?? '10', 10);
  }

  async retrieve(queries: SearchQuery): Promise<SearchResult[]> {
    const allQueries = [queries.primary, ...queries.alternatives];
    logger.info('Retrieving results for queries', { count: allQueries.length });

    // Run all queries in parallel across both engines
    const searchPromises = allQueries.flatMap(query => [
      serpApiService.search(query, this.maxResults),
      youComService.search(query, this.maxResults),
    ]);

    const results = await Promise.allSettled(searchPromises);
    const combined: SearchResult[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        combined.push(...result.value);
      }
    }

    const deduped = deduplicateResults(combined);
    logger.info(`Retrieved ${combined.length} raw results, ${deduped.length} after dedup`);
    return deduped;
  }
}

export const retrievalService = new RetrievalService();
