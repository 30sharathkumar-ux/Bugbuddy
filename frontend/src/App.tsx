import { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureTabs } from './components/FeatureTabs';
import { ErrorInput } from './components/ErrorInput';
import { ProgressPanel } from './components/ProgressPanel';
import { DebugReportView } from './components/DebugReport';
import { SocialProof } from './components/SocialProof';
import { HistoryDrawer } from './components/HistoryDrawer';
import { analyzeError, getHealth } from './api/debugApi';
import type { InvestigationSession, HealthStatus } from './types';
import type { EXAMPLE_ERRORS } from './constants/examples';
import { AlertCircle, Bug } from 'lucide-react';

const STORAGE_KEY = 'bug-buddy-sessions';

function loadSessions(): InvestigationSession[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSessions(sessions: InvestigationSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 20)));
  } catch {}
}

export default function App() {
  const [sessions, setSessions] = useState<InvestigationSession[]>(loadSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressSteps, setProgressSteps] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState<HealthStatus['providers'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Quick prefill state when user clicks an example from Hero
  const [prefillError, setPrefillError] = useState<string>('');
  const [prefillTech, setPrefillTech] = useState<string[]>([]);

  const studioRef = useRef<HTMLDivElement>(null);
  const currentSession = sessions.find(s => s.id === currentSessionId);

  useEffect(() => {
    getHealth()
      .then(h => setApiStatus(h.providers))
      .catch(() => {});
  }, []);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const scrollToStudio = () => {
    const el = document.getElementById('studio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectExample = (example: typeof EXAMPLE_ERRORS[0]) => {
    setPrefillError(example.error);
    setPrefillTech(example.technology);
    setCurrentSessionId(undefined);
    setError(null);
    scrollToStudio();
  };

  const handleAnalyze = useCallback(
    async (errorText: string, technology: string[], context: string) => {
      const id = `session-${Date.now()}`;
      const newSession: InvestigationSession = {
        id,
        error: errorText,
        technology,
        timestamp: new Date().toISOString(),
        status: 'analyzing',
        progressSteps: [],
      };

      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(id);
      setIsAnalyzing(true);
      setProgressSteps([]);
      setError(null);

      const addProgress = (step: string) => {
        setProgressSteps(prev => [...prev, step]);
        setSessions(prev =>
          prev.map(s =>
            s.id === id ? { ...s, progressSteps: [...s.progressSteps, step] } : s
          )
        );
      };

      addProgress('Error submitted to investigation pipeline');

      try {
        addProgress('Analyzing error & querying SerpAPI and You.com in parallel...');
        const report = await analyzeError(errorText, technology, context);
        addProgress('Evidence extracted & fixes classified by Gemini 3.5 AI');

        setSessions(prev =>
          prev.map(s =>
            s.id === id
              ? {
                  ...s,
                  report,
                  status: 'complete',
                  progressSteps: [...s.progressSteps, 'Investigation complete!'],
                }
              : s
          )
        );
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Investigation failed';
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || errMsg);
        setSessions(prev =>
          prev.map(s => (s.id === id ? { ...s, status: 'error' } : s))
        );
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  const handleNewInvestigation = () => {
    setCurrentSessionId(undefined);
    setPrefillError('');
    setPrefillTech([]);
    setProgressSteps([]);
    setError(null);
    scrollToStudio();
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setProgressSteps([]);
    setError(null);
    scrollToStudio();
  };

  const handleClearHistory = () => {
    setSessions([]);
    localStorage.removeItem(STORAGE_KEY);
    setCurrentSessionId(undefined);
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Floating Top Nav (Image 1 style) */}
      <Navbar
        apiStatus={apiStatus}
        historyCount={sessions.length}
        onOpenHistory={() => setHistoryOpen(true)}
        onNewInvestigation={handleNewInvestigation}
        onScrollToStudio={scrollToStudio}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Hero Section matching Image 1 */}
        <Hero
          onSelectExample={handleSelectExample}
          onScrollToStudio={scrollToStudio}
        />

        {/* 3 Step Feature Tabs matching Image 2 top */}
        <FeatureTabs />

        {/* The Studio Workspace Container */}
        <section ref={studioRef} className="max-w-5xl mx-auto px-4 mb-16">
          <div className="space-y-6">
            {/* Input Studio */}
            <ErrorInput
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              prefillError={prefillError}
              prefillTech={prefillTech}
            />

            {/* In-Progress Pipeline Tracker */}
            {isAnalyzing && (
              <ProgressPanel steps={progressSteps} isAnalyzing={isAnalyzing} />
            )}

            {/* Error Banner */}
            {error && !isAnalyzing && (
              <div className="clean-card p-5 border-red-200 bg-red-50/60">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-900">
                      Investigation Encountered an Issue
                    </h4>
                    <p className="text-xs text-red-700 mt-1">{error}</p>
                    <button
                      onClick={handleNewInvestigation}
                      className="mt-3 px-3 py-1.5 rounded-full bg-red-900 text-white text-xs font-medium hover:bg-red-800 transition cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Live Investigation Report View */}
            {currentSession?.report && !isAnalyzing && (
              <div className="pt-4">
                <DebugReportView report={currentSession.report} />
              </div>
            )}
          </div>
        </section>

        {/* Social Proof & Sources Grid matching Image 2 bottom */}
        <SocialProof />
      </main>

      {/* Slide-over History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onClearHistory={handleClearHistory}
      />

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-[#e8e7e1] bg-white py-10 px-4 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <Bug size={11} />
            </div>
            <span className="font-editorial text-base font-bold text-neutral-900">
              Bug Buddy
            </span>
            <span>— Live Research Debugging Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>SerpAPI</span>
            <span>•</span>
            <span>You.com</span>
            <span>•</span>
            <span>Gemini 3.5 AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
