import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { config } from './config';
import { logger } from './logger';
import { createRateLimiter } from './rateLimiter';
import { EnquirySubmissionSchema, EstimateDocRequestSchema } from './schemas';
import { calculateAuthoritativeEstimate } from './pricingEngine';
import { persistEnquiry } from './firestore';
import { processDocumentEstimation } from './geminiService';

declare global {
  namespace Express {
    interface Request {
      traceId?: string;
    }
  }
}

export function createApp(): express.Express {
  const app = express();

  // Trust Cloud Run / Google Cloud Load Balancer proxy headers for accurate per-IP rate limiting
  app.set('trust proxy', true);

  // 1. Trace ID Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const headerTrace = req.headers['x-cloud-trace-context'] || req.headers['x-request-id'];
    const traceId = typeof headerTrace === 'string' ? headerTrace.split('/')[0] : crypto.randomUUID();
    req.traceId = traceId;
    res.setHeader('X-Trace-Id', traceId);
    next();
  });

  // 2. Security Headers Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // 3. CORS Configuration (Allows Vercel production & preview origins, configured domains, and localhost)
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isVercel = origin.endsWith('.vercel.app');
        if (isVercel || config.allowedOrigins.includes(origin) || config.nodeEnv === 'development') {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
    })
  );

  // 4. Request Logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const durationMs = Date.now() - start;
      logger.info(`${req.method} ${req.path} ${res.statusCode} [${durationMs}ms]`, {
        traceId: req.traceId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs,
      });
    });
    next();
  });

  // 5. Body Parsers with limits
  app.use(express.json({ limit: `${config.maxBodyLimitMb}mb` }));
  app.use(express.urlencoded({ extended: true, limit: `${config.maxBodyLimitMb}mb` }));

  // 6. Rate Limiters
  const aiLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 16,
    keyPrefix: 'ai-est',
    message: 'Rate limit exceeded for AI syllabus analysis. Please wait a few moments or customize your project manually.',
  });

  const enquiryLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 10,
    keyPrefix: 'enquiry',
    message: 'Too many enquiry submissions from this IP. Please wait a few minutes before submitting another request.',
  });

  // ==========================================
  // ROUTES
  // ==========================================

  // Root API Descriptor
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      service: 'build-by-hari-api',
      status: 'online',
      description: 'BUILD WITH HARI Studio Backend API',
      version: '1.0.0',
      frontendOrigin: 'Vercel',
      endpoints: {
        health: '/api/healthz',
        enquiries: 'POST /api/enquiries',
        estimator: 'POST /api/estimate-doc',
      },
    });
  });

  // 3.1 Health endpoints (supporting internal probes and public proxies)
  app.get(['/healthz', '/api/healthz', '/api/health'], (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'build-by-hari-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    });
  });

  // 3.2 Custom Project Enquiry endpoint
  app.post('/api/enquiries', enquiryLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = EnquirySubmissionSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'The submitted enquiry details failed validation.',
          fieldErrors: parseResult.error.flatten().fieldErrors,
          traceId: req.traceId,
        });
        return;
      }

      const validatedInput = parseResult.data;

      // Deterministic authoritative server-side pricing recalculation
      const authoritativeEstimate = calculateAuthoritativeEstimate(validatedInput.attachedConfig);

      // Persist in Firestore or structured store
      const enquiryResult = await persistEnquiry(validatedInput, authoritativeEstimate, req.traceId);

      res.status(201).json({
        success: true,
        referenceId: enquiryResult.referenceId,
        submittedAt: enquiryResult.submittedAt,
        status: enquiryResult.status,
        savedEstimate: enquiryResult.savedEstimate,
        traceId: req.traceId,
      });
    } catch (err) {
      next(err);
    }
  });

  // 3.3 AI Syllabus & Document Estimator endpoint
  app.post('/api/estimate-doc', aiLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = EstimateDocRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Please provide a valid document (PDF, DOCX, TXT) or project requirements notes.',
          fieldErrors: parseResult.error.flatten().fieldErrors,
          traceId: req.traceId,
        });
        return;
      }

      const validatedInput = parseResult.data;
      const result = await processDocumentEstimation(validatedInput, req.traceId);

      res.status(200).json({
        success: true,
        plan: result.plan,
        analyzedFileName: result.analyzedFileName,
        modelUsed: result.modelUsed,
        fallbackNotice: result.fallbackNotice,
        traceId: req.traceId,
      });
    } catch (err) {
      next(err);
    }
  });

  // 404 Handler for undefined API routes (Backend Only)
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `The endpoint ${req.method} ${req.path} does not exist on build-by-hari-api. Frontend is hosted on Vercel (https://justinalexia.vercel.app/).`,
      traceId: req.traceId,
    });
  });

  // Global Error Boundary Handler
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    logger.error('Unhandled server exception', {
      traceId: req.traceId,
      error: err?.message,
      stack: config.nodeEnv === 'development' ? err?.stack : undefined,
    });

    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
      error: statusCode === 400 ? 'Bad Request' : 'Internal Server Error',
      message:
        config.nodeEnv === 'development'
          ? err?.message || 'An unexpected error occurred.'
          : 'An unexpected internal error occurred. Please try again later.',
      traceId: req.traceId,
    });
  });

  return app;
}
