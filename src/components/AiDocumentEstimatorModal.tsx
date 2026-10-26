import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  Clock,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  FileCheck,
  Cpu,
  Layers,
  HelpCircle,
  Info,
} from 'lucide-react';
import {
  ProjectConfig,
  ProjectTypeId,
  ComplexityLevel,
  DeliverySpeed,
  PROJECT_TYPES,
  COMPLEXITY_CONFIG,
  MICRO_ADD_ON_OPTIONS,
  LARGER_ADD_ON_OPTIONS,
  DELIVERY_OPTIONS,
  calculateEstimate,
  formatINR,
} from '../utils/pricing';
import { estimateDocument, ApiError } from '../utils/apiClient';

interface AiPlanResponse {
  projectTitle: string;
  summary: string;
  domain: string;
  projectType: ProjectTypeId;
  complexity: ComplexityLevel;
  complexityReason: string;
  webPagesCount?: number;
  selectedScopeFeatures?: string[];
  microAddOns: Array<{
    id: string;
    quantity: number;
    rationale: string;
  }>;
  selectedLargerAddOns: Array<{
    id: string;
    rationale: string;
  }>;
  recommendedDeliverySpeed: DeliverySpeed;
  timelineExplanation: string;
  keyFeaturesIdentified: string[];
  vivaFocusAreas?: string[];
}

interface AiDocumentEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlanToCart: (config: ProjectConfig, totalINR: number, projectTitle: string, summary: string) => void;
}

