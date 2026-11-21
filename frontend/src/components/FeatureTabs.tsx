import { useState } from 'react';
import { Search, FileText, GitCompare, CheckCircle2 } from 'lucide-react';

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: 'retrieval',
      tag: 'Step 1',
      title: 'Multi-engine retrieval',
      shortDesc: 'Parallel search across SerpAPI and You.com.',
      fullDesc:
        'Generates 4-6 targeted technical queries and queries SerpAPI (Google) and You.com (YDC Index) concurrently across GitHub Issues, Stack Overflow, and official documentation.',
      icon: Search,
      highlight: 'Live parallel search',
    },
    {
      id: 'evidence',
      tag: 'Step 2',
      title: 'Evidence & insights',
      shortDesc: 'Extract and rank verified technical findings.',
      fullDesc:
        'Deduplicates URLs, strips boilerplate, scores authority, and extracts concrete problem-solution pairs, version constraints, and prerequisite steps.',
      icon: FileText,
      highlight: 'Deduplicated & ranked',
    },
    {
      id: 'comparison',
      tag: 'Step 3',
      title: 'Compare fixes seamlessly',
      shortDesc: 'Root Fix vs Workaround vs Risky Fix.',
      fullDesc:
        'Gemini 3.5 classifies every solution into Root Fix, Workaround, or Risky Fix with risk tradeoffs and transparent citations, so you pick the safest path.',
      icon: GitCompare,
      highlight: 'Evidence-grounded',
    },
  ];

  return (
    <section id="features" className="max-w-5xl mx-auto px-4 mb-10">
      {/* 3 Tab Header Box matching Image 2 top */}
      <div className="border border-[#e5e4dc] rounded-2xl bg-white overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e8e7e1]">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(idx)}
                className={`p-6 text-left transition-colors relative cursor-pointer group ${
                  isActive ? 'bg-[#fcfbf9]' : 'bg-white hover:bg-[#faf9f5]'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-0.75 bg-neutral-900" />
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">
                    {feature.tag}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 group-hover:text-neutral-900'
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                </div>

                <h3 className="font-semibold text-neutral-900 text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {feature.shortDesc}
                </p>

                {isActive && (
                  <div className="mt-4 pt-3 border-t border-[#f0eee6] flex items-center gap-1.5 text-[11px] font-medium text-neutral-800">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>{feature.highlight}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Expanded description pane */}
        <div className="px-6 py-4 bg-[#fbfbfa] border-t border-[#e8e7e1] flex items-center justify-between text-xs text-neutral-600">
          <span>{features[activeTab].fullDesc}</span>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white border border-[#e8e7e1] text-[10px] font-medium text-neutral-700 whitespace-nowrap ml-4">
            Automated Pipeline
          </span>
        </div>
      </div>
    </section>
  );
}
