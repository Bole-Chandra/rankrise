# 🚀 Rankrise — Full Deployment Guide for Hostinger

> Complete, step-by-step guide to put the Rankrise website live at **https://rankrise.in** on Hostinger.
> Follow the steps in order. Everything below was tested against the current codebase.

> 📦 **A ready-to-upload ZIP already exists:** `C:\Users\Chandra\Desktop\rankrise\rankrise-deploy.zip`
> (~17 MB). It contains `client/` (with the built `dist/`), `server/`, and this guide — no `node_modules`.
>
> 👉 **On Business SHARED hosting (your plan): upload the ZIP via File Manager and configure the
> Node.js app — jump straight to Section 5.** Sections 2–4 are only for VPS or code changes.

---

## 0. What you are deploying (read this first)

The project is a **single Node.js application**. The Express backend (`server/`) does three jobs in production:

1. Serves the **REST API** (`/api/...`)
2. Serves the **uploaded files** (images, videos, PDF/DOCX documents) from `/uploads`
3. Serves the **pre-built React website** (`client/dist/`) and all its pages (SPA fallback)

That means **you only deploy ONE app on ONE port** — no separate frontend hosting, no CORS problems.

### Folder structure (exactly what the `rank` folder contains)

```
rank/                                ← upload THIS folder to your server
├── client/
│   ├── dist/                        ← the React site (already built — section 2)
│   └── src/, public/, index.html    ← source, kept so you can rebuild later
└── server/
    ├── server.js                    ← entry point (start this)
    ├── app.js
    ├── .env                         ← production secrets — edit before launch (section 4.4)
    ├── uploads/                     ← auto-created; images/videos/documents live here
    └── node_modules/                ← created by `npm install` (not included)
```

> ⚠️ The app **requires** `client/dist` to sit **next to** `server/` (i.e. as siblings: `client/` and `server/`).
> The `rank` folder already has this exact layout — upload it as-is.

---

## 1. Prerequisites

| Item | What you need |
|------|---------------|
| Hostinger plan | **Business / Startup shared hosting** — supports Node.js apps. VPS also works (Section 4) |
| MongoDB Atlas | Free tier cluster — **already connected** in this project |
| Domain | `rankrise.in` (your Business plan points it at Hostinger automatically) |
| A mailbox | For form-notification emails (Hostinger email or Gmail App Password) |
| The ZIP | `C:\Users\Chandra\Desktop\rankrise\rankrise-deploy.zip` — ready to upload |

> ❗ **Do not deploy the old copy** in `Downloads\rankrise\new\client`. Use only the
> `rankrise-deploy.zip` (or the `rank` folder / `C:\Users\Chandra\Desktop\rankrise\rankrise\new`).

---

## 2. Build the website (ALREADY DONE — only needed if you change the code)

The `rank` folder already contains the built site at `rank/client/dist/`. **You can skip this section**
and go straight to section 3.

If you later change the React code, rebuild it on your PC and copy the new `dist/` into `rank/client/`:

```powershell
cd C:\Users\Chandra\Desktop\rankrise\rankrise\new\client
npm install
npm run build
# then copy the fresh build into the upload folder:
Copy-Item -Recurse -Force "dist" "C:\Users\Chandra\Desktop\rankrise\rank\client\dist"
```

Verify it finished with `✓ built in …`.

> The client `.env` file already contains your Analytics/Ads/GTM IDs, which get baked into the build.
> Leave `VITE_API_URL` **unset** so the site uses same-origin `/api` calls (this is what the current setup does).

---

## 3. MongoDB Atlas — allow the server to connect

Your Atlas URI is already in `server/.env`. The only thing to check is **Network Access**:

1. Log in at **cloud.mongodb.com** → your project → **Network Access**.
2. Make sure an IP whitelist entry exists for **`0.0.0.0/0`** (Allow access from anywhere)
   — or add your Hostinger server's public IP if you prefer strict security.
