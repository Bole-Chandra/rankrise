# READY TO GO — Rankrise Site

Everything below is a checklist. Follow it top to bottom and you'll go from
this folder to a fully live, fully tracked site on Hostinger with nothing
left half-done.

---

## PART 1 — What changed in analytics/tracking just now

| What | Old | New |
|---|---|---|
| Google Ads Conversion ID | `AW-11479262272` (old account) | **`AW-18267384799`** (your new account) |
| Google Analytics 4 | `G-QS6RR4EMN7` | **kept the same** (unchanged) |
| Ads conversion label — "Contact" | — | **`pPJgCO6uvNkcEN_XyIZE`** (wired to the site's lead/enquiry forms) |
| Google Tag Manager | not installed | **`GTM-KFP8R7FR`** installed (container for `rankrise.in`) |

All of this lives in **`client/.env`** — nothing is hardcoded in the page
code, so you (or anyone) can change any ID later without touching a single
line of React.

> ⚠️ **You have two GTM containers** — `GTM-KFP8R7FR` (for `rankrise.in`)
> and `GTM-5NM44VCC` (for `www.rankrise.in`). I used `GTM-KFP8R7FR` because
> the site's canonical URL is the non-www `https://rankrise.in`. If your
> domain actually serves as `www.rankrise.in`, open `client/.env` and change
> `VITE_GTM_ID` to `GTM-5NM44VCC` instead, then rebuild (Part 4).

> ⚠️ **Don't add GA4 or Google Ads tags a second time inside the GTM
> container's own web UI.** This site already fires both directly (that's
> the block above GTM in `index.html`). Adding them again inside GTM would
> double-count every single event and conversion in your reports. Use GTM
> only if you later want to add something this site doesn't already cover
> (e.g. a Hotjar snippet, another ad platform's pixel).

### What's actually being tracked right now (already wired into every page)
This wasn't just IDs dropped in — every one of these already fires live,
site-wide, with no extra work needed:

- **Every page view** (GA4 + Meta), correctly re-fired on every in-app
  navigation (this is a single-page app, so this needed to be done manually
  — it has been)
- **Enquiry form submitted** → GA4 `generate_lead` event + Google Ads
  conversion (`pPJgCO6uvNkcEN_XyIZE`) + Meta `Lead` event
- **Admission form submitted** (Admissions page) → GA4 `admission_submitted`
  event + Meta `Lead` event (add `VITE_GOOGLE_ADS_LABEL_ADMISSION` in
  `.env` once you create that conversion action in Ads, to also count it
  there — see Part 2)
- **Every "Call Now" click**, anywhere on the site, with which phone number
  was clicked (Primary / Secondary / Footer Line 1 / Footer Line 2)
- **Every WhatsApp button click**
- **Brochure PDF download** (Contact page)
- **YouTube channel link click**
- **Form started** (first keystroke) vs **form submitted** — so you can see
  drop-off, not just completions

You do not need to add tracking calls to any more pages — this is already
live across Home, all Course pages, all College pages, Admissions, Contact,
the floating WhatsApp/call widgets, the top info bar, and the footer.

---

## PART 2 — Add more Google Ads conversion actions (optional, 5 min each)

Right now only **one** conversion action (Contact) is wired to a real label.
The code already has slots ready for four more — you just need to create
the conversion action in Ads and paste its label in:

1. Go to **Google Ads → Goals → Conversions → + New conversion action**
2. Create one for each you want (e.g. "Admission form", "Phone call",
   "WhatsApp click", "Brochure download")
3. On each one, open **Tag setup → Use Google tag** — you'll see something
   like `send_to: 'AW-18267384799/AbC-D1234efGH'`. Copy just the part
   **after the slash**.
4. Paste it into the matching line in `client/.env`:
   ```
   VITE_GOOGLE_ADS_LABEL_ADMISSION=<label you copied>
   VITE_GOOGLE_ADS_LABEL_CALL=<label you copied>
   VITE_GOOGLE_ADS_LABEL_WHATSAPP=<label you copied>
   VITE_GOOGLE_ADS_LABEL_BROCHURE=<label you copied>
   ```
5. Rebuild (Part 4) and redeploy. That's it — the site-side code for all
   four is already written and waiting, it just needs the label to turn on.

---

## PART 3 — How to verify tracking is actually working (do this before trusting any reports)

Do these checks **before** you rely on any dashboard — it takes 5 minutes
and catches 100% of setup mistakes immediately instead of you finding out
in 2 weeks that nothing was tracked.

### A. Google Tag Assistant (checks GTM + GA4 + Ads all at once)
1. Install the **[Tag Assistant Companion](https://chromewebstore.google.com/detail/tag-assistant-companion/kejbdjndbnbjgmefkgdddjlbokphdefk)** Chrome extension
2. Go to **tagassistant.google.com**, click **Add domain**, enter your live
   site URL, click **Connect**
3. Your site opens in a new tab — click around it (visit a page, submit the
   enquiry form, click "Call Now")
4. Back in Tag Assistant, you should see `GTM-KFP8R7FR`, `G-QS6RR4EMN7`, and
   `AW-18267384799` all listed as **firing**, with each event you triggered
   shown in the timeline

### B. GA4 Realtime (confirms Analytics specifically)
1. **Google Analytics → Reports → Realtime**
2. Open your live site in another tab/device, click around
3. You should see yourself as an active user within ~10 seconds, and each
   page view / event should appear in the event count list on that same
   screen

### C. Google Ads conversion status (confirms Ads specifically)
1. **Google Ads → Goals → Summary**
2. Submit the Contact/enquiry form on your live site once, as a real test
3. It can take a few hours to show as "Recording conversions" the very
   first time (this is normal, Google's own delay) — but the tag firing
   itself (check A) confirms it's wired correctly well before that

### D. Browser console, quickest sanity check of all
Open your live site, press **F12 → Console**, and type:
```js
window.dataLayer
```
You should see an array with multiple entries, including `gtm.js`, `js`,
`config` (twice — once for GA4, once for Ads). If this array is empty or
`undefined`, the tags aren't loading — check that `client/.env` actually
made it into your production build (Part 4) and wasn't left out during
upload.

---

## PART 4 — Build the site for production (do this every time you change `.env` or any code)

```bash
cd client
npm install
npm run build
```

This produces `client/dist/` — a folder of plain HTML/CSS/JS with your
`.env` values baked directly in. **You must rebuild after any `.env`
change** — editing `.env` alone does nothing to an already-built `dist/`
folder.

---

## PART 5 — Test drive first: Vercel + Render (free, do this before touching Hostinger)

This is the smart order: get the whole thing working end-to-end on free
throwaway URLs first, catch every mistake here where nothing is public or
paid for yet, *then* repeat the same steps for real on Hostinger with
confidence. Skip straight to Part 6 if you'd rather go straight to
production, but this is worth the 20 minutes.

### Step 1 — Push the code to GitHub (needed for both Vercel and Render)
```bash
cd new1
git init
git add .
git commit -m "Initial commit"
```
Create a new empty repo on [github.com/new](https://github.com/new), then:
```bash
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git
git branch -M main
git push -u origin main
```
> Double-check `server/.env` and `client/.env` are **not** committed —
> `.gitignore` in this project already excludes them, so this should be
> automatic. Verify with `git status` before pushing; if you see `.env`
> listed as a file to be committed, stop and fix `.gitignore` first.

### Step 2 — Backend on Render
1. [render.com](https://render.com) → sign up/log in → **New → Web Service**
2. Connect the GitHub repo you just pushed
3. Fill in:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
4. **Environment** tab → add these (fill in your real values):
   ```
   MONGODB_URI=<PASTE-YOUR-ATLAS-CONNECTION-STRING-HERE>
   JWT_SECRET=<PASTE-A-LONG-RANDOM-STRING-HERE>
   CLIENT_URL=<PASTE-YOUR-VERCEL-URL-HERE-ONCE-YOU-HAVE-IT>
   NODE_ENV=production
   EMAIL_HOST=smtp.hostinger.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=info@rankrise.in
   EMAIL_PASS=<PASTE-THAT-MAILBOX-PASSWORD-HERE>
   EMAIL_TO=info@rankrise.in
   ```
5. Click **Create Web Service** — first deploy takes a few minutes. You'll
   get a URL like:
   ```
   https://<PLACEHOLDER-render-service-name>.onrender.com
   ```
   Copy this — you need it in Step 3.

   > Free Render services "sleep" after 15 minutes of no traffic and take
   > ~30-60 seconds to wake back up on the next request. Fine for testing;
   > for production either upgrade to a paid Render instance or (as
   > planned) move to Hostinger for the real launch.

### Step 3 — Frontend on Vercel
1. Locally: `cd client && echo "VITE_API_URL=<PASTE-YOUR-RENDER-URL-FROM-STEP-2>" >> .env`
2. [vercel.com](https://vercel.com) → sign up/log in → **Add New → Project**
   → import the same GitHub repo
3. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
4. **Environment Variables** — add every one of these (fill in your real
   values — same ones as your local `client/.env`):
   ```
   VITE_API_URL=<PASTE-YOUR-RENDER-URL-FROM-STEP-2>
   VITE_GA_MEASUREMENT_ID=G-QS6RR4EMN7
   VITE_GOOGLE_ADS_ID=AW-18267384799
   VITE_GOOGLE_ADS_LABEL_LEAD=pPJgCO6uvNkcEN_XyIZE
   VITE_GTM_ID=GTM-KFP8R7FR
   ```
5. Click **Deploy**. You'll get a URL like:
   ```
   https://<PLACEHOLDER-vercel-project-name>.vercel.app
   ```

### Step 4 — Connect them
Go back to Render → your web service → **Environment** → update
`CLIENT_URL` to your real Vercel URL from Step 3 → save (this redeploys
automatically). This is what allows the frontend to actually call the API
without the browser blocking it as cross-origin.

### Step 5 — Test everything on these throwaway URLs
Open your Vercel URL and go through the **entire** Part 3 verification
checklist plus:
- [ ] Sign up as a new student, verify email works, log in
- [ ] Submit the enquiry form → check it shows up in the admin dashboard
- [ ] Log in as admin (`info@rankrise.in` / the password from Part 6 →
      "Create your real accounts", once you've run `npm run seed` against
      this Render-connected database)
- [ ] Tag Assistant / GA4 Realtime / `window.dataLayer` all show activity

Once everything above passes, you've proven the *code* works end-to-end —
any problems left at the Hostinger stage will be hosting-configuration
issues specifically, not app bugs, which makes them much faster to debug.

---

## PART 6 — Hosting on Hostinger, start to finish

### Step 0 — Find out what your plan actually supports (do this first)

Business shared hosting doesn't always include Node.js app hosting — that
feature (Hostinger runs Node through **Passenger**, which lets Apache proxy
requests to your app) is only on certain plan tiers. If you searched
Advanced and didn't see "Setup Node.js App", check these before assuming
it's missing:

1. In hPanel, use the **search bar at the top** and type `Node` — sometimes
   it's filed under a different menu than Advanced depending on your hPanel
   version.
2. Check if it's per-**website** rather than account-wide: hPanel →
   **Websites** → click into `rankrise.in` specifically → look for a
   Node.js option inside that site's own dashboard, not the main account
   Advanced menu.
3. If you truly can't find it anywhere, SSH in and run:
   ```bash
   which node
   node -v
   which pm2
   ```
   If `node` exists, you *can* run a Node process manually over SSH — but
   on standard shared hosting, that process usually can't be reached from
   the public internet, because shared hosting only exposes Apache/
   LiteSpeed on ports 80/443, not arbitrary app ports. A process you start
   over SSH will also typically get killed when your SSH session ends,
   unless the host specifically supports persistent app processes (which is
   exactly what "Setup Node.js App" provides — it's not just convenience,
   it's what actually keeps your app alive and reachable).

**If Step 0 confirms Node hosting genuinely isn't available on your plan**,
you have two real options — pick one:

- **Option A (simplest): upgrade** to a Hostinger plan that includes it —
  their dedicated Node.js Hosting plans, or Cloud/VPS hosting (VPS gives
  you full root SSH access and you can run Node + PM2 directly, no
  Passenger needed).
- **Option B (no upgrade needed): split hosting.** Host the frontend
  (static files) right here on your current Business plan via SSH — that
  part works on any shared hosting, no restrictions. Host the backend
  (the actual Express API + database connection) on a separate service
  built for persistent Node apps. Full steps below.

---

### Option A — Single Node.js app (if Setup Node.js App IS available)

#### Step 1 — Set up MongoDB Atlas (if not already done)
1. [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → free tier
   cluster is fine
2. **Network Access** → Add IP Address → `0.0.0.0/0` (allow from anywhere)
3. **Database Access** → create a database user, copy the connection string
   (`mongodb+srv://...`)

#### Step 2 — Build the frontend
```bash
cd client
npm install
npm run build
```

#### Step 3 — Upload
Upload the **entire `new1/` folder** to Hostinger — **except** any
`node_modules` folder. Make sure `client/dist/` (just built) is included.
Since you have SSH, `rsync`/`scp` works well for this, or hPanel's File
Manager / FTP.

#### Step 4 — Create the Node.js app in hPanel
1. hPanel → **Setup Node.js App → Create Application**
2. **Application root**: point it at the `server/` folder you uploaded
3. **Application startup file**: `server.js`
4. **Node.js version**: 18 or newer (20 LTS recommended)
5. **Domain**: `rankrise.in` (or whichever domain/subdomain you're using)

#### Step 5 — Set environment variables
In that same Node.js app panel, add these (or upload `server/.env` directly
— check `server/.env.example` for the full list):
```
MONGODB_URI=<your Atlas connection string>
JWT_SECRET=<a long random string — never reuse the example one>
CLIENT_URL=https://rankrise.in,https://www.rankrise.in
NODE_ENV=production
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=info@rankrise.in
EMAIL_PASS=<that mailbox's password>
EMAIL_TO=info@rankrise.in
```

#### Step 6 — Install and start
1. In the Node.js app panel, click **Run NPM Install** (or SSH:
   `cd server && npm install`)
2. Click **Restart** on the app

`server/app.js` automatically serves `client/dist/` when it sits next to
it, so this one app handles both the site and its API.

#### Step 7 — Point your domain
If the Node app was created directly on `rankrise.in`, this is already
done. Otherwise, hPanel → Domains → confirm `rankrise.in` points here.

---

### Option B — Split hosting over SSH (frontend here, backend elsewhere)

Use this if Step 0 confirmed there's genuinely no way to run a persistent
Node app on your plan.

#### Step 1 — Set up MongoDB Atlas
Same as Option A, Step 1 above.

#### Step 2 — Deploy the backend to a Node-hosting service
Pick one — all have free or cheap tiers and deploy straight from a git
repo or a zip, no server management:
- **[Render.com](https://render.com)** — easiest for a first deploy;
  "New Web Service" → connect your repo or upload → set **Root Directory**
  to `server`, **Build Command** to `npm install`, **Start Command** to
  `node server.js` → add the same environment variables as Option A Step 5
  → deploy. You'll get a URL like `https://rankrise-api.onrender.com`.
- **[Railway.app](https://railway.app)** — same idea, similarly simple.
- A **Hostinger VPS** — if you'd rather stay entirely inside Hostinger,
  a VPS plan gives full root SSH access and no Passenger requirement; you
  install Node + [PM2](https://pm2.keymetrics.io) yourself
  (`npm install -g pm2`, then `pm2 start server.js --name rankrise-api`,
  `pm2 save`, `pm2 startup`) and open port 80/443 directly (or put Nginx in
  front of it — standard VPS setup, not shared hosting).

Whichever you pick, note the live backend URL — you need it in the next
step.

#### Step 3 — Build the frontend pointed at that backend URL
```bash
cd client
echo "VITE_API_URL=https://<your-backend-url>" >> .env
npm install
npm run build
```

#### Step 4 — Upload the built frontend to your Business plan over SSH
This is the part your current plan handles fine — it's just static files.
```bash
# from your local machine, inside client/
scp -r dist/* your-username@your-server-ip:public_html/
# or, if rsync is available (faster for re-deploys):
rsync -avz dist/ your-username@your-server-ip:public_html/
```
(Find your SSH username/host/port in hPanel → Advanced → SSH Access.)

#### Step 5 — CORS
On the backend host (Render/Railway/VPS), set `CLIENT_URL` to
`https://rankrise.in,https://www.rankrise.in` — this is what allows your
Hostinger-hosted frontend to actually talk to the API without being
blocked by the browser.

#### Step 6 — Point your domain
Your domain already points at Hostinger — nothing to change there, since
the frontend is what's serving `rankrise.in` directly.

---

### Final steps — same for either option

#### Create your real accounts
```bash
cd server
npm run seed
```
This creates a working admin login and prints it to the console — **change
that password immediately** after your first real login, since the default
is publicly documented. It also prints every user currently in your
database, so you can always confirm what accounts really exist.

If any account you registered yourself won't log in with the password you
set, this fixes it directly and proves the fix worked before telling you
it's done:
```bash
node fix-user.js youremail@example.com "YourNewPassword"
```

#### Final pre-launch checklist
Go through this on the **live** URL, not localhost, before calling it done:

- [ ] Homepage loads with no console errors (F12 → Console, should be empty
      other than normal browser noise)
- [ ] `window.dataLayer` check from Part 3D shows entries
- [ ] Tag Assistant (Part 3A) shows all three tags firing
- [ ] Enquiry form submits successfully and shows in your database (admin
      dashboard)
- [ ] Admission form submits successfully
- [ ] Login works for a real student/teacher account (see "Create your real
      accounts" just above if not)
- [ ] `/sitemap.xml` and `/robots.txt` load correctly
- [ ] HTTPS is active (Hostinger's free SSL — hPanel → SSL, should be
      auto-issued for the domain)

---

## Where things live, if you need to change anything later

| To change... | Edit this file |
|---|---|
| Any tracking ID (GA4, Ads, Meta, GTM) or conversion label | `client/.env` |
| What each tracked event actually does/sends | `client/src/utils/analytics.js` |
| Phone/WhatsApp number labels shown in reports | `client/src/config/tracking.js` |
| Server environment (DB, email, JWT) | `server/.env` |
| Full deployment reference (this file is the fast path; that one has more
  detail on the split-frontend/backend alternative) | `DEPLOYMENT.md` |

Remember: **any `client/.env` change requires `npm run build` again**
(Part 4) before it shows up on the live site — the built `dist/` folder is
a frozen snapshot, not something that reads `.env` live.
