# KoziBnB

KoziBnB is a Next.js concierge and guest-registration platform for short-term
rental operators. It includes a bilingual marketing site, contact leads,
property-owner accounts, property-specific guest registration links, secure
document uploads, and an internal admin dashboard.

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and enter the Supabase and Brevo values.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Start the app with `npm run dev`.

The Supabase storage bucket is intentionally private. Never expose
`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, or `BREVO_API_KEY` to the browser.

## Required Vercel environment variables

Add every variable from `.env.example` in **Project Settings → Environment
Variables**. For production, set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS
domain. Add the same domain plus `/auth/callback` to the Supabase Auth redirect
URL allowlist.

After changing environment variables, redeploy the project. The standard Vercel
build command is `npm run build`; no custom output directory is required.

## Quality checks

Run these before deployment:

```bash
npm run lint
npx tsc --noEmit
npm run build
```
