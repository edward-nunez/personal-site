require('dotenv').config();

const session = require('express-session');
const cors = require('cors');
const express = require('express');
const httpLogger = require('morgan');
const helmet = require('helmet');
const path = require('path');

const allRoutes = require('./routes');

const app = express();

// Middleware
app.use(express.json());
app.use(httpLogger('dev'));
app.use(helmet());
app.use(cors());

// Allow express to create session when a client connects
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'this-is-super-secret',
    resave: true,
    saveUninitialized: true,
  })
);

// Serve up static assets
app.use(express.static(path.join(__dirname, './public')));

// Routes
app.use('/', allRoutes(passport));

module.exports = app;
