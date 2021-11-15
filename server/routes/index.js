const path = require('path');
const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/api', (req, res, next) => {
  res.json({ message: 'respond with a resource' });
});

router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../_static', 'index.html'));
});

module.exports = router;
