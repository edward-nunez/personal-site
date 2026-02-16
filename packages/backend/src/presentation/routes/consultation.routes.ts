import { Router } from 'express';
import { ConsultationController } from '../controllers/consultation.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { formLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();
const controller = new ConsultationController();

// Public route (rate limited)
router.post('/', formLimiter, (req, res, next) => controller.create(req, res, next));

// Protected routes (require authentication)
router.get('/', authMiddleware, (req, res, next) => controller.getAll(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => controller.getById(req, res, next));
router.patch('/:id/read', authMiddleware, (req, res, next) =>
  controller.markAsRead(req, res, next)
);
router.delete('/:id', authMiddleware, (req, res, next) => controller.delete(req, res, next));

// Handle unsupported methods
router.all('/', (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Method Not Allowed',
    message: `${req.method} is not supported on this endpoint`,
    allowedMethods: ['GET', 'POST'],
  });
});

router.all('/:id', (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Method Not Allowed',
    message: `${req.method} is not supported on this endpoint`,
    allowedMethods: ['GET', 'DELETE'],
  });
});

router.all('/:id/read', (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Method Not Allowed',
    message: `${req.method} is not supported on this endpoint`,
    allowedMethods: ['PATCH'],
  });
});

export default router;
