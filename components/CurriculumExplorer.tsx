"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { ModuleMeta } from "@/lib/types";
import { getReadingProgress, ReadingProgressItem } from "@/lib/storage";

interface CurriculumExplorerProps {
  modules: ModuleMeta[];
}

export function CurriculumExplorer({ modules }: CurriculumExplorerProps) {
  const [progress, setProgress] = useState<ReadingProgressItem[]>([]);

  useEffect(() => {
    const sync = () => setProgress(getReadingProgress());
    sync();
    window.addEventListener("snai-storage-change", sync);
    return () => window.removeEventListener("snai-storage-change", sync);
  }, []);

  const latest = progress[0];
  const completedSet = new Set(
    progress.filter((p) => p.completed).map((p) => p.id)
  );

  return (
    <div className="space-y-8">
      {/* Continue Learning Banner */}
      {latest && (
        <Link
          href={latest.href}
          className="group flex items-center justify-between gap-4 border border-border-strong bg-accent px-5 py-4 text-accent-fg transition-colors hover:bg-accent-hover"
        >
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider opacity-75">
              Continue Learning
            </p>
            <p className="mt-0.5 text-sm font-semibold sm:text-base">
              {latest.moduleTitle} / {latest.title}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}

      {/* Full-Title Module Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((mod) => {
          const total = mod.topics.length;
          const doneCount = mod.topics.filter((t) =>
            completedSet.has(`${mod.slug}/${t.slug}`)
          ).length;
          const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
          const firstHref =
            mod.topics.length > 0
              ? `/notes/${mod.slug}/${mod.topics[0].slug}`
              : `/notes/${mod.slug}`;

          return (
            <div
              key={mod.slug}
              className="flex flex-col justify-between border border-border bg-surface p-5 transition-colors hover:border-border-strong"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-subtle">
                    <BookOpen className="h-3.5 w-3.5 text-foreground" />
                    Module {String(mod.order).padStart(2, "0")}
                  </span>
                  <span className="border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted">
                    {total} {total === 1 ? "lesson" : "lessons"}
                  </span>
                </div>

                {/* Full unwrapped title */}
                <h2 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
                  <Link href={`/notes/${mod.slug}`} className="hover:underline">
                    {mod.title}
                  </Link>
                </h2>

                {mod.description && (
                  <p className="text-sm leading-relaxed text-muted">
                    {mod.description}
                  </p>
                )}

                {mod.topics.length > 0 && (
                  <ul className="space-y-1 border-t border-border pt-2.5 text-xs text-muted">
                    {mod.topics.map((t) => (
                      <li key={t.slug} className="flex items-center gap-1.5">
                        <span className="text-subtle">•</span>
                        <Link
                          href={`/notes/${mod.slug}/${t.slug}`}
                          className="hover:text-foreground hover:underline"
                        >
                          {t.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4 space-y-2.5 border-t border-border pt-3">
                <div className="flex items-center justify-between font-mono text-[11px] text-subtle">
                  <span>
                    Progress: {doneCount}/{total} ({pct}%)
                  </span>
                  <Link
                    href={firstHref}
                    className="inline-flex items-center gap-1 font-sans text-xs font-medium text-foreground hover:underline"
                  >
                    {doneCount > 0 ? "Resume" : "Start Module"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="h-1 w-full bg-background">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
