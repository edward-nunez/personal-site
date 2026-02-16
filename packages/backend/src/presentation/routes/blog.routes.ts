import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new BlogController();

// Public routes
router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.get('/slug/:slug', (req, res, next) => controller.getBySlug(req, res, next));
router.get('/:id', (req, res, next) => controller.getById(req, res, next));

// Protected routes (require authentication)
router.post('/', authMiddleware, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authMiddleware, (req, res, next) => controller.update(req, res, next));
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

router.all('/slug/:slug', (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Method Not Allowed',
    message: `${req.method} is not supported on this endpoint`,
    allowedMethods: ['GET'],
  });
});

router.all('/:id', (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Method Not Allowed',
    message: `${req.method} is not supported on this endpoint`,
    allowedMethods: ['GET', 'PUT', 'DELETE'],
  });
});

export default router;
