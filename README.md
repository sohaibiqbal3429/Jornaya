# Alpha Legal Intake Admin Panel

## Required environment variables (`.env.local`)

```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=alpha-legal-intake
ADMIN_EMAIL=admin@alphalegalintake.com
ADMIN_PASSWORD=your_strong_password
AUTH_SECRET=long_random_secret_for_signing_sessions
```

> Keep secrets only in `.env.local` (never commit them).

## Run locally

```bash
pnpm install
pnpm dev
```

Open:
- Website: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin`
- Admin dashboard: `http://localhost:3000/admin/dashboard`

## Features implemented

- Protected admin route with login/session cookie and middleware gating.
- Login rate limiting and generic invalid credential errors.
- Unified form submission API (`/api/forms/submit`).
- Admin APIs for listing, updating, deleting submissions.
- Live admin table refresh every 8 seconds.
- Filters/search, detail modal, status actions, and CSV export.
- Official Jornaya/LeadiD browser script integration using campaign key `f3982147-9948-8ae0-9315-8ceb32269185`.
- Canonical and mirrored `universal_leadid` hidden fields with polling, validation, submit waiting, and `window.LeadiD.reInit()` recovery.
- LeadID debug page at `/leadid-debug`.
- Replay verification worker flow using Playwright to obtain a second verification token without overwriting the original token.

## Safe deployment notes

- Configure all env variables in your hosting provider dashboard.
- Rotate any previously exposed credentials before deploying.
- Use HTTPS in production so secure cookies are fully protected.
- If you want the Playwright verification worker to run in production, the runtime must have Chromium available for Playwright.