3. If you changed the password in Atlas, update `MONGODB_URI` in `server/.env` to match.

---

## 4. Option A — Hostinger VPS / Cloud (only if you have a VPS)

> On Business shared hosting? **Skip this section and use Section 5** (ZIP upload).
> This VPS path is for Cloud/VPS plans: Node 20 LTS, PM2 (auto-restart), Nginx (reverse proxy + SSL).

### 4.1 Connect and install Node.js

```bash
ssh root@<your-server-ip>
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git build-essential
node -v    # should print v20.x
npm -v
```

### 4.2 Upload the project

Upload the **contents of the `rank` folder** so that `client/` and `server/` sit directly inside
`/var/www/rankrise/`. From your PC, using an SFTP tool (WinSCP/FileZilla) or `scp`:

```bash
# Upload the CONTENTS of the "rank" folder → client/ and server/ land under /var/www/rankrise/
scp -r "C:\Users\Chandra\Desktop\rankrise\rank\client" root@<ip>:/var/www/rankrise/
scp -r "C:\Users\Chandra\Desktop\rankrise\rank\server" root@<ip>:/var/www/rankrise/
scp  "C:\Users\Chandra\Desktop\rankrise\rank\README-DEPLOY.md" root@<ip>:/var/www/rankrise/
```

Result (all commands below assume this exact layout):

```
/var/www/rankrise/
├── client/dist/     ← the built site
├── server/          ← the backend (node_modules created in 4.3)
└── README-DEPLOY.md
```

> `node_modules` and `.git` are already excluded from the `rank` folder.

### 4.3 Install backend dependencies

```bash
cd /var/www/rankrise/server
npm install --omit=dev
```

### 4.4 Create the production environment file

```bash
cd /var/www/rankrise/server
nano .env
```

Paste and adapt (values below are the real ones — **change the JWT secret**):

```ini
PORT=5000
NODE_ENV=production

# MongoDB Atlas — keep your existing connection string
MONGODB_URI=mongodb+srv://rankriseinstitute_db_user:jdJyxb0lJ9IiYf0Z@rankrise.bfjmxpc.mongodb.net/rankrise?retryWrites=true&w=majority&appName=Rankrise

# JWT secret — MUST be 32+ characters (the app refuses to start in production otherwise)
JWT_SECRET=rankrise_super_secret_jwt_2024_change_this_in_production

# Client URL(s) allowed by CORS — your real domain
CLIENT_URL=https://rankrise.in,https://www.rankrise.in

# Email (Gmail — the account actually in use; needs a 16-char App Password, not your normal password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=rankriseinstitute@gmail.com
EMAIL_PASS=uylcywpyrqemhitd
EMAIL_TO=rankriseinstitute@gmail.com

# Email (Hostinger mailbox alternative)
# EMAIL_HOST=smtp.hostinger.com
# EMAIL_PORT=465
# EMAIL_SECURE=true
# EMAIL_USER=info@rankrise.in
# EMAIL_PASS=YourMailboxPassword
# EMAIL_TO=info@rankrise.in

# Google Sign-In (optional — leave blank to hide the button)
GOOGLE_CLIENT_ID=
```

Save with `Ctrl+O`, `Enter`, then `Ctrl+X`.

### 4.5 Run the app with PM2 (auto-restart, stays alive)

```bash
npm install -g pm2
cd /var/www/rankrise/server
pm2 start server.js --name rankrise
pm2 save
pm2 startup   # run the command it prints (sets up auto-start on reboot)
```

Check it works locally first:

```bash
curl http://localhost:5000/api            # → JSON with "database": "connected"
curl http://localhost:5000/               # → your HTML site
curl http://localhost:5000/sitemap.xml    # → sitemap with 19+ URLs
```

### 4.6 Nginx — point your domain to the app

Create the site config:

```bash
nano /etc/nginx/sites-available/rankrise
```

