// middleware.js

const express = require('express');
const session = require('express-session');

// Define the session middleware
const sessionMiddleware = session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // For development; set `secure: true` in production with HTTPS
});

// Define a custom method in the middleware
const customMethod = (req, res, next) => {
  if (req.session && req.session.user) {
    console.log('User is logged in:', req.session.user);
  } else {
    console.log('No user is logged in.');
  }
  next();  // Call next middleware
};

const expressLogin = (req, next) => {
    console.log('User is logged in:', req);
    next();  // Call next middleware
  };
  


// Export the middleware and methods
module.exports = {
  sessionMiddleware,
  customMethod,
  expressLogin
};
