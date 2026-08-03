# Deploying Rankrise on Hostinger

## 1. Requirements
- Hostinger plan with **Node.js hosting** enabled (Business/Cloud/VPS — Node apps aren't available on basic shared hosting).
- A MongoDB Atlas cluster (free tier is fine) with your Hostinger server's IP whitelisted under Network Access (or `0.0.0.0/0` to allow all).
- A mailbox for sending form-notification emails — easiest is a Hostinger email account created in hPanel → Emails (e.g. `info@rankrise.in`).

## 2. Recommended: single Node.js app (frontend + backend together)
This is the simplest option and avoids CORS/cross-domain complexity entirely.

1. On your machine (or Hostinger's terminal): `cd client && npm install && npm run build`
   This produces `client/dist/`.
2. Upload the whole `new1/` folder (including the built `client/dist/`) to your Hostinger Node.js app directory — **except `node_modules`**.
3. In hPanel → Node.js app settings, set:
   - **Application root**: the `server/` folder
   - **Application startup file**: `server.js`
   - **Node version**: 18+ (20 LTS recommended)
4. Set environment variables in the Node.js app panel (or upload `server/.env` — see `.env.example` for the full list): `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, `NODE_ENV=production`.
5. Run `npm install` from the Hostinger Node.js app panel (or SSH: `cd server && npm install`).
6. Start/restart the app. `server/app.js` automatically detects and serves `client/dist/` when it exists next to it, and the built React app's client-side routes are all handled by the existing catch-all.
7. Point your domain to the Node.js app (hPanel does this automatically when you create the app on a domain).

## 3. Alternative: split deployment (static frontend + separate API)
If you prefer to host the frontend as a plain static site and the backend as its own Node app (e.g. on `api.rankrise.in`):

1. Build the frontend with the API's public URL baked in:
   ```
   cd client
   echo "VITE_API_URL=https://api.rankrise.in" > .env
   npm install && npm run build
   ```
2. Upload `client/dist/` contents as the web root for `rankrise.in`.
3. Deploy `server/` as its own Node.js app on `api.rankrise.in`, with the same env vars as above, plus:
   `CLIENT_URL=https://rankrise.in,https://www.rankrise.in`

## 4. Email / SMTP setup (form notifications)
Every Admission and Contact/Enquiry submission is saved to MongoDB first (this always works), then a notification email is sent best-effort via SMTP using `nodemailer`. If email isn't configured, form submissions still succeed — only the email is skipped, and this is logged clearly on the server.

**Recommended — Hostinger email:**
```
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=info@rankrise.in
EMAIL_PASS=<mailbox password>
EMAIL_TO=info@rankrise.in
```
Create the mailbox first: hPanel → Emails → Create Email Account.

**Alternative — Gmail** (requires a 16-character [App Password](https://support.google.com/accounts/answer/185833), not your normal Gmail password):
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=you@gmail.com
EMAIL_PASS=<app password>
EMAIL_TO=you@gmail.com
```

## 5. First-time admin account
```
cd server
npm run seed
```
Creates `meghaphanikumar@gmail.com` / `ChandraCM` — **change this password immediately** after your first login by adding a new admin via `/api/auth/register` (protected route) and removing/disabling the seeded one, since it's a publicly known default.

## 6. What changed in this pass (summary)
See the chat response for the full list — in short: fixed a dependency bug that crashed the entire backend on startup, added SMTP email notifications for both forms, added the missing admin update/delete endpoints for admissions and enquiries, added helmet/rate-limiting/CORS hardening, added a shared frontend API client so it works regardless of how you deploy, and added `robots.txt`/`sitemap.xml` for SEO. No visual/UI changes were made anywhere.
