require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const connectDB = require('./config/db');

// ─── Startup Validation ───────────────────────────────────────────────────────
// Refuse to boot in production with missing/weak secrets — this is far safer
// than silently falling back to a hardcoded JWT secret.
if (process.env.NODE_ENV === 'production') {
  const missing = [];
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) missing.push('JWT_SECRET (32+ chars)');
  if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
  if (!process.env.CLIENT_URL) missing.push('CLIENT_URL');
  if (missing.length) {
    console.error('❌ Missing/weak required environment variables:', missing.join(', '));
    process.exit(1);
  }
}

const app = require('./app');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});