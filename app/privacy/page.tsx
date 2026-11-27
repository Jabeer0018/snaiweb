import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
  description: "How SNAI Course handles authentication and student learning data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      <header className="space-y-2 border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-subtle">
          Privacy &amp; Data Minimization
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Privacy Policy
        </h1>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-muted">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">
            1. Why Authentication Is Required
          </h2>
          <p>
            SNAI Course requires sign-in so only authorized students can access
            course lessons, interactive laboratories, command guides, and mock
            examinations, and so each student&apos;s progress stays separated on
            shared devices.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">
            2. Minimum Profile Information Collected
          </h2>
          <p>
            We authenticate exclusively through official OAuth 2.0 / OpenID
            Connect providers (Google and, when configured, Apple) requesting
            only basic identity scopes (<code>openid email profile</code>):
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Provider-scoped account identifier (used to isolate your progress).</li>
            <li>Display name (optional fallback if hidden by Apple).</li>
            <li>Email address (including Apple Private Relay emails).</li>
            <li>Profile avatar URL, when supplied by the provider.</li>
          </ul>
          <p>
            We never request access to Gmail, Google Drive, Contacts, Photos,
            Calendar, or unrelated account data, and we do not run third-party
            advertising trackers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">
            3. How Progress &amp; Mock Test Data Are Stored
          </h2>
          <p>
            Session state is stored in an encrypted, <code>HttpOnly</code>{" "}
            session cookie. Your lesson completions, bookmarks, playground
            progress, and mock examination history are stored locally in your
            browser, scoped strictly to your signed-in account ID. Progress does
            not automatically synchronize across different devices or browsers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">
            4. Sign-Out &amp; Data Deletion
          </h2>
          <p>
            You can sign out at any time from your account menu, and you can
            permanently clear your account&apos;s locally stored progress and
            examination history from the{" "}
            <Link href="/settings" className="text-foreground underline">
              Settings
            </Link>{" "}
            page.
          </p>
        </section>
      </div>
    </div>
  );
}
