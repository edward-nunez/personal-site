import './configs/index.js'; // Load dotenv once for runtime
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import DbService from './infrastructure/persistence/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './presentation/middleware/errorHandler.middleware.js';
import { apiLimiter } from './presentation/middleware/rateLimiter.middleware.js';
import logger from './shared/utils/logger.js';
import config from './configs/index.js';

const app: Express = express();
const port = config.port;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Health check routes
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

// API routes
app.use('/api', apiRoutes);

// 404 handler for unmatched routes (must come after all routes)
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to PostgreSQL and start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await DbService.connect();

    app.listen(port, () => {
      logger.info('🚀 Server started successfully');
      logger.info(`📦 Environment: ${config.nodeEnv}`);
      logger.info(`🔌 Port: ${port}`);
      logger.info(`🌐 CORS Origin: ${config.corsOrigin}`);
      logger.info(`📊 API available at: http://localhost:${port}/api`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
