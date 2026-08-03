const mongoose = require('mongoose');

let retryCount = 0;
const MAX_RETRY_DELAY = 30000; // cap backoff at 30s

/**
 * Connects to MongoDB with automatic retry. Deliberately does NOT call
 * process.exit() on failure — a database hiccup (or an un-whitelisted IP
 * during local development) should not take down the entire API. The
 * server keeps running and serving whatever it can (including a clear
 * "database not connected" status on GET /api) while it keeps retrying
 * in the background.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in server/.env — the API will run, but nothing that touches the database (forms, admin, gallery, etc.) will work until this is fixed.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    retryCount = 0;
    console.log('✅ MongoDB Atlas Connected');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
  } catch (error) {
    retryCount++;
    console.error('❌ MongoDB connection failed:', error.message);

    // The single most common cause of this in local development: the
    // machine's current IP address isn't whitelisted in Atlas yet.
    if (error.message.includes('whitelist') || error.message.includes('IP') || error.name === 'MongooseServerSelectionError') {
      console.error('   → This usually means your current IP address is not whitelisted in MongoDB Atlas.');
      console.error('   → Fix: MongoDB Atlas → your project → Network Access → Add IP Address → "Add Current IP Address" (or 0.0.0.0/0 for local dev only).');
      console.error('   → Also double check MONGODB_URI in server/.env has the correct username/password.');
    }

    const delay = Math.min(1000 * 2 ** retryCount, MAX_RETRY_DELAY);
    console.error(`   Retrying in ${Math.round(delay / 1000)}s... (attempt ${retryCount})`);
    setTimeout(connectDB, delay);
  }
};

// Log (not crash) on any later disconnect — e.g. a network blip after a
// successful initial connection — and let Mongoose's own reconnection
// logic take it from there.
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Mongoose will attempt to reconnect automatically.');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});

module.exports = connectDB;
