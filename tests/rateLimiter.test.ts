import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from '../src/server/rateLimiter';

test('createRateLimiter allows requests up to maxRequests and blocks afterwards', () => {
  const limiter = createRateLimiter({
    windowMs: 1000,
    maxRequests: 2,
    keyPrefix: 'test-rl',
    message: 'Rate limit exceeded in test',
  });

  const mockReq = {
    headers: { 'x-forwarded-for': '192.168.1.100' },
    socket: { remoteAddress: '192.168.1.100' },
  } as any;

  let statusCode = 200;
  let jsonResponse: any = null;
  const headers: Record<string, string> = {};

  const mockRes = {
    setHeader: (k: string, v: string) => {
      headers[k] = v;
    },
    status: (code: number) => {
      statusCode = code;
      return mockRes;
    },
    json: (body: any) => {
      jsonResponse = body;
    },
  } as any;

  let nextCalledCount = 0;
  const next = () => {
    nextCalledCount += 1;
  };

  // Request 1: Should pass
  limiter(mockReq, mockRes, next);
  assert.equal(nextCalledCount, 1);
  assert.equal(headers['X-RateLimit-Limit'], '2');
  assert.equal(headers['X-RateLimit-Remaining'], '1');

  // Request 2: Should pass
  limiter(mockReq, mockRes, next);
  assert.equal(nextCalledCount, 2);
  assert.equal(headers['X-RateLimit-Remaining'], '0');

  // Request 3: Should be blocked with 429
  limiter(mockReq, mockRes, next);
  assert.equal(nextCalledCount, 2); // Not called
  assert.equal(statusCode, 429);
  assert.equal(jsonResponse?.error, 'Too Many Requests');
});
