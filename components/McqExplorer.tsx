"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import { TheoryMcq } from "@/lib/types";
import { cn } from "@/lib/utils";

interface McqExplorerProps {
  mcqs: TheoryMcq[];
}

const MCQ_STORAGE_KEY = "snai_theory_mcqs_v1";

type AnswerMap = Record<string, number>;

const difficultyBadge: Record<TheoryMcq["difficulty"], string> = {
  Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Hard: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

const optionLetters = ["A", "B", "C", "D"] as const;

export function McqExplorer({ mcqs }: McqExplorerProps) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [moduleFilter, setModuleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Answered" | "Unanswered">("All");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MCQ_STORAGE_KEY);
      if (raw) setAnswers(JSON.parse(raw) as AnswerMap);
    } catch {
      // ignore
    }
  }, []);

  function selectOption(mcqId: string, optionIndex: number) {
    const next = { ...answers, [mcqId]: optionIndex };
    setAnswers(next);
    try {
      window.localStorage.setItem(MCQ_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function resetAll() {
    setAnswers({});
    try {
      window.localStorage.removeItem(MCQ_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  const modules = useMemo(() => {
    const s = new Set<string>();
    for (const m of mcqs) s.add(m.module);
    return ["All", ...Array.from(s)];
  }, [mcqs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mcqs.filter((m) => {
      if (diffFilter !== "All" && m.difficulty !== diffFilter) return false;
      if (moduleFilter !== "All" && m.module !== moduleFilter) return false;
      const isAnswered = answers[m.id] !== undefined;
      if (statusFilter === "Answered" && !isAnswered) return false;
      if (statusFilter === "Unanswered" && isAnswered) return false;
      if (!q) return true;
      return (
        m.question.toLowerCase().includes(q) ||
        m.module.toLowerCase().includes(q) ||
        m.options.some((o) => o.toLowerCase().includes(q))
      );
    });
  }, [mcqs, search, diffFilter, moduleFilter, statusFilter, answers]);

  const answeredCount = Object.keys(answers).length;
  const correctCount = mcqs.filter(
    (m) => answers[m.id] !== undefined && answers[m.id] === m.correctIndex
  ).length;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-muted">Answered</p>
            <p className="font-mono text-xl font-semibold text-foreground">
              {answeredCount} <span className="text-sm text-subtle">/ {mcqs.length}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-emerald-400">Correct</p>
            <p className="font-mono text-xl font-semibold text-foreground">
              {correctCount}{" "}
              <span className="text-sm text-subtle">
                ({answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%)
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-muted hover:border-border-strong hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Answers
        </button>
      </div>

      {/* Filters */}
      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-subtle" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search theory MCQs..."
            aria-label="Search theory MCQs"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
          />
        </div>

        <select
          value={diffFilter}
          onChange={(e) => setDiffFilter(e.target.value as typeof diffFilter)}
          aria-label="Filter by difficulty"
          className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          aria-label="Filter by module"
          className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          {modules.map((mod) => (
            <option key={mod} value={mod}>
              {mod === "All" ? "All Modules" : mod}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          aria-label="Filter by status"
          className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="All">All Status</option>
          <option value="Answered">Answered</option>
          <option value="Unanswered">Unanswered</option>
        </select>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
            No MCQs match the selected filters.
          </div>
        ) : (
          filtered.map((mcq) => {
            const picked = answers[mcq.id];
            const hasAnswered = picked !== undefined;
            const isCorrect = hasAnswered && picked === mcq.correctIndex;

            return (
              <article
                key={mcq.id}
                className="space-y-4 rounded-xl border border-border bg-surface p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-subtle">
                      Q{mcq.number}
                    </span>
                    <span className="rounded border border-border bg-elevated px-2 py-0.5 text-[11px] text-muted">
                      {mcq.module}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "rounded border px-2 py-0.5 text-[11px] font-medium",
                      difficultyBadge[mcq.difficulty]
                    )}
                  >
                    {mcq.difficulty}
                  </span>
                </div>

                <h2 className="text-base font-medium leading-relaxed text-foreground sm:text-[17px]">
                  {mcq.question}
                </h2>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {mcq.options.map((opt, idx) => {
                    const isThisPicked = picked === idx;
                    const isThisCorrect = mcq.correctIndex === idx;

                    let optionStyle =
                      "border-border bg-background/70 text-foreground/90 hover:border-border-strong hover:bg-elevated/60";
                    if (hasAnswered) {
                      if (isThisCorrect) {
                        optionStyle =
                          "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
                      } else if (isThisPicked && !isThisCorrect) {
                        optionStyle =
                          "border-rose-500/40 bg-rose-500/10 text-rose-300";
                      } else {
                        optionStyle =
                          "border-border bg-background/40 text-muted opacity-75";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectOption(mcq.id, idx)}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border px-3.5 py-3 text-left text-sm leading-relaxed transition-colors",
                          optionStyle
                        )}
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-current/30 font-mono text-[11px] font-semibold">
                          {optionLetters[idx]}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div
                    className={cn(
                      "rounded-lg border px-4 py-3 text-sm leading-relaxed",
                      isCorrect
                        ? "border-emerald-500/30 bg-emerald-500/5 text-foreground/90"
                        : "border-rose-500/30 bg-rose-500/5 text-foreground/90"
                    )}
                  >
                    <div className="mb-1 flex items-center gap-2 font-semibold">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-rose-400" />
                          <span className="text-rose-400">
                            Incorrect — Correct answer is {optionLetters[mcq.correctIndex]}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-muted">{mcq.explanation}</p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
