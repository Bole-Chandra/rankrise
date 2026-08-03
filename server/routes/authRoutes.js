const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyEmailOtp,
  resendOtp,
  loginUser,
  googleAuthHandler,
  forgotPassword,
  resetPassword,
  getMe,
  getPendingTeachers,
  getAllTeachers,
  approveTeacher,
  rejectTeacher,
} = require('../controllers/authController');
const { authenticate, protect } = require('../middleware/authMiddleware');

// ─── Public: registration & sign-in ──────────────────────────────────────────
router.post('/register', registerUser);
router.post('/verify-otp', verifyEmailOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/google', googleAuthHandler);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ─── Any authenticated user ──────────────────────────────────────────────────
router.get('/me', authenticate, getMe);

// ─── Admin only: teacher approvals ───────────────────────────────────────────
router.get('/teachers/pending', protect, getPendingTeachers);
router.get('/teachers', protect, getAllTeachers);
router.put('/teachers/:id/approve', protect, approveTeacher);
router.put('/teachers/:id/reject', protect, rejectTeacher);

module.exports = router;
