import axios from 'axios';
import { SearchResult, SerpApiResponse } from '../types/search.types';
import logger from '../utils/logger';

export class SerpApiService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://serpapi.com/search.json';

  constructor() {
    this.apiKey = process.env.SERPAPI_API_KEY ?? '';
    if (!this.apiKey) {
      logger.warn('SERPAPI_API_KEY is not set — SerpAPI searches will be skipped');
    }
  }

  async search(query: string, num = 10): Promise<SearchResult[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await axios.get<SerpApiResponse>(this.baseUrl, {
        params: {
          q: query,
          engine: 'google',
          api_key: this.apiKey,
          num,
        },
        timeout: 10000,
      });

      return (response.data.organic_results ?? []).map(r => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet,
        source: 'serpapi',
      }));
    } catch (error) {
      logger.error('SerpAPI search failed', { query, error });
      return [];
    }
  }
}

export const serpApiService = new SerpApiService();
