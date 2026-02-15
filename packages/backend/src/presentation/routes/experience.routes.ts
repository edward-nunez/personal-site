import { Router } from 'express';
import { ExperienceController } from '../controllers/experience.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new ExperienceController();

// Public routes
router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.get('/:id', (req, res, next) => controller.getById(req, res, next));

// Protected routes (require authentication)
router.post('/', authMiddleware, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authMiddleware, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => controller.delete(req, res, next));

export default router;
