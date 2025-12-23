const router = require('express').Router();
const projectRoutes = require('./projectRoutes');
const tagRoutes = require('./tagRoutes');

router.use('/projects', projectRoutes);
router.use('/tags', tagRoutes);

// Heath Readiness Endpoint
router.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = router;
