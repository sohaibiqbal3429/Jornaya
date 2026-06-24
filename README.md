# Alpha Legal Intake Admin Panel

## Required environment variables (`.env.local`)

```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=alpha-legal-intake
ADMIN_EMAIL=admin@alphalegalintake.com
ADMIN_PASSWORD=your_strong_password
AUTH_SECRET=long_random_secret_for_signing_sessions
NEXT_PUBLIC_LEADID_SCRIPT_SRC=https://create.lidstatic.com/campaign/your-campaign-key.js?snippet_version=2&f=reset
NEXT_PUBLIC_LEADID_NOSCRIPT_URL=https://create.leadid.com/noscript.gif?lac=your-lac&lck=your-campaign-key&snippet_version=2
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

## Safe deployment notes

- Configure all env variables in your hosting provider dashboard.
- Add the exact LeadID/Jornaya script URL from your LeadID account to `NEXT_PUBLIC_LEADID_SCRIPT_SRC`.
- Add the matching noscript image URL to `NEXT_PUBLIC_LEADID_NOSCRIPT_URL`.
- Rotate any previously exposed credentials before deploying.
- Use HTTPS in production so secure cookies are fully protected.
