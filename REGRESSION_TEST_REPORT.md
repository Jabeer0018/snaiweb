# REGRESSION TEST REPORT — SNAI COURSE

## 1. Build, Typecheck & Lint Verification
- `npm run typecheck` (`tsc --noEmit`): **PASS** (0 errors)
- `npm run lint` (`next lint`): **PASS** (0 warnings, 0 errors)
- `npm run build` (`next build`): **PASS** (147/147 static/dynamic routes compiled cleanly, `Middleware 87.9 kB`)

## 2. Theme Architecture & Code Block Fix
- **Root Cause Fixed:** Removed `@tailwindcss/typography` `.prose pre` dark background bleed (`#27272a`) by isolating `CodeBlock.tsx` with `not-prose border-code-border bg-code-bg` + `text-code-fg` and dedicated `:root` / `.dark` semantic CSS tokens in `styles/globals.css` and `tailwind.config.ts`.
- **Hover Contrast Fix:** Fixed `MockExamRunner.tsx` `Retry Incorrect` button (`hover:text-accent-fg` instead of `hover:text-white`).
- **Theme Persistence & Sync:** Verified Light <-> Dark theme toggling on `/login`, `/privacy`, and `/terms` across page reloads (`data-theme` and `.dark` class persisted cleanly with 0 console errors).

## 3. Authentication & Route Protection Verification (HTTP + Browser)
- **Protected Routes (`307` Redirect to `/login` when signed out):**
  - `/` -> `/login`
  - `/notes/06-os-filesystem/filesystem-permissions-path` -> `/login?callbackUrl=%2Fnotes%2F06-os-filesystem%2Ffilesystem-permissions-path`
  - `/commands/gcc` -> `/login?callbackUrl=%2Fcommands%2Fgcc`
  - `/mock-tests/mock-10` -> `/login?callbackUrl=%2Fmock-tests%2Fmock-10`
  - `/profile` -> `/login?callbackUrl=%2Fprofile`
  - `/settings` -> `/login?callbackUrl=%2Fsettings`
- **Public Routes (`200` with `course_leak=False`):**
  - `/login`, `/privacy`, `/terms`, `/api/auth/providers`
- **Desktop (`1440x900`) & Mobile (`375x812`) UI:**
  - `/login`: Split-screen desktop, single-column mobile, `0px` horizontal overflow, `0` console errors, honest `OAuth Provider Configuration Required` notice when `AUTH_GOOGLE_ID` / `AUTH_APPLE_ID` are unset (no fake login buttons, no non-functional Apple button).
  - `/privacy` & `/terms`: Clean rendering in Light & Dark themes, `0px` overflow, `0` console errors.

## 4. Remaining Provider Verification Required (Owner Action)
- **Google OAuth:** End-to-end live sign-in with a real Google account is **pending** your `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env.local` (and Vercel Environment Variables).
- **Apple Sign-In:** Currently disabled/hidden because `AUTH_APPLE_ID` and `AUTH_APPLE_SECRET` (requiring an Apple Developer Program membership) are not configured.
- **Deployment Status:** Local preview running at `http://localhost:3000`; nothing has been committed or pushed to GitHub/Vercel.
