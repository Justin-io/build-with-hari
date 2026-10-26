import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, UserCheck, TerminalSquare, RefreshCw, FileCode, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const trustPillars = [
    {
      title: 'One Developer, Direct Communication',
      icon: UserCheck,
      desc: 'You talk directly with Hari Nandan K., the software engineer writing the code. No middle managers or junior outsourced handoffs.',
    },
    {
      title: 'Fixed Scope Before Payment',
      icon: ShieldCheck,
      desc: 'Every deliverable, feature list, and revision boundary is formally documented and mutually agreed upon before work begins.',
    },
    {
      title: 'Complete Source Code & Git History',
      icon: FileCode,
      desc: 'You receive full ownership of the clean source code, package files, environment configs, and local run scripts.',
    },
    {
      title: 'Local Setup Walkthrough & Support',
      icon: TerminalSquare,
      desc: 'Every project includes a clear step-by-step setup guide and optional video or remote setup assistance to run it on your machine.',
    },
    {
      title: 'Defined Revision Period',
      icon: RefreshCw,
      desc: 'Every project comes with an agreed post-delivery revision window for bug fixes and scope adjustments according to the agreed plan.',
    },
    {
      title: 'Academic Integrity & Learning Focus',
      icon: CheckCircle2,
      desc: 'Positioned around genuine engineering, tutoring, and architectural understanding so you can confidently explain your build in your viva.',
    },
  ];

  const faqs = [
    {
      q: 'What is included in the price?',
      a: 'Every package includes the complete commented source code, requirements/dependency files, a comprehensive README with local setup instructions, demonstration screen recordings of the functioning application, and a standard revision window. Optional deliverables like PPT slides, viva preparation sheets, and report formatting are clearly itemized in the configurator.',
    },
    {
      q: 'Do I receive the full source code and rights?',
      a: 'Yes, 100%. You receive the complete repository with all code files, assets, and configurations. You are free to run, modify, fork, or present the code for your academic submission.',
    },
    {
      q: 'Can I request a completely custom or uncommon project?',
      a: 'Absolutely. Many final-year projects require custom combinations (e.g. Raspberry Pi IoT triggers + Flask server + React frontend, or a custom computer vision classifier). Submit your synopsis in the Custom Request form, and I will draft a dedicated architecture and timeline.',
    },
    {
      q: 'Can you explain how the code works for my viva or presentation?',
      a: 'Yes. If you add the "Viva Preparation Sheet" or request a walkthrough, you will receive a curated breakdown of key functions, architectural decisions, examiner questions, and algorithms used, helping you speak with genuine confidence.',
    },
    {
      q: 'How is the project deadline confirmed?',
      a: 'When you submit your requirements, I verify schedule availability against the requested deadline. Urgent (3–4 days) and Express (24–48 hours) turnarounds are locked in only after technical feasibility is confirmed, guaranteeing no unkept promises.',
    },
    {
      q: 'What happens if my college guide asks for changes?',
      a: 'Minor adjustments, parameter tweaks, and bug fixes within the originally agreed scope are handled promptly during the standard revision window. If your college guide substantially shifts the project topic or introduces major new services, we simply agree on a fair incremental quote for the extra scope.',
    },
    {
      q: 'Do you provide local setup assistance on my laptop?',
      a: 'Yes. In addition to thorough README instructions, deployment and setup assistance can be added so I can guide you through setting up Python virtual environments, Node dependencies, or database migrations on your machine.',
    },
    {
      q: 'How are payments handled?',
      a: 'Typically, a 50% initial commitment is made after agreeing on the scope and timeline, with the remaining 50% due upon viewing a live working demonstration before final source code handover. Bank transfer and UPI are supported.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#4778F5] mb-2">
            Standards & Expectations
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717] mb-4">
            Built on mutual trust and engineering clarity.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B73]">
            What you can count on when working with BUILD WITH HARI, and how we handle
            scope, delivery, and support.
          </p>
        </div>

        {/* 6 Trust Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-7 border border-[#E4E4E7] shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#171717] mb-4">
                  <Icon className="w-5 h-5 text-[#4778F5]" />
                </div>
                <h3 className="text-base font-bold text-[#171717] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6B73] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B73]">
              Practical, honest answers to common student questions.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-[#FFFFFF] rounded-xl border border-[#E4E4E7] overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#171717] hover:text-[#4778F5] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8E8E93] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#4778F5]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#6B6B73] leading-relaxed border-t border-[#F5F5F7]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
