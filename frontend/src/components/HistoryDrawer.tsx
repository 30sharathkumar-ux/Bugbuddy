import { X, Clock, ChevronRight, Trash2 } from 'lucide-react';
import type { InvestigationSession } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: InvestigationSession[];
  currentSessionId?: string;
  onSelectSession: (id: string) => void;
  onClearHistory: () => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onClearHistory,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/20 backdrop-blur-2xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-[#e8e7e1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        <div className="p-5 border-b border-[#f0eee6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-neutral-700" />
            <h3 className="text-sm font-semibold text-neutral-900">
              Investigation History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-xs text-neutral-500">
              No recent investigations recorded yet.
            </div>
          ) : (
            sessions.map(s => {
              const isSelected = s.id === currentSessionId;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer group flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-[#faf9f5] border-[#e8e7e1] text-neutral-900 hover:bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-mono truncate mb-1 ${
                        isSelected ? 'text-neutral-100' : 'text-neutral-800'
                      }`}
                    >
                      {s.error.slice(0, 60)}...
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-neutral-800 text-neutral-300'
                            : 'bg-white border border-[#e8e7e1] text-neutral-600'
                        }`}
                      >
                        {s.technology.join(', ') || 'Auto'}
                      </span>
                      <span
                        className={`text-[10px] ${
                          isSelected ? 'text-neutral-400' : 'text-neutral-500'
                        }`}
                      >
                        {new Date(s.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`mt-1 flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      isSelected ? 'text-white' : 'text-neutral-400'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="p-4 border-t border-[#f0eee6]">
            <button
              onClick={onClearHistory}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#e8e7e1] text-xs text-neutral-600 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
