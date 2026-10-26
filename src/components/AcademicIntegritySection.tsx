import React from 'react';
import { ShieldCheck, BookOpen, GraduationCap, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const AcademicIntegritySection: React.FC = () => {
  return (
    <section id="academic-integrity" className="py-20 sm:py-24 relative bg-[#FFFFFF] border-t border-[#E4E4E7]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-xs font-semibold text-[#10B981] mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ethical Engineering Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717] mb-4">
            Academic Integrity & Code Comprehension
          </h2>
          <p className="text-base text-[#6B6B73] leading-relaxed">
            BUILD WITH HARI operates as an independent technical software studio and engineering consultancy.
            We construct genuine, functional software prototypes to accelerate student learning,
            architectural understanding, and research prototyping.
          </p>
        </div>

        {/* 3 Core Pillars of Academic Support */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#F5F5F7] rounded-2xl p-6 sm:p-7 border border-[#E4E4E7]">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E4E4E7] flex items-center justify-center text-[#4778F5] mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#171717] mb-2">
              Transparent Code &amp; Documentation
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B73] leading-relaxed">
              Every deliverable contains inline code documentation, variable typing, and an exhaustive setup guide.
              You never receive black-box compiled binaries or unverified snippets.
            </p>
          </div>

          <div className="bg-[#F5F5F7] rounded-2xl p-6 sm:p-7 border border-[#E4E4E7]">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E4E4E7] flex items-center justify-center text-[#10B981] mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#171717] mb-2">
              Viva &amp; Presentation Readiness
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B73] leading-relaxed">
              We provide comprehensive viva defense briefs, architecture diagrams, and algorithm walkthroughs.
              Our mission is to help you thoroughly understand every line of code so you can defend your project with authority.
            </p>
          </div>

          <div className="bg-[#F5F5F7] rounded-2xl p-6 sm:p-7 border border-[#E4E4E7]">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E4E4E7] flex items-center justify-center text-[#F59E0B] mb-4">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#171717] mb-2">
              Strict Anti-Plagiarism Policy
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B73] leading-relaxed">
              We do not ghostwrite exam answers, fabricate scientific datasets, or facilitate academic dishonesty.
              Projects are built to serve as original engineering references, working prototypes, and educational systems.
            </p>
          </div>
        </div>

        {/* Syllabus & University Alignment Bento Box */}
        <div className="bg-[#191A1F] rounded-3xl p-7 sm:p-10 text-white border border-[#2A2B33]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-8 border-b border-[#2A2B33]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#4778F5] mb-2">
                University &amp; Degree Alignment
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Engineered to meet rigorous academic project rubrics
              </h3>
            </div>
            <div className="text-xs text-[#A1A1AA] max-w-md">
              Whether you are preparing a final-year B.Tech capstone, an MCA major project, or a research prototype,
              architectures follow standard software engineering lifecycle standards.
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#101114] border border-[#2A2B33]">
              <div className="text-xs font-bold text-white mb-1">B.Tech / B.E.</div>
              <div className="text-[11px] text-[#A1A1AA]">Computer Science, IT, AI &amp; DS, ECE Capstones</div>
            </div>
            <div className="p-4 rounded-xl bg-[#101114] border border-[#2A2B33]">
              <div className="text-xs font-bold text-white mb-1">BCA &amp; MCA</div>
              <div className="text-[11px] text-[#A1A1AA]">Full-stack web applications, database portals &amp; APIs</div>
            </div>
            <div className="p-4 rounded-xl bg-[#101114] border border-[#2A2B33]">
              <div className="text-xs font-bold text-white mb-1">M.Tech / M.Sc</div>
              <div className="text-[11px] text-[#A1A1AA]">Advanced ML algorithms, EDA benchmarks &amp; RAG pipelines</div>
            </div>
            <div className="p-4 rounded-xl bg-[#101114] border border-[#2A2B33]">
              <div className="text-xs font-bold text-white mb-1">Regional Relevance</div>
              <div className="text-[11px] text-[#A1A1AA]">KTU, Calicut University, CUSAT, MG &amp; All-India syllabi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
