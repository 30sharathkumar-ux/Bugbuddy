import axios from 'axios';
import { SearchResult, YouComResponse } from '../types/search.types';
import logger from '../utils/logger';

export class YouComService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://ydc-index.io/v1/search';

  constructor() {
    this.apiKey = process.env.YDC_API_KEY ?? '';
    if (!this.apiKey) {
      logger.warn('YDC_API_KEY is not set — You.com searches will be skipped');
    }
  }

  async search(query: string, count = 10): Promise<SearchResult[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await axios.post<YouComResponse>(
        this.baseUrl,
        { query, count },
        {
          headers: { 'X-API-Key': this.apiKey, 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      const webResults = response.data?.results?.web ?? [];
      return webResults.map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.description ?? (r.highlights?.join(' ') ?? ''),
        source: 'youcom',
      }));
    } catch (error) {
      logger.error('You.com search failed', { query, error });
      return [];
    }
  }
}

export const youComService = new YouComService();
