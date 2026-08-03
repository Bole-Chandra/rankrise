/**
 * Standalone email test — run this directly to check your email setup
 * without going through the whole form-submission flow:
 *
 *   cd server
 *   node test-email.js
 *
 * It will tell you clearly which method is active (Brevo or SMTP), attempt
 * to send a real test email to EMAIL_TO, and print exactly what went wrong
 * if it fails.
 */
require('dotenv').config();
const { sendMail, isConfigured, useBrevo } = require('./utils/mailer');

(async () => {
  console.log('─────────────────────────────────────────────────────');
  console.log('Rankrise — Email configuration test');
  console.log('─────────────────────────────────────────────────────');

  if (!isConfigured()) {
    console.log('❌ Nothing is configured yet.');
    console.log('   Set either BREVO_API_KEY, or EMAIL_USER + EMAIL_PASS, in server/.env');
    process.exit(1);
  }

  console.log(`Method:   ${useBrevo() ? 'Brevo HTTP API' : 'SMTP (' + (process.env.EMAIL_HOST || 'smtp.gmail.com') + ')'}`);
  console.log(`Sending to: ${process.env.EMAIL_TO || process.env.EMAIL_USER || process.env.EMAIL_FROM}`);
  console.log('Sending a test email now...\n');

  const ok = await sendMail({
    subject: 'Rankrise — Test Email',
    html: `
      <h2>✅ It works!</h2>
      <p>This is a test email from <code>node test-email.js</code>, sent at ${new Date().toLocaleString()}.</p>
      <p>If you're reading this, your email configuration is working correctly and form submissions will be able to send notification emails.</p>
    `,
  });

  console.log('\n─────────────────────────────────────────────────────');
  if (ok) {
    console.log('✅ SUCCESS — check the inbox (and spam folder, the first time) at the address above.');
    process.exit(0);
  } else {
    console.log('❌ FAILED — see the error above for the specific reason.');
    console.log('   Common causes:');
    console.log('   - Gmail: EMAIL_PASS must be a 16-character App Password (not your normal password),');
    console.log('     and 2-Step Verification must be enabled on the Google account first:');
    console.log('     https://support.google.com/accounts/answer/185833');
    console.log('   - SMTP timing out (not an auth error): your host is likely blocking outbound SMTP —');
    console.log('     switch to Brevo (see the comment at the top of server/utils/mailer.js).');
    console.log('   - Wrong EMAIL_HOST/EMAIL_PORT/EMAIL_SECURE combination for your provider.');
    process.exit(1);
  }
})();
