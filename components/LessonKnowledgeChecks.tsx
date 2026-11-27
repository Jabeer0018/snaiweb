"use client";

import { useState } from "react";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KnowledgeCheckQuestion {
  id: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  optionFeedback?: [string, string, string, string];
}

export function LessonKnowledgeChecks({
  questions,
  title = "Active Recall & Progressive Practice",
}: {
  questions: KnowledgeCheckQuestion[];
  title?: string;
}) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  if (!questions || questions.length === 0) return null;

  return (
    <section className="space-y-4 border-t border-border pt-8">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-subtle">
          <HelpCircle className="h-3.5 w-3.5 text-foreground" />
          {title}
        </h2>
        <p className="text-xs text-muted">
          Select an answer first, then check your reasoning. Explanations stay
          hidden until you attempt the question.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const choice = selected[q.id];
          const isChecked = Boolean(revealed[q.id]);
          const isCorrect = isChecked && choice === q.correctIndex;

          return (
            <div
              key={q.id}
              className="space-y-3 border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">
                  Check {idx + 1}
                </span>
                <span
                  className={cn(
                    "border px-2 py-0.5 font-mono text-[10px] uppercase",
                    q.level === "Beginner"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                      : q.level === "Intermediate"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-500"
                  )}
                >
                  {q.level}
                </span>
              </div>

              <p className="text-sm font-medium leading-relaxed text-foreground">
                {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isPicked = choice === optIdx;
                  const isRightOpt = isChecked && optIdx === q.correctIndex;
                  const isWrongPicked =
                    isChecked && isPicked && optIdx !== q.correctIndex;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isChecked}
                      onClick={() =>
                        setSelected((prev) => ({ ...prev, [q.id]: optIdx }))
                      }
                      className={cn(
                        "flex w-full items-start gap-2.5 border px-3.5 py-2.5 text-left text-xs leading-relaxed transition-colors",
                        isRightOpt
                          ? "border-emerald-500/50 bg-emerald-500/10 text-foreground"
                          : isWrongPicked
                            ? "border-rose-500/50 bg-rose-500/10 text-foreground"
                            : isPicked
                              ? "border-foreground bg-elevated text-foreground"
                              : "border-border bg-background text-muted hover:border-border-strong hover:text-foreground"
                      )}
                    >
                      <span className="font-mono font-semibold">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isRightOpt && (
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      )}
                      {isWrongPicked && (
                        <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!isChecked ? (
                <button
                  type="button"
                  disabled={choice === undefined}
                  onClick={() =>
                    setRevealed((prev) => ({ ...prev, [q.id]: true }))
                  }
                  className="bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-fg disabled:cursor-not-allowed disabled:opacity-40 hover:bg-accent-hover"
                >
                  Check Answer
                </button>
              ) : (
                <div
                  className={cn(
                    "space-y-1.5 border p-3.5 text-xs leading-relaxed",
                    isCorrect
                      ? "border-emerald-500/30 bg-emerald-500/5 text-foreground"
                      : "border-amber-500/30 bg-amber-500/5 text-foreground"
                  )}
                >
                  <p className="font-semibold">
                    {isCorrect
                      ? "Correct!"
                      : `Not quite — Option ${String.fromCharCode(65 + q.correctIndex)} is correct.`}
                  </p>
                  <p className="text-muted">{q.explanation}</p>
                  {!isCorrect &&
                    q.optionFeedback &&
                    choice !== undefined &&
                    q.optionFeedback[choice] && (
                      <p className="text-rose-500">
                        Why Option {String.fromCharCode(65 + choice)} is
                        incorrect: {q.optionFeedback[choice]}
                      </p>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