```nginx
server {
    listen 80;
    server_name rankrise.in www.rankrise.in;

    client_max_body_size 120M;        # allow video uploads (100MB + overhead)

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 600s;       # large video uploads need this
    }

    # Let uploads stream instead of being buffered (faster downloads)
    location /uploads/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
}
```

Enable it and add SSL:

```bash
ln -s /etc/nginx/sites-available/rankrise /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

apt install -y certbot python3-certbot-nginx
certbot --nginx -d rankrise.in -d www.rankrise.in
```

Now **https://rankrise.in** is live.

### 4.7 Point DNS (hPanel)

In Hostinger hPanel → **Domains** → `rankrise.in` → **DNS**:

```
A   @          → <your VPS IP>
A   www        → <your VPS IP>
```

Also create a Hostinger mailbox `info@rankrise.in` (hPanel → Emails) and use those credentials in `.env`.

---

## 5. Option B — Business SHARED hosting via ZIP (YOUR PLAN) ✅

This is the flow for **Business/Startup shared hosting**: upload the ZIP in File Manager,
extract it, then create the Node.js app in hPanel. Hostinger runs `npm install`, starts the app,
and connects your domain + free SSL automatically. **No SSH, Nginx or PM2 needed.**

### 5.1 Upload the ZIP

1. Log in to **hPanel** → **Files → File Manager**.
2. In the left column open your domain's folder, e.g. `home > <your-username> > domains > rankrise.in`.
   (Hostinger often shows it directly as `/domains/rankrise.in/`.)
3. Click **Upload** (top bar) → select
   `C:\Users\Chandra\Desktop\rankrise\rankrise-deploy.zip` → wait for the upload to finish.
4. Right-click the uploaded `rankrise-deploy.zip` → **Extract**.

   You should now see a `client/` folder and a `server/` folder inside `/domains/rankrise.in/`.

> The ZIP already contains the built website (`client/dist/`), the backend (`server/`), and
> this guide. `node_modules` is NOT included — Hostinger installs it for you in step 5.3.

### 5.2 Configure the Node.js app (hPanel)

