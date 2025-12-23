require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set Node to serve the files from React production build.
app.use(express.static(path.resolve(__dirname, './_static')));

// Import all routes
app.use(require('./routes'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  // If this looks like a browser GET for an app route, serve the React app
  if (req.method === 'GET' && req.accepts('html') && !req.path.startsWith('/api')) {
    return res.sendFile(path.resolve(__dirname, './_static', 'index.html'));
  }
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status);

  // API clients expect JSON
  if (req.path.startsWith('/api') || (req.accepts('json') && !req.accepts('html'))) {
    return res.json({ message: err.message, error: req.app.get('env') === 'development' ? err : {} });
  }

  // For browser requests, send a simple text response (no view engine required)
  if (req.app.get('env') === 'development') {
    return res.type('txt').send(`${err.message}\n\n${err.stack}`);
  }

  return res.type('txt').send('Server Error');
});

module.exports = app;
