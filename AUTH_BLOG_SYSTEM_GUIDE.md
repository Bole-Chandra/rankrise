# Student/Teacher Accounts & Blog Review System

## What this is
A full account system separate from the admin panel, so students and teachers can sign up, log in, and submit articles that get reviewed before appearing on the public blog.

**Access point:** one clean login/signup bar at the top of `/blog` — logs into the student/teacher account system, with a small "Admin Login" link alongside it for you. The admin panel itself is unchanged, still at `/admin/login`.

## Roles & rules

| Role | Can sign up freely? | Can log in immediately? | What they can do |
|---|---|---|---|
| **Student** | Yes | Yes, once email is verified | Submit articles for review |
| **Teacher** | Yes | **No** — needs admin approval first | Submit articles for review (once approved) |
| **Admin** | No (seeded only) | Yes | Everything, plus approve teachers and review articles |

Every account (student or teacher, whether via Google or email/password) must verify their email before logging in. Teachers additionally cannot log in — at all, this is an account-level gate, not just a blog-posting gate — until an admin approves them from the Dashboard's new **Teacher Approvals** tab.

## Blog review workflow

1. A logged-in, approved student/teacher writes an article from their **Dashboard** (`/dashboard` → "+ New Article").
2. It's saved with status **Pending** and does **not** appear on the public `/blog` page yet.
3. You review it in the admin Dashboard's new **Blog Review** tab — preview the full content, then Approve or Reject (with an optional reason shown to the author).
4. Once Approved, it appears on `/blog` immediately, exactly like a post you write directly as admin.
5. The author sees the live status (Pending / Approved / Rejected) on their own Dashboard at all times.

Blog posts you write directly in the existing **Blogs** admin tab are unaffected — they publish immediately as before, no review step, since that's you.

## Setting up Google Sign-In (optional — everything works without it)

The "Sign in with Google" button only appears once configured. Without it, email/password signup + OTP verification still works fully.

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → create/select a project
2. APIs & Services → Credentials → **Create Credentials → OAuth Client ID**
3. Application type: **Web application**
4. Authorized JavaScript origins: add your real domain (`https://rankrise.in`) and, for local testing, `http://localhost:5173`
5. Copy the Client ID (ends in `.apps.googleusercontent.com`)
6. Set it in **both**:
   - `server/.env` → `GOOGLE_CLIENT_ID=...`
   - `client/.env` → `VITE_GOOGLE_CLIENT_ID=...`
7. Rebuild the client.

## How OTP email verification works

Reuses the exact same email system already set up (Brevo or SMTP — see `ANALYTICS_SEO_GUIDE.md` / `LOCAL_DEV_TROUBLESHOOTING.md`). A 6-digit code is emailed for:
- Verifying a new signup's email
- Resetting a forgotten password

Codes expire after 10 minutes and lock out after 5 wrong attempts (then a new code must be requested) — this is enforced server-side, not just in the UI.

## A real security fix made along the way

Before this change, the admin panel's `protect` middleware only checked "is *any* valid login token present" — it didn't check *which* account. That was fine when the only accounts that existed were admins, but the moment students/teachers could also get valid tokens, that same middleware would have let them into every admin-only endpoint (managing admissions, gallery, other users' data, etc.) — a real privilege-escalation bug waiting to happen.

Fixed: `protect` now explicitly requires `role === 'admin'`. Every existing admin route (admissions, enquiries, gallery, videos, direct blog CRUD) needed zero code changes to pick up this fix, since they already all imported `protect` — it was quietly upgraded underneath them.

## API endpoints added

```
POST   /api/auth/register              — student/teacher signup
POST   /api/auth/verify-otp            — verify email with OTP
POST   /api/auth/resend-otp            — resend verification/reset OTP
POST   /api/auth/login                 — student/teacher/admin login (role-aware)
POST   /api/auth/google                — Google Sign-In
POST   /api/auth/forgot-password       — request a reset OTP
POST   /api/auth/reset-password        — reset password with OTP
GET    /api/auth/me                    — current user's profile

GET    /api/auth/teachers/pending      — [admin] pending teacher signups
GET    /api/auth/teachers              — [admin] all teachers
PUT    /api/auth/teachers/:id/approve  — [admin]
PUT    /api/auth/teachers/:id/reject   — [admin]

POST   /api/blogs/submit               — [student/teacher] submit an article
GET    /api/blogs/mine                 — [any logged-in user] their own submissions
GET    /api/blogs/pending              — [admin] review queue
PUT    /api/blogs/:id/approve          — [admin]
PUT    /api/blogs/:id/reject           — [admin]
```

## Testing it locally
1. Make sure MongoDB is connected and email is configured (`npm run test:email` in `server/`).
2. Go to `/blog` → click **Sign Up** → try both Student and Teacher.
3. Check your email for the OTP, verify.
4. Student: should be able to log in immediately and submit an article.
5. Teacher: login will be blocked with "awaiting admin approval" until you approve them from the admin Dashboard's **Teacher Approvals** tab.
6. Submit an article from `/dashboard` → check it shows "Pending" there, and appears in the admin Dashboard's **Blog Review** tab → Approve it → confirm it now appears on the public `/blog` page and the author's dashboard shows "Approved".
