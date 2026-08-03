const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/mailer');
const { verifyGoogleToken } = require('../utils/googleAuth');
const { generateOtp, hashOtp, compareOtp, getOtpExpiry, MAX_OTP_ATTEMPTS } = require('../utils/otp');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'rankrise_secret_key', { expiresIn: '30d' });
};

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  authProvider: user.authProvider,
  isEmailVerified: user.isEmailVerified,
  teacherStatus: user.teacherStatus,
});

// Deliverability notes: a fully-structured HTML document (not just a
// fragment), a real physical business address in the footer, and a
// balanced amount of surrounding text (not just one giant styled number)
// are all things spam filters actually score on — this isn't cosmetic.
const otpEmailHtml = (name, otp, purpose) => {
  const isReset = purpose === 'reset_password';
  const heading = isReset ? 'Reset Your Password' : 'Verify Your Email Address';
  const bodyText = isReset
    ? "We received a request to reset the password for your Rankrise account. Use the code below to continue."
    : "Thanks for signing up with Rankrise. Use the code below to verify your email address and activate your account.";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f4f6f5; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f5; padding: 30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="background-color:#015927; padding: 22px 30px;">
              <span style="color:#ffffff; font-size:20px; font-weight:bold;">Rankrise Educational Institutions</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 30px 10px 30px;">
              <h2 style="margin:0 0 16px 0; color:#1a1a1a; font-size:20px;">${heading}</h2>
              <p style="margin:0 0 8px 0; color:#333333; font-size:15px; line-height:1.6;">Hi ${name},</p>
              <p style="margin:0 0 20px 0; color:#333333; font-size:15px; line-height:1.6;">${bodyText}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 30px 20px 30px;" align="center">
              <div style="background-color:#f0f7f2; border: 1px dashed #015927; border-radius:8px; padding: 18px; display:inline-block; min-width:220px;">
                <span style="font-size:30px; font-weight:bold; letter-spacing:8px; color:#015927;">${otp}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <p style="margin:0 0 8px 0; color:#555555; font-size:13px; line-height:1.6;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email — no changes will be made to your account.</p>
              <p style="margin:16px 0 0 0; color:#333333; font-size:14px;">— The Rankrise Team</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f4f6f5; padding: 18px 30px; border-top: 1px solid #e5e5e5;">
              <p style="margin:0; color:#888888; font-size:12px; line-height:1.6;">
                Rankrise Educational Institutions<br>
                KPHB Main Road, Kukatpally, Hyderabad, Telangana 500072, India<br>
                <a href="https://rankrise.in" style="color:#015927;">rankrise.in</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const otpEmailText = (name, otp, purpose) => {
  const isReset = purpose === 'reset_password';
  const bodyText = isReset
    ? 'We received a request to reset the password for your Rankrise account.'
    : 'Thanks for signing up with Rankrise. Use the code below to verify your email address.';

  return `${isReset ? 'Reset Your Password' : 'Verify Your Email Address'}

Hi ${name},

${bodyText}

Your code: ${otp}

This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.

— The Rankrise Team
Rankrise Educational Institutions
KPHB Main Road, Kukatpally, Hyderabad, Telangana 500072, India
https://rankrise.in`;
};

const sendOtpToUser = async (user, purpose) => {
  const otp = generateOtp();
  user.otpCodeHash = await hashOtp(otp);
  user.otpPurpose = purpose;
  user.otpExpires = getOtpExpiry();
  user.otpAttempts = 0;
  await user.save();

  // Returns whether the email actually went out, so callers can be honest
  // with the user instead of always claiming "check your email" even when
  // it silently failed to send (e.g. a misconfigured mail provider).
  const emailSent = await sendMail({
    to: user.email,
    subject: purpose === 'reset_password' ? 'Rankrise — Password Reset Code' : 'Rankrise — Verify Your Email',
    html: otpEmailHtml(user.name, otp, purpose),
    text: otpEmailText(user.name, otp, purpose),
    replyTo: undefined,
  });

  return emailSent;
};

// ─── Registration (Student / Teacher) ────────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, role } = req.body;
    // Trimmed once here and reused for hashing — an invisible leading/
    // trailing space (very common from mobile keyboards, autofill, or
    // copy-paste) must never be able to make a correct password "wrong"
    // at login later, since login trims the same way before comparing.
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : req.body.email;
    const password = typeof req.body.password === 'string' ? req.body.password.trim() : req.body.password;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email, and password are required');
    }
    if (!['student', 'teacher'].includes(role)) {
      res.status(400);
      throw new Error('Role must be either student or teacher');
    }
    if (!password) {
      res.status(400);
      throw new Error('Password cannot be blank');
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      authProvider: 'local',
      isEmailVerified: false,
      teacherStatus: role === 'teacher' ? 'pending' : undefined,
    });

    const emailSent = await sendOtpToUser(user, 'verify_email');

    res.status(201).json({
      message: emailSent
        ? 'Account created. Please check your email for a verification code.'
        : 'Account created, but we could not send the verification email right now. Please use "Resend Code" on the next screen to try again.',
      emailSent,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Email OTP verification ──────────────────────────────────────────────────
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyEmailOtp = async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : req.body.email;
    const otp = typeof req.body.otp === 'string' ? req.body.otp.trim() : req.body.otp;
    if (!email || !otp) {
      res.status(400);
      throw new Error('Email and code are required');
    }

    const user = await User.findOne({ email: email.toLowerCase(), otpPurpose: 'verify_email' });
    if (!user || !user.otpCodeHash || !user.otpExpires) {
      res.status(400);
      throw new Error('No pending verification found for this email');
    }
    if (user.otpExpires < new Date()) {
      res.status(400);
      throw new Error('This code has expired. Please request a new one.');
    }
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      res.status(429);
      throw new Error('Too many incorrect attempts. Please request a new code.');
    }

    const isMatch = await compareOtp(otp, user.otpCodeHash);
    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();
      res.status(400);
      throw new Error('Incorrect code. Please try again.');
    }

    user.isEmailVerified = true;
    user.otpCodeHash = undefined;
    user.otpPurpose = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();

    if (user.role === 'teacher') {
      return res.json({
        message: 'Email verified! Your teacher account is now awaiting admin approval before you can log in.',
        awaitingApproval: true,
      });
    }

    res.json({
      message: 'Email verified! You can now log in.',
      token: generateToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : req.body.email;
    const { purpose } = req.body;
    if (!email || !['verify_email', 'reset_password'].includes(purpose)) {
      res.status(400);
      throw new Error('Email and a valid purpose are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // Don't reveal whether an email exists in the system either way.
    if (!user) {
      return res.json({ message: 'If that email exists, a new code has been sent.' });
    }
    if (purpose === 'verify_email' && user.isEmailVerified) {
      return res.json({ message: 'This email is already verified — you can log in.' });
    }

    const emailSent = await sendOtpToUser(user, purpose);
    res.json({
      message: emailSent
        ? 'A new code has been sent to your email.'
        : 'We could not send the code right now — please try again in a moment, or contact the admin if this keeps happening.',
      emailSent,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : req.body.email;
    const password = typeof req.body.password === 'string' ? req.body.password.trim() : req.body.password;
    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      res.status(403);
      throw new Error('Please verify your email before logging in.');
    }
    if (user.role === 'teacher' && user.teacherStatus !== 'approved') {
      res.status(403);
      throw new Error(
        user.teacherStatus === 'rejected'
          ? 'Your teacher account application was not approved. Please contact the admin.'
          : 'Your teacher account is still awaiting admin approval.'
      );
    }

    res.json({ token: generateToken(user._id), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

// ─── Google Sign-In ───────────────────────────────────────────────────────────
// @route   POST /api/auth/google
// @access  Public
// Body: { idToken, role } — role only used the first time a NEW account is
// created via Google (existing accounts keep whatever role they already have).
const googleAuthHandler = async (req, res, next) => {
  try {
    const { idToken, role } = req.body;
    if (!idToken) {
      res.status(400);
      throw new Error('Missing Google credential');
    }

    const payload = await verifyGoogleToken(idToken);
    if (!payload) {
      res.status(400);
      throw new Error('Google Sign-In is not configured, or the credential is invalid. See server/.env GOOGLE_CLIENT_ID.');
    }
    if (!payload.emailVerified) {
      res.status(400);
      throw new Error('Your Google account email is not verified.');
    }

    let user = await User.findOne({ email: payload.email.toLowerCase() });

    if (!user) {
      if (!['student', 'teacher'].includes(role)) {
        res.status(400);
        throw new Error('Please select whether you are signing up as a Student or Teacher.');
      }
      user = await User.create({
        name: payload.name,
        email: payload.email.toLowerCase(),
        googleId: payload.googleId,
        authProvider: 'google',
        role,
        isEmailVerified: true, // Google already verified this
        teacherStatus: role === 'teacher' ? 'pending' : undefined,
      });
    } else if (!user.googleId) {
      // An account with this email already exists locally — link it.
      user.googleId = payload.googleId;
      user.isEmailVerified = true;
      await user.save();
    }

    if (user.role === 'teacher' && user.teacherStatus !== 'approved') {
      res.status(403);
      throw new Error(
        user.teacherStatus === 'rejected'
          ? 'Your teacher account application was not approved. Please contact the admin.'
          : 'Your teacher account is still awaiting admin approval.'
      );
    }

    res.json({ token: generateToken(user._id), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

// ─── Forgot / Reset password ─────────────────────────────────────────────────
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : req.body.email;
    if (!email) {
      res.status(400);
      throw new Error('Email is required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // Don't reveal whether the email exists.
    if (!user || user.authProvider === 'google') {
      return res.json({ message: 'If that email has a password-based account, a reset code has been sent.' });
    }

    await sendOtpToUser(user, 'reset_password');
    res.json({ message: 'If that email has a password-based account, a reset code has been sent.' });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : req.body.email;
    const otp = typeof req.body.otp === 'string' ? req.body.otp.trim() : req.body.otp;
    // Trimmed the same way loginUser trims it, so a freshly reset password
    // can never fail to match itself at the very next login attempt.
    const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword.trim() : req.body.newPassword;
    if (!email || !otp || !newPassword) {
      res.status(400);
      throw new Error('Email, code, and new password are required');
    }
    if (!newPassword) {
      res.status(400);
      throw new Error('Password cannot be blank');
    }

    const user = await User.findOne({ email: email.toLowerCase(), otpPurpose: 'reset_password' });
    if (!user || !user.otpCodeHash || !user.otpExpires) {
      res.status(400);
      throw new Error('No pending password reset found for this email');
    }
    if (user.otpExpires < new Date()) {
      res.status(400);
      throw new Error('This code has expired. Please request a new one.');
    }
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      res.status(429);
      throw new Error('Too many incorrect attempts. Please request a new code.');
    }

    const isMatch = await compareOtp(otp, user.otpCodeHash);
    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();
      res.status(400);
      throw new Error('Incorrect code. Please try again.');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otpCodeHash = undefined;
    user.otpPurpose = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

// ─── Profile ──────────────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @access  Private (any authenticated user)
const getMe = async (req, res, next) => {
  try {
    res.json(publicUser(req.user));
  } catch (error) {
    next(error);
  }
};

// ─── Admin: Teacher approvals ─────────────────────────────────────────────────
// @route   GET /api/auth/teachers/pending
// @access  Private/Admin
const getPendingTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: 'teacher', teacherStatus: 'pending' })
      .select('-password -otpCodeHash')
      .sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/teachers
// @access  Private/Admin
const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password -otpCodeHash')
      .sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/teachers/:id/approve
// @access  Private/Admin
const approveTeacher = async (req, res, next) => {
  try {
    const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' });
    if (!teacher) {
      res.status(404);
      throw new Error('Teacher account not found');
    }
    teacher.teacherStatus = 'approved';
    await teacher.save();

    await sendMail({
      to: teacher.email,
      subject: 'Rankrise — Your Teacher Account Has Been Approved',
      html: `<p>Hi ${teacher.name},</p><p>Your teacher account on Rankrise has been approved. You can now log in and start writing articles/blogs for review.</p>`,
    });

    res.json({ message: 'Teacher approved', teacher: publicUser(teacher) });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/teachers/:id/reject
// @access  Private/Admin
const rejectTeacher = async (req, res, next) => {
  try {
    const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' });
    if (!teacher) {
      res.status(404);
      throw new Error('Teacher account not found');
    }
    teacher.teacherStatus = 'rejected';
    await teacher.save();

    await sendMail({
      to: teacher.email,
      subject: 'Rankrise — Teacher Account Application Update',
      html: `<p>Hi ${teacher.name},</p><p>We're unable to approve your teacher account at this time. Please contact the admin for more information.</p>`,
    });

    res.json({ message: 'Teacher application rejected', teacher: publicUser(teacher) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
