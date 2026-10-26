import React, { useState, useEffect, useMemo } from 'react';
import {
  ProjectConfig,
  formatINR,
  PROJECT_TYPES,
  COMPLEXITY_CONFIG,
  MICRO_ADD_ON_OPTIONS,
  LARGER_ADD_ON_OPTIONS,
  DELIVERY_OPTIONS,
  calculateEstimate,
  EstimateResult,
} from '../utils/pricing';
import { submitEnquiry, ApiError } from '../utils/apiClient';
import {
  Send,
  Upload,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Clock,
  Sparkles,
  MessageSquare,
  X,
  ShoppingBag,
  Trash2,
  Edit3,
  Layers,
  ArrowRight,
  ShieldCheck,
  Package,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

interface RequirementsFormProps {
  attachedConfig: ProjectConfig | null;
  attachedTotalINR: number | null;
  onClearAttachedEstimate: () => void;
  onEditEstimate?: () => void;
}

interface FormState {
  fullName: string;
  contactMethod: string;
  phoneWhatsapp: string;
  projectTitle: string;
  detailedRequirements: string;
  academicContext: string;
  deadline: string;
  college: string;
  department: string;
  semester: string;
  techStack: string;
  budgetRange: string;
  referenceLinks: string;
  additionalNotes: string;
}

interface ValidationErrors {
  fullName?: string;
  contactMethod?: string;
  projectTitle?: string;
  detailedRequirements?: string;
  academicContext?: string;
  deadline?: string;
}

export const RequirementsForm: React.FC<RequirementsFormProps> = ({
  attachedConfig,
  attachedTotalINR,
  onClearAttachedEstimate,
  onEditEstimate,
}) => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    contactMethod: '',
    phoneWhatsapp: '',
    projectTitle: '',
    detailedRequirements: '',
    academicContext: 'Final Year Capstone Project',
    deadline: '',
    college: '',
    department: '',
    semester: '',
    techStack: '',
    budgetRange: 'Not sure yet',
    referenceLinks: '',
    additionalNotes: '',
  });

  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceId: string;
    submittedAt: string;
    savedEstimate: EstimateResult | null;
  } | null>(null);

  // Compute live estimate breakdown from attachedConfig
  const estimateResult: EstimateResult | null = useMemo(() => {
    if (!attachedConfig) return null;
    return calculateEstimate(attachedConfig);
  }, [attachedConfig]);

  // Prepopulate title and budget when attachedConfig changes
  useEffect(() => {
    if (attachedConfig) {
      const typeMeta = PROJECT_TYPES[attachedConfig.projectType];
      setFormData((prev) => ({
        ...prev,
        projectTitle: prev.projectTitle || `${typeMeta?.name || 'Project'} Build`,
        budgetRange: attachedTotalINR
          ? `Around ${formatINR(attachedTotalINR)}`
          : prev.budgetRange,
      }));
    }
  }, [attachedConfig, attachedTotalINR]);

  const handleScrollToPricing = () => {
    if (onEditEstimate) {
      onEditEstimate();
      return;
    }
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const validate = (): boolean => {
    const errs: ValidationErrors = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    }
    if (!formData.contactMethod.trim()) {
      errs.contactMethod = 'Email or WhatsApp contact is required so Hari can reply';
    } else if (
      formData.contactMethod.includes('@') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactMethod.trim())
    ) {
      errs.contactMethod = 'Please enter a valid email address';
    }
    if (!formData.projectTitle.trim()) {
      errs.projectTitle = 'Project title or problem statement is required';
    }
    if (!formData.detailedRequirements.trim() || formData.detailedRequirements.trim().length < 25) {
      errs.detailedRequirements = 'Please provide at least 25 characters describing your requirements';
    }
    if (!formData.academicContext) {
      errs.academicContext = 'Please select your academic context / intended use';
    }
    if (!formData.deadline.trim()) {
      errs.deadline = 'Preferred deadline or semester submission date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    const allowed = ['.pdf', '.zip', '.docx', '.doc', '.txt', '.png', '.jpg'];
    const isAllowed = allowed.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isAllowed) {
      setFileError('Allowed formats: PDF, ZIP, DOCX, TXT, PNG, JPG.');
      return;
    }

    setUploadedFile({ name: file.name, size: file.size });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector('.form-error-anchor');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await submitEnquiry({
        fullName: formData.fullName.trim(),
        contactMethod: formData.contactMethod.trim(),
        phoneWhatsapp: formData.phoneWhatsapp.trim() || undefined,
        projectTitle: formData.projectTitle.trim(),
        detailedRequirements: formData.detailedRequirements.trim(),
        academicContext: formData.academicContext,
        deadline: formData.deadline.trim(),
        college: formData.college.trim() || undefined,
        department: formData.department.trim() || undefined,
        semester: formData.semester.trim() || undefined,
        techStack: formData.techStack.trim() || undefined,
        budgetRange: formData.budgetRange || undefined,
        referenceLinks: formData.referenceLinks.trim() || undefined,
        additionalNotes: formData.additionalNotes.trim() || undefined,
        attachedConfig: attachedConfig || undefined,
        uploadedFile: uploadedFile ? { name: uploadedFile.name, size: uploadedFile.size } : null,
      });

      setSubmissionSuccess({
        referenceId: response.referenceId,
        submittedAt: response.submittedAt,
        savedEstimate: response.savedEstimate || estimateResult,
      });
      setIsSubmitting(false);
      const el = document.getElementById('custom-request');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      if (err instanceof ApiError && err.fieldErrors) {
        const firstKey = Object.keys(err.fieldErrors)[0];
        const firstMsg = err.fieldErrors[firstKey]?.[0];
        setApiError(firstMsg ? `${firstKey}: ${firstMsg}` : err.message);
      } else {
        setApiError(err?.message || 'Failed to submit enquiry. Please try again.');
      }
    }
  };

  // WhatsApp formatted inquiry link
  const generateWhatsAppUrl = () => {
    const phone = '919000000000'; // Studio routing direct link
    let orderSummaryText = 'Direct Custom Scope Inquiry';

    if (attachedConfig && estimateResult) {
      const typeMeta = PROJECT_TYPES[attachedConfig.projectType];
      const activeMicroCount = Object.values(attachedConfig.microAddOns || {}).reduce((a, b) => a + b, 0);
      const activeLargerCount = (attachedConfig.selectedLargerAddOns || []).length;

      const lines = [
        `*Project:* ${typeMeta?.name || 'Custom'} (${COMPLEXITY_CONFIG[attachedConfig.complexity]?.label})`,
        `*Base Package:* ${formatINR(estimateResult.basePrice)}`,
      ];

      if (estimateResult.pagesPrice > 0) {
        lines.push(`*Web Pages:* +${formatINR(estimateResult.pagesPrice)}`);
      }

      if (activeMicroCount > 0) {
        lines.push(`*Micro Add-Ons (${activeMicroCount}):*`);
        Object.entries(attachedConfig.microAddOns || {}).forEach(([id, qty]) => {
          if (qty > 0) {
            const m = MICRO_ADD_ON_OPTIONS.find((opt) => opt.id === id);
            if (m) lines.push(`  - ${qty}x ${m.name}: ${formatINR(qty * m.price)}`);
          }
        });
      }

      if (activeLargerCount > 0) {
        lines.push(`*Deliverables (${activeLargerCount}):*`);
        attachedConfig.selectedLargerAddOns.forEach((id) => {
          const l = LARGER_ADD_ON_OPTIONS.find((opt) => opt.id === id);
          if (l) lines.push(`  - ${l.name}: ${formatINR(l.price)}`);
        });
      }

      lines.push(`*Turnaround:* ${DELIVERY_OPTIONS[attachedConfig.deliverySpeed]?.label}`);
      lines.push(`*Indicative Total:* ${formatINR(estimateResult.totalINR)}`);
      orderSummaryText = lines.join('\n');
    }

    const message =
      `*BUILD WITH HARI — PROJECT INQUIRY*\n` +
      `------------------------------------\n` +
      `👤 *Student Details*\n` +
      `• *Name:* ${formData.fullName || 'Student'}\n` +
      `• *Contact:* ${formData.contactMethod || 'Via WhatsApp'}\n` +
      `• *Topic:* ${formData.projectTitle || 'New Project'}\n` +
      `• *Deadline:* ${formData.deadline || 'Flexible'}\n` +
      `• *Context:* ${formData.academicContext}\n\n` +
      `📋 *Project Cart & Estimate Breakdown:*\n` +
      `${orderSummaryText}\n\n` +
      `*Brief Scope:* ${formData.detailedRequirements ? formData.detailedRequirements.slice(0, 140) + '...' : 'Please review my requirements.'}\n` +
      `------------------------------------\n` +
      `Looking forward to confirming scope and timeline with Hari.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Helper to count active add-ons
  const microAddOnItems = useMemo(() => {
    if (!attachedConfig?.microAddOns) return [];
    return Object.entries(attachedConfig.microAddOns)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const option = MICRO_ADD_ON_OPTIONS.find((o) => o.id === id);
        return {
          id,
          qty,
          option,
          totalPrice: option ? option.price * qty : 0,
        };
      });
  }, [attachedConfig]);

  const largerAddOnItems = useMemo(() => {
    if (!attachedConfig?.selectedLargerAddOns) return [];
    return attachedConfig.selectedLargerAddOns
      .map((id) => LARGER_ADD_ON_OPTIONS.find((o) => o.id === id))
      .filter(Boolean);
  }, [attachedConfig]);

  const totalCartItemCount = useMemo(() => {
    if (!attachedConfig) return 0;
    const microCount = Object.values(attachedConfig.microAddOns || {}).reduce((a, b) => a + b, 0);
    const largerCount = (attachedConfig.selectedLargerAddOns || []).length;
    const extraPagesCount =
      attachedConfig.projectType === 'web_app' && (attachedConfig.webPagesCount || 1) > 1
        ? (attachedConfig.webPagesCount || 1) - 1
        : 0;
    return 1 + (extraPagesCount > 0 ? 1 : 0) + microCount + largerCount;
  }, [attachedConfig]);

  return (
    <section id="custom-request" className="py-20 sm:py-28 relative scroll-mt-10">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Child 1: Section Header */}
        <div className="lg:col-span-12 max-w-2xl mb-2 sm:mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4778F5]/10 text-[#4778F5] text-xs font-semibold tracking-wider uppercase mb-3">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Project Cart & Requirements Checkout</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717] mb-3">
            {attachedConfig ? 'Review Your Project Cart & Finalize Scope' : 'Submit Project Requirements & Get a Quote'}
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B73]">
            {attachedConfig
              ? 'Your configured items and micro add-ons are itemized below. Provide your college context and problem statement to confirm development directly with Hari.'
              : 'Describe your syllabus, problem statement, or custom build idea. Hari will personally review the scope and provide an itemized quote within 4–6 hours.'}
          </p>
        </div>

        {/* Submission Confirmation View */}
        {submissionSuccess ? (
          <div className="lg:col-span-12 bg-[#FFFFFF] rounded-3xl p-8 sm:p-12 border border-[#E4E4E7] shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-center max-w-3xl mx-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-semibold tracking-wider uppercase text-[#16A34A] mb-2 block">
              Requirements & Cart Registered Successfully
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-3">
              Thank you, {formData.fullName}.
            </h3>

            <p className="text-sm sm:text-base text-[#6B6B73] leading-relaxed mb-6">
              Your project order enquiry has been logged with reference code{' '}
              <span className="font-mono font-bold text-[#171717] px-2.5 py-1 rounded-lg bg-[#F5F5F7] border border-[#E4E4E7]">
                {submissionSuccess.referenceId}
              </span>
              . Hari Nandan K. will personally review your syllabus specifications and respond via{' '}
              <span className="font-semibold text-[#171717]">{formData.contactMethod}</span> within 4–6 hours.
            </p>

            {/* Itemized Order Receipt Snapshot */}
            {submissionSuccess.savedEstimate && (
              <div className="mb-8 p-5 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7] text-left">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E4E4E7]">
                  <span className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#4778F5]" />
                    <span>Order Receipt Snapshot</span>
                  </span>
                  <span className="text-xs font-mono text-[#8E8E93]">
                    {submissionSuccess.submittedAt}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {submissionSuccess.savedEstimate.itemizedLines.map((line, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs gap-3">
                      <div>
                        <span className="font-medium text-[#171717]">{line.label}</span>
                        {line.detail && (
                          <span className="text-[#8E8E93] block text-[11px]">{line.detail}</span>
                        )}
                      </div>
                      <span className="font-semibold text-[#171717] shrink-0 tabular-nums">
                        {line.isIncludedFree ? 'FREE' : formatINR(line.amount)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171717]">Total Indicative Quote:</span>
                  <span className="text-base font-bold text-[#4778F5] tabular-nums">
                    {formatINR(submissionSuccess.savedEstimate.totalINR)}
                  </span>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-left text-xs text-[#4778F5] mb-8 space-y-1.5">
              <div className="font-bold text-[#171717] mb-1">Founder Direct Process:</div>
              <div className="text-[#6B6B73]">1. Hari examines the syllabus constraints, datasets, and architecture.</div>
              <div className="text-[#6B6B73]">2. You receive an agreed milestone roadmap and schedule.</div>
              <div className="text-[#6B6B73]">3. Development kicks off with scheduled live progress demos.</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-full transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open in WhatsApp for Faster Review</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSubmissionSuccess(null);
                  onClearAttachedEstimate();
                  setFormData({
                    fullName: '',
                    contactMethod: '',
                    phoneWhatsapp: '',
                    projectTitle: '',
                    detailedRequirements: '',
                    academicContext: 'Final Year Capstone Project',
                    deadline: '',
                    college: '',
                    department: '',
                    semester: '',
                    techStack: '',
                    budgetRange: 'Not sure yet',
                    referenceLinks: '',
                    additionalNotes: '',
                  });
                  setUploadedFile(null);
                }}
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-medium text-[#6B6B73] hover:text-[#171717] transition-colors"
              >
                Submit Another Project
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Child 2: Dedicated Project Cart & Order Review Card (CSS selector 1) */}
            <div className="order-1 lg:order-2 lg:col-span-5 w-full lg:sticky lg:top-24">
              <div className="bg-[#FFFFFF] rounded-3xl border border-[#E4E4E7] shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden transition-all">
                {/* Cart Top Bar */}
                <div className="p-5 sm:p-6 border-b border-[#E4E4E7] bg-gradient-to-b from-[#F5F5F7]/80 to-transparent">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#4778F5] text-white flex items-center justify-center shadow-sm">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#171717] tracking-tight">
                          Project Cart
                        </h3>
                        <div className="text-[11px] text-[#6B6B73]">
                          {attachedConfig
                            ? `${totalCartItemCount} item${totalCartItemCount > 1 ? 's' : ''} in scope`
                            : 'Direct custom inquiry'}
                        </div>
                      </div>
                    </div>

                    {/* Cart Status Badge */}
                    {attachedConfig ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#4778F5] text-[11px] font-semibold">
                        <Sparkles className="w-3 h-3" />
                        <span>Configured</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-medium">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Actions: Edit in Studio or Clear */}
                  {attachedConfig && (
                    <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E7]/60 text-xs">
                      <button
                        type="button"
                        onClick={handleScrollToPricing}
                        className="inline-flex items-center gap-1 text-[#4778F5] hover:text-[#3360D4] font-medium transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit items in configurator</span>
                      </button>

                      <button
                        type="button"
                        onClick={onClearAttachedEstimate}
                        className="inline-flex items-center gap-1 text-[#8E8E93] hover:text-[#EF4444] transition-colors"
                        title="Remove attached cart configuration"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear cart</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Cart Body */}
                <div className="p-5 sm:p-6 space-y-4 max-h-[520px] overflow-y-auto">
                  {attachedConfig && estimateResult ? (
                    <>
                      {/* Primary Base Package Item */}
                      <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7]/80">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-[#171717]">
                                {PROJECT_TYPES[attachedConfig.projectType]?.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white text-[#4778F5] border border-blue-200">
                                Base Build
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6B6B73] mt-0.5 line-clamp-1">
                              {PROJECT_TYPES[attachedConfig.projectType]?.description}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-[#171717] tabular-nums shrink-0">
                            {formatINR(PROJECT_TYPES[attachedConfig.projectType]?.basePrice || 0)}
                          </span>
                        </div>

                        {/* Complexity Sub-Line */}
                        {attachedConfig.projectType !== 'micro_tweak' && (
                          <div className="mt-2.5 pt-2 border-t border-[#E4E4E7] flex items-center justify-between text-[11px]">
                            <span className="text-[#6B6B73]">
                              Tier: <strong className="text-[#171717]">{COMPLEXITY_CONFIG[attachedConfig.complexity]?.label}</strong>
                            </span>
                            <span className="font-medium text-[#171717] tabular-nums">
                              {COMPLEXITY_CONFIG[attachedConfig.complexity]?.price > 0
                                ? `+ ${formatINR(COMPLEXITY_CONFIG[attachedConfig.complexity]?.price)}`
                                : 'Included'}
                            </span>
                          </div>
                        )}

                        {/* Extra Web Pages if applicable */}
                        {attachedConfig.projectType === 'web_app' &&
                          (attachedConfig.webPagesCount || 1) > 1 && (
                            <div className="mt-1.5 pt-1.5 border-t border-[#E4E4E7] flex items-center justify-between text-[11px]">
                              <span className="text-[#6B6B73]">
                                Extra Web Pages: <strong>{(attachedConfig.webPagesCount || 1) - 1} extra</strong>
                              </span>
                              <span className="font-medium text-[#171717] tabular-nums">
                                + {formatINR(((attachedConfig.webPagesCount || 1) - 1) * 99)}
                              </span>
                            </div>
                          )}
                      </div>

                      {/* Micro Add-Ons List (Itemized) */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] mb-2 px-1">
                          <span className="flex items-center gap-1.5 text-[#171717]">
                            <Sparkles className="w-3.5 h-3.5 text-[#4778F5]" />
                            <span>Micro Add-Ons & Edits</span>
                          </span>
                          <span>
                            {microAddOnItems.length > 0
                              ? `${microAddOnItems.reduce((acc, i) => acc + i.qty, 0)} active`
                              : 'None'}
                          </span>
                        </div>

                        {microAddOnItems.length > 0 ? (
                          <div className="space-y-1.5">
                            {microAddOnItems.map(({ id, qty, option, totalPrice }) => (
                              <div
                                key={id}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E4E4E7] text-xs hover:border-[#4778F5]/40 transition-colors"
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="font-medium text-[#171717] truncate">
                                    {option?.name}
                                  </div>
                                  <div className="text-[10px] text-[#8E8E93] flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#4778F5] font-semibold">
                                      Qty: {qty}
                                    </span>
                                    <span>· {option?.scopeLimit}</span>
                                  </div>
                                </div>
                                <span className="font-semibold text-[#171717] tabular-nums shrink-0">
                                  {formatINR(totalPrice)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-[#F5F5F7]/70 border border-dashed border-[#E4E4E7] text-center text-[11px] text-[#8E8E93]">
                            No micro add-ons selected ({formatINR(10)}–{formatINR(30)} per tweak).
                            <button
                              type="button"
                              onClick={handleScrollToPricing}
                              className="text-[#4778F5] font-medium ml-1 hover:underline inline"
                            >
                              Add tweaks
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Larger Project Deliverables */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#8E8E93] mb-2 px-1">
                          <span className="flex items-center gap-1.5 text-[#171717]">
                            <Package className="w-3.5 h-3.5 text-[#4778F5]" />
                            <span>Academic Deliverables</span>
                          </span>
                          <span>{largerAddOnItems.length > 0 ? `${largerAddOnItems.length} selected` : 'None'}</span>
                        </div>

                        {largerAddOnItems.length > 0 ? (
                          <div className="space-y-1.5">
                            {largerAddOnItems.map((item) => (
                              <div
                                key={item?.id}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E4E4E7] text-xs"
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="font-medium text-[#171717] truncate">{item?.name}</div>
                                  <div className="text-[10px] text-[#8E8E93] truncate">{item?.scopeLimit}</div>
                                </div>
                                <span className="font-semibold text-[#171717] tabular-nums shrink-0">
                                  {item?.isStartingFrom ? `from ${formatINR(item.price)}` : formatINR(item?.price || 0)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-[#F5F5F7]/70 border border-dashed border-[#E4E4E7] text-center text-[11px] text-[#8E8E93]">
                            No extra PPT / documentation packages attached.
                          </div>
                        )}
                      </div>

                      {/* Turnaround & Delivery Timeline */}
                      <div className="p-3 rounded-xl bg-[#F5F5F7] border border-[#E4E4E7] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#4778F5] shrink-0" />
                          <div>
                            <span className="font-medium text-[#171717]">
                              {DELIVERY_OPTIONS[attachedConfig.deliverySpeed]?.label}
                            </span>
                            <span className="text-[11px] text-[#6B6B73] block">
                              Est. {DELIVERY_OPTIONS[attachedConfig.deliverySpeed]?.timeline}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold text-[#171717] tabular-nums">
                          {estimateResult.deliverySurchargeAmount > 0
                            ? `+ ${formatINR(estimateResult.deliverySurchargeAmount)}`
                            : 'Included'}
                        </span>
                      </div>
                    </>
                  ) : (
                    /* Empty Cart State (Direct Custom Inquiry) */
                    <div className="py-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] border border-[#E4E4E7] text-[#8E8E93] flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#171717] mb-1">
                          Direct Custom Inquiry
                        </h4>
                        <p className="text-xs text-[#6B6B73] leading-relaxed max-w-xs mx-auto">
                          No pre-configured package in cart. You can submit your syllabus or problem statement directly for an individual scope quotation.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/60 text-left">
                        <div className="text-xs font-semibold text-[#171717] mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#4778F5]" />
                          <span>Want instant pricing with micro-edits?</span>
                        </div>
                        <p className="text-[11px] text-[#6B6B73] mb-2.5">
                          Explore our transparent base builds starting from ₹599 with ₹10–₹30 micro add-ons.
                        </p>
                        <button
                          type="button"
                          onClick={handleScrollToPricing}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#4778F5] hover:bg-[#3360D4] text-white text-xs font-semibold transition-all shadow-sm"
                        >
                          <span>Open Pricing Configurator</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Footer / Totals */}
                <div className="p-5 sm:p-6 bg-[#F5F5F7] border-t border-[#E4E4E7] space-y-3">
                  {attachedConfig && estimateResult ? (
                    <>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[#6B6B73]">
                          <span>Scope Subtotal:</span>
                          <span className="tabular-nums font-medium text-[#171717]">
                            {formatINR(estimateResult.subtotal)}
                          </span>
                        </div>
                        {estimateResult.deliverySurchargeAmount > 0 && (
                          <div className="flex items-center justify-between text-[#6B6B73]">
                            <span>Delivery Surcharge ({estimateResult.deliverySurchargeRate * 100}%):</span>
                            <span className="tabular-nums font-medium text-[#171717]">
                              + {formatINR(estimateResult.deliverySurchargeAmount)}
                            </span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-[#E4E4E7] flex items-baseline justify-between">
                          <div>
                            <span className="text-xs font-bold text-[#171717] block">
                              Indicative Cart Total:
                            </span>
                            <span className="text-[10px] text-[#8E8E93]">
                              Subject to exact syllabus confirmation
                            </span>
                          </div>
                          <span className="text-xl sm:text-2xl font-black text-[#4778F5] tabular-nums tracking-tight">
                            {formatINR(estimateResult.totalINR)}
                          </span>
                        </div>
                      </div>

                      {estimateResult.isSubjectToScopeReview && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                          <span>
                            Contains custom build items. Final quote confirmed after code review.
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#171717] block">Pricing Model:</span>
                        <span className="text-[11px] text-[#8E8E93]">Milestone-based, no surprises</span>
                      </div>
                      <span className="text-xs font-semibold text-[#4778F5]">
                        Custom Quote in 4–6 hrs
                      </span>
                    </div>
                  )}

                  {/* Standard Founder Guarantees Checklist */}
                  <div className="pt-3 border-t border-[#E4E4E7]/80 space-y-1.5 text-[11px] text-[#6B6B73]">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>100% clean, commented original source code</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>1-on-1 code walkthrough & viva defense briefing</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>Personal developer response in 4–6 business hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Child 3: Submission & Client Requirements Form (CSS selector 2) */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="order-2 lg:order-1 lg:col-span-7 bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border border-[#E4E4E7] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-8"
            >
              {/* Form Section 1: Contact Details */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E4E4E7]">
                  <span className="w-5 h-5 rounded-full bg-[#171717] text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-bold text-[#171717] tracking-tight uppercase">
                    Student & Contact Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold text-[#171717] mb-1.5"
                    >
                      Full Name <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#171717] bg-[#FFFFFF] transition-all focus-visible:outline-none focus-visible:ring-2 ${
                        errors.fullName
                          ? 'border-[#EF4444] ring-1 ring-[#EF4444] form-error-anchor'
                          : 'border-[#E4E4E7] focus-visible:border-[#4778F5] focus-visible:ring-[#4778F5]/20'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-[#EF4444] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Contact Method */}
                  <div>
                    <label
                      htmlFor="contactMethod"
                      className="block text-xs font-semibold text-[#171717] mb-1.5"
                    >
                      Email or WhatsApp Number <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="contactMethod"
                      type="text"
                      placeholder="e.g. rahul@example.com or +91 9876543210"
                      value={formData.contactMethod}
                      onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#171717] bg-[#FFFFFF] transition-all focus-visible:outline-none focus-visible:ring-2 ${
                        errors.contactMethod
                          ? 'border-[#EF4444] ring-1 ring-[#EF4444] form-error-anchor'
                          : 'border-[#E4E4E7] focus-visible:border-[#4778F5] focus-visible:ring-[#4778F5]/20'
                      }`}
                    />
                    {errors.contactMethod && (
                      <p className="text-[11px] text-[#EF4444] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.contactMethod}</span>
                      </p>
                    )}
                  </div>

                  {/* College / University (Optional) */}
                  <div>
                    <label htmlFor="college" className="block text-[11px] font-medium text-[#6B6B73] mb-1">
                      College / University (Optional)
                    </label>
                    <input
                      id="college"
                      type="text"
                      placeholder="e.g. Anna Univ, VTU, KTU"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E4E7] text-xs text-[#171717] bg-white"
                    />
                  </div>

                  {/* Branch / Dept (Optional) */}
                  <div>
                    <label htmlFor="department" className="block text-[11px] font-medium text-[#6B6B73] mb-1">
                      Branch / Department (Optional)
                    </label>
                    <input
                      id="department"
                      type="text"
                      placeholder="e.g. CSE / AI & Data Science"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E4E7] text-xs text-[#171717] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Form Section 2: Project Scope & Timeline */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E4E4E7]">
                  <span className="w-5 h-5 rounded-full bg-[#171717] text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-bold text-[#171717] tracking-tight uppercase">
                    Project Scope & Specifications
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Project Title */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="projectTitle"
                      className="block text-xs font-semibold text-[#171717] mb-1.5"
                    >
                      Project Title / Topic <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="projectTitle"
                      type="text"
                      placeholder="e.g. Automated Medical Imaging Classification using CNN"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#171717] bg-[#FFFFFF] transition-all focus-visible:outline-none focus-visible:ring-2 ${
                        errors.projectTitle
                          ? 'border-[#EF4444] ring-1 ring-[#EF4444] form-error-anchor'
                          : 'border-[#E4E4E7] focus-visible:border-[#4778F5] focus-visible:ring-[#4778F5]/20'
                      }`}
                    />
                    {errors.projectTitle && (
                      <p className="text-[11px] text-[#EF4444] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.projectTitle}</span>
                      </p>
                    )}
                  </div>

                  {/* Academic Context */}
                  <div>
                    <label
                      htmlFor="academicContext"
                      className="block text-xs font-semibold text-[#171717] mb-1.5"
                    >
                      Academic Context / Purpose <span className="text-[#EF4444]">*</span>
                    </label>
                    <select
                      id="academicContext"
                      value={formData.academicContext}
                      onChange={(e) => setFormData({ ...formData, academicContext: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] text-xs text-[#171717] bg-white transition-all focus-visible:outline-none focus-visible:border-[#4778F5]"
                    >
                      <option value="Final Year Capstone Project">Final Year Major / Capstone Project</option>
                      <option value="Mini Project (Pre-final year)">Mini Project (Pre-final year)</option>
                      <option value="Course Assignment / Lab Project">Course Assignment / Lab Project</option>
                      <option value="Hackathon / Competition Prototype">Hackathon / Competition Prototype</option>
                      <option value="Research Paper Implementation">Research Paper Implementation</option>
                      <option value="Personal Portfolio Build">Personal Portfolio Build</option>
                      <option value="Other">Other / Independent</option>
                    </select>
                  </div>

                  {/* Deadline */}
                  <div>
                    <label
                      htmlFor="deadline"
                      className="block text-xs font-semibold text-[#171717] mb-1.5"
                    >
                      Preferred Deadline <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      id="deadline"
                      type="text"
                      placeholder="e.g. 15th Nov, or within 5 days"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#171717] bg-[#FFFFFF] transition-all focus-visible:outline-none focus-visible:ring-2 ${
                        errors.deadline
                          ? 'border-[#EF4444] ring-1 ring-[#EF4444] form-error-anchor'
                          : 'border-[#E4E4E7] focus-visible:border-[#4778F5] focus-visible:ring-[#4778F5]/20'
                      }`}
                    />
                    {errors.deadline && (
                      <p className="text-[11px] text-[#EF4444] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.deadline}</span>
                      </p>
                    )}
                  </div>

                  {/* Preferred Tech Stack (Optional) */}
                  <div>
                    <label htmlFor="techStack" className="block text-[11px] font-medium text-[#6B6B73] mb-1">
                      Preferred Tech Stack (Optional)
                    </label>
                    <input
                      id="techStack"
                      type="text"
                      placeholder="e.g. Python, React, PyTorch, SQLite"
                      value={formData.techStack}
                      onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E4E7] text-xs text-[#171717] bg-white"
                    />
                  </div>

                  {/* Budget Indication */}
                  <div>
                    <label htmlFor="budgetRange" className="block text-[11px] font-medium text-[#6B6B73] mb-1">
                      Budget Expectation (Optional)
                    </label>
                    <input
                      id="budgetRange"
                      type="text"
                      placeholder="e.g. Matches Cart or Under ₹1,500"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E4E4E7] text-xs text-[#171717] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Form Section 3: Detailed Description & File Attachments */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E4E4E7]">
                  <span className="w-5 h-5 rounded-full bg-[#171717] text-white text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-sm font-bold text-[#171717] tracking-tight uppercase">
                    Detailed Scope & Syllabus Document
                  </h3>
                </div>

                {/* Textarea */}
                <div className="mb-4">
                  <label
                    htmlFor="detailedRequirements"
                    className="block text-xs font-semibold text-[#171717] mb-1.5"
                  >
                    Detailed Requirements & Deliverable Constraints <span className="text-[#EF4444]">*</span>
                  </label>
                  <textarea
                    id="detailedRequirements"
                    rows={4}
                    placeholder="Describe the required features, user flows, dataset sources, or specific viva questions/charts you need included."
                    value={formData.detailedRequirements}
                    onChange={(e) => setFormData({ ...formData, detailedRequirements: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-[#171717] bg-[#FFFFFF] transition-all focus-visible:outline-none focus-visible:ring-2 ${
                      errors.detailedRequirements
                        ? 'border-[#EF4444] ring-1 ring-[#EF4444] form-error-anchor'
                        : 'border-[#E4E4E7] focus-visible:border-[#4778F5] focus-visible:ring-[#4778F5]/20'
                    }`}
                  />
                  {errors.detailedRequirements && (
                    <p className="text-[11px] text-[#EF4444] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.detailedRequirements}</span>
                    </p>
                  )}
                </div>

                {/* Reference Links & File Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Reference Links */}
                  <div>
                    <label htmlFor="referenceLinks" className="block text-xs font-semibold text-[#171717] mb-1.5">
                      Reference Links (Optional)
                    </label>
                    <input
                      id="referenceLinks"
                      type="text"
                      placeholder="GitHub repo, IEEE paper DOI, or Figma link"
                      value={formData.referenceLinks}
                      onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] text-xs text-[#171717] bg-white"
                    />
                    <span className="text-[10px] text-[#8E8E93] mt-1 block">
                      Link to college syllabus rubric or sample repo.
                    </span>
                  </div>

                  {/* File Upload Box */}
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                      Attach Problem Statement / Synopsis (Optional)
                    </label>
                    <div className="relative border-2 border-dashed border-[#E4E4E7] hover:border-[#4778F5]/60 rounded-xl p-3.5 text-center bg-[#F5F5F7]/40 transition-colors">
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {uploadedFile ? (
                        <div className="flex items-center justify-between text-xs font-medium text-[#16A34A] px-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <FileCheck className="w-4 h-4 shrink-0" />
                            <span className="truncate">{uploadedFile.name}</span>
                            <span className="text-[10px] text-[#8E8E93]">
                              ({(uploadedFile.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFile(null);
                            }}
                            className="text-[#EF4444] text-[11px] hover:underline ml-2 shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <Upload className="w-4 h-4 text-[#8E8E93] mx-auto" />
                          <div className="text-[11px] text-[#171717] font-medium">
                            Drop syllabus PDF or <span className="text-[#4778F5] underline">browse</span>
                          </div>
                          <div className="text-[10px] text-[#8E8E93]">
                            PDF, DOCX, ZIP, or TXT (Max 10MB)
                          </div>
                        </div>
                      )}
                    </div>
                    {fileError && <p className="text-[11px] text-[#EF4444] mt-1">{fileError}</p>}
                  </div>
                </div>

                {/* Privacy Guarantee Note */}
                <div className="p-3.5 rounded-xl bg-[#F5F5F7] border border-[#E4E4E7] text-xs text-[#6B6B73]">
                  <strong className="text-[#171717]">Privacy Guarantee: </strong>
                  Your syllabus and requirements are reviewed exclusively by Hari Nandan K. They are never shared with external parties, published online, or utilized to train external AI models.
                </div>

                {apiError && (
                  <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-2.5 text-xs text-[#991B1B]">
                    <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <strong className="font-semibold block mb-0.5">Unable to submit enquiry</strong>
                      <span>{apiError}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E4E4E7]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold text-white bg-[#171717] hover:bg-[#4778F5] rounded-full transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Registering Order & Scope...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm & Send Requirements</span>
                    </>
                  )}
                </button>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold text-[#16A34A] bg-[#16A34A]/10 hover:bg-[#16A34A]/15 rounded-full transition-all border border-[#16A34A]/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Quick Inquiry via WhatsApp</span>
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
};
