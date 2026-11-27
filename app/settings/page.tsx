import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/settings");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2 border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-subtle">
          Preferences &amp; Account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
      </header>

      <section className="flex flex-wrap items-center justify-between gap-4 border border-border bg-surface p-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Appearance Theme
          </h2>
          <p className="mt-1 text-xs text-muted">
            Switch between Light, Dark, and System preference without losing
            progress.
          </p>
        </div>
        <ThemeToggle />
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 border border-border bg-surface p-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Learning Data &amp; Privacy
          </h2>
          <p className="mt-1 text-xs text-muted">
            View or clear your account-scoped local progress, or read our
            privacy disclosures.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/profile"
            className="border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground hover:border-border-strong"
          >
            Manage Progress
          </Link>
          <Link
            href="/privacy"
            className="border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground hover:border-border-strong"
          >
            Privacy Policy
          </Link>
        </div>
      </section>
    </div>
  );
}
