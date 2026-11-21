export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  sourceType: 'github-issue' | 'github-discussion' | 'stackoverflow' | 'official-docs' | 'blog' | 'forum' | 'other';
  provider: 'serpapi' | 'youcom';
  query: string;
  relevanceScore?: number;
  publishedDate?: string;
}

export interface Fix {
  title: string;
  description: string;
  steps: string[];
  code?: string;
  classification: 'ROOT_FIX' | 'WORKAROUND' | 'RISKY_FIX' | 'VERSION_SPECIFIC';
  risk: 'low' | 'medium' | 'high';
  pros: string[];
  cons: string[];
  source?: string;
  sourceUrl?: string;
}

export interface RankedSource {
  searchResult: SearchResult;
  extractedContent?: {
    url: string;
    title: string;
    content: string;
    isSnippetOnly: boolean;
    sourceType: string;
  };
  finalScore: number;
  relevanceReason: string;
}

export interface DebugReport {
  errorAnalysis: {
    errorType: string;
    technology: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    summary: string;
    whatIsFailing: string;
  };
  queries: string[];
  searchResults: SearchResult[];
  sources: RankedSource[];
  rootCause: {
    explanation: string;
    whyItHappened: string;
    responsibleComponent: string;
    trigger: string;
  };
  recommendedFix: Fix;
  alternativeFixes: Fix[];
  conflicts: Array<{ description: string; sources: string[]; recommendation: string; }>;
  evidence: Array<{ source: string; url: string; finding: string; sourceType: string; isSnippetOnly: boolean; }>;
  confidence: { level: 'high' | 'moderate' | 'limited'; explanation: string; sourceCount: number; };
  report: { whyRecommendedWins: string; investigationSteps: string[]; };
  providerStatus: { serpapi: 'success' | 'failed' | 'not_configured'; youcom: 'success' | 'failed' | 'not_configured'; };
}

export interface InvestigationSession {
  id: string;
  error: string;
  technology: string[];
  timestamp: string;
  report?: DebugReport;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  progressSteps: string[];
}

export interface HealthStatus {
  status: string;
  providers: { gemini: string; serpapi: string; youcom: string; };
}
