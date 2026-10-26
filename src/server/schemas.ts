import { z } from 'zod';

export const SafeText = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, { message: `Must be at least ${min} characters.` })
    .max(max, { message: `Exceeds maximum length of ${max} characters.` })
    .refine((val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val), {
      message: 'HTML script tags are not allowed.',
    });

export const SafeOptionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { message: `Exceeds maximum length of ${max} characters.` })
    .optional()
    .or(z.literal(''))
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : undefined));

export const ProjectConfigSchema = z.object({
  projectType: z.enum(['web_app', 'python_script', 'data_science', 'ai_ml', 'custom_build', 'micro_tweak']),
  complexity: z.enum(['basic', 'intermediate', 'advanced']),
  webPagesCount: z.number().int().min(1).max(20).optional(),
  selectedScopeFeatures: z.array(z.string().max(50)).max(20).default([]),
  microAddOns: z.record(z.string().max(50), z.number().int().min(0).max(10)).default({}),
  selectedLargerAddOns: z.array(z.string().max(50)).max(20).default([]),
  deliverySpeed: z.enum(['standard', 'urgent', 'express']).default('standard'),
});

export const UploadedFileMetaSchema = z.object({
  name: SafeText(1, 255),
  size: z.number().int().positive().max(10 * 1024 * 1024, { message: 'File size must not exceed 10MB.' }),
  type: SafeOptionalText(100),
});

export const EnquirySubmissionSchema = z.object({
  fullName: SafeText(2, 100),
  contactMethod: SafeText(3, 150),
  phoneWhatsapp: SafeOptionalText(30),
  projectTitle: SafeText(3, 200),
  detailedRequirements: SafeText(25, 10000),
  academicContext: SafeText(2, 100),
  deadline: SafeText(1, 100),
  college: SafeOptionalText(150),
  department: SafeOptionalText(150),
  semester: SafeOptionalText(50),
  techStack: SafeOptionalText(250),
  budgetRange: SafeOptionalText(100),
  referenceLinks: SafeOptionalText(1000).refine(
    (val) => {
      if (!val) return true;
      const lower = val.toLowerCase();
      return !lower.startsWith('javascript:') && !lower.startsWith('data:');
    },
    { message: 'Invalid URL scheme in reference links.' }
  ),
  additionalNotes: SafeOptionalText(2000),
  attachedConfig: ProjectConfigSchema.optional(),
  uploadedFile: UploadedFileMetaSchema.optional().nullable(),
});

export type EnquirySubmissionInput = z.infer<typeof EnquirySubmissionSchema>;

export const EstimateDocRequestSchema = z
  .object({
    fileData: z.string().max(16 * 1024 * 1024, 'Base64 file data exceeds limit.').optional(),
    fileName: SafeOptionalText(255),
    mimeType: SafeOptionalText(100),
    manualNotes: SafeOptionalText(10000),
  })
  .refine((data) => Boolean(data.fileData || data.manualNotes), {
    message: 'Please provide either a document file or project requirement notes.',
    path: ['manualNotes'],
  });

export type EstimateDocRequestInput = z.infer<typeof EstimateDocRequestSchema>;

export const AiPlanResponseSchema = z.object({
  projectTitle: z.string().min(1),
  summary: z.string().min(1),
  domain: z.string().optional(),
  projectType: z.enum(['web_app', 'python_script', 'data_science', 'ai_ml', 'custom_build']),
  complexity: z.enum(['basic', 'intermediate', 'advanced']),
  complexityReason: z.string().optional(),
  webPagesCount: z.number().int().min(1).max(20).optional(),
  selectedScopeFeatures: z.array(z.string()).default([]),
  microAddOns: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().min(1).max(10),
      rationale: z.string(),
    })
  ).default([]),
  selectedLargerAddOns: z.array(
    z.object({
      id: z.string(),
      rationale: z.string(),
    })
  ).default([]),
  recommendedDeliverySpeed: z.enum(['standard', 'urgent', 'express']).default('standard'),
  timelineExplanation: z.string().optional(),
  keyFeaturesIdentified: z.array(z.string()).default([]),
  vivaFocusAreas: z.array(z.string()).optional(),
});

export type ValidatedAiPlan = z.infer<typeof AiPlanResponseSchema>;
