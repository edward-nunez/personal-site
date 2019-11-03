const path = require('path');
const router = require('express').Router();

module.exports = () => {
  router.route('/api/v1/helloworld').get((req, res) => {
    res.json({ message: 'hello world' });
  });

  router.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  return router;
};
