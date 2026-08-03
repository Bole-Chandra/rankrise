const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Every account below is created the exact same way registerUser does it —
// bcrypt.genSalt(10) + bcrypt.hash — so there's no way for a seeded account
// to end up with a differently-shaped hash than a normally registered one.
const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

const seedUsers = [
  {
    name: 'Rankrise Admin',
    email: 'meghaphanikumar@gmail.com',
    password: 'ChandraCM',
    role: 'admin',
    authProvider: 'local',
    isEmailVerified: true,
  },
  {
    name: 'Rankrise Admin',
    email: 'info@rankrise.in',
    password: 'Rankrise@143',
    role: 'admin',
    authProvider: 'local',
    isEmailVerified: true,
  },
  {
    name: 'Demo Student',
    email: 'student@rankrise.in',
    password: 'Student@123',
    role: 'student',
    authProvider: 'local',
    isEmailVerified: true, // skips OTP so you can log in immediately in local dev
  },
  {
    name: 'Demo Teacher',
    email: 'teacher@rankrise.in',
    password: 'Teacher@123',
    role: 'teacher',
    authProvider: 'local',
    isEmailVerified: true,
    teacherStatus: 'approved', // skips the admin-approval wait too
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rankrise');
    console.log('MongoDB Connected for Seeding...');
    console.log('');

    for (const u of seedUsers) {
      const existingUser = await User.findOne({ email: u.email });
      if (existingUser) {
        console.log(`Skipped (already exists): ${u.email}`);
        continue;
      }

      await User.create({
        name: u.name,
        email: u.email,
        password: await hashPassword(u.password),
        role: u.role,
        authProvider: u.authProvider,
        isEmailVerified: u.isEmailVerified,
        teacherStatus: u.teacherStatus,
      });

      console.log(`Seeded ${u.role}: ${u.email} / ${u.password}`);
    }

    console.log('');
    console.log('Done. Use the credentials above to log in at /login (admin) or /login (student & teacher — same form, routed automatically by role).');

    // ─── Show every account that actually exists right now ────────────────
    // This runs every time, not just on first seed, so you always see the
    // real current state of the database instead of guessing — including
    // any accounts you created yourself through the Sign Up page.
    const allUsers = await User.find({}).sort({ createdAt: 1 });
    console.log('');
    console.log(`All users currently in the database (${allUsers.length}):`);
    console.log('─'.repeat(80));
    allUsers.forEach((u) => {
      const parts = [
        u.email.padEnd(32),
        u.role.padEnd(9),
        u.authProvider.padEnd(8),
        u.isEmailVerified ? 'verified  ' : 'UNVERIFIED',
        u.role === 'teacher' ? `(${u.teacherStatus || 'pending'})` : '',
      ];
      console.log(parts.join(' '));
    });
    console.log('─'.repeat(80));
    console.log('');
    console.log('If a student/teacher account you created yourself still won\'t log in with');
    console.log('the password you set, run this to force it to a known-working password:');
    console.log('  node fix-user.js <email> <newPassword>');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seed();
