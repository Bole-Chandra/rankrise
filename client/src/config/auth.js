/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GOOGLE SIGN-IN CONFIG — paste your Google OAuth Client ID below.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This powers the "Sign in with Google" button on the student/teacher
 * login and signup pages.
 *
 * WHERE TO GET IT:
 *   1. https://console.cloud.google.com → create/select a project
 *   2. APIs & Services → Credentials → Create Credentials → OAuth Client ID
 *   3. Application type: Web application
 *   4. Authorized JavaScript origins: add your site's URL
 *      (e.g. https://rankrise.in and http://localhost:5173 for local dev)
 *   5. Copy the Client ID (ends in .apps.googleusercontent.com)
 *
 * This SAME value also needs to go in server/.env as GOOGLE_CLIENT_ID — the
 * backend verifies the token against it too. See server/.env.example.
 *
 * Set it via client/.env (VITE_GOOGLE_CLIENT_ID=...) or hardcode the
 * fallback below. Leaving it blank simply hides the Google button.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const authConfig = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
};

export default authConfig;
