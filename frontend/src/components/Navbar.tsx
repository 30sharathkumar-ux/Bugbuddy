import { Bug, History, Plus } from 'lucide-react';
import type { HealthStatus } from '../types';

interface NavbarProps {
  apiStatus: HealthStatus['providers'] | null;
  historyCount: number;
  onOpenHistory: () => void;
  onNewInvestigation: () => void;
  onScrollToStudio: () => void;
}

export function Navbar({
  apiStatus,
  historyCount,
  onOpenHistory,
  onNewInvestigation,
  onScrollToStudio,
}: NavbarProps) {

  const allActive =
    apiStatus?.gemini === 'configured' &&
    apiStatus?.serpapi === 'configured' &&
    apiStatus?.youcom === 'configured';

  return (
    <header className="sticky top-4 z-40 px-4 max-w-6xl mx-auto w-full transition-all">
      <nav className="bg-white/80 backdrop-blur-md border border-[#e8e7e1] rounded-full px-5 py-2.5 shadow-sm flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewInvestigation}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center transition-transform group-hover:scale-105">
              <Bug size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-xl font-bold tracking-tight text-neutral-900 leading-none">
                Bug Buddy
              </span>
              <span className="text-[10px] text-neutral-500 font-medium tracking-wide uppercase">
                Live Research AI
              </span>
            </div>
          </button>
        </div>

        {/* Center navigation links (desktop) */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600">
          <button
            onClick={onScrollToStudio}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Studio
          </button>
          <a
            href="#features"
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Research Pipeline
          </a>
          <a
            href="#sources"
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Sources
          </a>
          {/* Provider status chip */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-[11px] text-neutral-700">
            <span
              className={`w-2 h-2 rounded-full ${
                allActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{allActive ? 'All 3 Engines Live' : 'Research Ready'}</span>
          </div>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2">
          {historyCount > 0 && (
            <button
              onClick={onOpenHistory}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 text-xs font-medium transition cursor-pointer"
              title="Recent debugging sessions"
            >
              <History size={13} />
              <span>History</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-semibold">
                {historyCount}
              </span>
            </button>
          )}

          <button
            onClick={onNewInvestigation}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium transition shadow-xs cursor-pointer"
          >
            <Plus size={13} />
            <span>New Session</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
