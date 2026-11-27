"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { ModuleMeta } from "@/lib/types";
import { getReadingProgress } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface ContextualModuleSidebarProps {
  modules: ModuleMeta[];
}

export function ContextualModuleSidebar({
  modules,
}: ContextualModuleSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const sync = () => {
      const map: Record<string, boolean> = {};
      for (const item of getReadingProgress()) {
        if (item.completed) map[item.id] = true;
      }
      setCompletedIds(map);
    };
    sync();
    window.addEventListener("snai-storage-change", sync);
    return () => window.removeEventListener("snai-storage-change", sync);
  }, []);

  const currentModule = modules.find((m) =>
    pathname.startsWith(`/notes/${m.slug}`)
  );

  if (!currentModule) return null;

  return (
    <aside
      aria-label="Module lessons"
      className="hidden w-64 shrink-0 lg:block"
    >
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-5 overflow-y-auto border-r border-border pr-5">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all modules
        </Link>

        {/* Module Switcher */}
        <div className="space-y-1.5">
          <label
            htmlFor="module-switcher"
            className="block font-mono text-[10px] uppercase tracking-wider text-subtle"
          >
            Switch Module
          </label>
          <select
            id="module-switcher"
            value={currentModule.slug}
            onChange={(e) => router.push(`/notes/${e.target.value}`)}
            className="w-full border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-foreground focus:outline-none"
          >
            {modules.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* Full Unwrapped Module Title */}
        <div className="space-y-1 border-t border-border pt-4">
          <p className="font-mono text-[11px] text-subtle">
            MODULE {String(currentModule.order).padStart(2, "0")}
          </p>
          <Link
            href={`/notes/${currentModule.slug}`}
            className="block text-sm font-semibold leading-snug text-foreground hover:underline"
          >
            {currentModule.title}
          </Link>
        </div>

        {/* Current-Module Lessons Only (Full Wrapped Titles) */}
        <nav aria-label="Lessons in this module" className="space-y-1">
          {currentModule.topics.map((topic, idx) => {
            const href = `/notes/${currentModule.slug}/${topic.slug}`;
            const active = pathname === href;
            const done = Boolean(
              completedIds[`${currentModule.slug}/${topic.slug}`]
            );

            return (
              <Link
                key={topic.slug}
                href={href}
                className={cn(
                  "flex items-start gap-2 border-l-2 px-2.5 py-2 text-xs leading-snug transition-colors",
                  active
                    ? "border-foreground bg-surface font-medium text-foreground"
                    : "border-transparent text-muted hover:bg-surface/60 hover:text-foreground"
                )}
              >
                {done ? (
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-subtle" />
                )}
                <span>
                  <span className="mr-1 font-mono text-[10px] text-subtle">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {topic.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
