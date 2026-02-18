import { Router, Response } from 'express';
import assessRoutes from './assess.routes.js';

const router = Router();

// Main API routes
router.use('/assess', assessRoutes);

// Root health check
router.get('/health', (_req, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'agent',
      status: 'running',
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
