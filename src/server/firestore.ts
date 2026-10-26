import crypto from 'crypto';
import { Firestore, FieldValue } from '@google-cloud/firestore';
import { config } from './config';
import { logger } from './logger';
import { EnquirySubmissionInput } from './schemas';
import { EstimateResult } from '../utils/pricing';

export interface StoredEnquiry {
  id: string;
  referenceId: string;
  status: 'new' | 'reviewed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  submittedAt: string;
  contactDetails: {
    fullName: string;
    contactMethod: string;
    phoneWhatsapp?: string;
    college?: string;
    department?: string;
    semester?: string;
  };
  projectRequirements: {
    projectTitle: string;
    detailedRequirements: string;
    academicContext: string;
    deadline: string;
    techStack?: string;
    budgetRange?: string;
    referenceLinks?: string;
    additionalNotes?: string;
  };
  validatedPricing: EstimateResult | null;
  attachmentMeta?: {
    name: string;
    size: number;
    type?: string;
  } | null;
  submissionHash: string;
}

export interface EnquiryPublicResponse {
  referenceId: string;
  submittedAt: string;
  status: 'new';
  savedEstimate: EstimateResult | null;
}

// In-memory fallback repository when Firestore is unconfigured or unavailable
const inMemoryEnquiries = new Map<string, StoredEnquiry>();
const recentSubmissions = new Map<string, { referenceId: string; timestamp: number }>();

let firestoreClient: Firestore | null = null;
let isFirestoreInitialized = false;

function getFirestore(): Firestore | null {
  if (isFirestoreInitialized) return firestoreClient;
  isFirestoreInitialized = true;

  if (config.nodeEnv === 'test' || process.env.USE_IN_MEMORY_STORE === 'true') {
    logger.info('Running in test environment; using in-memory store');
    firestoreClient = null;
    return null;
  }

  try {
    // Only attempt Firestore initialization if GCP_PROJECT_ID or GOOGLE_APPLICATION_CREDENTIALS exists
    if (config.gcpProjectId || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      firestoreClient = new Firestore({
        projectId: config.gcpProjectId,
        databaseId: config.firestoreDatabaseId,
        ignoreUndefinedProperties: true,
      });
      logger.info('Firestore client initialized successfully', {
        projectId: config.gcpProjectId,
        databaseId: config.firestoreDatabaseId,
      });
    } else {
      logger.info('Firestore not configured; utilizing persistent fallback repository');
    }
  } catch (err: any) {
    logger.warn('Firestore initialization failed; falling back to in-memory store', {
      error: err?.message,
    });
    firestoreClient = null;
  }

  return firestoreClient;
}

// Compute submission hash for deduplication
function computeSubmissionHash(input: EnquirySubmissionInput): string {
  const payload = `${input.fullName}|${input.contactMethod}|${input.projectTitle}|${input.detailedRequirements.slice(0, 100)}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export async function persistEnquiry(
  input: EnquirySubmissionInput,
  authoritativeEstimate: EstimateResult | null,
  traceId?: string
): Promise<EnquiryPublicResponse> {
  const hash = computeSubmissionHash(input);
  const now = Date.now();

  // Deduplication check: check if identical enquiry was submitted within the last 5 minutes
  const recent = recentSubmissions.get(hash);
  if (recent && now - recent.timestamp < 5 * 60 * 1000) {
    logger.info('Duplicate enquiry submission detected; returning existing reference code', {
      traceId,
      referenceId: recent.referenceId,
    });
    return {
      referenceId: recent.referenceId,
      submittedAt: new Date(recent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'new',
      savedEstimate: authoritativeEstimate,
    };
  }

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `BWH-2026-${randomCode}`;
  const id = crypto.randomUUID();
  const dateObj = new Date();
  const createdAtIso = dateObj.toISOString();
  const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const record: StoredEnquiry = {
    id,
    referenceId,
    status: 'new',
    createdAt: createdAtIso,
    submittedAt: formattedTime,
    contactDetails: {
      fullName: input.fullName,
      contactMethod: input.contactMethod,
      phoneWhatsapp: input.phoneWhatsapp,
      college: input.college,
      department: input.department,
      semester: input.semester,
    },
    projectRequirements: {
      projectTitle: input.projectTitle,
      detailedRequirements: input.detailedRequirements,
      academicContext: input.academicContext,
      deadline: input.deadline,
      techStack: input.techStack,
      budgetRange: input.budgetRange,
      referenceLinks: input.referenceLinks,
      additionalNotes: input.additionalNotes,
    },
    validatedPricing: authoritativeEstimate,
    attachmentMeta: input.uploadedFile
      ? {
          name: input.uploadedFile.name,
          size: input.uploadedFile.size,
          type: input.uploadedFile.type,
        }
      : null,
    submissionHash: hash,
  };

  const db = getFirestore();
  if (db) {
    try {
      await db.collection('enquiries').doc(id).set({
        ...record,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      logger.info('Enquiry written to Firestore', {
        traceId,
        referenceId,
        id,
      });
    } catch (err: any) {
      logger.warn('Failed to write enquiry to Firestore; falling back to in-memory store', {
        traceId,
        referenceId,
        error: err?.message,
      });
      inMemoryEnquiries.set(id, record);
    }
  } else {
    inMemoryEnquiries.set(id, record);
    logger.info('Enquiry stored in resilient fallback repository', {
      traceId,
      referenceId,
      id,
    });
  }

  // Update deduplication cache
  recentSubmissions.set(hash, { referenceId, timestamp: now });

  return {
    referenceId,
    submittedAt: formattedTime,
    status: 'new',
    savedEstimate: authoritativeEstimate,
  };
}

// Internal accessor for audits and tests
export async function getEnquiryById(id: string): Promise<StoredEnquiry | null> {
  const db = getFirestore();
  if (db) {
    try {
      const doc = await db.collection('enquiries').doc(id).get();
      if (doc.exists) {
        return doc.data() as StoredEnquiry;
      }
    } catch (err: any) {
      logger.warn('Failed to read from Firestore', { id, error: err?.message });
    }
  }
  return inMemoryEnquiries.get(id) || null;
}
