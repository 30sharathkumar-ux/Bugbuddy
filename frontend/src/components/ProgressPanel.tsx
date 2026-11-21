import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface ProgressPanelProps {
  steps: string[];
  isAnalyzing: boolean;
}

export function ProgressPanel({ steps, isAnalyzing }: ProgressPanelProps) {
  return (
    <div className="clean-card p-6 border-neutral-300 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0eee6]">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-neutral-800" />
          <h3 className="text-sm font-semibold text-neutral-900">
            Real-Time Research Pipeline
          </h3>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-700">
            <Loader2 size={12} className="animate-spin text-neutral-800" />
            <span>Live Web Retrieval Active</span>
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-700">
            <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{step}</span>
          </div>
        ))}

        {isAnalyzing && (
          <div className="flex items-center gap-2.5 text-xs text-neutral-500 pt-1">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin flex-shrink-0" />
            <span className="italic">Synthesizing authoritative sources with Gemini 3.5...</span>
          </div>
        )}
      </div>
    </div>
  );
}
