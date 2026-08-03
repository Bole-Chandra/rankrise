const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** Verifies the JWT and attaches the full user document (minus secrets) to req.user. */
const authenticate = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rankrise_secret_key');
      req.user = await User.findById(decoded.id).select('-password -otpCodeHash');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

/** Restricts a route to specific role(s). Must run after `authenticate`. */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You are not authorized to perform this action.' });
  }
  next();
};

// Backward-compatible: every existing admin-only route already imports
// `protect` expecting "admin access required". Previously this only checked
// that *some* valid user token was present — now that students and teachers
// can also log in, that would have been a real privilege-escalation bug.
// `protect` now explicitly requires role === 'admin', so every existing
// route stays correctly locked down with zero changes needed at the call site.
const protect = [authenticate, requireRole('admin')];

module.exports = { authenticate, requireRole, protect };
