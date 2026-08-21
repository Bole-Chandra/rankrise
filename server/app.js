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

      // Allow Postman/mobile/server requests
      if (!origin) {
        return callback(null, true);
      }


      const cleanOrigin = origin.replace(/\/$/, '');


      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }


      console.log(
        'Blocked CORS:',
        cleanOrigin
      );


      return callback(
        new Error(
          `CORS: Origin ${cleanOrigin} not allowed`
        )
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ],
  })
);


// ─── Body Parsers ─────────────────────────────────────────────────────────────

app.use(
  express.json({
    limit: '10mb'
  })
);


app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb'
  })
);


// ─── Security Sanitizer ───────────────────────────────────────────────────────

app.use(sanitizeBody);

// ─── Database Connection Check ────────────────────────────────────────────────

app.use('/api', (req, res, next) => {

  if (req.path === '' || req.path === '/') {
    return next();
  }


  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        'Database is not connected yet. Check MongoDB Atlas connection.'
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
    message:
      'Too many requests, please try again later.'
  }
});


app.use('/api', apiLimiter);


// ─── Authentication Rate Limit ────────────────────────────────────────────────

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    message:
      'Too many login attempts. Please try again later.'
  }
});


app.use('/api/auth/login', authLimiter);
app.use('/api/auth/google', authLimiter);


// ─── OTP Rate Limit ───────────────────────────────────────────────────────────

const otpLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 15,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      'Too many OTP attempts. Please wait and try again.'
  }

});


app.use('/api/auth/verify-otp', otpLimiter);
app.use('/api/auth/resend-otp', otpLimiter);
app.use('/api/auth/forgot-password', otpLimiter);
app.use('/api/auth/reset-password', otpLimiter);
app.use('/api/auth/register', otpLimiter);


// ─── Public Form Protection ───────────────────────────────────────────────────

const formLimiter = rateLimit({

  windowMs: 60 * 60 * 1000,

  max: 20,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      'Too many submissions. Try again later.'
  }

});


app.use(
  '/api/contact',
  formLimiter
);


app.use(
  '/api/admissions',
  (req, res, next) => {

    if (req.method === 'POST') {
      return formLimiter(req, res, next);
    }

    next();
  }
);


// ─── Static Uploads ───────────────────────────────────────────────────────────

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads')
  )
);


// ─── Sitemap ──────────────────────────────────────────────────────────────────

app.use(
  require('./routes/sitemapRoute')
);


// ─── API Routes ───────────────────────────────────────────────────────────────

app.use(
  '/api/auth',
  require('./routes/authRoutes')
);


app.use(
  '/api/admissions',
  require('./routes/admissionRoutes')
);


app.use(
  '/api/blogs',
  require('./routes/blogRoutes')
);


app.use(
  '/api/contact',
  require('./routes/contactRoutes')
);


app.use(
  '/api/gallery',
  require('./routes/galleryRoutes')
);


app.use(
  '/api/videos',
  require('./routes/videoRoutes')
);


app.use(
  '/api/documents',
  require('./routes/documentRoutes')
);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/api', (req, res) => {

  const dbStates = [
    'disconnected',
    'connected',
    'connecting',
    'disconnecting'
  ];


  res.json({

    message:
      'Rankrise Educational Platform API is running',

    version:
      '1.0.0',

    database:
      dbStates[mongoose.connection.readyState] || 'unknown'

  });

});


// ─── Serve React Build (Optional) ────────────────────────────────────────────
// Used only if frontend build exists inside the same server deployment.

const clientDistPath = path.join(
  __dirname,
  '../client/dist'
);


if (fs.existsSync(clientDistPath)) {

  app.use(
    express.static(clientDistPath)
  );


  app.get(
    /^(?!\/api|\/uploads).*/,
    (req, res) => {

      res.sendFile(
        path.join(
          clientDistPath,
          'index.html'
        )
      );

    }
  );

}


// ─── API 404 Handler ──────────────────────────────────────────────────────────

app.use('/api', (req, res) => {

  res.status(404).json({

    message:
      `Route ${req.originalUrl} not found`

  });

});


// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use(errorHandler);


// ─── IMPORTANT EXPORT ─────────────────────────────────────────────────────────
// server.js uses:
// const app = require('./app');
// app.listen(PORT)

module.exports = app;