"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  FolderOpen,
  Search,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import { SearchDocument } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  documents: SearchDocument[];
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "ig");
  const parts = text.split(regex);
  return parts.map((part, idx) =>
    regex.test(part) ? (
      <mark
        key={idx}
        className="rounded bg-elevated px-0.5 font-semibold text-foreground underline decoration-border-strong"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

const typeIcon: Record<SearchDocument["type"], typeof BookOpen> = {
  module: FolderOpen,
  topic: BookOpen,
  command: Terminal,
  revision: Sparkles,
  resource: FileText,
  paper: BookOpen,
};

export function SearchModal({ open, onClose, documents }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents.slice(0, 10);

    return documents
      .map((doc) => {
        const titleMatch = doc.title.toLowerCase().includes(q) ? 3 : 0;
        const subtitleMatch = doc.subtitle?.toLowerCase().includes(q) ? 2 : 0;
        const keywordMatch = doc.keywords.some((k) =>
          k.toLowerCase().includes(q)
        )
          ? 2
          : 0;
        const excerptMatch = doc.excerpt.toLowerCase().includes(q) ? 1 : 0;
        const score = titleMatch + subtitleMatch + keywordMatch + excerptMatch;
        return { doc, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .map((item) => item.doc);
  }, [query, documents]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleSelect(doc: SearchDocument) {
    onClose();
    router.push(doc.href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0 ? (prev + 1) % results.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border-strong bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, commands, keywords, definitions..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-subtle focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded p-1 text-muted hover:bg-elevated hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {documents.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted">
              No course material has been added yet. Search results will appear
              here once modules, topics, or commands are ingested.
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted">
              No results found for{" "}
              <span className="font-medium text-foreground">
                &ldquo;{query}&rdquo;
              </span>
              .
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((doc, index) => {
                const Icon = typeIcon[doc.type];
                const active = index === selectedIndex;
                return (
                  <li key={doc.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(doc)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                        active ? "bg-elevated" : "hover:bg-elevated/60"
                      )}
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-foreground">
                            {highlightMatch(doc.title, query)}
                          </span>
                          <span className="shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-subtle">
                            {doc.type}
                          </span>
                        </div>
                        {(doc.subtitle || doc.excerpt) && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                            {doc.subtitle ? `${doc.subtitle} — ` : ""}
                            {highlightMatch(doc.excerpt, query)}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-elevated/40 px-4 py-2 text-[11px] text-subtle">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">
                ↑↓
              </kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">
                ↵
              </kbd>{" "}
              open
            </span>
          </div>
          <span>
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">
              esc
            </kbd>{" "}
            close
          </span>
        </div>
      </div>
    </div>
  );
}
