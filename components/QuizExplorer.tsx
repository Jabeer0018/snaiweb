"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { TheoryQuiz } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuizExplorerProps {
  quizzes: TheoryQuiz[];
}

interface QuizScoreRecord {
  answered: number;
  correct: number;
  total: number;
  completed: boolean;
}

const QUIZ_STORAGE_KEY = "snai_theory_quizzes_v1";
const optionLetters = ["A", "B", "C", "D"] as const;

const difficultyBadge: Record<"Easy" | "Medium" | "Hard", string> = {
  Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Hard: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

export function QuizExplorer({ quizzes }: QuizExplorerProps) {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Saved answers per quiz: { [quizId]: { [questionId]: optionIndex } }
  const [allAnswers, setAllAnswers] = useState<
    Record<string, Record<string, number>>
  >({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
      if (raw) {
        setAllAnswers(JSON.parse(raw) as Record<string, Record<string, number>>);
      }
    } catch {
      // ignore
    }
  }, []);

  function saveAnswers(next: Record<string, Record<string, number>>) {
    setAllAnswers(next);
    try {
      window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const activeQuiz = useMemo(
    () => quizzes.find((q) => q.id === activeQuizId) || null,
    [quizzes, activeQuizId]
  );

  function openQuiz(quiz: TheoryQuiz) {
    setActiveQuizId(quiz.id);
    setQIndex(0);
    setShowSummary(false);
  }

  function selectOption(quizId: string, questionId: string, optionIdx: number) {
    const quizAns = allAnswers[quizId] || {};
    const next = {
      ...allAnswers,
      [quizId]: { ...quizAns, [questionId]: optionIdx },
    };
    saveAnswers(next);
  }

  function retakeQuiz(quizId: string) {
    const next = { ...allAnswers };
    delete next[quizId];
    saveAnswers(next);
    setQIndex(0);
    setShowSummary(false);
  }

  function getQuizScore(quiz: TheoryQuiz): QuizScoreRecord {
    const ans = allAnswers[quiz.id] || {};
    const answered = Object.keys(ans).length;
    const correct = quiz.questions.filter(
      (q) => ans[q.id] !== undefined && ans[q.id] === q.correctIndex
    ).length;
    return {
      answered,
      correct,
      total: quiz.questions.length,
      completed: answered === quiz.questions.length && quiz.questions.length > 0,
    };
  }

  // ============================================================
  // 10-QUIZ HUB VIEW
  // ============================================================
  if (!activeQuiz) {
    const completedQuizzes = quizzes.filter(
      (qz) => getQuizScore(qz).completed
    ).length;
    const totalAnswered = quizzes.reduce(
      (acc, qz) => acc + getQuizScore(qz).answered,
      0
    );
    const totalMcqs = quizzes.reduce((acc, qz) => acc + qz.questions.length, 0);

    return (
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-muted">Available Quizzes</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-foreground">
              {quizzes.length} <span className="text-sm text-subtle">quizzes</span>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-muted">Quizzes Completed</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-foreground">
              {completedQuizzes} <span className="text-sm text-subtle">/ {quizzes.length}</span>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-muted">MCQs Answered</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-foreground">
              {totalAnswered} <span className="text-sm text-subtle">/ {totalMcqs}</span>
            </p>
          </div>
        </div>

        {/* 10 Quiz Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((quiz) => {
            const score = getQuizScore(quiz);
            const easyCount = quiz.questions.filter(
              (q) => q.difficulty === "Easy"
            ).length;
            const medCount = quiz.questions.filter(
              (q) => q.difficulty === "Medium"
            ).length;
            const hardCount = quiz.questions.filter(
              (q) => q.difficulty === "Hard"
            ).length;

            return (
              <button
                key={quiz.id}
                type="button"
                onClick={() => openQuiz(quiz)}
                className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-elevated/50"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-accent">
                      QUIZ {String(quiz.number).padStart(2, "0")} ·{" "}
                      {quiz.modules.join(" & ")}
                    </span>
                    <span className="rounded border border-border bg-elevated px-2 py-0.5 font-mono text-xs text-muted">
                      {quiz.questions.length} MCQs
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors sm:text-lg">
                    {quiz.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {quiz.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">{easyCount}E</span>
                    <span className="text-subtle">·</span>
                    <span className="text-amber-400">{medCount}M</span>
                    <span className="text-subtle">·</span>
                    <span className="text-rose-400">{hardCount}H</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {score.answered > 0 ? (
                      <span
                        className={cn(
                          "font-mono font-medium",
                          score.completed ? "text-emerald-400" : "text-accent"
                        )}
                      >
                        Score: {score.correct}/{score.total}
                      </span>
                    ) : (
                      <span className="text-muted group-hover:text-foreground">
                        Start Quiz
                      </span>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 text-subtle group-hover:translate-x-0.5 group-hover:text-accent transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================
  // QUIZ SUMMARY VIEW
  // ============================================================
  const quizAnswers = allAnswers[activeQuiz.id] || {};
  const score = getQuizScore(activeQuiz);

  if (showSummary) {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveQuizId(null)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:border-border-strong"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All 10 Quizzes
          </button>
          <button
            type="button"
            onClick={() => retakeQuiz(activeQuiz.id)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retake Quiz
          </button>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 text-center sm:p-8">
          <Trophy className="mx-auto h-10 w-10 text-accent" />
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-accent">
            Quiz {String(activeQuiz.number).padStart(2, "0")} Complete
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">
            {activeQuiz.title}
          </h2>
          <p className="mt-4 font-mono text-4xl font-bold text-foreground">
            {score.correct} <span className="text-xl text-subtle">/ {score.total}</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            Accuracy: {pct}% ({score.answered} of {score.total} answered)
          </p>
        </div>

        {/* Review All Questions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-subtle">
            Answer Review
          </h3>
          {activeQuiz.questions.map((q, idx) => {
            const picked = quizAnswers[q.id];
            const isCorrect = picked === q.correctIndex;
            return (
              <div
                key={q.id}
                className="space-y-2 rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-subtle">
                    Q{idx + 1} · {q.module}
                  </span>
                  <span
                    className={cn(
                      "rounded border px-2 py-0.5 text-[11px] font-medium",
                      difficultyBadge[q.difficulty]
                    )}
                  >
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {q.question}
                </p>
                <p className="text-xs text-muted">
                  <span className={isCorrect ? "text-emerald-400" : "text-rose-400"}>
                    {isCorrect ? "Correct" : `Incorrect (Correct: ${optionLetters[q.correctIndex]})`}
                  </span>{" "}
                  — {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================
  // ACTIVE QUIZ RUNNER VIEW (1 Question at a time)
  // ============================================================
  const currentQ = activeQuiz.questions[qIndex];
  const picked = quizAnswers[currentQ.id];
  const hasAnswered = picked !== undefined;
  const isCorrect = hasAnswered && picked === currentQ.correctIndex;

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveQuizId(null)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-foreground hover:border-border-strong"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Quizzes
          </button>
          <span className="font-mono text-xs text-accent">
            Quiz {String(activeQuiz.number).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {activeQuiz.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted">
            {score.correct}/{score.total} correct
          </span>
          <button
            type="button"
            onClick={() => setShowSummary(true)}
            className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent-hover"
          >
            Finish Quiz
          </button>
        </div>
      </div>

      {/* Question Number Pills */}
      <div className="flex flex-wrap gap-1.5">
        {activeQuiz.questions.map((q, idx) => {
          const ans = quizAnswers[q.id];
          const answered = ans !== undefined;
          const right = answered && ans === q.correctIndex;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setQIndex(idx)}
              className={cn(
                "h-8 w-8 rounded-md border font-mono text-xs font-medium transition-colors",
                idx === qIndex
                  ? "border-accent bg-accent text-white"
                  : answered
                  ? right
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-400"
                  : "border-border bg-surface text-muted hover:text-foreground"
              )}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <article className="space-y-5 rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-subtle">
              Question {qIndex + 1} of {activeQuiz.questions.length}
            </span>
            <span className="rounded border border-border bg-elevated px-2 py-0.5 text-[11px] text-muted">
              {currentQ.module}
            </span>
          </div>
          <span
            className={cn(
              "rounded border px-2 py-0.5 text-[11px] font-medium",
              difficultyBadge[currentQ.difficulty]
            )}
          >
            {currentQ.difficulty}
          </span>
        </div>

        <h2 className="text-base font-medium leading-relaxed text-foreground sm:text-lg">
          {currentQ.question}
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {currentQ.options.map((opt, idx) => {
            const isThisPicked = picked === idx;
            const isThisCorrect = currentQ.correctIndex === idx;

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
                onClick={() => selectOption(activeQuiz.id, currentQ.id, idx)}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-4 py-3.5 text-left text-sm leading-relaxed transition-colors",
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
              "rounded-lg border px-4 py-3.5 text-sm leading-relaxed",
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
                    Incorrect — Correct answer is {optionLetters[currentQ.correctIndex]}
                  </span>
                </>
              )}
            </div>
            <p className="text-muted">{currentQ.explanation}</p>
          </div>
        )}

        {/* Prev / Next */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <button
            type="button"
            disabled={qIndex === 0}
            onClick={() => setQIndex((i) => Math.max(0, i - 1))}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>

          {qIndex < activeQuiz.questions.length - 1 ? (
            <button
              type="button"
              onClick={() =>
                setQIndex((i) =>
                  Math.min(activeQuiz.questions.length - 1, i + 1)
                )
              }
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-1.5 text-xs font-medium text-white hover:bg-accent-hover"
            >
              Next Question
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSummary(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
            >
              Finish &amp; View Score
              <Trophy className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
