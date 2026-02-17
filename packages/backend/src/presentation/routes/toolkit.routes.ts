import { Router } from 'express';
import { ToolkitController } from '../controllers/toolkit.controller.js';

const router = Router();
const controller = new ToolkitController();

router.get('/', (req, res, next) => controller.getAll(req, res, next));

router.all('/', (req, res) => {
  res.status(405).json({
    success: false,
    error: 'Method Not Allowed',
    message: `${req.method} is not supported on this endpoint`,
    allowedMethods: ['GET'],
  });
});

export default router;
