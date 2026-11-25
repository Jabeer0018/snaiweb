import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  hint?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  hint,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface/60 px-6 py-12 text-center",
        className
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-elevated text-muted">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      {hint && (
        <p className="mt-3 rounded-md border border-border bg-elevated px-3 py-1.5 font-mono text-xs text-subtle">
          {hint}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center rounded-md border border-border bg-elevated px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
