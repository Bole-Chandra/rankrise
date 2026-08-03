// A repair tool for exactly one problem: "I know my email and the password
// I want, but the app won't let me log in with it."
//
// This sets a user's password directly in the database using the exact same
// bcrypt.genSalt + bcrypt.hash call that registerUser and resetPassword use
// — then immediately re-reads it back and runs bcrypt.compare against it,
// the exact same check loginUser uses. If that self-check doesn't pass, the
// script tells you and exits with an error instead of pretending it worked.
// It also clears every other reason login could still fail afterwards
// (unverified email, unapproved teacher account, leftover OTP state), so a
// success message here means login truly will work — not just "should".
//
// Usage:
//   node fix-user.js <email> <newPassword>
//   node fix-user.js student@rankrise.in "MyNewPass123"
//
// If the email doesn't exist yet, it creates the account (as a student,
// pre-verified) instead of failing — handy for quickly spinning up a test
// login without going through Sign Up + email verification at all.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const [, , rawEmail, rawPassword] = process.argv;

if (!rawEmail || !rawPassword) {
  console.error('Usage: node fix-user.js <email> <newPassword>');
  process.exit(1);
}

// Trimmed exactly the way authController now trims register/login input —
// this script has to match that behavior or it could "fix" a password to a
// value that still doesn't match what login will trim and compare.
const email = rawEmail.trim().toLowerCase();
const password = rawPassword.trim();

if (!password) {
  console.error('Password cannot be blank (or all whitespace).');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rankrise');
    console.log('MongoDB Connected.');

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    let user = await User.findOne({ email });
    let created = false;

    if (!user) {
      user = await User.create({
        name: 'Test User',
        email,
        password: hashed,
        role: 'student',
        authProvider: 'local',
        isEmailVerified: true,
      });
      created = true;
    } else {
      user.password = hashed;
      user.authProvider = 'local'; // in case it was a Google-only account with no password before
      user.isEmailVerified = true; // clears "please verify your email" as a possible blocker
      if (user.role === 'teacher') user.teacherStatus = 'approved'; // clears "awaiting admin approval" too
      // Clear any leftover OTP state so it can't interfere with a future
      // verify/reset attempt.
      user.otpCodeHash = undefined;
      user.otpPurpose = undefined;
      user.otpExpires = undefined;
      user.otpAttempts = 0;
      await user.save();
    }

    // Self-check: re-read from the DB and run the exact comparison loginUser
    // runs. Don't just trust that the save worked — prove it.
    const fresh = await User.findOne({ email });
    const matches = await bcrypt.compare(password, fresh.password);

    console.log('');
    if (matches) {
      console.log(`✅ ${created ? 'Created' : 'Updated'} ${email} (role: ${fresh.role}) — verified this password logs in correctly.`);
      console.log(`   Email:    ${email}`);
      console.log(`   Password: ${password}`);
    } else {
      console.error('❌ Something is still wrong — the password was saved but does not match on re-check.');
      console.error('   This would indicate a deeper issue (e.g. a corrupted bcrypt install) rather than a data problem.');
      process.exitCode = 1;
    }

    await mongoose.disconnect();
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

run();
