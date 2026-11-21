import { Sparkles, GitBranch, MessageSquare, BookOpen, Layers } from 'lucide-react';

export function SocialProof() {
  const sources = [
    {
      name: 'GitHub',
      subtext: 'Issues & Discussions',
      icon: GitBranch,
      detail: 'Live issue tracking, closed bug threads, and maintainer patches',
    },
    {
      name: 'Stack Overflow',
      subtext: 'Verified Developer Answers',
      icon: MessageSquare,
      detail: 'Highest-voted accepted fixes with real community verification',
    },
    {
      name: 'Official Docs',
      subtext: 'MDN, Python, React, Node',
      icon: BookOpen,
      detail: 'Authoritative API specifications, migration guides, and releases',
    },
    {
      name: 'Registries',
      subtext: 'npm, PyPI, Docker Hub',
      icon: Layers,
      detail: 'Peer dependency trees, package deprecations, and version specs',
    },
  ];

  return (
    <section id="sources" className="max-w-5xl mx-auto px-4 py-16 text-center">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-300/80 bg-white text-xs font-semibold text-neutral-700 shadow-2xs mb-4">
        <Sparkles size={12} className="text-neutral-800" />
        <span>Authoritative Technical Grounding</span>
      </div>

      {/* Editorial Headline */}
      <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl font-normal text-neutral-900 tracking-tight mb-3">
        Confidence backed by results
      </h2>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-neutral-600 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
        Our research engine crawls live, confirmed sources across the developer ecosystem
        so you never debug with unverified guesswork.
      </p>

      {/* Grid of 4 Cards with diagonal hatch corners (matching Image 2) */}
      <div className="border border-[#e5e4dc] rounded-2xl bg-white overflow-hidden shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e8e7e1]">
        {sources.map((item, idx) => {
          const Icon = item.icon;
          const isCorner = idx === 0 || idx === 3;
          return (
            <div
              key={item.name}
              className={`p-6 text-left relative transition hover:bg-[#faf9f5] ${
                isCorner ? 'bg-[#fcfbf9]' : 'bg-white'
              }`}
            >
              {/* Subtle crosshatch corner badge */}
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-[#e8e7e1] flex items-center justify-center text-neutral-800 mb-3 shadow-2xs">
                <Icon size={18} />
              </div>

              <h4 className="font-semibold text-neutral-900 text-sm tracking-tight">
                {item.name}
              </h4>
              <p className="text-[11px] font-medium text-neutral-500 mb-2">
                {item.subtext}
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
