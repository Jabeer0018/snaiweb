"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { RevisionEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

interface RevisionExplorerProps {
  entries: (RevisionEntry & { renderedContent: React.ReactNode })[];
}

const typeLabels: Record<RevisionEntry["type"], string> = {
  definition: "Definitions",
  concept: "Key Concepts",
  cheatsheet: "Cheat Sheets",
  comparison: "Comparisons",
  "confused-commands": "Confused Commands",
  syntax: "Important Syntax",
  summary: "Topic Summaries",
};

export function RevisionExplorer({ entries }: RevisionExplorerProps) {
  const [selectedType, setSelectedType] = useState<string>("all");

  const availableTypes = useMemo(() => {
    const set = new Set<RevisionEntry["type"]>();
    for (const e of entries) set.add(e.type);
    return Array.from(set);
  }, [entries]);

  const filtered = useMemo(() => {
    if (selectedType === "all") return entries;
    return entries.filter((e) => e.type === selectedType);
  }, [entries, selectedType]);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Quick Revision is awaiting course material"
        description="Definitions, key concepts, command cheat sheets, concept comparisons, and concise topic summaries will be generated strictly from your supplied course materials."
        hint="content/revision/<slug>.md"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedType("all")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
            selectedType === "all"
              ? "border-accent/40 bg-accent-muted text-accent"
              : "border-border bg-surface text-muted hover:text-foreground"
          )}
        >
          All ({entries.length})
        </button>
        {availableTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              selectedType === type
                ? "border-accent/40 bg-accent-muted text-accent"
                : "border-border bg-surface text-muted hover:text-foreground"
            )}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((entry) => (
          <section
            key={entry.slug}
            id={entry.slug}
            className="scroll-mt-20 rounded-lg border border-border bg-surface p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="rounded border border-border bg-elevated px-2 py-0.5 font-medium text-foreground">
                    {typeLabels[entry.type]}
                  </span>
                  {entry.moduleTitle && <span>{entry.moduleTitle}</span>}
                </div>
                <h2 className="mt-2 text-lg font-semibold text-foreground">
                  {entry.title}
                </h2>
                {entry.summary && (
                  <p className="mt-1 text-sm text-muted">{entry.summary}</p>
                )}
              </div>
              {entry.source && (
                <span className="text-xs text-subtle">
                  Source: {entry.source}
                </span>
              )}
            </div>

            <div className="mt-4">{entry.renderedContent}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
