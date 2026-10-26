import React, { useState, useMemo } from 'react';
import {
  ProjectTypeId,
  ComplexityLevel,
  DeliverySpeed,
  ProjectConfig,
  PROJECT_TYPES,
  COMPLEXITY_CONFIG,
  MICRO_ADD_ON_OPTIONS,
  LARGER_ADD_ON_OPTIONS,
  DELIVERY_OPTIONS,
  calculateEstimate,
  formatINR,
  ADDITIONAL_WEB_PAGE_PRICE,
} from '../utils/pricing';
import {
  Check,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  Clock,
  Globe,
  Terminal,
  BrainCircuit,
  Sliders,
  Plus,
  Minus,
  Wrench,
  AlertCircle,
  BarChart3,
  FileText,
  HelpCircle,
  Palette,
  FileCheck2,
  GitBranch,
} from 'lucide-react';

interface PricingConfiguratorProps {
  initialProjectType?: ProjectTypeId;
  onContinueWithEstimate: (config: ProjectConfig, totalINR: number) => void;
  onCustomProjectClick: () => void;
}

export const PricingConfigurator: React.FC<PricingConfiguratorProps> = ({
  initialProjectType = 'web_app',
  onContinueWithEstimate,
  onCustomProjectClick,
}) => {
  // State
  const [projectType, setProjectType] = useState<ProjectTypeId>(initialProjectType);
  const [complexity, setComplexity] = useState<ComplexityLevel>('basic');
  const [webPagesCount, setWebPagesCount] = useState<number>(1);
  const [selectedScopeFeatures, setSelectedScopeFeatures] = useState<string[]>([]);
  const [microAddOns, setMicroAddOns] = useState<Record<string, number>>({});
  const [selectedLargerAddOns, setSelectedLargerAddOns] = useState<string[]>([]);
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('standard');
  const [activeTab, setActiveTab] = useState<'build' | 'addons' | 'delivery'>('build');
  const [addonSubTab, setAddonSubTab] = useState<'micro' | 'larger'>('micro');

  React.useEffect(() => {
    if (initialProjectType) {
      setProjectType(initialProjectType);
      setSelectedScopeFeatures([]);
    }
  }, [initialProjectType]);

  const currentConfig: ProjectConfig = useMemo(() => {
    return {
      projectType,
      complexity,
      webPagesCount: projectType === 'web_app' ? webPagesCount : undefined,
      selectedScopeFeatures,
      microAddOns,
      selectedLargerAddOns,
      deliverySpeed,
    };
  }, [projectType, complexity, webPagesCount, selectedScopeFeatures, microAddOns, selectedLargerAddOns, deliverySpeed]);

  const estimate = useMemo(() => {
    return calculateEstimate(currentConfig);
  }, [currentConfig]);

  const toggleScopeFeature = (featureId: string) => {
    setSelectedScopeFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };

  const updateMicroQty = (id: string, delta: number, maxQty: number) => {
    setMicroAddOns((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, Math.min(maxQty, current + delta));
      const updated = { ...prev };
      if (next === 0) {
        delete updated[id];
      } else {
        updated[id] = next;
      }
      return updated;
    });
  };

  const toggleLargerAddOn = (addOnId: string) => {
    setSelectedLargerAddOns((prev) =>
      prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]
    );
  };

  const workbenchRef = React.useRef<HTMLDivElement>(null);

  const handleTabChange = (nextTab: 'build' | 'addons' | 'delivery') => {
    setActiveTab(nextTab);
    if (workbenchRef.current) {
      const yOffset = -90;
      const y = workbenchRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setComplexity('basic');
    setWebPagesCount(1);
    setSelectedScopeFeatures([]);
    setMicroAddOns({});
    setSelectedLargerAddOns([]);
    setDeliverySpeed('standard');
    setAddonSubTab('micro');
    handleTabChange('build');
  };

  const currentTypeMeta = PROJECT_TYPES[projectType] || PROJECT_TYPES.web_app;

  // Active micro count
  const activeMicroCount = useMemo(() => {
    return Object.values(microAddOns).reduce((acc, q) => acc + q, 0);
  }, [microAddOns]);

  const totalAddonsCount = activeMicroCount + selectedLargerAddOns.length;

  // Check if charts are already included in current scope
  const hasDashboardOrChartsIncluded = useMemo(() => {
    return (
      selectedLargerAddOns.includes('larger_dashboard') ||
      selectedScopeFeatures.includes('dashboard_scope') ||
      (projectType === 'data_science' && selectedScopeFeatures.includes('visualizations'))
    );
  }, [selectedLargerAddOns, selectedScopeFeatures, projectType]);

  const hasPresentationIncluded = useMemo(() => {
    return selectedLargerAddOns.includes('larger_ppt');
  }, [selectedLargerAddOns]);

  return (
    <section id="pricing" className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#4778F5] mb-2">
            Transparent Pricing Studio
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] mb-4">
            Honest project estimates. Micro-add-ons from ₹10.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B73] leading-relaxed">
            Need a full software build or just targeted tweaks on an existing project?
            Configure base tiers, ultra-low-cost micro additions, and academic deliverables with instant price transparency.
          </p>
        </div>

        {/* 1. Project Type Selector */}
        <div className="mb-8 bg-[#FFFFFF]/85 backdrop-blur-xl border border-white/80 rounded-2xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
            {[
              { id: 'web_app' as ProjectTypeId, label: 'Web & Apps', icon: Globe, price: 'from ₹699' },
              { id: 'python_script' as ProjectTypeId, label: 'Python & CLI', icon: Terminal, price: 'from ₹599' },
              { id: 'data_science' as ProjectTypeId, label: 'Data Science', icon: Layers, price: 'from ₹999' },
              { id: 'ai_ml' as ProjectTypeId, label: 'AI & Systems', icon: BrainCircuit, price: 'from ₹1,299' },
              { id: 'custom_build' as ProjectTypeId, label: 'Custom Build', icon: Sliders, price: 'from ₹999+' },
              { id: 'micro_tweak' as ProjectTypeId, label: 'Existing Code Tweak', icon: Wrench, price: '₹0 base · Add-ons' },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = projectType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setProjectType(t.id);
                    setSelectedScopeFeatures([]);
                  }}
                  className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl transition-all duration-200 text-center ${
                    isSelected
                      ? 'bg-[#171717] text-white shadow-md scale-[1.02]'
                      : 'hover:bg-white text-[#6B6B73] hover:text-[#171717]'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-[#4778F5]' : 'text-[#8E8E93]'}`} />
                  <span className="text-xs font-semibold whitespace-nowrap">{t.label}</span>
                  <span
                    className={`text-[10px] tabular-nums mt-0.5 ${
                      isSelected ? 'text-[#A1A1AA]' : 'text-[#8E8E93]'
                    }`}
                  >
                    {t.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Column Studio Workbench */}
        <div
          ref={workbenchRef}
          id="pricing-workbench"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24"
        >
          {/* Left Controls: Smooth Tabbed Experience (Col 7) */}
          <div className="lg:col-span-7 bg-[#FFFFFF]/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-7">
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F5F5F7] border border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => handleTabChange('build')}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'build'
                      ? 'bg-white text-[#171717] shadow-sm'
                      : 'text-[#6B6B73] hover:text-[#171717]'
                  }`}
                >
                  1. Architecture & Scope
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('addons')}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'addons'
                      ? 'bg-white text-[#171717] shadow-sm'
                      : 'text-[#6B6B73] hover:text-[#171717]'
                  }`}
                >
                  <span>2. Add-ons & Micro-Edits</span>
                  {totalAddonsCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#4778F5] text-white text-[10px] flex items-center justify-center font-bold">
                      {totalAddonsCount}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('delivery')}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'delivery'
                      ? 'bg-white text-[#171717] shadow-sm'
                      : 'text-[#6B6B73] hover:text-[#171717]'
                  }`}
                >
                  3. Turnaround
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[#8E8E93] hover:text-[#EF4444] transition-colors flex items-center gap-1 px-2 py-1 rounded"
                title="Reset selections"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* TAB 1: ARCHITECTURE & SCOPE */}
            {activeTab === 'build' && (
              <div className="space-y-6">
                {/* Project Summary Banner */}
                <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#171717]">{currentTypeMeta.name}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-[#4778F5] border border-[#E4E4E7]">
                        Base: {formatINR(currentTypeMeta.basePrice)}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6B73] mt-1">{currentTypeMeta.description}</p>
                  </div>
                  {projectType === 'custom_build' && (
                    <span className="text-[10px] uppercase font-bold px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg shrink-0">
                      Subject to scope review
                    </span>
                  )}
                </div>

                {/* Complexity Tier (only for builds, not micro tweak mode) */}
                {projectType !== 'micro_tweak' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                        Project Complexity
                      </label>
                      <span className="text-xs font-semibold text-[#4778F5]">
                        {COMPLEXITY_CONFIG[complexity].label}
                        {COMPLEXITY_CONFIG[complexity].price > 0 &&
                          ` (+${formatINR(COMPLEXITY_CONFIG[complexity].price)})`}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7]">
                      {(['basic', 'intermediate', 'advanced'] as ComplexityLevel[]).map((level) => {
                        const isSelected = complexity === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setComplexity(level)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 text-center ${
                              isSelected
                                ? 'bg-[#171717] text-white shadow-sm'
                                : 'text-[#6B6B73] hover:text-[#171717]'
                            }`}
                          >
                            {COMPLEXITY_CONFIG[level].label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-[#6B6B73] mt-2 px-1 leading-relaxed">
                      {COMPLEXITY_CONFIG[complexity].description}
                    </p>
                  </div>
                )}

                {/* Additional Pages Counter (Web App only) */}
                {projectType === 'web_app' && (
                  <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E4E4E7] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#171717]">Number of Web Pages / Views</div>
                      <div className="text-[11px] text-[#6B6B73]">
                        1 page included in base · +{formatINR(ADDITIONAL_WEB_PAGE_PRICE)}/additional page
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setWebPagesCount((c) => Math.max(1, c - 1))}
                        disabled={webPagesCount <= 1}
                        className="w-8 h-8 rounded-lg bg-[#F5F5F7] border border-[#E4E4E7] flex items-center justify-center text-[#171717] disabled:opacity-30 hover:bg-[#E4E4E7] transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-[#171717] tabular-nums">
                        {webPagesCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setWebPagesCount((c) => Math.min(8, c + 1))}
                        disabled={webPagesCount >= 8}
                        className="w-8 h-8 rounded-lg bg-[#F5F5F7] border border-[#E4E4E7] flex items-center justify-center text-[#171717] disabled:opacity-30 hover:bg-[#E4E4E7] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Scope Feature Chips (if any) */}
                {currentTypeMeta.scopeFeatures.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                      Feature Modules for {currentTypeMeta.name}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentTypeMeta.scopeFeatures.map((feat) => {
                        const isChecked = selectedScopeFeatures.includes(feat.id);
                        return (
                          <button
                            key={feat.id}
                            type="button"
                            onClick={() => toggleScopeFeature(feat.id)}
                            className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                              isChecked
                                ? 'border-[#4778F5] bg-[#4778F5]/5 ring-1 ring-[#4778F5]'
                                : 'border-[#E4E4E7] bg-white hover:border-[#8E8E93]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-[#171717]">{feat.label}</span>
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                  isChecked ? 'bg-[#4778F5] border-[#4778F5] text-white' : 'border-[#E4E4E7]'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                            <p className="text-[11px] text-[#6B6B73] mb-2">{feat.description}</p>
                            <span className="text-xs font-semibold text-[#4778F5] tabular-nums">
                              {feat.price > 0 ? `+${formatINR(feat.price)}` : 'Included in Base'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {projectType === 'micro_tweak' && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#4778F5]" />
                      Existing Project Tweak Mode Active
                    </div>
                    <p className="text-blue-800 leading-relaxed">
                      Base build fee is ₹0. In the next step, select the exact micro add-ons you need (e.g. ₹10 for a simple chart, ₹20 for 5 viva questions, ₹30 for report formatting adjustment).
                    </p>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleTabChange('addons')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-[#4778F5] transition-colors"
                  >
                    <span>Proceed to Add-ons & Micro-Edits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: ADD-ONS & MICRO-EDITS */}
            {activeTab === 'addons' && (
              <div className="space-y-6">
                {/* Sub-tab Switcher: Micro Add-ons vs Larger Deliverables */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1 p-1 bg-[#F5F5F7] border border-[#E4E4E7] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setAddonSubTab('micro')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                        addonSubTab === 'micro'
                          ? 'bg-white text-[#171717] shadow-sm'
                          : 'text-[#6B6B73] hover:text-[#171717]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#4778F5]" />
                      <span>Ultra-Low-Cost Micro Add-ons (₹10–₹99)</span>
                      {activeMicroCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#171717] text-white text-[9px] flex items-center justify-center font-bold">
                          {activeMicroCount}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddonSubTab('larger')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                        addonSubTab === 'larger'
                          ? 'bg-white text-[#171717] shadow-sm'
                          : 'text-[#6B6B73] hover:text-[#171717]'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-[#4778F5]" />
                      <span>Substantial Deliverables</span>
                      {selectedLargerAddOns.length > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#171717] text-white text-[9px] flex items-center justify-center font-bold">
                          {selectedLargerAddOns.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Policy Notice: Distinguish Micro-edits from Full Deliverables */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <span className="font-bold">Micro-Add-On Scope Restriction:</span> ₹10–₹30 items are strictly for minor adjustments in an existing, working project (e.g. adding 1 chart, theme tweak, or 5 viva Q&As). Full model training, scraping pipelines, or dataset cleaning require standard project scope.
                  </div>
                </div>

                {/* VIEW A: ULTRA-LOW-COST MICRO ADD-ONS */}
                {addonSubTab === 'micro' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                        Available Micro Adjustments
                      </span>
                      <span className="text-[11px] text-[#6B6B73]">Use +/- to set exact count</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MICRO_ADD_ON_OPTIONS.map((micro) => {
                        const qty = microAddOns[micro.id] || 0;
                        const isSelected = qty > 0;

                        // Check deduplication condition
                        const isChart = micro.id === 'micro_chart' || micro.id === 'micro_graph';
                        const isDiagram = micro.id === 'micro_flowchart' || micro.id === 'micro_diagram';
                        const isWaivedChart = isChart && hasDashboardOrChartsIncluded;
                        const isWaivedDiagram = isDiagram && hasPresentationIncluded;

                        return (
                          <div
                            key={micro.id}
                            className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#4778F5] bg-[#4778F5]/5 ring-1 ring-[#4778F5]'
                                : 'border-[#E4E4E7] bg-white hover:border-[#8E8E93]'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span className="text-xs font-bold text-[#171717] leading-tight">
                                  {micro.name}
                                </span>
                                <span className="text-xs font-bold text-[#4778F5] tabular-nums shrink-0">
                                  {formatINR(micro.price)}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6B6B73] mb-2 leading-relaxed">
                                {micro.description}
                              </p>
                              <div className="text-[10px] px-2 py-0.5 rounded bg-[#F5F5F7] text-[#6B6B73] inline-block mb-3">
                                {micro.scopeLimit}
                              </div>

                              {/* Deduplication Notice */}
                              {isWaivedChart && (
                                <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md mb-2 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Covered in your selected Dashboard/Charts! (1st free)</span>
                                </div>
                              )}
                              {isWaivedDiagram && (
                                <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md mb-2 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Covered in PPT slide deck deliverables!</span>
                                </div>
                              )}
                            </div>

                            {/* Stepper / Toggle */}
                            <div className="pt-2 border-t border-[#F0F0F3] flex items-center justify-between">
                              <span className="text-[11px] font-medium text-[#8E8E93]">
                                {isSelected ? `${qty} selected (${formatINR(qty * micro.price)})` : 'Not selected'}
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateMicroQty(micro.id, -1, micro.maxQuantity)}
                                  disabled={qty <= 0}
                                  className="w-7 h-7 rounded-lg bg-[#F5F5F7] border border-[#E4E4E7] flex items-center justify-center text-[#171717] disabled:opacity-30 hover:bg-[#E4E4E7] transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-[#171717] tabular-nums">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateMicroQty(micro.id, 1, micro.maxQuantity)}
                                  disabled={qty >= micro.maxQuantity}
                                  className="w-7 h-7 rounded-lg bg-[#171717] text-white flex items-center justify-center disabled:opacity-30 hover:bg-[#4778F5] transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* VIEW B: SUBSTANTIAL DELIVERABLES */}
                {addonSubTab === 'larger' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                        Full Deliverables & System Extensions
                      </span>
                      <span className="text-[11px] text-[#6B6B73]">Select items to include</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {LARGER_ADD_ON_OPTIONS.map((addon) => {
                        const isSelected = selectedLargerAddOns.includes(addon.id);
                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => toggleLargerAddOn(addon.id)}
                            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#4778F5] bg-[#4778F5]/5 ring-1 ring-[#4778F5]'
                                : 'border-[#E4E4E7] bg-white hover:border-[#8E8E93]'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-xs font-bold text-[#171717]">{addon.name}</span>
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    isSelected ? 'bg-[#4778F5] border-[#4778F5] text-white' : 'border-[#E4E4E7]'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                              <p className="text-[11px] text-[#6B6B73] mb-2 leading-relaxed">{addon.description}</p>
                              <div className="text-[10px] px-2 py-0.5 rounded bg-[#F5F5F7] text-[#6B6B73] inline-block mb-3">
                                {addon.scopeLimit}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F3]">
                              <span className="text-[10px] text-[#8E8E93]">
                                {addon.isStartingFrom ? 'Starting from' : 'Standard flat fee'}
                              </span>
                              <span className="text-xs font-bold text-[#4778F5] tabular-nums">
                                {addon.isStartingFrom ? `from ${formatINR(addon.price)}` : `+${formatINR(addon.price)}`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step navigation buttons */}
                <div className="pt-4 flex items-center justify-between border-t border-[#E4E4E7]/60">
                  <button
                    type="button"
                    onClick={() => handleTabChange('build')}
                    className="text-xs font-semibold text-[#6B6B73] hover:text-[#171717] transition-colors"
                  >
                    &larr; Back to Scope
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('delivery')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-[#4778F5] transition-colors shadow-sm active:scale-[0.98]"
                  >
                    <span>Proceed to Turnaround</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: TURNAROUND */}
            {activeTab === 'delivery' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#171717] mb-1">Select Delivery Speed</h3>
                  <p className="text-xs text-[#6B6B73]">
                    Express turnarounds are locked in after scope review to guarantee deadlines.
                  </p>
                </div>

                <div className="space-y-3">
                  {(['standard', 'urgent', 'express'] as DeliverySpeed[]).map((speed) => {
                    const meta = DELIVERY_OPTIONS[speed];
                    const isSelected = deliverySpeed === speed;
                    return (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setDeliverySpeed(speed)}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-[#4778F5] bg-[#4778F5]/5 ring-1 ring-[#4778F5]'
                            : 'border-[#E4E4E7] bg-white hover:border-[#8E8E93]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#171717]">{meta.label}</span>
                            <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {meta.timeline}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B6B73]">{meta.note}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {meta.surchargeRate > 0 ? (
                            <span className="text-xs font-semibold text-[#EF4444] tabular-nums">
                              +{Math.round(meta.surchargeRate * 100)}% Surcharge
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-[#16A34A]">No Extra Fee</span>
                          )}
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-[#4778F5] border-[#4778F5] text-white' : 'border-[#E4E4E7]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#E4E4E7]/60">
                  <button
                    type="button"
                    onClick={() => handleTabChange('addons')}
                    className="text-xs font-semibold text-[#6B6B73] hover:text-[#171717] transition-colors"
                  >
                    &larr; Back to Add-ons
                  </button>
                  <button
                    type="button"
                    onClick={() => onContinueWithEstimate(currentConfig, estimate.totalINR)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-[#4778F5] transition-colors shadow-sm active:scale-[0.98]"
                  >
                    <span>
                      {estimate.isSubjectToScopeReview
                        ? 'Transfer Quote & Confirm Scope'
                        : 'Continue With This Estimate'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Live Estimate Card: Apple-style receipt with frosted glass (Col 5) */}
          <div className="lg:col-span-5 bg-[#FFFFFF]/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.03)] sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#8E8E93]">
                  Indicative Project Quote
                </span>
                <div className="text-base font-bold text-[#171717] mt-0.5">{currentTypeMeta.name}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-[#171717] tabular-nums tracking-tight">
                  {formatINR(estimate.totalINR)}
                </div>
                <div className="text-xs text-[#16A34A] font-semibold flex items-center justify-end gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{estimate.timelineDays}</span>
                </div>
              </div>
            </div>

            {/* Scope Confirmation Notice if subject to review */}
            {estimate.isSubjectToScopeReview && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Subject to Scope Confirmation</span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-relaxed">
                  Contains components with flexible complexity. Quote will be confirmed upon syllabus/rubric review.
                </p>
              </div>
            )}

            {/* Itemized Lines */}
            <div className="space-y-2 text-xs max-h-60 overflow-y-auto pr-1">
              <div className="text-[10px] font-bold uppercase text-[#8E8E93] tracking-wider mb-1 flex items-center justify-between">
                <span>Itemized Breakdown</span>
                <span className="text-[10px] lowercase text-[#8E8E93] font-normal">
                  {estimate.itemizedLines.length} item{estimate.itemizedLines.length !== 1 ? 's' : ''}
                </span>
              </div>
              {estimate.itemizedLines.map((line, idx) => (
                <div key={idx} className="flex justify-between items-start gap-2 py-1.5 border-b border-[#F5F5F7] last:border-none">
                  <div>
                    <div className="font-semibold text-[#171717] flex items-center gap-1.5">
                      <span>{line.label}</span>
                      {line.isIncludedFree && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Free
                        </span>
                      )}
                    </div>
                    {line.detail && <div className="text-[10px] text-[#8E8E93]">{line.detail}</div>}
                  </div>
                  <div
                    className={`font-bold tabular-nums shrink-0 ${
                      line.isIncludedFree ? 'text-emerald-600' : 'text-[#171717]'
                    }`}
                  >
                    {line.isIncludedFree ? '₹0' : formatINR(line.amount)}
                  </div>
                </div>
              ))}
            </div>

            {/* Included Guarantee */}
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7] space-y-1.5">
              <div className="text-xs font-bold text-[#171717] flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <span>Deliverables Guarantee:</span>
              </div>
              {estimate.includedDeliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#52525B]">
                  <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => onContinueWithEstimate(currentConfig, estimate.totalINR)}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 text-xs font-semibold text-white bg-[#171717] hover:bg-[#4778F5] rounded-xl transition-all shadow-sm active:scale-[0.99]"
              >
                <span>
                  {estimate.isSubjectToScopeReview
                    ? 'Transfer Quote & Confirm Scope'
                    : 'Continue With This Estimate'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onCustomProjectClick}
                className="w-full text-center py-2 text-xs font-medium text-[#6B6B73] hover:text-[#171717] transition-colors"
              >
                Custom or unlisted syllabus requirements? Describe here &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
