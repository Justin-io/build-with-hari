import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createApp } from './src/server/app';
import { config } from './src/server/config';
import { logger } from './src/server/logger';

async function startServer() {
  const app = createApp();

  // In development, attach Vite middleware for local development convenience.
  // In production (Cloud Run), the service is strictly a backend API; the frontend is hosted on Vercel.
  if (config.nodeEnv !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(config.port, '0.0.0.0', () => {
    logger.info(`[BUILD WITH HARI] Backend API service running at http://0.0.0.0:${config.port}`, {
      port: config.port,
      environment: config.nodeEnv,
    });
  });

  // Graceful shutdown handling
  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed cleanly.');
      process.exit(0);
    });

    // Force exit if connections take too long to close
    setTimeout(() => {
      logger.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  logger.error('Failed to start server', { error: err?.message, stack: err?.stack });
  process.exit(1);
});
