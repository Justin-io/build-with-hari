import crypto from 'crypto';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  traceId?: string;
  userId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  [key: string]: unknown;
}

// Mask sensitive keys and values
const SENSITIVE_KEY_REGEX = /^(api[-_]?key|authorization|bearer|password|secret|token|credential)/i;
const EMAIL_REGEX = /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/g;

function sanitizeValue(key: string, val: unknown): unknown {
  if (SENSITIVE_KEY_REGEX.test(key)) {
    return '[REDACTED_SECRET]';
  }
  if (typeof val === 'string') {
    // Redact emails in log messages if detected
    return val.replace(EMAIL_REGEX, '$1***@$2.$3');
  }
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      sanitizedObj[k] = sanitizeValue(k, v);
    }
    return sanitizedObj;
  }
  return val;
}

export function log(level: LogLevel, message: string, context?: LogContext): void {
  const timestamp = new Date().toISOString();
  const traceId = context?.traceId || crypto.randomUUID();

  const entry: Record<string, unknown> = {
    severity: level.toUpperCase(),
    timestamp,
    message,
    traceId,
  };

  if (context) {
    for (const [k, v] of Object.entries(context)) {
      if (k !== 'traceId') {
        entry[k] = sanitizeValue(k, v);
      }
    }
  }

  const output = JSON.stringify(entry);

  if (level === 'error') {
    console.error(output);
  } else if (level === 'warn') {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => log('debug', msg, ctx),
  info: (msg: string, ctx?: LogContext) => log('info', msg, ctx),
  warn: (msg: string, ctx?: LogContext) => log('warn', msg, ctx),
  error: (msg: string, ctx?: LogContext) => log('error', msg, ctx),
};