1. Go to **Websites** → `rankrise.in` → open the **Node.js** section.
2. Fill in the settings:
   - **Node.js version**: `20.x` LTS (the app needs Node 18+, use 20)
   - **Application root**: the `server` folder, e.g. `/home/<your-username>/domains/rankrise.in/server`
   - **Application startup file**: `server.js`
   - If the panel shows a **port** for the app, note it (you'll use it below).
3. In the **Environment variables** box add these (they override `server/.env`):

   ```text
   NODE_ENV=production
   CLIENT_URL=https://rankrise.in
   PORT=      ← the port shown in the panel (or delete this line and it uses 5000)
   ```

   `MONGODB_URI` and `JWT_SECRET` are already in `server/.env` (included in the ZIP) — no need to
   re-add them, but you can paste them here too for clarity:

   ```text
   MONGODB_URI=mongodb+srv://rankriseinstitute_db_user:jdJyxb0lJ9IiYf0Z@rankrise.bfjmxpc.mongodb.net/rankrise?retryWrites=true&w=majority&appName=Rankrise
   JWT_SECRET=rankrise_super_secret_jwt_2024_change_this_in_production
   ```

   And the email config **actually in use** (Gmail — already in `server/.env`, no action needed,
   but you can paste it here too):

   ```text
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=rankriseinstitute@gmail.com
   EMAIL_PASS=uylcywpyrqemhitd
   EMAIL_TO=rankriseinstitute@gmail.com
   ```

### 5.3 Install & start

1. Click **Install** (or **Run**) in the Node.js panel. Hostinger runs `npm install` in the
   application root and starts `server.js`.
2. The domain `rankrise.in` is now automatically served by your Node app, with free SSL.

### 5.4 Verify

Open in your browser and check (also see Section 7):

```
https://rankrise.in/             → home page
https://rankrise.in/api          → {"database": "connected"}
https://rankrise.in/sitemap.xml  → 19+ URLs
https://rankrise.in/admin/login  → admin login works
```

> **Shared-hosting notes**
> - Uploads (images / videos / PDFs / DOCX) are stored under `server/uploads/` inside your hosting
>   and persist across restarts — back them up with your site files (Section 9).
> - Very large video uploads (≈100 MB) may time out on shared hosting. If that becomes a problem,
>   switch to the VPS option (Section 4) or reduce video file sizes.
> - No PM2 needed — Hostinger keeps the Node app running.

---

## 6. First-time admin account (required for the Admin panel)

> ✅ **Most likely already done** — the same MongoDB Atlas database already has the admin accounts
> seeded (done during setup). Just log in at `https://rankrise.in/admin/login`.

If the database is empty or you need a new admin, seed it. On **shared hosting** use SSH
(Business plan includes it: hPanel → **Advanced → SSH Access**) or run it in the Node.js app root:

```bash
# VPS:
cd /var/www/rankrise/server
npm run seed

# SHARED hosting via SSH (paths may differ — check your File Manager path):
cd ~/domains/rankrise.in/server
npm run seed
```

This creates (use these to log in at `https://rankrise.in/admin/login`):

| Role | Email | Password |
|------|-------|----------|
| Admin | `meghaphanikumar@gmail.com` | `ChandraCM` |
| Admin | `info@rankrise.in` | `Rankrise@143` |
| Student | `student@rankrise.in` | `Student@123` |
| Teacher | `teacher@rankrise.in` | `Teacher@123` |

> 🔒 **Security:** the admin passwords are public defaults. After your first login,
> change them (or register your own admin and delete the seeded accounts) before launch.

From the Admin Dashboard you can now manage:
**Admissions · Enquiries · Photo Gallery · Video Gallery · Blogs · Course Documents (PDF/DOCX for Exam Pattern / Syllabus) · Blog Review · Teacher Approvals**

---

## 7. After deploying — verify everything is live

Run each of these and confirm the result:

| Check | URL | Expect |
|-------|-----|--------|
| Site loads | `https://rankrise.in/` | Home page with banner |
| SEO sitemap | `https://rankrise.in/sitemap.xml` | 19 static URLs + blog posts |
| Robots | `https://rankrise.in/robots.txt` | Allows crawlers + AI bots, points to sitemap |
| AI file | `https://rankrise.in/llms.txt` | Institute summary (GEO) |
| API health | `https://rankrise.in/api` | `"database": "connected"` |
| Canonical | View page source on any page | `<link rel="canonical" href="https://rankrise.in/...">` |
| Admin | `https://rankrise.in/admin/login` | Login works |
| Uploads | After uploading a document in Admin → Course Documents | File downloads at `/uploads/documents/...` |

**Then, in Google Search Console:**
1. Add your property as **Domain** (`rankrise.in`).
2. Submit `https://rankrise.in/sitemap.xml`.
3. Verify ownership (DNS TXT or the HTML tag method — paste the code into `client/.env` as
   `VITE_GOOGLE_SITE_VERIFICATION`, then rebuild + redeploy the client, or use the DNS method to avoid a redeploy).
4. Same for **Bing Webmaster Tools**.

---

## 8. Updating the site later

After making changes, rebuild and re-upload:

```powershell
# 1. On your PC — rebuild the website
cd C:\Users\Chandra\Desktop\rankrise\rankrise\new\client
npm run build
Copy-Item -Recurse -Force "dist" "C:\Users\Chandra\Desktop\rankrise\rank\client\dist"

# 2. Re-create the ZIP (or upload just the changed folders)
Compress-Archive -Path "C:\Users\Chandra\Desktop\rankrise\rank\client","C:\Users\Chandra\Desktop\rankrise\rank\server" -DestinationPath "C:\Users\Chandra\Desktop\rankrise\rankrise-deploy.zip" -Force
```

**On shared hosting (your plan):**
1. File Manager → upload the new ZIP → **Extract** (choose "Replace / Overwrite" when asked).
2. hPanel → Websites → Node.js → click **Restart** (or Stop → Run).
3. Hard-refresh your site.

**On VPS:**
```bash
# upload changed files (or git pull), then:
pm2 restart rankrise --update-env
pm2 save
```

---

## 9. Backups (important)

- **Database**: MongoDB Atlas → **Backup** (enable free weekly snapshots in Atlas).
- **Uploads**: the `server/uploads/` folder holds all images, videos and PDFs — back it up or it's
  lost forever.
  - **VPS**: `/var/www/rankrise/server/uploads`
  - **Shared hosting**: `~/domains/rankrise.in/server/uploads`
  - Easiest: use hPanel **Files → File Manager → select `uploads` → Download** regularly.

VPS cron example:

```bash
crontab -e
# daily backup of uploads, keep 14 days
0 3 * * * tar -czf /root/backups/uploads-$(date +\%F).tar.gz -C /var/www/rankrise/server/uploads . && find /root/backups -name "uploads-*" -mtime +14 -delete
```

---

## 10. Troubleshooting

| Problem | Fix |
|---------|-----|
| App won't start in production | Check `server/.env` + panel env vars: `NODE_ENV=production`, `JWT_SECRET` ≥ 32 chars, `MONGODB_URI`, `CLIENT_URL` all set. The server logs exactly which one is missing. |
| "MongoDB Connection error" | Network Access in Atlas must include `0.0.0.0/0` (or the server IP). |
| Blank page / API 404 on shared hosting | `client/dist` must sit **next to** `server/` (both inside the domain folder) and the Node.js **Application root** must point to the `server` folder. Re-extract the ZIP. |
| Node.js panel shows "Invalid application root" | The root path must be the absolute path to `server/` — copy it from File Manager's address bar. |
| App starts but site shows "502 / Node app not running" | In hPanel → Node.js click **Restart**. Check the startup file is exactly `server.js`. |
| 413 Request Entity Too Large on upload | VPS: add `client_max_body_size 120M;` to Nginx (section 4.6). Shared hosting: keep video files under ~100 MB. |
| Video upload times out | VPS: raise `proxy_read_timeout` (600s) in Nginx. Shared hosting: upload via SSH or reduce file size. |
| Email not sent | Emails are best-effort — forms still save to the DB. Check `EMAIL_*`; Hostinger needs `EMAIL_HOST=smtp.hostinger.com`, `EMAIL_PORT=465`, `EMAIL_SECURE=true`. |
| Site down after VPS reboot | `pm2 startup` + `pm2 save` were both run? (VPS only — shared hosting stays up on its own.) |
| www → redirect loop (VPS) | Make sure both `rankrise.in` and `www.rankrise.in` are in Nginx `server_name` + certbot. |
| Stale old site showing | You deployed the `Downloads\rankrise` copy by mistake — use `rankrise-deploy.zip` only. |
| Can't log in to Admin | The seeded admins exist in Atlas — if the DB was recreated, run `npm run seed` (Section 6). |

---

## 11. Summary of the current stack

| Part | Tech |
|------|------|
| Frontend | React 19 + Vite 8 + React Router 7 + Bootstrap 5 |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas (cloud) |
| Auth | JWT (admin) + OTP email + Google Sign-In |
| Files | Multer uploads → `server/uploads/` (images→WebP, videos, PDF/DOCX docs) |
| SEO | Per-page Helmet, canonical, JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt` |
| Security | Helmet, rate limiting, CORS allowlist, input sanitization, admin-role middleware |

**Deploy (shared hosting) → ZIP upload → Node.js app in hPanel → done.**
**Deploy (VPS) → single Node app → PM2 → Nginx → HTTPS → done.**

