import React from 'react';
import { Github, Linkedin, ExternalLink, Mail, Code, Terminal, Brain, Sparkles } from 'lucide-react';

export const FounderSection: React.FC = () => {
  return (
    <section id="about" className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E4E4E7] p-8 sm:p-14 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Narrative / About */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#E4E4E7] text-xs font-semibold tracking-wider uppercase text-[#6B6B73]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4778F5]" />
                <span>Founder & Principal Developer</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
                Built by a developer who loves solving problems.
              </h2>

              <p className="text-sm sm:text-base text-[#6B6B73] leading-relaxed">
                Hi, I&apos;m <span className="font-semibold text-[#171717]">Hari Nandan K.</span>, an independent software
                engineer and data practitioner. BUILD WITH HARI is my focused project studio dedicated to building high-quality,
                tailored technical software for university students and engineers.
              </p>

              <p className="text-sm sm:text-base text-[#6B6B73] leading-relaxed">
                Instead of dealing with anonymous marketplace freelancers or unverified code repositories that fail to run,
                you work directly with me. I personally design the architecture, write the clean codebase, verify every test,
                and prepare clear documentation so you can understand and defend your project with confidence.
              </p>

              {/* Technical Domains */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#F5F5F7] border border-[#E4E4E7]">
                  <Code className="w-4 h-4 text-[#4778F5] mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Fullstack Web</div>
                  <div className="text-[11px] text-[#8E8E93]">React, TS, Next.js, APIs</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F5F7] border border-[#E4E4E7]">
                  <Terminal className="w-4 h-4 text-[#4778F5] mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Python & Systems</div>
                  <div className="text-[11px] text-[#8E8E93]">Automation, CLI, Scraping</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F5F7] border border-[#E4E4E7]">
                  <Brain className="w-4 h-4 text-[#4778F5] mb-1.5" />
                  <div className="text-xs font-bold text-[#171717]">Data Science & AI</div>
                  <div className="text-[11px] text-[#8E8E93]">ML, EDA, RAG, Visuals</div>
                </div>
              </div>

              {/* Founder Social & Portfolio Links */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="https://justinalexia.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171717] hover:bg-[#4778F5] text-xs font-semibold text-white transition-colors"
                >
                  <span>Personal Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://github.com/Justin-io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F5F7] hover:bg-[#E4E4E7] border border-[#E4E4E7] text-xs font-semibold text-[#171717] transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub (@Justin-io)</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/justinalexia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F5F7] hover:bg-[#E4E4E7] border border-[#E4E4E7] text-xs font-semibold text-[#171717] transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>LinkedIn Profile</span>
                </a>

                <a
                  href="mailto:harinandhan972@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F5F7] hover:bg-[#E4E4E7] border border-[#E4E4E7] text-xs font-semibold text-[#171717] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#6B6B73]" />
                  <span>harinandhan972@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Right Card / Studio Identity Badge */}
            <div className="lg:col-span-5 bg-[#F5F5F7] rounded-2xl p-7 sm:p-8 border border-[#E4E4E7] space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#171717] text-white flex items-center justify-center font-bold text-xl tracking-tight shadow-md">
                  HN
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#171717]">Hari Nandan K.</h3>
                  <p className="text-xs text-[#6B6B73]">Independent Software Developer</p>
                  <p className="text-[11px] text-[#8E8E93]">Based in India · Working with students worldwide</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E4E4E7] text-xs space-y-2.5">
                <div className="font-semibold text-[#171717]">Studio Principles:</div>
                <div className="text-[#6B6B73] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span>Zero code shortcuts or broken copy-pastes</span>
                </div>
                <div className="text-[#6B6B73] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span>Complete local environment setup guide</span>
                </div>
                <div className="text-[#6B6B73] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span>Honest technical advice on syllabus feasibility</span>
                </div>
              </div>

              <div className="text-[11px] text-[#8E8E93] leading-relaxed">
                Direct inquiries handled via WhatsApp or email. Every project inquiry receives a
                custom response with tailored architecture notes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
