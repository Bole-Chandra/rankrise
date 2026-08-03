# Local Dev: "Form not submitting / no email" checklist

## What was actually broken (fixed in this pass)
Your server was crashing the moment MongoDB failed to connect for **any**
reason (`process.exit(1)` in `server/config/db.js`). Locally, the #1 cause
of that is your current IP not being whitelisted in MongoDB Atlas yet. Once
the server crashed, every form submission failed instantly — not because of
the form or the email, but because there was no backend process running at
all to send the request to.

Fixed: the server now **stays running** even if MongoDB isn't connected yet,
retries automatically in the background, and any form submission attempted
while it's down now fails **instantly with a clear message** instead of
hanging for 10+ seconds and then failing anyway.

## How to confirm it's fixed for you
1. Run `npm run dev` from the project root.
2. **Watch the server terminal window carefully** — look for one of:
   - `✅ MongoDB Atlas Connected` — good, everything should work now.
   - `❌ MongoDB connection failed: ...` followed by retry attempts — this
     tells you exactly why (see below).
3. Try submitting a form. The error banner on the page will now say either:
   - *"Could not reach the server..."* → the backend process isn't running
     at all (check the terminal — did `npm run server` crash or error out?).
   - *"Database is not connected yet..."* → the backend IS running, but
     MongoDB isn't connected (see the terminal for the specific reason).
   - The actual validation/save error from the server, if something else
     is wrong.

## If it says MongoDB isn't connecting
This is almost always one of these two things:

**1. Your IP isn't whitelisted in Atlas (most common for local dev)**
- Go to [cloud.mongodb.com](https://cloud.mongodb.com) → your project →
  **Network Access** (left sidebar) → **Add IP Address**
- Click **"Add Current IP Address"** — this adds whatever IP you're on
  right now.
- ⚠️ Your home/office IP changes periodically (most ISPs assign dynamic
  IPs) — if it worked before and suddenly stopped, this is usually why.
  For local development only, you can instead add `0.0.0.0/0` ("allow
  access from anywhere") to stop needing to update this — just don't do
  that for a production database with real user data on it long-term.

**2. Wrong username/password/cluster in `MONGODB_URI`**
- Check `server/.env` → `MONGODB_URI` against MongoDB Atlas → your
  cluster → **Connect** → **Drivers** → copy the connection string again,
  and make sure `<password>` was actually replaced with your real DB user
  password (not your Atlas login password — these are different).

## About the email — one important thing to know
Every form submission **saves to MongoDB first**, then *separately* tries
to send a notification email. If MongoDB isn't connected, the submission
fails before it ever gets to the email step — so "no email showing up" was
very likely just a downstream symptom of the MongoDB issue above, not a
separate email bug. Once you see `✅ MongoDB Atlas Connected` in the
terminal and a successful submission, check:
- `server/.env` → `EMAIL_USER` / `EMAIL_PASS` are filled in (not the
  placeholder values)
- The server terminal for `✅ SMTP ready via ...` on startup, or a `⚠️ SMTP
  connection could not be verified` warning with the specific reason
- Your spam folder, the first time

If MongoDB is connected and a submission succeeds (you'll see it appear in
the Admin Dashboard) but no email arrives, that's a distinct, separate
issue from what was reported here — let me know and I'll dig into the SMTP
side specifically.
