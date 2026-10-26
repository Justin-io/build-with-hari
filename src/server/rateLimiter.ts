import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyPrefix?: string;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const records = new Map<string, RateLimitRecord>();
  const { windowMs, maxRequests, message = 'Too many requests. Please try again later.', keyPrefix = 'rl' } = options;

  // Cleanup stale records periodically
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of records.entries()) {
      if (now > record.resetAt) {
        records.delete(key);
      }
    }
  }, Math.max(windowMs, 60000));

  // Ensure timer does not block process exit
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.socket.remoteAddress || '127.0.0.1';

    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    let record = records.get(key);

    if (!record || now > record.resetAt) {
      record = { count: 1, resetAt: now + windowMs };
      records.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000).toString());

    if (record.count > maxRequests) {
      res.status(429).json({
        error: 'Too Many Requests',
        message,
        retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
      });
      return;
    }

    next();
  };
}
