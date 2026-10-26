import React from 'react';
import { Sparkles, FileText, ArrowUpRight } from 'lucide-react';

interface AiEstimatorFabProps {
  onClick: () => void;
}

export const AiEstimatorFab: React.FC<AiEstimatorFabProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
      {/* Floating Pill Button */}
      <button
        type="button"
        onClick={onClick}
        aria-label="Upload document to estimate budget with Gemini AI"
        className="relative flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-[#171717] text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-white/15 hover:border-[#4778F5]/60 hover:bg-[#1E1E22] active:scale-95 transition-all duration-300"
      >
        {/* Glowing aura badge on pulse */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4778F5] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4778F5]"></span>
        </span>

        <div className="w-6 h-6 rounded-full bg-[#4778F5] text-white flex items-center justify-center shrink-0 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
            <span>AI Syllabus Estimator</span>
            <ArrowUpRight className="w-3 h-3 text-[#4778F5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
          <span className="hidden sm:inline text-[10px] text-[#A1A1AA]">
            PDF / DOCX to Instant Cart
          </span>
        </div>
      </button>
    </div>
  );
};
