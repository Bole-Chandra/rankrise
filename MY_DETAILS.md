# MY DETAILS — fill this in, then copy each value to where it says

This is your single checklist. Don't edit code to add your details — every
value below goes into an `.env` file (or a hosting provider's dashboard),
never into the source code itself. Fill in the blanks here first so you
have everything in one place, then copy each one across.

Anything already filled in below is a value already set up for you in this
project — just there so you can see it and copy it elsewhere (e.g. into
Render/Vercel) without hunting for it.

---

## 1. Database — MongoDB Atlas

- [ ] Connection string: `_________________________________________________`
      (Atlas → your cluster → Connect → Drivers → copy, then replace
      `<password>` in it with your actual database user's password)

**Goes into:** `server/.env` → `MONGODB_URI=`
**Also goes into:** Render's Environment tab (Part 5) and Hostinger's
Node.js app environment variables (Part 6), if/when you deploy there.

---

## 2. Security

- [ ] JWT secret (a long random string — not a real password you use
      anywhere else, just needs to be long and random):
      `_________________________________________________`
      Generate one with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

**Goes into:** `server/.env` → `JWT_SECRET=` (and Render/Hostinger env vars)

---

## 3. Email (for OTP verification, password reset, contact form notifications)

- [ ] Mailbox: `info@rankrise.in` (create this first in hPanel → Emails,
      if it doesn't exist yet)
- [ ] That mailbox's password: `_________________________________________________`

**Goes into:** `server/.env`:
```
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=info@rankrise.in
EMAIL_PASS=<the password you filled in above>
EMAIL_TO=info@rankrise.in
```

---

## 4. Admin login (for the /admin dashboard)

Already set up for you — run `npm run seed` in `server/` to create these:

| Email | Password | Note |
|---|---|---|
| `meghaphanikumar@gmail.com` | `ChandraCM` | original admin |
| `info@rankrise.in` | `Rankrise@143` | added per your request |

⚠️ **Change both of these passwords once you're actually live** — they're
written in plain text in this project's `seed.js` and in this document, so
treat them as temporary/setup-only, not permanent production passwords.
Change a password any time via the normal "Forgot password" flow on the
site, or instantly with:
```bash
cd server
node fix-user.js info@rankrise.in "YourNewRealPassword"
```

---

## 5. Analytics & Ads — already filled in, nothing to do here

| Value | Currently set to |
|---|---|
| Google Analytics 4 | `G-QS6RR4EMN7` |
| Google Ads ID | `AW-18267384799` |
| Contact conversion label | `pPJgCO6uvNkcEN_XyIZE` |
| Google Tag Manager | `GTM-KFP8R7FR` |

**Lives in:** `client/.env` (already done). See `READYTOGO.md` Part 2 if
you want to add more conversion labels later (call, WhatsApp, admission,
Document).

---

## 6. Domain / CORS

- [ ] Your live domain(s): `_________________________________________________`
      (e.g. `https://rankrise.in,https://www.rankrise.in` — comma-separated,
      no trailing slash, no spaces)

**Goes into:** `server/.env` → `CLIENT_URL=`

---

## 7. Test-drive hosting (Part 5 of READYTOGO.md) — fill in as you go

- [ ] GitHub repo URL: `_________________________________________________`
- [ ] Render backend URL: `https://___________________________.onrender.com`
- [x] Live site URL: `https://rankrise.in`

---

## 8. Real hosting — Hostinger

- [ ] SSH username: `_________________________________________________`
- [ ] SSH host/IP: `_________________________________________________`
- [ ] SSH port (default 22 unless hPanel says otherwise): `_______`
      (hPanel → Advanced → SSH Access — has all three of the above)
- [ ] Does "Setup Node.js App" exist on your plan? (Part 6, Step 0)
      → Yes, found it under: `_________________________________________________`
      → No → using Option B (split hosting)

---

Once every box above is filled in and copied to its `.env` file, you're
ready to follow `READYTOGO.md` start to finish without stopping to look
anything up.


