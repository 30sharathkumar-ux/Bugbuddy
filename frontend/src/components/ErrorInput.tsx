import { useState, useEffect } from 'react';
import { Terminal, X, Search, Sparkles, CornerDownLeft, SlidersHorizontal } from 'lucide-react';
import { TECHNOLOGIES } from '../constants/examples';

interface ErrorInputProps {
  onAnalyze: (error: string, technology: string[], context: string) => void;
  isAnalyzing: boolean;
  prefillError?: string;
  prefillTech?: string[];
}

export function ErrorInput({
  onAnalyze,
  isAnalyzing,
  prefillError = '',
  prefillTech = [],
}: ErrorInputProps) {
  const [error, setError] = useState(prefillError);
  const [selectedTech, setSelectedTech] = useState<string[]>(prefillTech);
  const [context, setContext] = useState('');
  const [techSearch, setTechSearch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (prefillError) setError(prefillError);
  }, [prefillError]);

  useEffect(() => {
    if (prefillTech && prefillTech.length > 0) setSelectedTech(prefillTech);
  }, [prefillTech]);

  const handleSubmit = () => {
    if (!error.trim() || isAnalyzing) return;
    onAnalyze(error, selectedTech, context);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleTech = (tech: string) => {
    if (tech === 'Auto Detect') {
      setSelectedTech([]);
      return;
    }
    setSelectedTech(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev.filter(t => t !== 'Auto Detect'), tech]
    );
  };

  const filteredTechs = TECHNOLOGIES.filter(t =>
    t.toLowerCase().includes(techSearch.toLowerCase())
  );

  return (
    <div id="studio" className="clean-card p-6 md:p-8 transition-all">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[#f0eee6]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-[#e5e4dc] flex items-center justify-center text-neutral-800">
            <Terminal size={14} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 leading-tight">
              Error Investigation Studio
            </h2>
            <p className="text-[11px] text-neutral-600">
              Paste stack traces, compiler errors, or terminal logs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <button
              onClick={() => setError('')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#e8e7e1] bg-white hover:bg-neutral-50 text-xs text-neutral-600 transition cursor-pointer"
            >
              <X size={12} />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer ${
              showAdvanced
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'border-[#e8e7e1] bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <SlidersHorizontal size={12} />
            <span>Options</span>
          </button>
        </div>
      </div>

      {/* Main Code Editor Textarea */}
      <div className="relative mb-5">
        <textarea
          value={error}
          onChange={e => setError(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your error, stack trace, logs, or describe the bug here... (e.g. npm ERR! ERESOLVE, ModuleNotFoundError, NullPointerException)"
          rows={7}
          disabled={isAnalyzing}
          className="w-full bg-[#18181b] text-neutral-100 border border-neutral-800 rounded-xl p-4 font-mono text-xs md:text-sm placeholder:text-neutral-500 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent resize-y leading-relaxed shadow-inner"
        />
        <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-600">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800 font-mono text-[10px]">Ctrl + Enter</kbd> to run</span>
          <span>{error.length} / 10,000 characters</span>
        </div>
      </div>

      {/* Technology Stack Picker */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
            <Search size={13} className="text-neutral-500" />
            <span>Target Technology Stack</span>
          </label>
          {selectedTech.length > 0 ? (
            <span className="text-[11px] text-neutral-500 font-medium">
              {selectedTech.length} selected
            </span>
          ) : (
            <span className="text-[11px] text-neutral-600 font-medium">
              Auto-detected via AI
            </span>
          )}
        </div>

        {/* Quick Tech Chips */}
        <div className="flex flex-wrap gap-1.5">
          {TECHNOLOGIES.slice(0, 12).map(tech => {
            const isAuto = tech === 'Auto Detect';
            const isSelected =
              (isAuto && selectedTech.length === 0) || selectedTech.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 border-neutral-900 text-white font-medium shadow-2xs'
                    : 'bg-white border-[#e8e7e1] text-neutral-600 hover:border-neutral-300 hover:text-neutral-900'
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced context drawer (if toggled) */}
      {showAdvanced && (
        <div className="mb-5 p-4 rounded-xl bg-[#fbfbfa] border border-[#e8e7e1] space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Filter More Technologies
            </label>
            <input
              type="text"
              value={techSearch}
              onChange={e => setTechSearch(e.target.value)}
              placeholder="Search framework, database, tool..."
              className="w-full bg-white border border-[#e8e7e1] rounded-lg px-3 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
            />
            {techSearch && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto">
                {filteredTechs.map(tech => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      selectedTech.includes(tech)
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white border-[#e8e7e1] text-neutral-600'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Project Context / Environment (optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. Node 20, Vite 5, macOS Sonoma, npm workspaces"
              className="w-full bg-white border border-[#e8e7e1] rounded-lg px-3 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
            />
          </div>
        </div>
      )}

      {/* Action Submit Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Sparkles size={13} className="text-neutral-700" />
          <span>Queries SerpAPI Google Search & You.com in real time</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!error.trim() || isAnalyzing}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold tracking-wide transition shadow-sm cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Investigating...</span>
            </>
          ) : (
            <>
              <span>Investigate with Live Research</span>
              <CornerDownLeft size={13} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
