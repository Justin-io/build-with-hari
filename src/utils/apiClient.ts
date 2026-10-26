import { ProjectConfig, EstimateResult } from './pricing';

export interface EnquirySubmissionPayload {
  fullName: string;
  contactMethod: string;
  phoneWhatsapp?: string;
  projectTitle: string;
  detailedRequirements: string;
  academicContext: string;
  deadline: string;
  college?: string;
  department?: string;
  semester?: string;
  techStack?: string;
  budgetRange?: string;
  referenceLinks?: string;
  additionalNotes?: string;
  attachedConfig?: ProjectConfig | null;
  uploadedFile?: {
    name: string;
    size: number;
    type?: string;
  } | null;
}

export interface EnquirySubmissionResponse {
  success: boolean;
  referenceId: string;
  submittedAt: string;
  status: 'new';
  savedEstimate: EstimateResult | null;
  traceId?: string;
}

export interface EstimateDocPayload {
  fileData?: string;
  fileName?: string;
  mimeType?: string;
  manualNotes?: string;
}

export interface EstimateDocResponse {
  success: boolean;
  plan: any;
  analyzedFileName: string;
  modelUsed: string;
  fallbackNotice: string | null;
  traceId?: string;
}

export class ApiError extends Error {
  public statusCode?: number;
  public fieldErrors?: Record<string, string[]>;
  public traceId?: string;

  constructor(message: string, statusCode?: number, fieldErrors?: Record<string, string[]>, traceId?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    this.traceId = traceId;
  }
}

// Single configurable API base URL (empty string for same-origin proxy in development & production)
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function submitEnquiry(payload: EnquirySubmissionPayload): Promise<EnquirySubmissionResponse> {
  const url = `${API_BASE_URL}/api/enquiries`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage = data?.message || data?.error || `Enquiry submission failed (HTTP ${res.status})`;
      throw new ApiError(errorMessage, res.status, data?.fieldErrors, data?.traceId);
    }

    return data as EnquirySubmissionResponse;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Network error connecting to the server. Please check your connection.', 0);
  }
}

export async function estimateDocument(payload: EstimateDocPayload): Promise<EstimateDocResponse> {
  const url = `${API_BASE_URL}/api/estimate-doc`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      let errMsg = data?.message || data?.error || `Document analysis failed (HTTP ${res.status})`;
      if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE')) {
        errMsg = 'The AI model is experiencing temporary peak traffic. Please try again in a few moments, or customize your plan manually below.';
      }
      throw new ApiError(errMsg, res.status, data?.fieldErrors, data?.traceId);
    }

    return data as EstimateDocResponse;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Network error connecting to AI estimation service.', 0);
  }
}

export async function checkHealth(): Promise<{ status: string; service: string }> {
  const url = `${API_BASE_URL}/healthz`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Health check failed with HTTP ${res.status}`);
  return res.json();
}
