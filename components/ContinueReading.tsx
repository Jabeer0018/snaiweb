"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { getReadingProgress, ReadingProgressItem } from "@/lib/storage";

export function ContinueReading() {
  const [items, setItems] = useState<ReadingProgressItem[]>([]);

  useEffect(() => {
    setItems(getReadingProgress().slice(0, 3));
    const sync = () => setItems(getReadingProgress().slice(0, 3));
    window.addEventListener("snai-storage-change", sync);
    return () => window.removeEventListener("snai-storage-change", sync);
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-w-0 rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-subtle">
          <Clock className="h-3.5 w-3.5" />
          Continue Reading
        </div>
        <p className="mt-2 text-sm text-muted">
          Your reading history will appear here once you open a course topic.
          Progress is saved locally in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-subtle">
          <Clock className="h-3.5 w-3.5 text-accent" />
          Continue Reading
        </div>
        <Link
          href="/saved"
          className="text-xs text-muted hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="mt-3 divide-y divide-border">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex items-center justify-between gap-3 py-2.5 first:pt-1 last:pb-1"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  {item.title}
                </p>
                {item.completed && (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                )}
              </div>
              <p className="truncate text-xs text-subtle">{item.moduleTitle}</p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
          </Link>
        ))}
      </div>
    </div>
  );
}
