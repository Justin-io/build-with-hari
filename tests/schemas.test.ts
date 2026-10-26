import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EnquirySubmissionSchema,
  EstimateDocRequestSchema,
  AiPlanResponseSchema,
} from '../src/server/schemas';

test('EnquirySubmissionSchema accepts valid enquiry', () => {
  const valid = {
    fullName: 'Hari Nandan',
    contactMethod: 'hari@example.com',
    projectTitle: 'Real-Time Telemetry Dashboard',
    detailedRequirements: 'Build a high-performance telemetry dashboard using React and WebSockets for monitoring drone telemetry streams.',
    academicContext: 'Final Year Capstone Project',
    deadline: '2026-11-15',
    college: 'Engineering Institute of Technology',
    department: 'Computer Science',
    attachedConfig: {
      projectType: 'web_app',
      complexity: 'intermediate',
      webPagesCount: 2,
      selectedScopeFeatures: ['responsive', 'contact_form'],
      microAddOns: { micro_chart: 2 },
      selectedLargerAddOns: ['larger_dashboard'],
      deliverySpeed: 'standard',
    },
    uploadedFile: {
      name: 'syllabus_brief.pdf',
      size: 1024 * 500,
    },
  };

  const parsed = EnquirySubmissionSchema.safeParse(valid);
  assert.equal(parsed.success, true);
});

test('EnquirySubmissionSchema rejects short requirements (< 25 chars)', () => {
  const invalid = {
    fullName: 'Rahul S',
    contactMethod: 'rahul@example.com',
    projectTitle: 'Simple App',
    detailedRequirements: 'Too short',
    academicContext: 'Mini Project',
    deadline: 'Next week',
  };

  const parsed = EnquirySubmissionSchema.safeParse(invalid);
  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.ok(parsed.error.flatten().fieldErrors.detailedRequirements);
  }
});

test('EnquirySubmissionSchema rejects malicious script tags in text fields', () => {
  const invalid = {
    fullName: '<script>alert("pwned")</script>',
    contactMethod: 'test@example.com',
    projectTitle: 'Normal Title',
    detailedRequirements: 'Valid long requirements description exceeding minimum character length requirements easily.',
    academicContext: 'Mini Project',
    deadline: '2026-12-01',
  };

  const parsed = EnquirySubmissionSchema.safeParse(invalid);
  assert.equal(parsed.success, false);
});

test('EnquirySubmissionSchema rejects javascript: scheme in referenceLinks', () => {
  const invalid = {
    fullName: 'Rahul S',
    contactMethod: 'rahul@example.com',
    projectTitle: 'Normal Title',
    detailedRequirements: 'Valid long requirements description exceeding minimum character length requirements easily.',
    academicContext: 'Mini Project',
    deadline: '2026-12-01',
    referenceLinks: 'javascript:alert(1)',
  };

  const parsed = EnquirySubmissionSchema.safeParse(invalid);
  assert.equal(parsed.success, false);
});

test('EnquirySubmissionSchema rejects files larger than 10MB', () => {
  const invalid = {
    fullName: 'Rahul S',
    contactMethod: 'rahul@example.com',
    projectTitle: 'Normal Title',
    detailedRequirements: 'Valid long requirements description exceeding minimum character length requirements easily.',
    academicContext: 'Mini Project',
    deadline: '2026-12-01',
    uploadedFile: {
      name: 'giant.zip',
      size: 11 * 1024 * 1024, // 11MB
    },
  };

  const parsed = EnquirySubmissionSchema.safeParse(invalid);
  assert.equal(parsed.success, false);
});

test('EstimateDocRequestSchema requires either fileData or manualNotes', () => {
  const empty = {};
  const parsedEmpty = EstimateDocRequestSchema.safeParse(empty);
  assert.equal(parsedEmpty.success, false);

  const withNotes = { manualNotes: 'Need a computer vision model for defect detection' };
  const parsedWithNotes = EstimateDocRequestSchema.safeParse(withNotes);
  assert.equal(parsedWithNotes.success, true);

  const withFile = { fileData: 'SGVsbG8gV29ybGQ=', fileName: 'notes.txt', mimeType: 'text/plain' };
  const parsedWithFile = EstimateDocRequestSchema.safeParse(withFile);
  assert.equal(parsedWithFile.success, true);
});

test('AiPlanResponseSchema validates complete studio estimation plan', () => {
  const plan = {
    projectTitle: 'AI Drone Vision System',
    summary: 'Real-time object detection and classification for autonomous drone flights.',
    domain: 'Computer Vision & Deep Learning',
    projectType: 'ai_ml',
    complexity: 'advanced',
    complexityReason: 'Requires multi-stage YOLO pipeline and custom edge inference optimization.',
    microAddOns: [
      { id: 'micro_chart', quantity: 1, rationale: 'Precision-Recall curves' },
      { id: 'micro_flowchart', quantity: 1, rationale: 'Inference pipeline diagram' },
    ],
    selectedLargerAddOns: [
      { id: 'larger_ppt', rationale: 'Final thesis defense deck' },
    ],
    recommendedDeliverySpeed: 'standard',
    keyFeaturesIdentified: ['YOLOv8 fine-tuning', 'Edge inference script', 'Metric evaluation report'],
  };

  const parsed = AiPlanResponseSchema.safeParse(plan);
  assert.equal(parsed.success, true);
});
