import React from 'react';
import { Globe, Terminal, BrainCircuit, FileSpreadsheet, ArrowRight, Layers, Check } from 'lucide-react';
import { ProjectTypeId } from '../utils/pricing';

interface ServicesSectionProps {
  onSelectCategory: (typeId: ProjectTypeId) => void;
  onSelectDocumentation: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectCategory,
  onSelectDocumentation,
}) => {
  const services = [
    {
      id: 'web_app' as ProjectTypeId,
      title: 'Web & Applications',
      tagline: 'Responsive interfaces, portals, and dashboards',
      description:
        'Websites, interactive client dashboards, CRUD portals, and small applications built with React, TypeScript, and clean modern styling.',
      startingPrice: '₹699',
      icon: Globe,
      highlights: [
        'Responsive mobile, tablet & desktop layouts',
        'Interactive forms, state handling & validation',
        'Optional REST API, authentication & database',
        'Clean, commented frontend codebase',
      ],
      actionLabel: 'Configure Web Estimate',
    },
    {
      id: 'python_script' as ProjectTypeId,
      title: 'Python & Automation',
      tagline: 'Automation scripts, scraping, and data pipelines',
      description:
        'Robust Python utilities, automated data extractors, file parsers (CSV/Excel/JSON), and modular command-line or Streamlit tools.',
      startingPrice: '₹599',
      icon: Terminal,
      highlights: [
        'Web scraping & automated data ingestion',
        'Batch file processing & format transformations',
        'Modular functions with clean typing & error handling',
        'Virtualenv & requirements.txt setup guide',
      ],
      actionLabel: 'Configure Python Estimate',
    },
    {
      id: 'data_science' as ProjectTypeId,
      title: 'Data Science & Analytics',
      tagline: 'Exploratory data analysis & statistical modeling',
      description:
        'In-depth exploratory data analysis (EDA), statistical hypothesis testing, data cleaning, and presentation-ready visual charts.',
      startingPrice: '₹999',
      icon: Layers,
      highlights: [
        'Structured Jupyter notebooks with markdown steps',
        'Seaborn, Matplotlib, or Plotly charts',
        'Statistical validation, correlation & outlier removal',
        'Clean summary insights & analytical findings',
      ],
      actionLabel: 'Configure Data Science Estimate',
    },
    {
      id: 'ai_ml' as ProjectTypeId,
      title: 'AI & Intelligent Systems',
      tagline: 'Trained ML models, RAG pipelines & evaluation',
      description:
        'Clearly scoped machine learning models, classification/regression pipelines, confusion matrices, or RAG retrieval applications.',
      startingPrice: '₹1,299',
      icon: BrainCircuit,
      highlights: [
        'Algorithms benchmarking (Random Forest, XGBoost, etc.)',
        'Evaluation metrics (Accuracy, F1, ROC-AUC curves)',
        'Vector embeddings & RAG retrieval implementations',
        'FastAPI model serving or inference script',
      ],
      actionLabel: 'Configure AI/ML Estimate',
    },
  ];

  return (
    <section id="services" className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#4778F5] mb-2">
            Service Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717] mb-4">
            What are we building?
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B73]">
            Choose a starting point. We&apos;ll tailor the scope, architecture, and timeline
            to your exact syllabus and project requirements.
          </p>
        </div>

        {/* 4 Core Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-[#FFFFFF] rounded-2xl p-7 sm:p-8 border border-[#E4E4E7] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#4778F5]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] border border-[#E4E4E7] flex items-center justify-center text-[#171717] group-hover:text-[#4778F5] group-hover:bg-[#4778F5]/5 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#8E8E93]">Starting at</div>
                      <div className="text-lg font-bold text-[#171717] tabular-nums">
                        {service.startingPrice}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#171717] mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs font-medium text-[#4778F5] mb-3">
                    {service.tagline}
                  </p>
                  <p className="text-sm text-[#6B6B73] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-8 border-t border-[#F0F0F3] pt-5">
                    {service.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#48484A]">
                        <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectCategory(service.id)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-[#171717] bg-[#F5F5F7] hover:bg-[#171717] hover:text-white rounded-xl transition-all duration-200 group-hover:bg-[#171717] group-hover:text-white"
                >
                  <span>{service.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Documentation & Deliverables Banner Card */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E4E4E7] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#F5F5F7] border border-[#E4E4E7] flex items-center justify-center text-[#171717] shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-[#4778F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-[#171717]">
                  Presentations, Reports & Deliverables
                </h3>
                <span className="text-xs text-[#6B6B73]">· Add-on or Standalone</span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B6B73] max-w-2xl leading-relaxed">
                Need a viva defense briefing sheet, system architecture diagram, formatted academic
                project report, or high-impact PPT slides? Add them to any project in the configurator.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSelectDocumentation}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#171717] bg-[#F5F5F7] hover:bg-[#171717] hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <span>Explore Add-on Packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
