import dotenv from 'dotenv';
dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  geminiApiKey: string | undefined;
  gcpProjectId: string | undefined;
  firestoreDatabaseId: string;
  allowedOrigins: string[];
  notificationEmail: string | undefined;
  maxBodyLimitMb: number;
}

function parseOrigins(rawOrigins?: string): string[] {
  if (!rawOrigins || rawOrigins.trim() === '') {
    return [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ];
  }
  return rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);
}

export const config: AppConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || undefined,
  gcpProjectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID || 'gen-lang-client-0494322977',
  firestoreDatabaseId: process.env.FIRESTORE_DATABASE_ID || '(default)',
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
  notificationEmail: process.env.NOTIFICATION_EMAIL || undefined,
  maxBodyLimitMb: 12,
};
