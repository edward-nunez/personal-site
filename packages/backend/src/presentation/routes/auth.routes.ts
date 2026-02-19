import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();
const controller = new AuthController();

// Public routes (with rate limiting)
router.post('/login', authLimiter, (req, res, next) => controller.login(req, res, next));

// Protected routes
router.get('/me', authMiddleware, (req, res, next) => controller.me(req, res, next));

// DELETE, PUT, PATCH endpoints intentionally disabled. Authentication is stateless (JWT);
// users cannot modify their login state after initial POST. Sessions managed by token expiration.
router.all('/login', (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Method Not Allowed',
    message: `${req.method} is not supported on this endpoint`,
    allowedMethods: ['POST'],
  });
});

router.all('/me', (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Method Not Allowed',
    message: `${req.method} is not supported on this endpoint`,
    allowedMethods: ['GET'],
  });
});

export default router;
