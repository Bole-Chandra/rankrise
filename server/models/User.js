const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  // Not required: accounts created via Google Sign-In never set a password.
  password: { type: String },

  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },

  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String },

  isEmailVerified: { type: Boolean, default: false },

  // Only meaningful when role === 'teacher'. Teachers cannot log in until an
  // admin approves them, regardless of whether they signed up locally or
  // via Google.
  teacherStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: undefined },

  // One-time-password fields, reused for both email verification and
  // password reset (distinguished by otpPurpose). The OTP itself is never
  // stored in plain text.
  otpCodeHash: { type: String },
  otpPurpose: { type: String, enum: ['verify_email', 'reset_password'] },
  otpExpires: { type: Date },
  otpAttempts: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

// A teacher account is only usable once explicitly approved.
userSchema.methods.canLogIn = function () {
  if (this.role === 'teacher') return this.teacherStatus === 'approved';
  return true;
};

module.exports = mongoose.model('User', userSchema);
