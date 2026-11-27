import Link from "next/link";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { signIn } from "@/auth";
import {
  isAppleConfigured,
  isGoogleConfigured,
  sanitizeCallbackUrl,
} from "@/auth.config";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Sign In",
  description: "Sign in to access SNAI Course.",
};

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Sign-in was cancelled or denied. You can try again below.",
  Configuration:
    "Authentication provider configuration is incomplete on this server.",
  OAuthCallbackError:
    "The authentication callback could not be verified. Please try again.",
  OAuthSignin: "Could not start the sign-in flow with the provider.",
  Verification: "Your sign-in link or token has expired. Please try again.",
  Default: "Authentication failed. Please try signing in again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = sanitizeCallbackUrl(params.callbackUrl);
  const errorKey = params.error;
  const errorMessage = errorKey
    ? ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.Default
    : null;

  const hasAnyProvider = isGoogleConfigured || isAppleConfigured;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* Left Column: Auth Controls */}
        <div className="flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg font-bold tracking-tight text-foreground">
              SNAI.
            </span>
            <ThemeToggle />
          </div>

          <div className="mx-auto w-full max-w-sm space-y-6 py-12">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-wider text-subtle">
                Student Access
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Welcome to SNAI.
              </h1>
              <p className="text-sm leading-relaxed text-muted">
                Your complete learning platform for systems and artificial
                intelligence.
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs leading-relaxed text-rose-500"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3">
              {isGoogleConfigured && (
                <form
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: callbackUrl });
                  }}
                >
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-3 border border-border-strong bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </form>
              )}

              {isAppleConfigured && (
                <form
                  action={async () => {
                    "use server";
                    await signIn("apple", { redirectTo: callbackUrl });
                  }}
                >
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-3 bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <svg
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
                    </svg>
                    <span>Continue with Apple</span>
                  </button>
                </form>
              )}

              {!hasAnyProvider && (
                <div className="space-y-2 border border-amber-500/30 bg-amber-500/5 p-4 text-xs leading-relaxed text-foreground">
                  <p className="font-semibold text-amber-500">
                    OAuth Provider Configuration Required
                  </p>
                  <p className="text-muted">
                    No OAuth provider credentials are currently configured on
                    this server. Add{" "}
                    <code className="border border-border bg-elevated px-1 py-0.5 font-mono text-[11px]">
                      AUTH_GOOGLE_ID
                    </code>{" "}
                    and{" "}
                    <code className="border border-border bg-elevated px-1 py-0.5 font-mono text-[11px]">
                      AUTH_GOOGLE_SECRET
                    </code>{" "}
                    in{" "}
                    <code className="border border-border bg-elevated px-1 py-0.5 font-mono text-[11px]">
                      .env.local
                    </code>{" "}
                    (or Vercel Environment Variables) and restart the server to
                    enable Google Sign-In.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 border-t border-border pt-4 text-xs text-subtle">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
              <p>
                Identity-only sign-in (name, email, profile photo). We never
                request Gmail, Drive, Contacts, or Calendar access.
              </p>
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-xs text-subtle">
            <span>SNAI Course</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Use
              </Link>
            </div>
          </footer>
        </div>

        {/* Right Column: Monochromatic Technical Editorial Visual */}
        <div className="hidden flex-col justify-between border-l border-border bg-surface bg-grid-subtle p-12 lg:flex lg:p-16">
          <div className="font-mono text-xs uppercase tracking-widest text-subtle">
            System &amp; AI Essentials
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-foreground">
              Learn.
              <br />
              Understand.
              <br />
              Master.
            </h2>

            <div className="space-y-3 border border-border bg-background p-6 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2 text-subtle">
                <span>STACK ARCHITECTURE</span>
                <span>C00 — C17</span>
              </div>
              <div className="space-y-2 pt-1 text-muted">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">01 · Shell &amp; CLI</span>
                  <span>66 Commands</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">02 · OS, Binary &amp; Git</span>
                  <span>8 Interactive Labs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">03 · AI &amp; Research Papers</span>
                  <span>10 Foundational Papers</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">04 · Mock Examinations</span>
                  <span>10 Tests · 350 Questions</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-subtle">
            Authenticated University Learning Platform · Light, Dark &amp; System Themes
          </p>
        </div>
      </div>
    </div>
  );
}
