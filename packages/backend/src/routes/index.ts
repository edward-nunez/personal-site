import { Router } from 'express';
import experienceRoutes from '../presentation/routes/experience.routes.js';
import authRoutes from '../presentation/routes/auth.routes.js';
import projectRoutes from '../presentation/routes/project.routes.js';
import blogRoutes from '../presentation/routes/blog.routes.js';
import contactRoutes from '../presentation/routes/contact.routes.js';
import consultationRoutes from '../presentation/routes/consultation.routes.js';

const router = Router();

// Mount routes
router.use('/experiences', experienceRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/blog', blogRoutes);
router.use('/contact', contactRoutes);
router.use('/consultation', consultationRoutes);

export default router;
