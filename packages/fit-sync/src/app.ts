import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './presentation/routes/index.js';
import { errorHandler } from './presentation/middleware/errorHandler.js';
import { logger } from './shared/utils/logger.js';

const app = express();

// Middleware - Security and parsing
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  });
});

// Error handling (must be last)
app.use(errorHandler);

export default app;
