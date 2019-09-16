// Load environment variables into for use in server
require('dotenv').config();

// Import server dependencies
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('cookie-session');
const Keygrip = require('keygrip');

// Declare and initialize express server and create socket.io and https services
const app = express();

// Initialize middleware for express server
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Security setup for cookies and storage of each session
const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
app.use(
  session({
    name: 'session',
    keys: new Keygrip(['key1', 'key2'], 'SHA384', 'base64'),
    cookie: {
      secure: true,
      httpOnly: true,
      domain: process.env.DOMAIN || 'localhost',
      expires: expiryDate,
    },
  }),
);

// Adding static directories from React build and importing all routes
app.use(express.static('client/build'));
const routes = require('./routes');

app.use('/', routes());

app.listen((process.env.NODE_PORT || 8080), '0.0.0.0', () => {
  console.log(
    `🌎  ==> API Server now listening on PORT ${process.env.PORT || 8080}!`,
  );
});
