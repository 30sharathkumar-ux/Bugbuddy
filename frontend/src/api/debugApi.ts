import axios from 'axios';
import type { DebugReport, Fix, HealthStatus } from '../types';

const api = axios.create({ baseURL: '/api', timeout: 120000 });

// Backend DebugResponse shape (from backend/src/types/debug.types.ts)
interface BackendStep {
  stepNumber: number;
  title: string;
  description: string;
  codeExample?: string;
}

interface BackendSolution {
  title: string;
  explanation: string;
  steps: BackendStep[];
  codeFixExample?: string;
  confidence: 'high' | 'medium' | 'low';
}

interface BackendSource {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

interface BackendDebugResponse {
  success: boolean;
  errorType: string;
  rootCause: string;
  solutions: BackendSolution[];
  researchSources: BackendSource[];
  relatedTopics: string[];
  estimatedFixTime?: string;
  timestamp: string;
  // Extended fields returned by our wrapper
  data?: DebugReport;
  // Provider status injected by the route wrapper
  providerStatus?: { serpapi: string; youcom: string };
  error?: string;
}

function mapConfidenceToRisk(confidence: 'high' | 'medium' | 'low'): 'low' | 'medium' | 'high' {
  if (confidence === 'high') return 'low';
  if (confidence === 'low') return 'high';
  return 'medium';
}

function classifyByIndex(index: number, total: number): Fix['classification'] {
  if (index === 0) return 'ROOT_FIX';
  if (index === total - 1 && total > 2) return 'WORKAROUND';
  return 'VERSION_SPECIFIC';
}

function mapSolutionToFix(solution: BackendSolution, index: number, total: number): Fix {
  const steps = solution.steps.map(s => {
    const parts = [s.title, s.description].filter(Boolean);
    if (s.codeExample) parts.push(`\`${s.codeExample}\``);
    return parts.join(' — ');
  });

  return {
    title: solution.title,
    description: solution.explanation,
    steps,
    code: solution.codeFixExample,
    classification: classifyByIndex(index, total),
    risk: mapConfidenceToRisk(solution.confidence),
    pros: solution.confidence === 'high' ? ['Highly recommended', 'Addresses root cause'] : ['Alternative approach'],
    cons: solution.confidence === 'low' ? ['Lower confidence fix', 'May need adjustment'] : [],
  };
}

function adaptBackendResponse(backend: BackendDebugResponse, technology: string[]): DebugReport {
  // If the backend already returned a fully-shaped DebugReport (via the data key), use it
  if (backend.data && backend.data.errorAnalysis) {
    return backend.data;
  }

  const solutions = backend.solutions || [];
  const [primary, ...alternatives] = solutions;

  const sources = (backend.researchSources || []).map((s, i) => ({
    searchResult: {
      title: s.title,
      url: s.url,
      snippet: s.snippet,
      domain: (() => { try { return new URL(s.url).hostname; } catch { return 'unknown'; } })(),
      sourceType: classifyDomain(s.url),
      provider: i % 2 === 0 ? 'serpapi' as const : 'youcom' as const,
      query: '',
    },
    finalScore: Math.round(s.relevance * 100),
    relevanceReason: `Relevance: ${Math.round(s.relevance * 100)}%`,
  }));

  const evidence = (backend.researchSources || []).map(s => ({
    source: s.title,
    url: s.url,
    finding: s.snippet,
    sourceType: classifyDomain(s.url),
    isSnippetOnly: true,
  }));

  const queries = backend.relatedTopics?.slice(0, 5) || [];

  return {
    errorAnalysis: {
      errorType: backend.errorType || 'Unknown Error',
      technology,
      severity: 'medium',
      summary: backend.rootCause || 'Error analysis complete.',
      whatIsFailing: primary?.title || 'Unknown component',
    },
    queries,
    searchResults: [],
    sources,
    rootCause: {
      explanation: backend.rootCause || '',
      whyItHappened: primary?.explanation || '',
      responsibleComponent: backend.errorType || 'Unknown',
      trigger: primary?.steps?.[0]?.description || 'See steps above',
    },
    recommendedFix: primary ? mapSolutionToFix(primary, 0, solutions.length) : {
      title: 'No fix found',
      description: 'No solutions were identified from the research.',
      steps: [],
      classification: 'WORKAROUND',
      risk: 'medium',
      pros: [],
      cons: [],
    },
    alternativeFixes: alternatives.map((s, i) => mapSolutionToFix(s, i + 1, solutions.length)),
    conflicts: [],
    evidence,
    confidence: {
      level: backend.researchSources?.length > 3 ? 'high' : backend.researchSources?.length > 1 ? 'moderate' : 'limited',
      explanation: `Based on ${backend.researchSources?.length || 0} research sources and ${solutions.length} identified solutions.`,
      sourceCount: backend.researchSources?.length || 0,
    },
    report: {
      whyRecommendedWins: primary
        ? `"${primary.title}" is recommended because it addresses the root cause with ${primary.confidence} confidence.`
        : 'No clear winner identified.',
      investigationSteps: [
        'Error analyzed with Gemini AI',
        'Live web search performed via SerpAPI and You.com',
        'Sources deduplicated and ranked',
        'Evidence extracted from top sources',
        'Fixes compared and ranked by confidence',
      ],
    },
    providerStatus: {
      serpapi: backend.providerStatus?.serpapi === 'success' ? 'success'
        : backend.providerStatus?.serpapi === 'failed' ? 'failed' : 'not_configured',
      youcom: backend.providerStatus?.youcom === 'success' ? 'success'
        : backend.providerStatus?.youcom === 'failed' ? 'failed' : 'not_configured',
    },
  };
}

function classifyDomain(url: string): 'github-issue' | 'github-discussion' | 'stackoverflow' | 'official-docs' | 'blog' | 'forum' | 'other' {
  if (url.includes('github.com') && url.includes('/issues/')) return 'github-issue';
  if (url.includes('github.com') && url.includes('/discussions/')) return 'github-discussion';
  if (url.includes('stackoverflow.com')) return 'stackoverflow';
  if (url.includes('docs.') || url.includes('/docs/') || url.includes('pypi.org') || url.includes('npmjs.com')) return 'official-docs';
  if (url.includes('dev.to') || url.includes('medium.com') || url.includes('hashnode')) return 'blog';
  if (url.includes('reddit.com') || url.includes('discourse.')) return 'forum';
  return 'other';
}

export async function analyzeError(error: string, technology: string[], context?: string): Promise<DebugReport> {
  const { data } = await api.post<BackendDebugResponse>('/debug/analyze', { error, technology, context });
  if (data.success === false) throw new Error(data.error || 'Analysis failed');
  return adaptBackendResponse(data, technology);
}

export async function getHealth(): Promise<HealthStatus> {
  const { data } = await api.get('/health');
  return data;
}