export const AiDocumentEstimatorModal: React.FC<AiDocumentEstimatorModalProps> = ({
  isOpen,
  onClose,
  onApplyPlanToCart,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualNotes, setManualNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // The AI plan returned from server
  const [aiPlan, setAiPlan] = useState<AiPlanResponse | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string>('gemini-3.1-flash-lite');

  // Interactive customization states
  const [customProjectType, setCustomProjectType] = useState<ProjectTypeId>('web_app');
  const [customComplexity, setCustomComplexity] = useState<ComplexityLevel>('basic');
  const [customMicroAddOns, setCustomMicroAddOns] = useState<Record<string, number>>({});
  const [customLargerAddOns, setCustomLargerAddOns] = useState<string[]>([]);
  const [customDeliverySpeed, setCustomDeliverySpeed] = useState<DeliverySpeed>('standard');
  const [customWebPagesCount, setCustomWebPagesCount] = useState<number>(1);
  const [customItemRationales, setCustomItemRationales] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setError('Supported formats: PDF, DOCX, DOC, TXT, or Markdown.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    setSelectedFile(file);
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Strip out the data url header prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !manualNotes.trim()) {
      setError('Please upload a syllabus document (PDF/DOCX) or enter your project requirements notes.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      setAnalysisStep('Reading document and extracting academic guidelines...');
      let fileData: string | undefined;

      if (selectedFile) {
        fileData = await fileToBase64(selectedFile);
      }

      setAnalysisStep('Connecting to Gemini 3.1 Flash Lite architect...');

      const result = await estimateDocument({
        fileData,
        fileName: selectedFile?.name,
        mimeType: selectedFile?.type || (selectedFile?.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
        manualNotes: manualNotes.trim() || undefined,
      });

      setAnalysisStep('Evaluating syllabus modules & mapping micro-add-on pricing...');

      const plan: AiPlanResponse = result.plan;
      setAiPlan(plan);
      setFallbackNotice(result.fallbackNotice || null);
      setModelUsed(result.modelUsed || 'gemini-3.1-flash-lite');

      // Initialize interactive customization state from plan
      const validProjectType = (['web_app', 'python_script', 'data_science', 'ai_ml', 'custom_build'] as ProjectTypeId[]).includes(plan.projectType)
        ? plan.projectType
        : 'web_app';
      setCustomProjectType(validProjectType);

      const validComplexity = (['basic', 'intermediate', 'advanced'] as ComplexityLevel[]).includes(plan.complexity)
        ? plan.complexity
        : 'basic';
      setCustomComplexity(validComplexity);

      const microMap: Record<string, number> = {};
      const rationales: Record<string, string> = {};

      (plan.microAddOns || []).forEach((item) => {
        if (item.id && item.quantity > 0) {
          microMap[item.id] = item.quantity;
          rationales[item.id] = item.rationale;
        }
      });
      setCustomMicroAddOns(microMap);

      const largerIds: string[] = [];
      (plan.selectedLargerAddOns || []).forEach((item) => {
        if (item.id) {
          largerIds.push(item.id);
          rationales[item.id] = item.rationale;
        }
      });
      setCustomLargerAddOns(largerIds);

      const validSpeed = (['standard', 'urgent', 'express'] as DeliverySpeed[]).includes(plan.recommendedDeliverySpeed)
        ? plan.recommendedDeliverySpeed
        : 'standard';
      setCustomDeliverySpeed(validSpeed);

      setCustomWebPagesCount(plan.webPagesCount || 1);
      setCustomItemRationales(rationales);
    } catch (err: any) {
      console.error('Error analyzing document:', err);
      setError(err.message || 'Analysis failed. Please try again or enter notes manually.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Compute live customized estimate
  const currentConfig: ProjectConfig = {
    projectType: customProjectType,
    complexity: customComplexity,
    webPagesCount: customWebPagesCount,
    selectedScopeFeatures: aiPlan?.selectedScopeFeatures || [],
    microAddOns: customMicroAddOns,
    selectedLargerAddOns: customLargerAddOns,
    deliverySpeed: customDeliverySpeed,
  };

  const currentEstimate = calculateEstimate(currentConfig);

  const handleUpdateMicroQty = (id: string, delta: number) => {
    setCustomMicroAddOns((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const copy = { ...prev };
      if (next === 0) {
        delete copy[id];
      } else {
        copy[id] = next;
      }
      return copy;
    });
  };

  const handleToggleLargerAddOn = (id: string) => {
    setCustomLargerAddOns((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleApplyToCheckout = () => {
    if (!aiPlan) return;
    onApplyPlanToCart(
      currentConfig,
      currentEstimate.totalINR,
      aiPlan.projectTitle || `${PROJECT_TYPES[customProjectType].name} Build`,
      aiPlan.summary || 'Custom syllabus requirements'
    );
    onClose();
  };

  // WhatsApp formatted inquiry link
  const generateWhatsAppUrl = () => {
    const phone = '919000000000';
    if (!aiPlan) return `https://wa.me/${phone}`;

    const activeMicroCount = Object.values(customMicroAddOns).reduce((a, b) => a + b, 0);
    const text =
      `*BUILD WITH HARI — AI SYLLABUS ESTIMATE*\n` +
      `------------------------------------\n` +
      `📄 *Document:* ${selectedFile?.name || 'Project Syllabus'}\n` +
      `🎯 *Topic:* ${aiPlan.projectTitle}\n` +
      `🏷️ *Domain:* ${aiPlan.domain}\n` +
      `📦 *Package:* ${PROJECT_TYPES[customProjectType]?.name} (${COMPLEXITY_CONFIG[customComplexity]?.label})\n` +
      `✨ *Micro Add-Ons (${activeMicroCount}):* ${Object.entries(customMicroAddOns).map(([id, q]) => `${q}x ${id}`).join(', ') || 'None'}\n` +
      `📊 *Deliverables:* ${customLargerAddOns.join(', ') || 'None'}\n` +
      `⚡ *Turnaround:* ${DELIVERY_OPTIONS[customDeliverySpeed]?.label}\n` +
      `💰 *Estimated Cart Total:* ${formatINR(currentEstimate.totalINR)}\n` +
      `------------------------------------\n` +
      `Hi Hari, I analyzed my syllabus with your AI estimator and would like to discuss confirming this build.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-[#E4E4E7] shadow-[0_24px_64px_rgba(0,0,0,0.18)] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E4E4E7] bg-gradient-to-r from-[#F5F5F7] via-white to-blue-50/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4778F5] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#171717] tracking-tight">
                  AI Syllabus Scope & Budget Architect
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-[#4778F5] text-[10px] font-bold uppercase">
                  Gemini 3.1 Flash Lite
                </span>
              </div>
              <p className="text-xs text-[#6B6B73]">
                Upload your project syllabus, IEEE abstract, or rubric for an instant tailored build plan and itemized cart.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E4E4E7] hover:bg-[#F5F5F7] text-[#8E8E93] hover:text-[#171717] flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1">
                <span className="font-bold block">Unable to complete analysis</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {!aiPlan ? (
            /* Upload Screen */
            <div className="space-y-6">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                  selectedFile
                    ? 'border-[#16A34A] bg-green-50/40'
                    : 'border-[#E4E4E7] hover:border-[#4778F5] bg-[#F5F5F7]/50 hover:bg-[#F5F5F7]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
                      <FileCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#171717]">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-[#8E8E93]">
                        {(selectedFile.size / 1024).toFixed(1)} KB · Ready to analyze
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-xs text-[#EF4444] font-medium hover:underline inline-block"
                    >
                      Remove and choose another file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#E4E4E7] text-[#4778F5] flex items-center justify-center mx-auto shadow-sm">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#171717]">
                        Drag & drop your syllabus or <span className="text-[#4778F5] underline">browse file</span>
                      </div>
                      <div className="text-xs text-[#8E8E93] mt-1">
                        Accepts PDF, DOCX, DOC, TXT, or Markdown (Max 10MB)
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[11px] text-[#4778F5] font-medium">
                      <Sparkles className="w-3 h-3" />
                      <span>Gemini 3.1 Flash Lite extracts exact modules & micro-pricing</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Guidance / Problem Statement Textarea */}
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  Additional Syllabus Notes or Teacher Constraints (Optional)
                </label>
                <textarea
                  rows={3}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. My professor specified PyTorch with 85%+ accuracy, must include a flowchart and 10 viva defense questions, deadline is next Tuesday."
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E4E4E7] text-xs text-[#171717] bg-white transition-all focus-visible:outline-none focus-visible:border-[#4778F5]"
                />
              </div>

              {/* Value prop pill highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7] text-xs text-[#6B6B73]">
                  <strong className="text-[#171717] block mb-0.5">Automated Plan</strong>
                  Maps required features directly into ultra-low-cost micro-addons (₹10–₹30).
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7] text-xs text-[#6B6B73]">
                  <strong className="text-[#171717] block mb-0.5">Zero Ambiguity</strong>
                  Each line item includes an explanation of why the syllabus requires it.
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7] text-xs text-[#6B6B73]">
                  <strong className="text-[#171717] block mb-0.5">100% Customizable</strong>
                  Modify items, add viva questions, or adjust delivery speed before checkout.
                </div>
              </div>
            </div>
          ) : (
            /* Results & Customization View */
            <div className="space-y-6">
              {/* AI Analysis Summary Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50/80 to-[#F5F5F7] border border-blue-200/70 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4778F5] text-white text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Scope Analysis Complete</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-blue-200 text-[#4778F5] text-[10px] font-semibold">
                        {modelUsed === 'gemini-3.8-flash'
                          ? 'Gemini 3.8 Flash'
                          : modelUsed === 'studio-syllabus-engine'
                          ? 'Studio Syllabus Engine'
                          : 'Gemini 3.1 Flash Lite'}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-[#171717]">
                      {aiPlan.projectTitle}
                    </h4>
                    <span className="text-xs font-semibold text-[#4778F5]">
                      Domain: {aiPlan.domain}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAiPlan(null)}
                    className="text-xs text-[#8E8E93] hover:text-[#171717] underline shrink-0"
                  >
                    Upload another doc
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                  {aiPlan.summary}
                </p>

                {fallbackNotice && (
                  <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-[11px] text-amber-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{fallbackNotice}</span>
                  </div>
                )}

                {/* Detected Features Chips */}
                {aiPlan.keyFeaturesIdentified && aiPlan.keyFeaturesIdentified.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-[#171717] block mb-1.5">
                      Key Syllabus Modules Detected:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiPlan.keyFeaturesIdentified.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[11px] font-medium text-[#171717]"
                        >
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Viva Defense Topics */}
                {aiPlan.vivaFocusAreas && aiPlan.vivaFocusAreas.length > 0 && (
                  <div className="pt-2 border-t border-blue-200/60">
                    <span className="text-[11px] font-semibold text-[#171717] block mb-1">
                      Expected Viva Voce Defense Topics:
                    </span>
                    <div className="text-[11px] text-[#6B6B73] space-y-0.5">
                      {aiPlan.vivaFocusAreas.map((topic, idx) => (
                        <div key={idx}>• {topic}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Cart Customization Workbench */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
                  <div>
                    <h5 className="text-sm font-bold text-[#171717]">
                      Customizable Project Cart & Micro-Edits
                    </h5>
                    <p className="text-xs text-[#6B6B73]">
                      Adjust the AI recommendations to match your specific requirements or budget.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#4778F5]">
                    Live Total: {formatINR(currentEstimate.totalINR)}
                  </span>
                </div>

                {/* Base Category & Complexity Tiers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7]">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Base Project Package
                    </label>
                    <select
                      value={customProjectType}
                      onChange={(e) => setCustomProjectType(e.target.value as ProjectTypeId)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] text-xs text-[#171717] bg-white"
                    >
                      {Object.values(PROJECT_TYPES).map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} ({formatINR(type.basePrice)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Complexity Tier
                    </label>
                    <select
                      value={customComplexity}
                      onChange={(e) => setCustomComplexity(e.target.value as ComplexityLevel)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E4E4E7] text-xs text-[#171717] bg-white"
                    >
                      {Object.entries(COMPLEXITY_CONFIG).map(([lvl, meta]) => (
                        <option key={lvl} value={lvl}>
                          {meta.label} ({meta.price > 0 ? `+${formatINR(meta.price)}` : 'Included'})
                        </option>
                      ))}
                    </select>
                    {aiPlan.complexityReason && (
                      <span className="text-[10px] text-[#6B6B73] mt-1 block">
                        AI rationale: {aiPlan.complexityReason}
                      </span>
                    )}
                  </div>
                </div>

                {/* Micro Add-Ons List with Explanations and Quantities */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#171717] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#4778F5]" />
                      <span>Recommended Micro Add-Ons (₹10–₹30)</span>
                    </span>
                    <span className="text-[#8E8E93] font-normal text-[11px]">
                      {Object.values(customMicroAddOns).reduce((a, b) => a + b, 0)} items selected
                    </span>
                  </div>

                  <div className="space-y-2">
                    {MICRO_ADD_ON_OPTIONS.map((addon) => {
                      const qty = customMicroAddOns[addon.id] || 0;
                      const rationale = customItemRationales[addon.id];

                      return (
                        <div
                          key={addon.id}
                          className={`p-3 rounded-2xl border transition-all ${
                            qty > 0
                              ? 'bg-blue-50/40 border-[#4778F5]/40'
                              : 'bg-white border-[#E4E4E7] opacity-75'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-[#171717]">
                                  {addon.name}
                                </span>
                                <span className="text-xs font-semibold text-[#4778F5]">
                                  {formatINR(addon.price)}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#6B6B73]">
                                {addon.scopeLimit}
                              </div>
                              {rationale && (
                                <div className="text-[10px] text-blue-700 bg-blue-100/60 rounded px-1.5 py-0.5 inline-block mt-1">
                                  💡 <strong>Why in plan:</strong> {rationale}
                                </div>
                              )}
                            </div>

                            {/* Qty Controls */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleUpdateMicroQty(addon.id, -1)}
                                disabled={qty === 0}
                                className="w-7 h-7 rounded-lg border border-[#E4E4E7] bg-white hover:bg-[#F5F5F7] flex items-center justify-center text-[#171717] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-5 text-center text-xs font-bold text-[#171717] tabular-nums">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateMicroQty(addon.id, 1)}
                                className="w-7 h-7 rounded-lg border border-[#E4E4E7] bg-white hover:bg-[#F5F5F7] flex items-center justify-center text-[#171717] transition-colors"
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

                {/* Substantial Academic Deliverables (Larger Add-Ons) */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#171717] mb-2">
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-[#4778F5]" />
                      <span>Academic Project Deliverables</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {LARGER_ADD_ON_OPTIONS.map((larger) => {
                      const isChecked = customLargerAddOns.includes(larger.id);
                      const rationale = customItemRationales[larger.id];

                      return (
                        <div
                          key={larger.id}
                          onClick={() => handleToggleLargerAddOn(larger.id)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-blue-50/40 border-[#4778F5]'
                              : 'bg-white border-[#E4E4E7] opacity-80 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-[#171717]">
                                {larger.name}
                              </div>
                              <div className="text-[10px] text-[#6B6B73]">
                                {larger.scopeLimit}
                              </div>
                              {rationale && (
                                <div className="text-[10px] text-blue-700 mt-1 line-clamp-1">
                                  💡 {rationale}
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-bold text-[#4778F5] shrink-0 tabular-nums">
                              {larger.isStartingFrom ? `from ${formatINR(larger.price)}` : formatINR(larger.price)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Timeline Selector */}
                <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#4778F5]" />
                    <div>
                      <span className="font-semibold text-[#171717]">Turnaround Speed:</span>
                      <span className="text-[#6B6B73] block text-[11px]">
                        {aiPlan.timelineExplanation || DELIVERY_OPTIONS[customDeliverySpeed]?.timeline}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(['standard', 'urgent', 'express'] as DeliverySpeed[]).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setCustomDeliverySpeed(spd)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          customDeliverySpeed === spd
                            ? 'bg-[#171717] text-white'
                            : 'bg-white border border-[#E4E4E7] text-[#6B6B73] hover:text-[#171717]'
                        }`}
                      >
                        {spd.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-[#E4E4E7] bg-[#F5F5F7] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {!aiPlan ? (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#8E8E93] text-center sm:text-left">
                Document parsed securely. Never shared with third parties or used for model training.
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#171717] hover:bg-[#4778F5] text-white text-xs font-semibold transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{analysisStep || 'Analyzing Document with Gemini...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Plan & Cart</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-[#6B6B73]">Customized Cart Total:</span>
                <span className="text-xl sm:text-2xl font-black text-[#4778F5] tabular-nums">
                  {formatINR(currentEstimate.totalINR)}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] text-xs font-semibold hover:bg-[#16A34A]/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Discuss</span>
                </a>

                <button
                  type="button"
                  onClick={handleApplyToCheckout}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#171717] hover:bg-[#4778F5] text-white text-xs font-semibold transition-all shadow-md active:scale-98"
                >
                  <span>Apply to Cart & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
