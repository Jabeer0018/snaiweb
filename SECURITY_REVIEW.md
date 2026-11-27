# SECURITY REVIEW — SNAI COURSE

## 1. Authentication & Session Architecture
- **Library:** Auth.js v5 (`next-auth@beta`) with official Google and conditional Apple OAuth 2.0 / OIDC providers.
- **Session Cookies:** Encrypted JWE session stored in an `HttpOnly`, `SameSite=Lax` cookie (`Secure` in HTTPS production), 7-day `maxAge`.
- **OAuth Protections:** Built-in Auth.js PKCE, `state`, and OIDC `nonce` validation + CSRF protection on sign-in/sign-out POST actions.

## 2. Server-Side Route & Payload Protection
- `middleware.ts` enforces authentication on all educational routes (`/`, `/notes/**`, `/commands/**`, `/papers/**`, `/playground/**`, `/mock-tests/**`, `/mcqs/**`, `/revision/**`, `/resources/**`, `/saved/**`, `/profile/**`, `/settings/**`).
- Public routes are strictly limited to `/login`, `/api/auth/**`, `/privacy`, `/terms`, `/_next/**`, `/diagrams/**`, and `/favicon.ico`.
- `app/layout.tsx` checks `await auth()` server-side and passes empty `modules` and `searchDocuments` arrays when unauthenticated so protected course metadata and search indexes are never serialized into `/login` HTML/RSC payloads.

## 3. Open Redirect & Account Isolation
- `sanitizeCallbackUrl()` in `auth.config.ts` and `callbacks.redirect` ensure `callbackUrl` must be a relative path starting with `/` (rejecting `//`, external URLs, and `/login` redirect loops).
- Account IDs are provider-namespaced (`${account.provider}:${account.providerAccountId}`), preventing automatic cross-provider account linking solely by email address.
- Local progress (`bookmarks`, `readingProgress`, `mockExams`) is scoped by `user.id` in `localStorage`, preventing cross-student leakage on shared devices, with explicit opt-in migration for pre-login anonymous data.

## 4. Credential Audit
- Verified `git ls-files` contains zero `.env` or secret files.
- `.env.example` contains placeholders only; `.env.local` is excluded by `.gitignore`.
- No `NEXT_PUBLIC_` variables hold OAuth secrets.
