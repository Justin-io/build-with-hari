import React from 'react';
import { FileText, Calculator, Code, CheckSquare } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Share your requirements',
      icon: FileText,
      description:
        'Explain the idea, syllabus deadline, academic context, and required deliverables. Upload reference materials or synopses if you have them.',
      details: 'No commitment required to discuss and explore technical viability.',
    },
    {
      step: '02',
      title: 'Get a confirmed quote',
      icon: Calculator,
      description:
        'Hari reviews your exact scope and provides a transparent, fixed-scope quote itemizing deliverables, timeline, milestones, and revision limits.',
      details: 'Zero unexpected hidden fees or moving goalposts during development.',
    },
    {
      step: '03',
      title: 'Build and review',
      icon: Code,
      description:
        'Development begins with modular architecture, proper code comments, and interim review checkpoints or screen-recordings of progress.',
      details: 'Regular progress updates directly from the developer building it.',
    },
    {
      step: '04',
      title: 'Handover & walkthrough',
      icon: CheckSquare,
      description:
        'Receive the complete clean source code, local setup instructions, requirements files, agreed documentation, and post-delivery revision window.',
      details: 'Ready to run on your local machine with clear step-by-step guidance.',
    },
  ];

  return (
    <section id="process" className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#4778F5] mb-2">
            The Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717] mb-4">
            Clear from the first conversation.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B73]">
            No messy freelancer bidding wars, no junior middlemen. Just direct, transparent
            engineering from concept definition to local setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#FFFFFF] rounded-2xl p-7 border border-[#E4E4E7] shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#4778F5]/30 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-bold text-[#8E8E93]/60">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#171717]">
                      <Icon className="w-5 h-5 text-[#4778F5]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#171717] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B6B73] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0F0F3] text-[11px] text-[#8E8E93] font-medium">
                  {item.details}
                </div>
              </div>
            );
          })}
        </div>

        {/* Academic integrity reassurance note */}
        <div className="mt-10 p-5 rounded-xl bg-[#FFFFFF] border border-[#E4E4E7] text-xs text-[#6B6B73] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-[#171717]">Ethical & Technical Reassurance: </span>
            This studio provides legitimate technical development, prototyping, and code tutoring to help you
            understand the architecture. We never guarantee institutional grades or plagiarism clearance.
          </div>
        </div>
      </div>
    </section>
  );
};
