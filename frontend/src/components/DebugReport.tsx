import { useState } from 'react';
import type { DebugReport as ReportType } from '../types';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  FileText,
  Search,
  Globe,
  Code,
  Sparkles,
} from 'lucide-react';

interface ReportProps {
  report: ReportType;
}

type Tab = 'overview' | 'recommended' | 'alternatives' | 'evidence' | 'sources';

function ClassificationBadge({ classification }: { classification: string }) {
  const map: Record<string, string> = {
    ROOT_FIX: 'badge-root',
    WORKAROUND: 'badge-workaround',
    RISKY_FIX: 'badge-risky',
    VERSION_SPECIFIC: 'badge-version',
  };
  const labels: Record<string, string> = {
    ROOT_FIX: 'Root Fix',
    WORKAROUND: 'Workaround',
    RISKY_FIX: 'Risky Fix',
    VERSION_SPECIFIC: 'Version-Specific',
  };
  return (
    <span className={map[classification] || 'badge-version'}>
      {labels[classification] || classification}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${
        colors[severity] || colors.medium
      }`}
    >
      {severity} severity
    </span>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative bg-[#18181b] rounded-xl border border-neutral-800 mt-3 shadow-inner">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-800 text-[11px] text-neutral-400">
        <span>Suggested Fix Code</span>
        <button
          onClick={copy}
          className="text-neutral-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
        >
          <Copy size={11} />
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="text-xs text-neutral-100 p-4 overflow-x-auto font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function FixCard({
  fix,
  isRecommended = false,
}: {
  fix: ReportType['recommendedFix'];
  isRecommended?: boolean;
}) {
  const [expanded, setExpanded] = useState(isRecommended);
  return (
    <div
      className={`clean-card p-5 transition-all ${
        isRecommended
          ? 'border-neutral-900/40 ring-1 ring-neutral-900/10 bg-white'
          : 'bg-[#fcfbf9] border-[#e8e7e1]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {isRecommended && (
              <span className="text-xs bg-neutral-900 text-white px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                <Sparkles size={11} />
                Recommended Fix
              </span>
            )}
            <ClassificationBadge classification={fix.classification} />
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                fix.risk === 'low'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : fix.risk === 'medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {fix.risk} risk
            </span>
          </div>
          <h3 className="font-semibold text-neutral-900 text-base">{fix.title}</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#f0eee6] space-y-4">
          <p className="text-sm text-neutral-700 leading-relaxed">{fix.description}</p>

          {fix.steps.length > 0 && (
            <div>
              <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mb-2">
                Implementation Steps
              </p>
              <ol className="space-y-2">
                {fix.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 font-semibold flex items-center justify-center flex-shrink-0 text-[11px]">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {fix.code && <CodeBlock code={fix.code} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {fix.pros.length > 0 && (
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-800 mb-1.5 flex items-center gap-1">
                  <CheckCircle size={12} /> Advantages
                </p>
                <ul className="space-y-1">
                  {fix.pros.map((p, i) => (
                    <li key={i} className="text-xs text-emerald-900">
                      • {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {fix.cons.length > 0 && (
              <div className="p-3 rounded-lg bg-red-50/50 border border-red-100">
                <p className="text-xs font-semibold text-red-800 mb-1.5 flex items-center gap-1">
                  <XCircle size={12} /> Tradeoffs & Risks
                </p>
                <ul className="space-y-1">
                  {fix.cons.map((c, i) => (
                    <li key={i} className="text-xs text-red-900">
                      • {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {fix.sourceUrl && (
            <div className="pt-2">
              <a
                href={fix.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-700 hover:text-neutral-900 font-medium hover:underline"
              >
                <ExternalLink size={12} />
                <span>Source: {fix.source || fix.sourceUrl}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SourceTypeIcon({ type }: { type: string }) {
  if (type === 'stackoverflow')
    return <span className="text-amber-600 text-xs font-bold">SO</span>;
  if (type === 'github-issue' || type === 'github-discussion')
    return <span className="text-neutral-800 text-xs font-bold">GH</span>;
  if (type === 'official-docs') return <FileText size={13} className="text-blue-600" />;
  if (type === 'blog') return <Code size={13} className="text-purple-600" />;
  return <Globe size={13} className="text-neutral-500" />;
}

export function DebugReportView({ report }: ReportProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview & Cause' },
    { id: 'recommended', label: 'Recommended Fix' },
    {
      id: 'alternatives',
      label: `Alternatives (${report.alternativeFixes?.length || 0})`,
    },
    { id: 'evidence', label: `Evidence (${report.evidence?.length || 0})` },
    { id: 'sources', label: `Ranked Sources (${report.sources?.length || 0})` },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Report Header Card */}
      <div className="clean-card p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <AlertTriangle size={13} />
              </span>
              <h2 className="font-semibold text-neutral-900 text-lg">
                {report.errorAnalysis.errorType}
              </h2>
            </div>
            <p className="text-sm text-neutral-700 max-w-2xl leading-relaxed">
              {report.errorAnalysis.summary}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <SeverityBadge severity={report.errorAnalysis.severity} />
              {report.errorAnalysis.technology.map(t => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Confidence Badge */}
          <div className="p-3.5 rounded-xl bg-[#faf9f5] border border-[#e8e7e1] text-right">
            <div
              className={`text-sm font-semibold ${
                report.confidence.level === 'high'
                  ? 'text-emerald-700'
                  : report.confidence.level === 'moderate'
                  ? 'text-amber-700'
                  : 'text-neutral-700'
              }`}
            >
              {report.confidence.level === 'high'
                ? 'High Evidence'
                : report.confidence.level === 'moderate'
                ? 'Moderate Evidence'
                : 'Limited Evidence'}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              {report.confidence.sourceCount} verified sources analyzed
            </div>
          </div>
        </div>

        {/* Engine Pipeline Status */}
        <div className="pt-3 border-t border-[#f0eee6] flex flex-wrap items-center gap-4 text-xs text-neutral-500">
          <span className="font-medium text-neutral-700">Verified via:</span>
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle size={12} /> SerpAPI Google Search
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle size={12} /> You.com YDC Index
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <CheckCircle size={12} /> Gemini 3.5 AI
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#e5e4dc] overflow-x-auto pb-0.5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer rounded-t-lg ${
              activeTab === tab.id
                ? 'border-b-2 border-neutral-900 text-neutral-900 bg-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Root Cause Card */}
          <div className="clean-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Search size={15} className="text-neutral-800" />
              <h3 className="font-semibold text-neutral-900 text-sm">
                Identified Root Cause
              </h3>
            </div>
            <p className="text-sm text-neutral-800 leading-relaxed mb-4">
              {report.rootCause.explanation}
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-[#fbfbfa] rounded-xl p-3.5 border border-[#e8e7e1]">
                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Why It Happened
                </p>
                <p className="text-xs text-neutral-800 leading-relaxed">
                  {report.rootCause.whyItHappened}
                </p>
              </div>

              <div className="bg-[#fbfbfa] rounded-xl p-3.5 border border-[#e8e7e1]">
                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Responsible Component
                </p>
                <p className="text-xs text-neutral-800 leading-relaxed">
                  {report.rootCause.responsibleComponent}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence Explanation */}
          <div className="clean-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={15} className="text-neutral-800" />
              <h3 className="font-semibold text-neutral-900 text-sm">
                Evidence Evaluation
              </h3>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed">
              {report.confidence.explanation}
            </p>
          </div>

          {/* Recommended Quick Preview */}
          <FixCard fix={report.recommendedFix} isRecommended={true} />

          {/* Queries Used */}
          {report.queries?.length > 0 && (
            <div className="clean-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Search size={13} className="text-neutral-500" />
                <h4 className="text-xs font-semibold text-neutral-700">
                  Targeted Research Queries Used
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {report.queries.map((q, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Recommended Fix */}
      {activeTab === 'recommended' && (
        <div className="space-y-4">
          <FixCard fix={report.recommendedFix} isRecommended={true} />

          {report.report?.whyRecommendedWins && (
            <div className="clean-card p-6 bg-[#fcfbf9]">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={15} className="text-amber-600" />
                <h3 className="font-semibold text-neutral-900 text-sm">
                  Why This Fix Wins
                </h3>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {report.report.whyRecommendedWins}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Alternatives */}
      {activeTab === 'alternatives' && (
        <div className="space-y-3">
          {report.alternativeFixes?.length > 0 ? (
            report.alternativeFixes.map((fix, i) => <FixCard key={i} fix={fix} />)
          ) : (
            <div className="clean-card text-center py-10">
              <p className="text-neutral-500 text-xs">
                No secondary alternative fixes found in the retrieved evidence.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Evidence */}
      {activeTab === 'evidence' && (
        <div className="space-y-3">
          {report.evidence?.length > 0 ? (
            report.evidence.map((ev, i) => (
              <div key={i} className="clean-card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <SourceTypeIcon type={ev.sourceType} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {ev.source}
                      </p>
                      {ev.isSnippetOnly && (
                        <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                          Extracted Snippet
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 capitalize mt-0.5">
                      {ev.sourceType.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-neutral-700 mt-2 leading-relaxed">
                      {ev.finding}
                    </p>
                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-neutral-800 font-medium hover:underline mt-2.5"
                      >
                        <ExternalLink size={11} />
                        <span>View verified source</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="clean-card text-center py-10">
              <p className="text-neutral-500 text-xs">No extracted evidence available.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Sources */}
      {activeTab === 'sources' && (
        <div className="space-y-3">
          {report.sources?.length > 0 ? (
            report.sources.map((s, i) => (
              <div key={i} className="clean-card p-5 hover:border-neutral-400 transition">
                <div className="flex items-start gap-3">
                  <span className="text-xs text-neutral-400 font-mono mt-0.5">
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={s.searchResult.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition truncate"
                      >
                        {s.searchResult.title}
                      </a>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                          s.searchResult.provider === 'serpapi'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {s.searchResult.provider === 'serpapi' ? 'SerpAPI' : 'You.com'}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {s.searchResult.domain} •{' '}
                      {s.searchResult.sourceType.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {s.searchResult.snippet}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f0eee6]">
                      <span className="text-[11px] text-neutral-500">
                        Score: {Math.round(s.finalScore)}% • {s.relevanceReason}
                      </span>
                      <a
                        href={s.searchResult.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
                      >
                        <span>Open source</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="clean-card text-center py-10">
              <p className="text-neutral-500 text-xs">No sources available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
