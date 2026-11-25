"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Terminal,
  Trash2,
} from "lucide-react";
import {
  BookmarkItem,
  getBookmarks,
  getReadingProgress,
  ReadingProgressItem,
  toggleBookmark,
  toggleTopicCompleted,
} from "@/lib/storage";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/lib/utils";

export default function SavedPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [progress, setProgress] = useState<ReadingProgressItem[]>([]);

  useEffect(() => {
    const load = () => {
      setBookmarks(getBookmarks());
      setProgress(getReadingProgress());
    };
    load();
    window.addEventListener("snai-storage-change", load);
    return () => window.removeEventListener("snai-storage-change", load);
  }, []);

  return (
    <div className="space-y-10">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Saved Content
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Bookmarked topics, commands, and your local reading progress. Stored
          in your browser without requiring an account.
        </p>
      </header>

      {/* Bookmarks */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Bookmarks ({bookmarks.length})
        </h2>

        {bookmarks.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No saved items yet"
            description="Use the Save button on any course topic or command reference to bookmark it for quick access."
            actionLabel="Browse Course Notes"
            actionHref="/notes"
          />
        ) : (
          <div className="divide-y divide-border rounded-lg border border-border bg-surface">
            {bookmarks.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <Link
                  href={item.href}
                  className="group flex min-w-0 flex-1 items-center gap-3"
                >
                  {item.type === "command" ? (
                    <Terminal className="h-4 w-4 shrink-0 text-accent" />
                  ) : (
                    <BookOpen className="h-4 w-4 shrink-0 text-accent" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="truncate text-xs text-muted">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </Link>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden text-xs text-subtle sm:inline">
                    {formatDate(item.savedAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      toggleBookmark({
                        id: item.id,
                        type: item.type,
                        title: item.title,
                        subtitle: item.subtitle,
                        href: item.href,
                      })
                    }
                    aria-label={`Remove ${item.title} from bookmarks`}
                    className="rounded p-1.5 text-muted hover:bg-elevated hover:text-foreground transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reading Progress */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Reading History ({progress.length})
        </h2>

        {progress.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted">
            Topics you open will be tracked here so you can resume or mark them
            as completed.
          </div>
        ) : (
          <div className="divide-y divide-border rounded-lg border border-border bg-surface">
            {progress.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                  >
                    <span className="truncate">{item.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                  <p className="truncate text-xs text-subtle">
                    {item.moduleTitle} • Last visited{" "}
                    {formatDate(item.lastVisitedAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleTopicCompleted(item.id)}
                  className={
                    item.completed
                      ? "inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400"
                      : "inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-muted hover:text-foreground"
                  }
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {item.completed ? "Completed" : "Mark complete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
