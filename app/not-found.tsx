import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        The requested topic, command, or page could not be found in the course
        hub.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-elevated"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>
    </div>
  );
}
