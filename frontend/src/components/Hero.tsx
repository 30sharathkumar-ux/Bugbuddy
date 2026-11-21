import { ArrowDown, Sparkles } from 'lucide-react';
import { EXAMPLE_ERRORS } from '../constants/examples';

interface HeroProps {
  onSelectExample: (example: typeof EXAMPLE_ERRORS[0]) => void;
  onScrollToStudio: () => void;
}

export function Hero({ onSelectExample, onScrollToStudio }: HeroProps) {
  return (
    <section className="relative pt-12 pb-14 text-center px-4 max-w-4xl mx-auto">
      {/* Warm ambient background glow */}
      <div className="absolute inset-0 -top-20 hero-glow pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300/80 bg-white/70 backdrop-blur-xs text-xs font-medium text-neutral-700 shadow-2xs mb-6">
        <Sparkles size={13} className="text-neutral-800" />
        <span>Live Web Research via SerpAPI + You.com</span>
        <span className="w-1 h-1 rounded-full bg-neutral-300" />
        <span className="text-neutral-500 font-normal">Gemini 3.5 AI</span>
      </div>

      {/* Editorial Headline */}
      <h1 className="font-editorial text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-neutral-900 leading-[1.08] mb-6">
        Effortless code error <br className="hidden sm:inline" />
        <span className="italic font-normal">resolution</span> by Bug Buddy
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
        Streamline your debugging process with seamless automation, verified root-cause
        analysis, and real-time evidence retrieval across GitHub, Stack Overflow, and official docs.
      </p>

      {/* Hero CTA Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
        <button
          onClick={onScrollToStudio}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium transition-all shadow-sm hover:shadow-md cursor-pointer group"
        >
          <span>Start Investigation</span>
          <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>

      {/* Quick Try Example Chips */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-2.5">
          Or try a sample real-world error
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
          {EXAMPLE_ERRORS.map(ex => (
            <button
              key={ex.id}
              onClick={() => onSelectExample(ex)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e8e7e1] hover:border-neutral-400 text-xs text-neutral-700 hover:text-neutral-950 font-medium transition shadow-2xs cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              <span>{ex.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
