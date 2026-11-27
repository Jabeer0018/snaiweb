"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Printer, RotateCw, Sparkles } from "lucide-react";
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

const FLASHCARDS = [
  {
    q: "Why is a juicer NOT a computer even though it has Input, Process, and Output?",
    a: "A juicer performs one fixed task and cannot be reprogrammed. Computers can run different programs.",
  },
  {
    q: "What is the unsigned range of n bits (e.g. 6 bits)?",
    a: "2^n values, range 0 to 2^n - 1. For 6 bits: 64 values, range 0 to 63 (not 0 to 64).",
  },
  {
    q: "Why does `rm folder/file.txt` fail when `folder/` is chmod 555 even if `file.txt` is chmod 644?",
    a: "Deleting or moving a file modifies the parent directory's entry list, which requires write (w) permission on the directory itself.",
  },
  {
    q: "What is the exact difference between `kill <PID>` and `kill -9 <PID>`?",
    a: "`kill <PID>` sends SIGTERM (15, polite request allowing cleanup); `kill -9 <PID>` sends SIGKILL (9, forced immediate termination).",
  },
  {
    q: "What happens if PATH is empty (`PATH=\"\"`) when you run `ls` vs `/bin/ls`?",
    a: "`ls` fails with 'command not found' because the shell has no directories to search; `/bin/ls` still works because the exact absolute path bypasses PATH.",
  },
  {
    q: "How does `git clone` differ from `git pull`?",
    a: "`git clone <URL>` downloads a repository and its full history for the first time; `git pull` downloads only the latest updates into an existing local repo.",
  },
  {
    q: "How do Unicode and UTF-8 differ?",
    a: "Unicode assigns each character a unique code point (e.g. U+0928); UTF-8 encodes code points into 1 to 4 bytes for storage and transmission.",
  },
  {
    q: "What is the difference between Encoding and Encryption?",
    a: "Encoding (ASCII, UTF-8, Hex) represents data using a known, public rule anyone can decode. Encryption protects data using a secret key.",
  },
];

export function RevisionExplorer({ entries }: RevisionExplorerProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

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
        description="Definitions, key concepts, command cheat sheets, concept comparisons, and concise topic summaries will appear here."
      />
    );
  }

  const card = FLASHCARDS[cardIdx];

  return (
    <div className="space-y-8">
      {/* Interactive Flashcards */}
      <section className="border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">
              Interactive Flashcards · {cardIdx + 1} / {FLASHCARDS.length}
            </p>
            <h2 className="text-sm font-semibold text-foreground">
              Rapid Exam Recall
            </h2>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-elevated"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Revision
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="flex min-h-[120px] w-full flex-col justify-between border border-border-strong bg-background p-5 text-left transition-colors hover:bg-elevated"
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
            {flipped ? "Answer (Click to flip back)" : "Question (Click to reveal answer)"}
          </span>
          <p className="my-2 text-sm font-medium leading-relaxed text-foreground sm:text-base">
            {flipped ? card.a : card.q}
          </p>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted">
            <RotateCw className="h-3 w-3" />
            Flip card
          </span>
        </button>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setFlipped(false);
              setCardIdx((i) => (i - 1 + FLASHCARDS.length) % FLASHCARDS.length);
            }}
            className="inline-flex items-center gap-1 border border-border bg-background px-3 py-1 text-xs text-muted hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev Card
          </button>
          <button
            type="button"
            onClick={() => {
              setFlipped(false);
              setCardIdx((i) => (i + 1) % FLASHCARDS.length);
            }}
            className="inline-flex items-center gap-1 bg-accent px-3 py-1 text-xs font-medium text-accent-fg hover:bg-accent-hover"
          >
            Next Card
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedType("all")}
          className={cn(
            "border px-3 py-1.5 text-xs font-medium transition-colors",
            selectedType === "all"
              ? "border-foreground bg-accent text-accent-fg"
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
              "border px-3 py-1.5 text-xs font-medium transition-colors",
              selectedType === type
                ? "border-foreground bg-accent text-accent-fg"
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
            className="scroll-mt-20 border border-border bg-surface p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="border border-border bg-background px-2 py-0.5 font-medium text-foreground">
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
