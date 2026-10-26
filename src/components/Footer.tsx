import React, { useState } from 'react';
import { ArrowUpRight, Github, Linkedin, ExternalLink, Mail, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onStartProjectClick: () => void;
  onBuildEstimateClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onStartProjectClick,
  onBuildEstimateClick,
}) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'academic' | null>(null);

  return (
    <footer className="pt-20 pb-12 bg-[#FFFFFF] border-t border-[#E4E4E7] relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Pre-footer Final CTA Banner */}
        <div className="bg-[#101114] rounded-3xl p-8 sm:p-14 text-white text-center mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#4778F5]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#4778F5] mb-2 block">
              Ready to begin?
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Let&apos;s make your idea work.
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] mb-8 leading-relaxed">
              Tell me what you&apos;re building. We&apos;ll define a practical scope, calculate a fair estimate,
              and take it from there.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onStartProjectClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold text-white bg-[#4778F5] hover:bg-[#3464DC] rounded-full transition-all shadow-sm active:scale-[0.98]"
              >
                <span>Start Your Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onBuildEstimateClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-semibold text-white bg-[#191A1F] hover:bg-[#2A2B33] border border-[#2A2B33] rounded-full transition-all active:scale-[0.98]"
              >
                <span>Build an Estimate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Minimalist 3-Column Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E4E4E7] text-xs">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-base font-bold text-[#171717] tracking-tight">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#4778F5]" />
              <span>BUILD WITH HARI</span>
            </div>
            <p className="text-[#6B6B73] max-w-sm leading-relaxed">
              Independent Software & Project Studio operated by Hari Nandan K.
              Tailored software engineering, data science, Python, and AI builds for students and researchers.
            </p>
            <div className="pt-2 text-[11px] text-[#8E8E93]">
              Founder: <span className="text-[#171717] font-medium">Hari Nandan K.</span>
            </div>
          </div>

          {/* Studio Navigation Links */}
          <div className="space-y-2.5">
            <div className="font-bold text-[#171717] uppercase tracking-wider text-[11px]">
              Studio Navigation
            </div>
            <ul className="space-y-2 text-[#6B6B73]">
              <li><a href="#work" className="hover:text-[#171717] transition-colors">Demonstrated Work</a></li>
              <li><a href="#services" className="hover:text-[#171717] transition-colors">Service Capabilities</a></li>
              <li><a href="#process" className="hover:text-[#171717] transition-colors">Development Process</a></li>
              <li><a href="#pricing" className="hover:text-[#171717] transition-colors">Pricing Configurator</a></li>
              <li><a href="#academic-integrity" className="hover:text-[#171717] transition-colors">Academic Standards &amp; Ethics</a></li>
              <li><a href="#about" className="hover:text-[#171717] transition-colors">About Hari Nandan K.</a></li>
            </ul>
          </div>

          {/* Social & Verification */}
          <div className="space-y-2.5">
            <div className="font-bold text-[#171717] uppercase tracking-wider text-[11px]">
              Verified Channels
            </div>
            <ul className="space-y-2 text-[#6B6B73]">
              <li>
                <a
                  href="https://justinalexia.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#4778F5] transition-colors flex items-center gap-1.5"
                >
                  <span>justinalexia.vercel.app</span>
                  <ExternalLink className="w-3 h-3 text-[#8E8E93]" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Justin-io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#4778F5] transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub (@Justin-io)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/justinalexia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#4778F5] transition-colors flex items-center gap-1.5"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>LinkedIn Profile</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:harinandhan972@gmail.com"
                  className="hover:text-[#4778F5] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#6B6B73]" />
                  <span>harinandhan972@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Ethics notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8E93]">
          <div>
            &copy; {new Date().getFullYear()} BUILD WITH HARI · All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveModal('academic')}
              className="hover:text-[#171717] transition-colors underline"
            >
              Academic Policy & Scope
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="hover:text-[#171717] transition-colors"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="hover:text-[#171717] transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Lightweight Policy Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#E4E4E7] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7] mb-4">
              <h3 className="text-base font-bold text-[#171717]">
                {activeModal === 'academic' && 'Academic Policy & Scope'}
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-xs font-semibold text-[#6B6B73] hover:text-[#171717] px-2 py-1 rounded bg-[#F5F5F7]"
              >
                Close
              </button>
            </div>

            <div className="text-xs text-[#6B6B73] leading-relaxed space-y-3 max-h-80 overflow-y-auto">
              {activeModal === 'academic' && (
                <>
                  <p>
                    <strong>Legitimate Development & Tutoring Support:</strong> BUILD WITH HARI provides bespoke
                    software development, architectural consultation, code refactoring, and technical walkthroughs.
                  </p>
                  <p>
                    All clients are encouraged to thoroughly review the provided codebase, study the setup documentation,
                    and utilize the viva briefing materials to understand the project deeply. We do not guarantee grades,
                    institutional evaluations, or bypass academic oversight.
                  </p>
                </>
              )}
              {activeModal === 'privacy' && (
                <>
                  <p>
                    We value your confidentiality. Any project requirements, problem statements, datasets, or reference
                    files submitted through this website are strictly utilized by Hari Nandan K. for scoping and development.
                  </p>
                  <p>
                    We never sell, distribute, or publicly index your private documents. Contact information is only used
                    to reply to your specific enquiry.
                  </p>
                </>
              )}
              {activeModal === 'terms' && (
                <>
                  <p>
                    <strong>Agreed Milestones:</strong> Before development begins, an itemized scope of deliverables and timeline
                    is locked in. Turnarounds (Standard, Urgent, Express) are confirmed prior to project kickoff.
                  </p>
                  <p>
                    <strong>Revisions:</strong> Minor bug fixes and configuration adjustments are supported within the agreed
                    post-delivery revision period. Substantial changes to core requirements after kickoff are subject to an
                    incremental scope quote.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
