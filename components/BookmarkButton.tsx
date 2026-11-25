"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { isBookmarked, toggleBookmark } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  id: string;
  type: "topic" | "command";
  title: string;
  subtitle?: string;
  href: string;
  className?: string;
  compact?: boolean;
}

export function BookmarkButton({
  id,
  type,
  title,
  subtitle,
  href,
  className,
  compact = false,
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(id));
    const sync = () => setSaved(isBookmarked(id));
    window.addEventListener("snai-storage-change", sync);
    return () => window.removeEventListener("snai-storage-change", sync);
  }, [id]);

  function handleToggle() {
    const next = toggleBookmark({ id, type, title, subtitle, href });
    setSaved(next);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        saved
          ? "border-accent/40 bg-accent-muted text-accent"
          : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
        className
      )}
    >
      <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} />
      {!compact && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
