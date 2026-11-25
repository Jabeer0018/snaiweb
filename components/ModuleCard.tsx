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
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-elevated/60 hover:shadow-[0_8px_30px_rgba(139,92,246,0.08)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-subtle">
            <BookOpen className="h-3.5 w-3.5 text-accent" />
            Module {String(module.order).padStart(2, "0")}
          </span>
          <span className="rounded border border-border bg-elevated px-2 py-0.5 text-xs text-muted">
            {module.topics.length} {module.topics.length === 1 ? "topic" : "topics"}
          </span>
        </div>
        <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors">
          {module.title}
        </h3>
        {module.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
            {module.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
        <span className="truncate">
          {module.source ? `Source: ${module.source}` : "Course module"}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-foreground group-hover:text-accent transition-colors">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
