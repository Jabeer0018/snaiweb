import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { ModuleMeta } from "@/lib/types";

interface ModuleCardProps {
  module: ModuleMeta;
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link
      href={`/notes/${module.slug}`}
      className="group flex min-w-0 flex-col justify-between border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-elevated"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-subtle">
            <BookOpen className="h-3.5 w-3.5 text-foreground" />
            Module {String(module.order).padStart(2, "0")}
          </span>
          <span className="border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted">
            {module.topics.length} {module.topics.length === 1 ? "topic" : "topics"}
          </span>
        </div>
        <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
          {module.title}
        </h3>
        {module.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
            {module.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex min-w-0 items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted">
        <span className="min-w-0 flex-1 truncate">
          {module.source ? `Source: ${module.source}` : "Course module"}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 font-medium text-foreground">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
