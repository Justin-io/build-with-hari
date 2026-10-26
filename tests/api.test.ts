import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import { createApp } from '../src/server/app';

let server: http.Server;
let baseUrl: string;

test.before(async () => {
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const address = server.address() as { port: number };
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

test('GET / returns 200 with service descriptor and Vercel origin reference', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.service, 'build-by-hari-api');
  assert.equal(data.status, 'online');
  assert.equal(data.frontendOrigin, 'Vercel');
  assert.ok(data.endpoints);
});

test('GET /healthz returns 200 with service health info and security headers', async () => {
  const res = await fetch(`${baseUrl}/healthz`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.service, 'build-by-hari-api');
  assert.ok(typeof data.timestamp === 'string');
  assert.ok(typeof data.uptimeSeconds === 'number');

  // Verify security headers
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('x-frame-options'), 'DENY');
  assert.ok(res.headers.get('x-trace-id'));
});

test('Undefined routes return 404 JSON referencing Vercel frontend', async () => {
  const res = await fetch(`${baseUrl}/unknown-route-test`);
  assert.equal(res.status, 404);

  const data = await res.json();
  assert.equal(data.error, 'Not Found');
  assert.ok(data.message.includes('Frontend is hosted on Vercel'));
  assert.ok(data.traceId);
});

test('POST /api/enquiries rejects missing required fields with 400', async () => {
  const res = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Rahul',
      // missing contactMethod, projectTitle, detailedRequirements, etc.
    }),
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.error, 'Validation Error');
  assert.ok(data.fieldErrors);
  assert.ok(data.traceId);
});

test('POST /api/enquiries accepts valid payload, calculates price, and returns 201', async () => {
  const payload = {
    fullName: 'Rahul Sharma',
    contactMethod: 'rahul.sharma@example.com',
    phoneWhatsapp: '+919876543210',
    projectTitle: 'Autonomous Agricultural Drone Control System',
    detailedRequirements: 'Develop a Python automation pipeline with OpenCV and YOLO for real-time crop disease detection on raspberry pi.',
    academicContext: 'Final Year B.Tech Capstone Project',
    deadline: '2026-11-30',
    college: 'Vellore Institute of Technology',
    department: 'Computer Science and Engineering',
    semester: '7th Semester',
    techStack: 'Python, OpenCV, PyTorch, FastAPI',
    budgetRange: 'Around ₹2,500',
    referenceLinks: 'https://github.com/example/drone-cv',
    additionalNotes: 'Need 1-on-1 viva coaching before seminar presentation.',
    attachedConfig: {
      projectType: 'ai_ml',
      complexity: 'intermediate',
      selectedScopeFeatures: ['model_training', 'evaluation_metrics'],
      microAddOns: { micro_chart: 1, micro_flowchart: 1 },
      selectedLargerAddOns: ['larger_ppt'],
      deliverySpeed: 'standard',
    },
    uploadedFile: {
      name: 'syllabus_abstract.pdf',
      size: 1024 * 350,
      type: 'application/pdf',
    },
  };

  const res = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.referenceId.startsWith('BWH-2026-'));
  assert.equal(data.status, 'new');
  // Base 1299 (ai_ml) + 400 (intermediate) + 350 (model_training) + 200 (evaluation_metrics) + 10 (micro_chart) + 299 (larger_ppt) = 2558
  // (micro_flowchart ₹20 is waived/included free in larger_ppt presentation deliverable)
  assert.equal(data.savedEstimate.basePrice, 1299);
  assert.equal(data.savedEstimate.complexityPrice, 400);
  assert.equal(data.savedEstimate.totalINR, 2558);
});

test('POST /api/enquiries detects duplicate submissions and returns existing reference', async () => {
  const payload = {
    fullName: 'Ananya Verma',
    contactMethod: 'ananya.v@example.com',
    projectTitle: 'E-Commerce Recommendation System',
    detailedRequirements: 'Collaborative filtering recommendation engine with FastAPI backend and React frontend dashboard.',
    academicContext: 'M.Tech Thesis Project',
    deadline: '2026-12-15',
  };

  const res1 = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.equal(res1.status, 201);
  const data1 = await res1.json();

  const res2 = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.equal(res2.status, 201);
  const data2 = await res2.json();

  // Reference IDs should match due to deduplication
  assert.equal(data1.referenceId, data2.referenceId);
});

test('POST /api/estimate-doc rejects empty requests with 400', async () => {
  const res = await fetch(`${baseUrl}/api/estimate-doc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.error, 'Validation Error');
});

test('POST /api/estimate-doc analyzes syllabus notes and returns structured plan', async () => {
  const payload = {
    manualNotes: 'Develop a Deep Learning CNN model with PyTorch for medical image segmentation. Needs accuracy plots, architecture flowchart, and slide deck presentation for viva.',
  };

  const res = await fetch(`${baseUrl}/api/estimate-doc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.plan);
  assert.equal(data.plan.projectType, 'ai_ml');
  assert.ok(data.plan.microAddOns.length > 0);
  assert.ok(data.modelUsed);
});
