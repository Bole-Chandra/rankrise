const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

/** Generates a random 6-digit numeric OTP as a string, e.g. "042817". */
const generateOtp = () => {
  const otp = crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');
  return otp;
};

/** Hashes an OTP for storage — never store the raw code. */
const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

/** Compares a submitted OTP against the stored hash. */
const compareOtp = async (otp, hash) => {
  if (!otp || !hash) return false;
  return bcrypt.compare(otp, hash);
};

const getOtpExpiry = () => new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

module.exports = {
  generateOtp,
  hashOtp,
  compareOtp,
  getOtpExpiry,
  OTP_EXPIRY_MINUTES,
  MAX_OTP_ATTEMPTS,
};
