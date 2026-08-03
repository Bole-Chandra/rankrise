const { OAuth2Client } = require('google-auth-library');

let client = null;
const getClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID) return null;
  if (!client) client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  return client;
};

/**
 * Verifies a Google Sign-In ID token (sent from the frontend after a
 * successful Google login) and returns the verified payload — never trust
 * an email/name sent directly from the client without this check, since
 * that could be spoofed.
 *
 * @returns {Promise<{email: string, name: string, googleId: string, emailVerified: boolean} | null>}
 *          null if GOOGLE_CLIENT_ID isn't configured or the token is invalid.
 */
const verifyGoogleToken = async (idToken) => {
  const oauthClient = getClient();
  if (!oauthClient || !idToken) return null;

  try {
    const ticket = await oauthClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) return null;

    return {
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      googleId: payload.sub,
      emailVerified: Boolean(payload.email_verified),
    };
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    return null;
  }
};

module.exports = { verifyGoogleToken };
