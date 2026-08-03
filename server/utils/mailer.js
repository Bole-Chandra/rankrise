const nodemailer = require('nodemailer');

// ─── Email sending — two methods, tried in this order ────────────────────────
//
// 1. Brevo (formerly Sendinblue) HTTP API — RECOMMENDED. Sends over HTTPS
//    (port 443), so it is never affected by a host blocking outbound SMTP
//    ports, which is a very common — and very hard to diagnose — problem on
//    shared hosting (including Hostinger). Free tier: 300 emails/day,
//    forever, no credit card required.
//
//      1. Sign up free at https://www.brevo.com
//      2. Go to Settings → SMTP & API → API Keys → Generate a new key
//      3. Put it in server/.env as BREVO_API_KEY=xkeysib-xxxxxxxx
//
// 2. SMTP via nodemailer (Hostinger email, Gmail, etc) — used automatically
//    if BREVO_API_KEY isn't set. This is the method most likely to be
//    silently blocked on shared hosting — if you've configured EMAIL_USER/
//    EMAIL_PASS correctly and emails still aren't arriving, that's the #1
//    suspect. Switching to Brevo above sidesteps the problem entirely.
//
// Run `node test-email.js` in the server/ folder any time to test whichever
// method is currently configured and get a clear pass/fail result.

const useBrevo = () => Boolean(process.env.BREVO_API_KEY);
const isConfigured = () => useBrevo() || Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

// ─── Method 1: Brevo HTTP API ────────────────────────────────────────────────
const sendViaBrevo = async ({ subject, html, text, replyTo, to }) => {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: 'Rankrise Educational Institutions',
        email: process.env.EMAIL_FROM || process.env.EMAIL_TO || 'no-reply@rankrise.in',
      },
      to: [{ email: to || process.env.EMAIL_TO || process.env.EMAIL_FROM }],
      replyTo: replyTo ? { email: replyTo } : undefined,
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Brevo API error ${res.status}: ${errBody}`);
  }
};

// ─── Method 2: SMTP via nodemailer ────────────────────────────────────────────
let smtpTransporter = null;
let smtpVerified = false;

const getSmtpTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';

  // Gmail App Passwords are always exactly 16 characters, lowercase
  // letters/digits only, no spaces or symbols (e.g. "uylcywpyrqemhitd").
  // A regular Google account password will NEVER work here — Google
  // rejects it outright — and that failure is a fairly cryptic
  // "535 Bad Credentials" error that's easy to misdiagnose as something
  // else. Catching the obviously-wrong format here gives a much clearer
  // answer immediately instead.
  if (host.includes('gmail.com') && !/^[a-z0-9]{16}$/.test(process.env.EMAIL_PASS)) {
    console.error('⚠️  EMAIL_PASS does not look like a valid Gmail App Password.');
    console.error('   Gmail App Passwords are exactly 16 lowercase letters/digits, no spaces or symbols.');
    console.error('   Generate one at https://myaccount.google.com/apppasswords for the EMAIL_USER account,');
    console.error('   and make sure 2-Step Verification is enabled on that account first.');
    console.error('   Your regular Google account password will never work here, even if correct.');
    return null;
  }

  if (!smtpTransporter) {
    const port = Number(process.env.EMAIL_PORT) || 465;
    const secure = process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : port === 465;

    smtpTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      connectionTimeout: 10000, // fail fast (10s) instead of hanging if the port is blocked
    });

    if (!smtpVerified) {
      smtpVerified = true;
      smtpTransporter.verify((err) => {
        if (err) {
          console.error('⚠️  SMTP connection could not be verified:', err.message);
          console.error('   If this times out (rather than an auth error), the host is very likely blocking this SMTP port.');
          console.error('   Consider switching to Brevo (see server/utils/mailer.js header comment) — it uses HTTPS instead.');
        } else {
          console.log(`✅ SMTP ready via ${host}:${port} (${process.env.EMAIL_USER})`);
        }
      });
    }
  }

  return smtpTransporter;
};

const sendViaSmtp = async ({ subject, html, text, replyTo, to }) => {
  const transporter = getSmtpTransporter();
  if (!transporter) throw new Error('SMTP not usable — see the warning logged above for the specific reason (missing credentials or invalid Gmail App Password format)');

  await transporter.sendMail({
    from: `"Rankrise Educational Institutions" <${process.env.EMAIL_USER}>`,
    to: to || process.env.EMAIL_TO || process.env.EMAIL_USER,
    replyTo,
    subject,
    html,
    text, // plain-text alternative — HTML-only emails are more likely to be flagged as spam
  });
};

/**
 * Send an email. Never throws — logs and resolves to false on failure so
 * callers can save-to-DB first and treat email as a best-effort side effect.
 *
 * @param {string} [to] - Recipient override. Omit this for admin
 *   notifications (enquiry/admission forms) — those should always go to
 *   EMAIL_TO. ALWAYS pass this explicitly for anything meant for a specific
 *   person (OTP codes, teacher approval notices, etc) — otherwise it goes
 *   to the admin inbox instead of the intended recipient.
 * @param {string} [text] - Plain-text alternative. Always provide this for
 *   anything going to an end user (not just admin notifications) — an
 *   HTML-only email is a real, measurable spam-score factor with most
 *   providers (Gmail included).
 * @returns {Promise<boolean>} true if the email was sent
 */
const sendMail = async ({ subject, html, text, replyTo, to }) => {
  if (!isConfigured()) {
    console.warn('✉️  Email not sent — no BREVO_API_KEY or EMAIL_USER/EMAIL_PASS configured in .env');
    return false;
  }

  try {
    if (useBrevo()) {
      await sendViaBrevo({ subject, html, text, replyTo, to });
      console.log(`✅ Email sent via Brevo: "${subject}" → ${to || process.env.EMAIL_TO}`);
    } else {
      await sendViaSmtp({ subject, html, text, replyTo, to });
      console.log(`✅ Email sent via SMTP: "${subject}" → ${to || process.env.EMAIL_TO}`);
    }
    return true;
  } catch (error) {
    console.error('⚠️  Email send failed:', error.message);
    return false;
  }
};

module.exports = { sendMail, isConfigured, useBrevo };
