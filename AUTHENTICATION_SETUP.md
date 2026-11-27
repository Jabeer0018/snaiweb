# AUTHENTICATION SETUP GUIDE — SNAI COURSE

SNAI Course uses **Auth.js v5 (`next-auth@beta`)** with encrypted JWT/JWE `HttpOnly` session cookies and Next.js `middleware.ts` route protection.

## Required Environment Variables (`.env.example`)
- `AUTH_SECRET` — 32+ byte random secret (`openssl rand -base64 32`)
- `AUTH_GOOGLE_ID` — Google OAuth 2.0 Web Client ID
- `AUTH_GOOGLE_SECRET` — Google OAuth 2.0 Web Client Secret
- `AUTH_APPLE_ID` *(optional)* — Apple Services ID (only when Apple Developer Program is configured)
- `AUTH_APPLE_SECRET` *(optional)* — Signed JWT client secret generated from your Apple `.p8` key

> **Important:** Unconfigured providers are **automatically hidden** on `/login`. Do not deploy mandatory auth to production until at least Google OAuth is configured and verified.

---

## Part A — Google OAuth Setup Guide (14 Steps)

1. Open **Google Cloud Console** (`https://console.cloud.google.com/`).
2. Select your project or click **New Project** (e.g., `SNAI-Course-Auth`).
3. Go to **APIs & Services -> OAuth consent screen** (or **Google Auth Platform -> Branding / Audience**).
4. Choose **External** (unless using a private university Google Workspace domain -> **Internal**), fill App Name (`SNAI Course`), User Support Email, and Developer Contact Email.
5. Under **Scopes**, verify ONLY non-sensitive identity scopes are included: `openid`, `email`, `profile` (never request Gmail, Drive, Contacts, or Calendar).
6. Under **Test users** (while Publishing Status is *Testing*), add your own Google account and test student emails.
7. Go to **Clients -> Create Client -> Web application**.
8. Name it `SNAI Course Web`.
9. Under **Authorized JavaScript origins**, add:
   - Local: `http://localhost:3000`
   - Production: `https://snai-web.vercel.app` *(or your exact Vercel production domain)*
10. Under **Authorized redirect URIs**, add the exact Auth.js v5 callback routes:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://snai-web.vercel.app/api/auth/callback/google`
11. Click **Create**, then copy the **Client ID** (`AUTH_GOOGLE_ID`) and **Client Secret** (`AUTH_GOOGLE_SECRET`).
12. Add them to `/Users/jabeer/LAB - AI/.env.local` (already gitignored) alongside `AUTH_SECRET`, and run `npm run dev` or `npm run build && npm run start` to test at `http://localhost:3000/login`.
13. In **Vercel Project Settings -> Environment Variables**, add `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET` for **Production** and **Preview**.
14. When ready for all students, change OAuth consent screen Publishing Status from **Testing** to **In Production** and verify a full sign-in on the live domain.

---

## Part B — Sign in with Apple Setup Guide

**Prerequisites:** An active **Apple Developer Program** membership (\$99/year). Without this membership, Apple credentials cannot be created and Apple Sign-In remains cleanly hidden.

1. In Apple Developer (**Certificates, Identifiers & Profiles -> Identifiers**), create an **App ID** with the **Sign in with Apple** capability enabled.
2. Create a **Services ID** (e.g., `com.snai.course.web`) — this value becomes `AUTH_APPLE_ID`.
3. Enable **Sign in with Apple** on the Services ID, click **Configure**, add your verified **Web Domain** (`snai-web.vercel.app`, no `https://`) and **Return URL**:
   - `https://snai-web.vercel.app/api/auth/callback/apple`
   *(Note: Apple requires HTTPS return URLs even for dev testing via an HTTPS tunnel).*
4. Under **Keys**, create a new Key with **Sign in with Apple** enabled, download the `.p8` private key once, and note the **Key ID** and **Team ID**.
5. Generate the ES256 JWT `AUTH_APPLE_SECRET` signed with the `.p8` key (maximum lifetime 6 months; rotate before expiration) and store `AUTH_APPLE_ID` and `AUTH_APPLE_SECRET` in Vercel Environment Variables / `.env.local`.
