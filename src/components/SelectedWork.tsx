import React, { useState } from 'react';
import { ExternalLink, Github, Terminal, Cpu, Database, Activity, CheckCircle2, Play } from 'lucide-react';

export const SelectedWork: React.FC = () => {
  const [activeVoideTab, setActiveVoideTab] = useState<'terminal' | 'waveform'>('terminal');

  return (
    <section id="work" className="py-20 sm:py-28 bg-[#101114] text-white relative overflow-hidden">
      {/* Background ambient lighting subtle gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4778F5]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#16A34A]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-wider uppercase text-[#4778F5] mb-2">
              Demonstrated Engineering
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Built with curiosity. Engineered with purpose.
            </h2>
            <p className="text-base sm:text-lg text-[#A1A1AA]">
              A selection of technical work, experiments, and software systems built by Hari.
              Inspect the real code repositories and architectural decisions.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href="https://github.com/Justin-io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#191A1F] hover:bg-[#23252C] border border-[#2A2B33] text-xs font-semibold text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>github.com/Justin-io</span>
              <ExternalLink className="w-3 h-3 text-[#A1A1AA]" />
            </a>
          </div>
        </div>

        {/* PROJECT 1 (Featured Flagship): V.O.I.D.E. */}
        <div className="bg-[#191A1F] rounded-3xl border border-[#2A2B33] p-7 sm:p-10 mb-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3 text-xs text-[#A1A1AA]">
                <span className="text-[#4778F5] font-semibold">Flagship Project</span>
                <span aria-hidden="true">·</span>
                <span>System Software</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#10B981] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Open-Source Prototype
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                V.O.I.D.E.
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#71717A] font-mono">
                Voice Operated Intelligent Digital Entity
              </p>

              <p className="text-sm text-[#D4D4D8] leading-relaxed">
                An autonomous desktop voice interface and OS automation pipeline. Integrates real-time
                speech recognition, local TTS synthesis, and natural language command dispatch to orchestrate
                operating system workflows, application launching, and web intelligence.
              </p>

              <div className="flex flex-wrap gap-2 pt-2 pb-2">
                {['Python', 'SpeechRecognition', 'Pyttsx3', 'OS Automation', 'Audio Signal I/O'].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#101114] border border-[#2A2B33] text-[#D4D4D8] font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-4">
                <a
                  href="https://github.com/Justin-io/V.O.I.D.E"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4778F5] hover:bg-[#3464DC] text-xs font-semibold text-white transition-all shadow-sm"
                >
                  <Github className="w-4 h-4" />
                  <span>Inspect Repository</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* Right Visual Console Preview */}
            <div className="lg:col-span-7 bg-[#101114] rounded-2xl border border-[#2A2B33] p-4 sm:p-6 shadow-2xl font-mono text-xs overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#2A2B33] text-[#71717A]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                  </div>
                  <span className="text-[11px] text-[#A1A1AA] ml-1.5 truncate">voide_core_runtime.py</span>
                </div>

                <div className="flex items-center gap-1 bg-[#191A1F] p-0.5 rounded-lg border border-[#2A2B33] shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveVoideTab('terminal')}
                    className={`px-3 py-1.5 rounded text-[11px] transition-colors ${
                      activeVoideTab === 'terminal' ? 'bg-[#2A2B33] text-white shadow-xs' : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    Console Log
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVoideTab('waveform')}
                    className={`px-3 py-1.5 rounded text-[11px] transition-colors ${
                      activeVoideTab === 'waveform' ? 'bg-[#2A2B33] text-white shadow-xs' : 'text-[#71717A] hover:text-white'
                    }`}
                  >
                    Waveform
                  </button>
                </div>
              </div>

              {activeVoideTab === 'terminal' ? (
                <div className="space-y-2.5 text-[#D4D4D8] text-[11px] sm:text-xs leading-relaxed overflow-x-auto">
                  <div className="flex items-start gap-2 break-all sm:break-normal">
                    <span className="text-[#71717A] font-mono shrink-0">[09:02:14]</span>
                    <span>Initializing speech engine: <code className="text-[#93C5FD]">pyttsx3.init(&apos;sapi5&apos;)</code></span>
                  </div>

                  <div className="flex items-start gap-2 break-all sm:break-normal text-[#10B981]">
                    <span className="text-[#71717A] font-mono shrink-0">[09:02:15]</span>
                    <span>Audio input hardware detected: Microphone (24-bit 48kHz)</span>
                  </div>

                  <div className="flex items-start gap-2 break-all sm:break-normal text-[#A1A1AA]">
                    <span className="text-[#71717A] font-mono shrink-0">[09:02:16]</span>
                    <span>Calibrating energy threshold for ambient noise: 340 Hz</span>
                  </div>

                  <div className="p-3 my-2 rounded-xl bg-[#191A1F] border border-[#2A2B33] text-[#60A5FA] break-words">
                    <span className="text-[#A1A1AA]">$ User query:</span> &quot;Analyze project requirements and summarize data dependencies&quot;
                  </div>

                  <div className="flex items-start gap-2 break-all sm:break-normal text-[#34D399]">
                    <span className="text-[#71717A] font-mono shrink-0">[09:02:17]</span>
                    <span>Intent parsed: INTENT_ANALYZE_PIPELINE (confidence: 0.982)</span>
                  </div>

                  <div className="flex items-start gap-2 break-all sm:break-normal text-[#D4D4D8]">
                    <span className="text-[#71717A] font-mono shrink-0">[09:02:18]</span>
                    <span>Dispatching command handler -&gt; PipelineController.execute()</span>
                  </div>

                  <div className="text-[#71717A] flex items-center gap-2 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping shrink-0" />
                    <span>Listening on voice thread...</span>
                  </div>
                </div>
              ) : (
                <div className="py-4 sm:py-6 flex flex-col items-center justify-center space-y-4">
                  <div className="text-[#A1A1AA] text-[11px] text-center">Real-time Audio Amplitude & Energy Threshold</div>
                  {/* Responsive CSS/SVG Waveform visual */}
                  <div className="w-full h-24 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 bg-[#191A1F] rounded-xl border border-[#2A2B33] overflow-hidden">
                    {[18, 32, 60, 45, 80, 95, 65, 40, 75, 90, 100, 70, 50, 85, 90, 60, 35, 20].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 sm:w-2 rounded-full bg-gradient-to-t from-[#4778F5] to-[#60A5FA] transition-all duration-300 shrink-0"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap justify-between gap-2 w-full px-1 text-[10px] text-[#71717A]">
                    <span>Sample Rate: 48,000 Hz</span>
                    <span>Energy: 412 RMS</span>
                    <span>Latency: 18ms</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TWO-COLUMN GRID: Project 2 & Project 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* PROJECT 2: Autonomous AI Data Scientist */}
          <div className="bg-[#191A1F] rounded-3xl border border-[#2A2B33] p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-4">
                <span className="text-[#4778F5] font-semibold">Machine Learning</span>
                <span className="text-[#10B981] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Open-Source Workbench
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                Autonomous AI Data Scientist
              </h3>
              <p className="text-sm text-[#D4D4D8] leading-relaxed mb-6">
                Automated tabular data science system. Handles ingestion, automated exploratory data
                analysis (EDA), statistical validation, missing value imputation, multi-algorithm training
                (Random Forest, XGBoost), and cross-validated metric reports.
              </p>

              {/* Data Science Metric Table Preview */}
              <div className="bg-[#101114] rounded-xl border border-[#2A2B33] p-4 mb-6 font-mono text-xs">
                <div className="text-[11px] text-[#71717A] mb-2 flex justify-between">
                  <span>Model Benchmark Results</span>
                  <span className="text-[#10B981]">5-Fold CV</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[#D4D4D8] border-b border-[#2A2B33]/60 pb-1.5">
                    <span className="font-semibold text-white">Random Forest Classifier</span>
                    <span className="text-[#34D399] tabular-nums font-bold">94.2% Acc / 0.93 F1</span>
                  </div>
                  <div className="flex justify-between items-center text-[#A1A1AA] border-b border-[#2A2B33]/60 pb-1.5">
                    <span>XGBoost Gradient Boost</span>
                    <span className="tabular-nums">93.8% Acc / 0.92 F1</span>
                  </div>
                  <div className="flex justify-between items-center text-[#71717A]">
                    <span>Logistic Regression (Baseline)</span>
                    <span className="tabular-nums">86.4% Acc / 0.84 F1</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {['Python', 'Pandas', 'Scikit-Learn', 'Automated ML', 'Feature Engineering'].map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#101114] border border-[#2A2B33] text-[#A1A1AA] font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#2A2B33] flex items-center justify-between">
              <a
                href="https://github.com/Justin-io/autonomous-ai-data-scientist"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#4778F5] hover:text-[#60A5FA] transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* PROJECT 3: RAG Evaluation Platform */}
          <div className="bg-[#191A1F] rounded-3xl border border-[#2A2B33] p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-4">
                <span className="text-[#4778F5] font-semibold">AI & LLM Systems</span>
                <span className="text-[#10B981] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Evaluation Suite
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                RAG Evaluation Platform
              </h3>
              <p className="text-sm text-[#D4D4D8] leading-relaxed mb-6">
                Diagnostic benchmarking platform for Retrieval-Augmented Generation architectures.
                Evaluates chunking strategies, vector embeddings, context retrieval precision, answer
                groundedness, and hallucination reduction.
              </p>

              {/* RAG Metrics preview */}
              <div className="bg-[#101114] rounded-xl border border-[#2A2B33] p-4 mb-6 font-mono text-xs">
                <div className="text-[11px] text-[#71717A] mb-2 flex justify-between">
                  <span>RAG Triad Assessment</span>
                  <span className="text-[#4778F5]">Cosine Distance</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-[#191A1F] border border-[#2A2B33]">
                    <div className="text-[10px] text-[#71717A]">Context Precision</div>
                    <div className="text-sm font-bold text-[#34D399] tabular-nums mt-0.5">0.92</div>
                  </div>
                  <div className="p-2 rounded bg-[#191A1F] border border-[#2A2B33]">
                    <div className="text-[10px] text-[#71717A]">Faithfulness</div>
                    <div className="text-sm font-bold text-[#34D399] tabular-nums mt-0.5">0.96</div>
                  </div>
                  <div className="p-2 rounded bg-[#191A1F] border border-[#2A2B33]">
                    <div className="text-[10px] text-[#71717A]">Answer Relevance</div>
                    <div className="text-sm font-bold text-[#60A5FA] tabular-nums mt-0.5">0.89</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {['Vector Embeddings', 'Cosine Similarity', 'RAG Triad', 'Evaluation Suite', 'FastAPI'].map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#101114] border border-[#2A2B33] text-[#A1A1AA] font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#2A2B33] flex items-center justify-between">
              <a
                href="https://github.com/Justin-io/rag-eval-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#4778F5] hover:text-[#60A5FA] transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Direct Link to Justin/Hari's Vercel Portfolio */}
        <div className="p-6 rounded-2xl bg-[#191A1F]/60 border border-[#2A2B33] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#4778F5]" />
            <span>Looking for more design & frontend showcases? View Hari&apos;s full personal portfolio.</span>
          </div>
          <a
            href="https://justinalexia.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#4778F5] transition-colors shrink-0"
          >
            <span>justinalexia.vercel.app</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
