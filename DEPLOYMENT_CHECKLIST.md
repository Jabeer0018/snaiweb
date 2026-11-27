# DEPLOYMENT & ROLLBACK CHECKLIST — SNAI COURSE

## Pre-Deployment Gate (Must Complete Before Pushing)
1. **Configure Google OAuth:** Add `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET` in Vercel Project Settings -> Environment Variables (and `.env.local` for local verification).
2. **Verify Real OAuth Login Locally:** Sign in with a real Google account at `http://localhost:3000/login`, verify redirect back to intended route, test Sign Out, and test `/profile` progress isolation.
3. **Verify Vercel Build:** Confirm `npm run typecheck && npm run lint && npm run build` passes cleanly with zero errors.
4. *(Optional)* **Apple Sign-In:** Only add `AUTH_APPLE_ID` and `AUTH_APPLE_SECRET` once an Apple Developer Services ID and ES256 client secret are ready.

> **Warning:** Do NOT push mandatory authentication to the production branch before `AUTH_SECRET` and `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are set in Vercel, or students will see the configuration-required screen instead of the Google login button.

## Rollback Plan
1. **Immediate Vercel Rollback:** In Vercel Dashboard -> **Deployments**, promote the previous verified deployment to Production (zero-downtime instant rollback).
2. **Git Rollback:** `git revert <commit-hash>` on the auth commit and push to restore pre-auth access if an OAuth provider outage occurs.
