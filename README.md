# BUILD WITH HARI — Independent Software & Student Engineering Studio

> High-craft software engineering, custom academic projects, and intelligent systems developed by Hari Nandan K.

[![Tests](https://img.shields.io/badge/tests-35%20passed-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)]()
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)]()
[![Cloud Run](https://img.shields.io/badge/Backend-Google%20Cloud%20Run-4285F4.svg)]()
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black.svg)]()

---

## 🏛️ System Architecture

This repository is organized as a decoupled, modern cloud architecture:

```
[ Student / University Client ]
             │
             ▼
   [ Vercel Edge Network ] ─── (Hosts React 19 Frontend SPA)
             │
      /api/* Reverse Proxy / Direct HTTPS
             │
             ▼
  [ Google Cloud Run (asia-south1) ] ─── (Pure Express API Service)
             │
     ┌───────┴────────────────────────┐
     ▼                                ▼
[ Cloud Firestore ]         [ Gemini AI Studio Engine ]
(Persistent Enquiries)      (Syllabus / Doc Estimation + Rule Fallback)
```

- **Frontend**: Single Page Application built with React 19, TypeScript, Tailwind CSS, Three.js (interactive ferrofluid visualization), and Motion. Hosted on **Vercel** (`https://justinalexia.vercel.app/`).
- **Backend**: Express API service hosted on **Google Cloud Run** in `asia-south1` (Mumbai).
- **Persistence**: Google Cloud Firestore for persistent, deduplicated client enquiry tracking.
- **AI Estimation Engine**: Dual-model Gemini AI parser (`gemini-3.1-flash-lite` with fallback to `gemini-3.8-flash`) and an authoritative local syllabus rule engine with zero external downtime risk.
- **Security**: Sliding-window IP rate limiting (`X-RateLimit-*`), zero-trust Zod schema validation, prompt-injection sanitization, CORS allowlisting, and trace-ID propagation (`X-Trace-Id`).

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Justin-io/build-with-hari.git
cd build-with-hari
npm install
```

### 2. Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env
```

Configure your environment variables:
- `GEMINI_API_KEY`: Google Gemini API key (optional for local rule fallback)
- `GOOGLE_CLOUD_PROJECT`: `gen-lang-client-0494322977`
- `FIRESTORE_DATABASE_ID`: Active Firestore database identifier

### 3. Start Local Development Server

```bash
npm run dev
```

The unified development server will launch at `http://localhost:3000`.

---

## 🧪 Verification & Testing

The repository includes a comprehensive 35-test automated test suite verifying authoritative pricing, micro add-ons, quantity bounds, bundle deduplication, rate limiters, validation schemas, and HTTP endpoints:

```bash
# Run unit & integration test suite
npm test

# Type-check TypeScript sources
npm run lint

# Compile production frontend bundle
npm run build
```

---

## 📦 Deployment Guide

### 1. Deploying the Backend to Google Cloud Run

The Cloud Run container builds strictly the backend API runtime with zero static bloat:

```bash
gcloud run deploy build-by-hari-api \
  --source . \
  --region asia-south1 \
  --project gen-lang-client-0494322977 \
  --service-account="build-by-hari-runner@gen-lang-client-0494322977.iam.gserviceaccount.com" \
  --cpu 1 \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 1 \
  --concurrency 40 \
  --timeout 120s \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT=gen-lang-client-0494322977,FIRESTORE_DATABASE_ID=ai-studio-hopewebplatform-7510203b-3c5f-485d-9a92-eee4eccdea95" \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest"
```

Live Service URL: `https://build-by-hari-api-308291525318.asia-south1.run.app`

### 2. Deploying the Frontend to Vercel

The included [vercel.json](vercel.json) automatically proxies `/api/*` and `/healthz` directly to the Cloud Run backend:

```bash
vercel --prod
```

Or configure the Vercel dashboard environment variable:
- `VITE_API_BASE_URL`: `https://build-by-hari-api-308291525318.asia-south1.run.app`

---

## 🛡️ Security & Privacy

- All sensitive keys, GCP service credentials, `.env*` files, and local caches are strictly ignored via [.gitignore](.gitignore) and [.dockerignore](.dockerignore).
- Inputs are validated via strict Zod schemas with script injection removal and URL scheme whitelisting.
- API endpoints enforce IP sliding-window rate limits (10 req/10 min on enquiries; 16 req/10 min on AI analysis).
- Client inputs and raw keys are masked in structured JSON logs.

---

## 👨‍💻 Founder & Engineer

**Hari Nandan K.** — Independent Software Engineer
- **Portfolio**: [https://justinalexia.vercel.app/](https://justinalexia.vercel.app/)
- **GitHub**: [https://github.com/Justin-io](https://github.com/Justin-io)
- **LinkedIn**: [https://www.linkedin.com/in/justinalexia/](https://www.linkedin.com/in/justinalexia/)
- **Contact**: `harinandhan972@gmail.com`
