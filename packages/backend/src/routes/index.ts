import { Router } from 'express';
import experienceRoutes from '../presentation/routes/experience.routes.js';
import authRoutes from '../presentation/routes/auth.routes.js';

const router = Router();

// Mount routes
router.use('/experiences', experienceRoutes);
router.use('/auth', authRoutes);

export default router;
