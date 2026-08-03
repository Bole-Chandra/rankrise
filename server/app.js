const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const sanitizeBody = require('./middleware/sanitize');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();


// ─── Proxy Configuration ──────────────────────────────────────────────────────
app.set('trust proxy', 1);


// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);


// ─── Compression ──────────────────────────────────────────────────────────────
app.use(compression());


// ─── CORS Configuration ───────────────────────────────────────────────────────

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://rankrise-psi.vercel.app',

  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL
        .split(',')
        .map((url) => url.trim().replace(/\/$/, ''))
        .filter(Boolean)
    : []),
];


app.use(
  cors({
    origin: (origin, callback) => {

      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/$/, '');

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      console.log('Blocked CORS Origin:', cleanOrigin);

      return callback(
        new Error(`CORS: Origin ${cleanOrigin} not allowed`)
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);


// ─── Body Parsers ─────────────────────────────────────────────────────────────

app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);


// ─── Sanitize Body ────────────────────────────────────────────────────────────

app.use(sanitizeBody);


// ─── Database Connection Check ────────────────────────────────────────────────

app.use('/api', (req, res, next) => {

  if (req.path === '' || req.path === '/') {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        'Database is not connected yet. Check MongoDB connection.',
    });
  }

  next();
});


// ─── Rate Limiting ────────────────────────────────────────────────────────────

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests, please try again later.',
  },
});


app.use('/api', apiLimiter);



const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    message:
      'Too many login attempts. Please try again later.',
  },
});


app.use('/api/auth/login', authLimiter);
app.use('/api/auth/google', authLimiter);