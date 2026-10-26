import { ArrowDown, Calculator, Code2, CheckCircle2, Sparkles, Upload } from 'lucide-react';

interface HeroProps {
  onBuildEstimateClick: () => void;
  onExploreWorkClick: () => void;
  onUploadDocEstimateClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBuildEstimateClick,
  onExploreWorkClick,
  onUploadDocEstimateClick,
}) => {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Apple-grade Frosted Glass Hero Container for pristine legibility over the 3D Ferrofluid Sphere */}
        <div className="max-w-3xl bg-[#FFFFFF]/75 backdrop-blur-2xl border border-white/80 rounded-3xl p-7 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.03)] transition-all">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-[#FFFFFF] border border-[#E4E4E7] text-xs font-semibold tracking-wider uppercase text-[#6B6B73] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4778F5]" />
            <span>Independent Project Studio</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-[#171717] mb-6">
            <span className="block text-[#171717]">Your idea.</span>
            <span className="block text-[#71717A] font-bold">Built properly.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-[#3F3F46] font-normal leading-relaxed mb-8 max-w-2xl">
            From websites and Python applications to data science and AI projects.
            Tell me what you need, and let&apos;s define the right build.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={onUploadDocEstimateClick}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#4778F5] hover:bg-[#3360D4] rounded-full transition-all duration-200 shadow-md shadow-[#4778F5]/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4778F5]"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Upload Syllabus (PDF/DOCX)</span>
            </button>

            <button
              onClick={onBuildEstimateClick}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#171717] hover:bg-[#2D2D30] rounded-full transition-all duration-200 shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4778F5]"
            >
              <Calculator className="w-4 h-4 text-white" />
              <span>Manual Configurator</span>
            </button>

            <button
              onClick={onExploreWorkClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#171717] bg-[#FFFFFF] hover:bg-[#F0F0F3] border border-[#E4E4E7] rounded-full transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4778F5]"
            >
              <Code2 className="w-4 h-4 text-[#6B6B73]" />
              <span>Explore Work</span>
            </button>
          </div>

          {/* Starting price indicator & trust pills */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#52525B] pt-4 border-t border-[#E4E4E7]/60">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#171717] tabular-nums">Projects from ₹599 · Micro add-ons from ₹10</span>
              <span className="text-[#A1A1AA]">·</span>
              <span>Transparent fixed-scope quotes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>1-on-1 direct developer communication</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Source code + setup instructions included</span>
            </div>
          </div>
        </div>

        {/* Studio Technical Capabilities Strip */}
        <div className="mt-12 max-w-4xl bg-[#FFFFFF]/60 backdrop-blur-xl border border-white/70 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-[#6B6B73]">
          <div>
            <div className="text-[#171717] font-semibold mb-1">Web & Frontends</div>
            <div>React, TypeScript, Tailwind, Next.js, Dashboards</div>
          </div>
          <div>
            <div className="text-[#171717] font-semibold mb-1">Python & Scripting</div>
            <div>Automation, Scraping, CLI, Pandas, File I/O</div>
          </div>
          <div>
            <div className="text-[#171717] font-semibold mb-1">Data & Machine Learning</div>
            <div>EDA, Scikit-Learn, Visualizations, Classifiers</div>
          </div>
          <div>
            <div className="text-[#171717] font-semibold mb-1">AI & Intelligent Systems</div>
            <div>RAG, Vector DB, LLM Agents, Model Serving</div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="mt-8 flex items-center justify-start">
          <a
            href="#services"
            className="group inline-flex items-center gap-2 text-xs font-medium text-[#71717A] hover:text-[#171717] transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#4778F5]" />
            <span>Scroll to explore services & work</span>
          </a>
        </div>
      </div>
    </section>
  );
};
