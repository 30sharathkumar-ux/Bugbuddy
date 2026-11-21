// Debug-related types

export interface DebugRequest {
  errorMessage: string;
  codeSnippet?: string;
  language?: string;
  framework?: string;
  additionalContext?: string;
}

export interface DebugStep {
  stepNumber: number;
  title: string;
  description: string;
  codeExample?: string;
}

export interface DebugSolution {
  title: string;
  explanation: string;
  steps: DebugStep[];
  codeFixExample?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

export interface DebugResponse {
  success: boolean;
  errorType: string;
  rootCause: string;
  solutions: DebugSolution[];
  researchSources: ResearchSource[];
  relatedTopics: string[];
  estimatedFixTime?: string;
  timestamp: string;
}

export interface ExtractedContent {
  url: string;
  title: string;
  content: string;
  relevanceScore: number;
}
