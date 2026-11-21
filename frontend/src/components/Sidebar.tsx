import { Bug, Plus, Clock, ChevronRight, X, Activity } from 'lucide-react';
import type { InvestigationSession } from '../types';

interface SidebarProps {
  sessions: InvestigationSession[];
  currentSessionId?: string;
  onNewInvestigation: () => void;
  onSelectSession: (id: string) => void;
  apiStatus: { gemini: string; serpapi: string; youcom: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

function StatusDot({ status }: { status: string }) {
  const color = status === 'configured' || status === 'success'
    ? 'bg-green-400'
    : status === 'failed'
      ? 'bg-red-400'
      : 'bg-yellow-400';
  return <span className={`inline-block w-2 h-2 rounded-full ${color} mr-1.5`} />;
}

export function Sidebar({ sessions, currentSessionId, onNewInvestigation, onSelectSession, apiStatus, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onClose} />
      )}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-bg-secondary border-r border-bg-border flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-bg-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Bug size={16} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm leading-tight">Bug Buddy</h1>
              <p className="text-xs text-muted">Live Research Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-muted hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* New Investigation */}
        <div className="p-4">
          <button
            onClick={onNewInvestigation}
            className="w-full btn-primary flex items-center justify-center gap-2 py-2.5"
          >
            <Plus size={16} />
            New Investigation
          </button>
        </div>

        {/* Recent Investigations */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {sessions.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 px-2 mb-2">
                <Clock size={12} className="text-muted" />
                <span className="text-xs text-muted uppercase tracking-wider">Recent</span>
              </div>
              <div className="space-y-1">
                {sessions.slice(0, 20).map(session => (
                  <button
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group flex items-start gap-2 ${
                      currentSessionId === session.id
                        ? 'bg-accent/20 border border-accent/30'
                        : 'hover:bg-bg-card'
                    }`}
                  >
                    <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      session.status === 'complete' ? 'bg-green-400' :
                      session.status === 'analyzing' ? 'bg-yellow-400 animate-pulse' :
                      session.status === 'error' ? 'bg-red-400' : 'bg-muted'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-300 truncate leading-tight">{session.error.slice(0, 50)}...</p>
                      <p className="text-xs text-muted mt-0.5">{session.technology.join(', ') || 'Auto'}</p>
                    </div>
                    <ChevronRight size={12} className="text-muted ml-auto flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* API Status */}
        <div className="p-4 border-t border-bg-border">
          <div className="flex items-center gap-1.5 mb-2">
            <Activity size={12} className="text-muted" />
            <span className="text-xs text-muted uppercase tracking-wider">API Status</span>
          </div>
          {apiStatus ? (
            <div className="space-y-1">
              {(['gemini', 'serpapi', 'youcom'] as const).map(key => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-muted capitalize">{key === 'youcom' ? 'You.com' : key === 'serpapi' ? 'SerpAPI' : 'Gemini'}</span>
                  <div className="flex items-center">
                    <StatusDot status={apiStatus[key]} />
                    <span className={`text-xs ${apiStatus[key] === 'configured' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {apiStatus[key] === 'configured' ? 'Ready' : 'Not set'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted">Connecting...</p>
          )}
        </div>
      </aside>
    </>
  );
}
