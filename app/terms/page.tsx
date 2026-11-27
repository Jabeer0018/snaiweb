import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of Use for the SNAI Course learning platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      <header className="space-y-2 border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-subtle">
          Platform Guidelines
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Terms of Use
        </h1>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-muted">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">
            1. Educational Purpose
          </h2>
          <p>
            SNAI Course is an interactive digital textbook, command reference,
            and practice examination platform for Systems and Artificial
            Intelligence coursework.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">
            2. Practice Mock Examinations
          </h2>
          <p>
            The mock examinations on this platform are practice assessments
            designed for learning and self-evaluation—not an official proctored
            university examination environment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">
            3. Acceptable Use
          </h2>
          <p>
            Students must sign in with their own Google or Apple account and
            must not attempt to bypass authentication, scrape protected course
            content for redistribution, or disrupt platform availability.
          </p>
        </section>
      </div>
    </div>
  );
}
