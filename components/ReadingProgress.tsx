"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import {
  getReadingProgress,
  recordTopicVisit,
  toggleTopicCompleted,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  id: string;
  title: string;
  moduleTitle: string;
  href: string;
}

export function ReadingProgress({
  id,
  title,
  moduleTitle,
  href,
}: ReadingProgressProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    recordTopicVisit({ id, title, moduleTitle, href });
    const progress = getReadingProgress();
    const current = progress.find((p) => p.id === id);
    setCompleted(Boolean(current?.completed));
  }, [id, title, moduleTitle, href]);

  function handleToggle() {
    const next = toggleTopicCompleted(id);
    setCompleted(next);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        completed
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground"
      )}
    >
      {completed ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Completed</span>
        </>
      ) : (
        <>
          <Circle className="h-3.5 w-3.5" />
          <span>Mark complete</span>
        </>
      )}
    </button>
  );
}
