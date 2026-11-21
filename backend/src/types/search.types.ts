// Search-related types

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevanceScore?: number;
}

export interface RankedSource {
  title: string;
  url: string;
  snippet: string;
  source: string;
  score: number;
  rank: number;
}

export interface SerpApiResult {
  title: string;
  link: string;
  snippet: string;
  displayed_link: string;
}

export interface SerpApiResponse {
  organic_results: SerpApiResult[];
}

export interface YouComWebResult {
  title: string;
  url: string;
  description: string;
  highlights?: string[];
}

export interface YouComResponse {
  results: {
    web: YouComWebResult[];
  };
}

export interface SearchQuery {
  primary: string;
  alternatives: string[];
}
