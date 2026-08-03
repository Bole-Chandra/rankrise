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

// Hostinger (and most PaaS hosts) sit behind a reverse proxy — required for
// correct client IPs in rate-limiting and secure cookies.
app.set('trust proxy', 1);

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    // Uploaded images/videos are served cross-origin to the frontend, so don't
    // block that with the default cross-origin-resource-policy.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ─── Compression ──────────────────────────────────────────────────────────────
app.use(compression());

// ─── CORS Configuration ──────────────────────────────────────────────────────
// Supports a comma-separated list in CLIENT_URL, e.g.
// CLIENT_URL=https://rankrise.in,https://www.rankrise.in
const allowedOrigins = [
  ...(process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Sanitize against NoSQL injection ────────────────────────────────────────
app.use(sanitizeBody);

// ─── Fail fast if MongoDB isn't connected ────────────────────────────────────
// Without this, a request that touches the database while Mongo is down
// (e.g. Atlas IP not whitelisted yet during local dev) would just hang for
// ~10 seconds until Mongoose's internal buffering timeout kicks in, which
// looks like the form is silently doing nothing. This gives an immediate,
// clear answer instead.
app.use('/api', (req, res, next) => {
  if (req.path === '' || req.path === '/') return next(); // let the health check through regardless
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not connected yet. Check the server terminal for MongoDB connection errors (see server/.env MONGODB_URI, and MongoDB Atlas → Network Access whitelist).',
    });
  }
  next();
});

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// Stricter limiter for auth login (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/google', authLimiter);

// OTP endpoints get their own, slightly more generous limiter — a real user
// might legitimately hit "resend code" a few times, but this still blocks
// automated OTP-guessing/spam.
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});
app.use('/api/auth/verify-otp', otpLimiter);
app.use('/api/auth/resend-otp', otpLimiter);
app.use('/api/auth/forgot-password', otpLimiter);
app.use('/api/auth/reset-password', otpLimiter);
app.use('/api/auth/register', otpLimiter);

// Stricter limiter for public form submissions (spam protection)
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions from this device. Please try again later.' },
});
app.use('/api/contact', formLimiter);
app.use('/api/admissions', (req, res, next) => (req.method === 'POST' ? formLimiter(req, res, next) : next()));

// ─── Static Files (uploads) ──────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Dynamic sitemap.xml (includes all blog posts automatically) ────────────
app.use(require('./routes/sitemapRoute'));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    message: 'Rankrise Educational Platform API is running',
    version: '1.0.0',
    database: dbStates[mongoose.connection.readyState] || 'unknown',
  });
});

// ─── Serve React build (single-service Hostinger Node.js deployment) ────────
// If you deploy client/dist separately (e.g. as a static site) this block is
// simply skipped because the dist folder won't exist next to app.js.
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ─── 404 for unmatched API routes ────────────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
