import './configs/index.js';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import DbService from './infrastructure/persistence/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './presentation/middleware/errorHandler.middleware.js';
import { apiLimiter } from './presentation/middleware/rateLimiter.middleware.js';
import {
  errorTrackingMiddleware,
  expressErrorHandler,
} from './presentation/middleware/errorTrackingMiddleware.js';
import config from './configs/index.js';

/**
 * Create and configure the Express application (without connecting DB or listening).
 * Used by index.ts for the server and by integration tests.
 */
export function createApp(): Express {
  const app = express();

  app.use(helmet());
  const corsOrigins = config.corsOrigin
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: corsOrigins.length > 1 ? corsOrigins : (corsOrigins[0] ?? true),
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Error tracking middleware (capture errors for LaunchDarkly observability)
  app.use(errorTrackingMiddleware);

  app.use('/api', apiLimiter);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/ready', async (_req, res) => {
    const dbHealthy = await DbService.healthCheck();
    res.status(dbHealthy ? 200 : 503).json({
      status: dbHealthy ? 'ready' : 'degraded',
      database: dbHealthy ? 'connected' : 'disconnected',
    });
  });

  app.use('/api', apiRoutes);

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      message: 'The requested endpoint does not exist',
    });
  });

  app.use(errorHandler);

  // Express error handler (must be last middleware)
  app.use(expressErrorHandler);

  return app;
}
