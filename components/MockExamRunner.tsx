"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Eraser,
  Flag,
  HelpCircle,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { MockExam, MockPassage, MockQuestion } from "@/lib/types";
import {
  clearInProgressAttempt,
  CompletedAttempt,
  ExamMode,
  InProgressAttempt,
  loadMockStorage,
  recordCompletedAttempt,
  saveInProgressAttempt,
} from "@/lib/mock-storage";
import { cn } from "@/lib/utils";

interface MockExamRunnerProps {
  exam: MockExam;
}

const optionLetters = ["A", "B", "C", "D"] as const;

function normalizeTypedAnswer(val: string): string {
  return val.trim().replace(/\s+/g, " ").toLowerCase();
}

export function evaluateQuestion(
  q: MockQuestion,
  rawAnswer: string | undefined
): boolean {
  if (rawAnswer === undefined || rawAnswer.trim() === "") return false;
  if (q.type === "mcq" || q.type === "case-study-mcq") {
    return Number(rawAnswer) === Number(q.correctAnswer);
  }
  if (q.type === "numerical") {
    const norm = normalizeTypedAnswer(rawAnswer);
    const accepted = (q.acceptedAnswers || [String(q.correctAnswer)]).map(
      normalizeTypedAnswer
    );
    return accepted.includes(norm);
  }
  if (q.type === "matching") {
    return rawAnswer === String(q.correctAnswer);
  }
  return false;
}

function getShuffledRightIndices(examNum: number, qNum: number): number[] {
  const arr = [0, 1, 2, 3];
  const shift = (examNum + qNum) % 3 + 1;
  return [...arr.slice(shift), ...arr.slice(0, shift)];
}

function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

export function MockExamRunner({ exam }: MockExamRunnerProps) {
  const searchParams = useSearchParams();
  const wantReview = searchParams.get("view") === "review";

  const [phase, setPhase] = useState<"setup" | "running" | "results">("setup");
  const [mode, setMode] = useState<ExamMode>("exam");
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timerMinutes, setTimerMinutes] = useState(exam.recommendedMinutes);

  const [attempt, setAttempt] = useState<InProgressAttempt | null>(null);
  const [completedResult, setCompletedResult] =
    useState<CompletedAttempt | null>(null);

  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [mobilePassageOpen, setMobilePassageOpen] = useState(true);
  const [practiceChecked, setPracticeChecked] = useState<Record<number, boolean>>({});
  const [practiceHintOpen, setPracticeHintOpen] = useState<Record<number, boolean>>({});
  const [subsetNumbers, setSubsetNumbers] = useState<number[] | null>(null);

  // Results filters
  const [reviewFilter, setReviewFilter] = useState<
    "all" | "correct" | "incorrect" | "unattempted" | "marked"
  >("all");
  const [conceptFilter, setConceptFilter] = useState<string>("All");

  // Hydrate from localStorage
  useEffect(() => {
    const store = loadMockStorage();
    const inProg = store.inProgress[exam.id];
    const doneList = store.completed[exam.id] || [];

    if (wantReview && doneList.length > 0) {
      setCompletedResult(doneList[0]);
      setPhase("results");
      return;
    }

    if (inProg) {
      setAttempt(inProg);
      setMode(inProg.mode);
      setPhase("running");
    }
  }, [exam.id, wantReview]);

  const submitExam = useCallback(
    (currAttempt: InProgressAttempt) => {
      let score = 0;
      let correctCount = 0;
      let incorrectCount = 0;
      let unattemptedCount = 0;

      for (const q of exam.questions) {
        const ans = currAttempt.answers[q.number];
        if (ans === undefined || ans.trim() === "") {
          unattemptedCount++;
        } else if (evaluateQuestion(q, ans)) {
          score += q.points;
          correctCount++;
        } else {
          incorrectCount++;
        }
      }

      const elapsed = Math.round((Date.now() - currAttempt.startedAt) / 1000);
      const completed: CompletedAttempt = {
        attemptId: `${exam.id}-${Date.now()}`,
        examId: exam.id,
        completedAt: Date.now(),
        mode: currAttempt.mode,
        score,
        maxPoints: exam.maxPoints,
        percentage: Math.round((score / exam.maxPoints) * 100),
        correctCount,
        incorrectCount,
        unattemptedCount,
        timeTakenSeconds: elapsed,
        answers: currAttempt.answers,
        markedForReview: currAttempt.markedForReview,
      };

      recordCompletedAttempt(completed);
      setCompletedResult(completed);
      setAttempt(null);
      setConfirmSubmitOpen(false);
      setPhase("results");
    },
    [exam]
  );

  // Timer calculated from saved startedAt timestamp
  useEffect(() => {
    if (phase !== "running" || !attempt || !attempt.timerMinutes) {
      setRemainingSec(null);
      return;
    }
    const deadline = attempt.startedAt + attempt.timerMinutes * 60_000;
    const tick = () => {
      const rem = Math.ceil((deadline - Date.now()) / 1000);
      if (rem <= 0) {
        setRemainingSec(0);
        submitExam(attempt);
      } else {
        setRemainingSec(rem);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase, attempt, submitExam]);

  function startNewExam(selectedMode: ExamMode, customSubset?: number[]) {
    const firstQ = customSubset && customSubset.length > 0 ? customSubset[0] : 1;
    const fresh: InProgressAttempt = {
      examId: exam.id,
      mode: selectedMode,
      startedAt: Date.now(),
      timerMinutes:
        selectedMode === "exam" && timerEnabled ? timerMinutes : null,
      answers: {},
      markedForReview: [],
      visited: [firstQ],
      currentNumber: firstQ,
    };
    setMode(selectedMode);
    setSubsetNumbers(customSubset || null);
    setPracticeChecked({});
    setPracticeHintOpen({});
    saveInProgressAttempt(fresh);
    setAttempt(fresh);
    setPhase("running");
  }

  function updateAttempt(updater: (prev: InProgressAttempt) => InProgressAttempt) {
    if (!attempt) return;
    const next = updater(attempt);
    setAttempt(next);
    saveInProgressAttempt(next);
  }

  function goToQuestion(num: number) {
    updateAttempt((prev) => ({
      ...prev,
      currentNumber: num,
      visited: prev.visited.includes(num) ? prev.visited : [...prev.visited, num],
    }));
  }

  function setAnswer(qNum: number, val: string) {
    updateAttempt((prev) => ({
      ...prev,
      answers: { ...prev.answers, [qNum]: val },
    }));
  }

  function clearAnswer(qNum: number) {
    updateAttempt((prev) => {
      const nextAns = { ...prev.answers };
      delete nextAns[qNum];
      return { ...prev, answers: nextAns };
    });
    setPracticeChecked((prev) => ({ ...prev, [qNum]: false }));
  }

  function toggleMarkForReview(qNum: number) {
    updateAttempt((prev) => {
      const exists = prev.markedForReview.includes(qNum);
      return {
        ...prev,
        markedForReview: exists
          ? prev.markedForReview.filter((n) => n !== qNum)
          : [...prev.markedForReview, qNum],
      };
    });
  }

  const passageMap = useMemo(() => {
    const m: Record<string, MockPassage> = {};
    for (const p of exam.passages) m[p.id] = p;
    return m;
  }, [exam.passages]);

  // ============================================================
  // 1. SETUP SCREEN
  // ============================================================
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/mock-tests"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Mock Tests
        </Link>

        <div className="space-y-4 rounded-xl border border-border bg-surface p-6 sm:p-8">
          <div className="space-y-1.5 border-b border-border pb-5">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Mock Test {String(exam.number).padStart(2, "0")} ·{" "}
              {exam.difficultyLabel}
            </p>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              {exam.title}
            </h1>
            <p className="text-sm text-muted">{exam.subtitle}</p>
          </div>

          <div className="grid gap-3 text-xs sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-subtle">Blueprint</p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                35 Questions (A–E)
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-subtle">Maximum Score</p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                124 Points
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-subtle">Scoring</p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                No Negative Marking
              </p>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-semibold text-foreground">
              Choose Examination Mode
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("exam")}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  mode === "exam"
                    ? "border-accent bg-accent-muted/60"
                    : "border-border bg-background hover:border-border-strong"
                )}
              >
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Real Exam Mode
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  Simulates an actual assessment: no hints, no explanations, and
                  no correctness feedback until final submission.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("practice")}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  mode === "practice"
                    ? "border-accent bg-accent-muted/60"
                    : "border-border bg-background hover:border-border-strong"
                )}
              >
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <BookOpen className="h-4 w-4 text-accent" />
                  Practice Mode
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  Unlimited untimed practice with optional hints, immediate
                  answer checking, detailed explanations, and course note links.
                </p>
              </button>
            </div>
          </div>

          {mode === "exam" && (
            <div className="space-y-3 rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Practice Timer (Optional)
                  </p>
                  <p className="text-xs text-subtle">
                    Configurable practice setting; auto-submits when time expires.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={timerEnabled}
                    onChange={(e) => setTimerEnabled(e.target.checked)}
                    className="h-4 w-4 accent-violet-500"
                  />
                  Enable Timer
                </label>
              </div>
              {timerEnabled && (
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>Duration (minutes):</span>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={timerMinutes}
                    onChange={(e) =>
                      setTimerMinutes(Math.max(10, Number(e.target.value) || 60))
                    }
                    className="w-20 rounded border border-border bg-surface px-2.5 py-1 font-mono text-foreground"
                  />
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => startNewExam(mode)}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg hover:bg-accent-hover"
            >
              <Play className="h-4 w-4" />
              Start {mode === "exam" ? "Real Exam" : "Practice Session"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 2. RESULTS & ANALYTICS VIEW
  // ============================================================
  if (phase === "results" && completedResult) {
    // Breakdown calculations
    const byConcept: Record<
      string,
      { earned: number; total: number; correct: number; count: number; href: string }
    > = {};
    const byDifficulty: Record<string, { correct: number; total: number }> = {};
    const byType: Record<string, { correct: number; total: number }> = {};

    const incorrectNumbers: number[] = [];

    for (const q of exam.questions) {
      const ans = completedResult.answers[q.number];
      const ok = evaluateQuestion(q, ans);
      if (!ok) incorrectNumbers.push(q.number);

      if (!byConcept[q.primaryConcept]) {
        byConcept[q.primaryConcept] = {
          earned: 0,
          total: 0,
          correct: 0,
          count: 0,
          href: q.noteRef.href,
        };
      }
      byConcept[q.primaryConcept].total += q.points;
      byConcept[q.primaryConcept].count += 1;
      if (ok) {
        byConcept[q.primaryConcept].earned += q.points;
        byConcept[q.primaryConcept].correct += 1;
      }

      if (!byDifficulty[q.difficulty]) {
        byDifficulty[q.difficulty] = { correct: 0, total: 0 };
      }
      byDifficulty[q.difficulty].total += 1;
      if (ok) byDifficulty[q.difficulty].correct += 1;

      if (!byType[q.type]) {
        byType[q.type] = { correct: 0, total: 0 };
      }
      byType[q.type].total += 1;
      if (ok) byType[q.type].correct += 1;
    }

    const conceptEntries = Object.entries(byConcept).map(([name, data]) => ({
      name,
      ...data,
      pct: Math.round((data.earned / data.total) * 100),
    }));
    const weakest = [...conceptEntries]
      .filter((c) => c.pct < 100)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 4);
    const strongest = [...conceptEntries]
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);

    const attempted =
      completedResult.correctCount + completedResult.incorrectCount;
    const accuracy =
      attempted > 0
        ? Math.round((completedResult.correctCount / attempted) * 100)
        : 0;

    const filteredReview = exam.questions.filter((q) => {
      const ans = completedResult.answers[q.number];
      const isUnattempted = ans === undefined || ans.trim() === "";
      const isOk = !isUnattempted && evaluateQuestion(q, ans);
      const isMarked = completedResult.markedForReview.includes(q.number);

      if (reviewFilter === "correct" && !isOk) return false;
      if (reviewFilter === "incorrect" && (isOk || isUnattempted)) return false;
      if (reviewFilter === "unattempted" && !isUnattempted) return false;
      if (reviewFilter === "marked" && !isMarked) return false;
      if (conceptFilter !== "All" && q.primaryConcept !== conceptFilter)
        return false;
      return true;
    });

    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/mock-tests"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Mock Tests
          </Link>

          <div className="flex flex-wrap gap-2">
            {incorrectNumbers.length > 0 && (
              <button
                type="button"
                onClick={() => startNewExam("practice", incorrectNumbers)}
                className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent-muted px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent hover:text-accent-fg transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry Incorrect ({incorrectNumbers.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                clearInProgressAttempt(exam.id);
                setPhase("setup");
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Exam
            </button>
          </div>
        </div>

        {/* Score Summary Card */}
        <div className="grid gap-4 rounded-xl border border-border bg-surface p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted">Total Score</p>
            <p className="mt-1 font-mono text-3xl font-bold text-foreground">
              {completedResult.score}{" "}
              <span className="text-lg text-subtle">
                / {completedResult.maxPoints}
              </span>
            </p>
            <p className="mt-1 font-mono text-xs text-accent">
              {completedResult.percentage}% overall
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Question Breakdown</p>
            <p className="mt-1 text-sm text-emerald-400">
              {completedResult.correctCount} Correct
            </p>
            <p className="text-sm text-rose-400">
              {completedResult.incorrectCount} Incorrect
            </p>
            <p className="text-sm text-subtle">
              {completedResult.unattemptedCount} Unattempted
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">Accuracy &amp; Time</p>
            <p className="mt-1 font-mono text-xl font-semibold text-foreground">
              {accuracy}% accuracy
            </p>
            <p className="mt-1 font-mono text-xs text-muted">
              Time: {formatDuration(completedResult.timeTakenSeconds)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted">By Difficulty</p>
            <div className="mt-1 space-y-0.5 font-mono text-xs">
              {Object.entries(byDifficulty).map(([d, v]) => (
                <p key={d} className="text-foreground/90">
                  {d}: {v.correct}/{v.total}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Analytics: Strongest, Weakest & Revise Weak Concepts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
              Concept Performance &amp; Weak Areas
            </h2>
            <p className="text-xs text-subtle">
              Note: Small question counts per concept in a single test indicate
              areas to review rather than definitive mastery.
            </p>
            <div className="space-y-2.5 pt-1">
              {conceptEntries.map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{c.name}</span>
                    <span className="font-mono text-muted">
                      {c.earned}/{c.total} pts ({c.pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        c.pct >= 75
                          ? "bg-emerald-500"
                          : c.pct >= 40
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      )}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-surface p-5">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
                Revise Weak Concepts
              </h2>
              {weakest.length === 0 ? (
                <p className="mt-2 text-sm text-emerald-400">
                  100% across all tested concepts in this attempt.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {weakest.map((w) => (
                    <Link
                      key={w.name}
                      href={w.href}
                      className="flex items-center justify-between rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs transition-colors hover:border-accent/40"
                    >
                      <span>
                        <strong className="text-foreground">{w.name}</strong>{" "}
                        <span className="text-rose-400">({w.pct}%)</span>
                      </span>
                      <span className="text-accent">Revise notes →</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
                Strongest Concepts
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {strongest.map((s) => (
                  <span
                    key={s.name}
                    className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400"
                  >
                    {s.name} ({s.pct}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Question-by-Question Review */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">
              Detailed Question Review ({filteredReview.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "All"],
                  ["correct", "Correct"],
                  ["incorrect", "Incorrect"],
                  ["unattempted", "Unattempted"],
                  ["marked", "Marked for Review"],
                ] as const
              ).map(([key, lbl]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setReviewFilter(key)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium",
                    reviewFilter === key
                      ? "border-accent/40 bg-accent-muted text-accent"
                      : "border-border bg-surface text-muted hover:text-foreground"
                  )}
                >
                  {lbl}
                </button>
              ))}
              <select
                value={conceptFilter}
                onChange={(e) => setConceptFilter(e.target.value)}
                aria-label="Filter review by concept"
                className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-foreground"
              >
                <option value="All">All Concepts</option>
                {conceptEntries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReview.map((q) => {
              const studentAns = completedResult.answers[q.number];
              const isUnattempted =
                studentAns === undefined || studentAns.trim() === "";
              const isOk = !isUnattempted && evaluateQuestion(q, studentAns);

              return (
                <article
                  key={q.id}
                  className="space-y-3 rounded-xl border border-border bg-surface p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        Q{q.number}
                      </span>
                      <span className="rounded border border-border bg-elevated px-2 py-0.5 text-[11px] text-muted">
                        {q.primaryConcept}
                      </span>
                      <span className="rounded border border-border bg-elevated px-2 py-0.5 text-[11px] text-subtle">
                        {q.difficulty}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-mono text-xs font-semibold",
                        isOk
                          ? "text-emerald-400"
                          : isUnattempted
                          ? "text-subtle"
                          : "text-rose-400"
                      )}
                    >
                      {isOk ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {isOk ? q.points : 0} / {q.points} pts
                    </span>
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-foreground">
                    {q.question}
                  </p>

                  <div className="grid gap-2 rounded-lg border border-border bg-background p-3 font-mono text-xs sm:grid-cols-2">
                    <div>
                      <span className="text-subtle">Your Answer: </span>
                      <span
                        className={
                          isOk
                            ? "text-emerald-400"
                            : isUnattempted
                            ? "text-subtle"
                            : "text-rose-400"
                        }
                      >
                        {isUnattempted
                          ? "(Unattempted)"
                          : q.options
                          ? `${optionLetters[Number(studentAns)]} — ${
                              q.options[Number(studentAns)]
                            }`
                          : studentAns}
                      </span>
                    </div>
                    <div>
                      <span className="text-subtle">Correct Answer: </span>
                      <span className="text-emerald-400">
                        {q.options
                          ? `${optionLetters[Number(q.correctAnswer)]} — ${
                              q.options[Number(q.correctAnswer)]
                            }`
                          : String(q.correctAnswer)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs leading-relaxed text-muted">
                    <p>
                      <strong className="text-foreground">Explanation: </strong>
                      {q.explanation}
                    </p>
                    <Link
                      href={q.noteRef.href}
                      className="inline-flex items-center gap-1 text-accent hover:underline"
                    >
                      Related notes: {q.noteRef.title} →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 3. ACTIVE EXAMINATION INTERFACE
  // ============================================================
  if (!attempt) return null;

  const visibleNumbers = subsetNumbers || exam.questions.map((q) => q.number);
  const currentQ =
    exam.questions.find((q) => q.number === attempt.currentNumber) ||
    exam.questions[0];
  const currentIdx = visibleNumbers.indexOf(currentQ.number);
  const currentAnswer = attempt.answers[currentQ.number];
  const isMarked = attempt.markedForReview.includes(currentQ.number);
  const passage = currentQ.passageId ? passageMap[currentQ.passageId] : null;
  const isPractice = attempt.mode === "practice";
  const isChecked = Boolean(practiceChecked[currentQ.number]);
  const isCurrentCorrect = evaluateQuestion(currentQ, currentAnswer);

  const answeredCount = visibleNumbers.filter(
    (n) => attempt.answers[n] !== undefined && attempt.answers[n].trim() !== ""
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Examination Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-semibold text-accent">
            {exam.title}
          </span>
          <span className="rounded border border-border bg-elevated px-2 py-0.5 text-[11px] font-medium text-muted">
            {isPractice ? "Practice Mode" : "Real Exam Mode"}
          </span>
          <span className="font-mono text-xs text-foreground">
            Q{currentQ.number} / {exam.totalQuestions}
          </span>
          <span className="rounded border border-accent/30 bg-accent-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
            {currentQ.points} pts
          </span>
        </div>

        <div className="flex items-center gap-3">
          {remainingSec !== null && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-semibold",
                remainingSec < 300
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                  : "border-border bg-background text-foreground"
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(remainingSec)}
            </span>
          )}
          <button
            type="button"
            onClick={() => setConfirmSubmitOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover"
          >
            <Send className="h-3.5 w-3.5" />
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Layout: Question Area + Palette */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left/Center Question Area (Split-screen when Case Study!) */}
        <div className="space-y-4 lg:col-span-9">
          <div
            className={cn(
              "grid gap-4",
              passage ? "lg:grid-cols-12" : "grid-cols-1"
            )}
          >
            {/* Case Study Passage (Desktop split-screen, Mobile collapsible) */}
            {passage && (
              <div className="rounded-xl border border-border bg-surface p-5 lg:col-span-5 lg:max-h-[70vh] lg:overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setMobilePassageOpen((o) => !o)}
                  className="flex w-full items-center justify-between text-left lg:pointer-events-none"
                >
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                    {passage.title}
                  </span>
                  <span className="lg:hidden text-muted">
                    {mobilePassageOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </span>
                </button>

                <div
                  className={cn(
                    "mt-3 space-y-4",
                    !mobilePassageOpen && "hidden lg:block"
                  )}
                >
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {passage.content}
                  </p>

                  {passage.tables?.map((tbl, idx) => (
                    <div
                      key={idx}
                      className="overflow-x-auto rounded-lg border border-border"
                    >
                      {tbl.caption && (
                        <p className="border-b border-border bg-elevated/60 px-3 py-1.5 font-mono text-[11px] font-medium text-muted">
                          {tbl.caption}
                        </p>
                      )}
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-border bg-elevated/40 text-muted">
                          <tr>
                            {tbl.headers.map((h) => (
                              <th key={h} className="px-3 py-2 font-medium">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                          {tbl.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="px-3 py-2 font-mono text-[11px] text-foreground/90"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}

                  {passage.codeBlock && (
                    <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed text-foreground">
                      {passage.codeBlock}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {/* Active Question Card */}
            <div
              className={cn(
                "space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6",
                passage ? "lg:col-span-7" : "col-span-1"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    Question {currentQ.number}
                  </span>
                  <span className="rounded border border-border bg-elevated px-2 py-0.5 text-[11px] text-muted">
                    {currentQ.primaryConcept}
                  </span>
                  <span className="rounded border border-border bg-elevated px-2 py-0.5 text-[11px] text-subtle">
                    {currentQ.difficulty}
                  </span>
                </div>
                <span className="font-mono text-xs text-subtle">
                  {currentQ.points} points
                </span>
              </div>

              <h2 className="text-base font-medium leading-relaxed text-foreground sm:text-[17px]">
                {currentQ.question}
              </h2>

              {currentQ.codeBlock && (
                <pre className="overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed text-foreground">
                  {currentQ.codeBlock}
                </pre>
              )}

              {/* MCQ Options */}
              {(currentQ.type === "mcq" ||
                currentQ.type === "case-study-mcq") &&
                currentQ.options && (
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt, idx) => {
                      const selected = currentAnswer === String(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAnswer(currentQ.number, String(idx))}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm leading-relaxed transition-colors",
                            selected
                              ? "border-accent bg-accent-muted/70 text-foreground"
                              : "border-border bg-background/70 text-foreground/90 hover:border-border-strong hover:bg-elevated/60"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-[11px] font-semibold",
                              selected
                                ? "border-accent bg-accent text-accent-fg"
                                : "border-border-strong text-muted"
                            )}
                          >
                            {optionLetters[idx]}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

              {/* Numerical / Typed Input */}
              {currentQ.type === "numerical" && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={currentAnswer || ""}
                    onChange={(e) => setAnswer(currentQ.number, e.target.value)}
                    placeholder="Type your answer..."
                    aria-label="Numerical or typed answer"
                    className="w-full rounded-lg border border-border-strong bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
                  />
                  {currentQ.answerFormatHint && (
                    <p className="text-xs text-subtle">
                      Format: {currentQ.answerFormatHint}
                    </p>
                  )}
                </div>
              )}

              {/* Matching Pairs */}
              {currentQ.type === "matching" && currentQ.pairs && (
                <div className="space-y-3">
                  {(() => {
                    const shuffledRight = getShuffledRightIndices(
                      exam.number,
                      currentQ.number
                    );
                    const currentMap: Record<number, number> = {};
                    if (currentAnswer) {
                      for (const part of currentAnswer.split(",")) {
                        const [l, r] = part.split(":");
                        if (l !== undefined && r !== undefined) {
                          currentMap[Number(l)] = Number(r);
                        }
                      }
                    }

                    return currentQ.pairs.map((pair, lIdx) => (
                      <div
                        key={lIdx}
                        className="grid items-center gap-3 rounded-lg border border-border bg-background p-3 sm:grid-cols-2"
                      >
                        <div className="text-xs font-medium text-foreground">
                          <span className="mr-1.5 font-mono text-accent">
                            {lIdx + 1}.
                          </span>
                          {pair.left}
                        </div>
                        <select
                          value={
                            currentMap[lIdx] !== undefined
                              ? String(currentMap[lIdx])
                              : ""
                          }
                          onChange={(e) => {
                            const updated = {
                              ...currentMap,
                              [lIdx]: Number(e.target.value),
                            };
                            const serialized = [0, 1, 2, 3]
                              .map((i) =>
                                updated[i] !== undefined
                                  ? `${i}:${updated[i]}`
                                  : `${i}:`
                              )
                              .join(",");
                            setAnswer(currentQ.number, serialized);
                          }}
                          aria-label={`Match for ${pair.left}`}
                          className="rounded-md border border-border bg-surface px-2.5 py-2 text-xs text-foreground"
                        >
                          <option value="" disabled>
                            Select matching item...
                          </option>
                          {shuffledRight.map((origRIdx) => (
                            <option key={origRIdx} value={String(origRIdx)}>
                              {currentQ.pairs![origRIdx].right}
                            </option>
                          ))}
                        </select>
                      </div>
                    ));
                  })()}
                </div>
              )}

              {/* Practice Mode Controls & Feedback */}
              {isPractice && (
                <div className="space-y-3 border-t border-border pt-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPracticeChecked((p) => ({
                          ...p,
                          [currentQ.number]: true,
                        }))
                      }
                      className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover"
                    >
                      Check Answer
                    </button>
                    {currentQ.hint && (
                      <button
                        type="button"
                        onClick={() =>
                          setPracticeHintOpen((p) => ({
                            ...p,
                            [currentQ.number]: !p[currentQ.number],
                          }))
                        }
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-elevated px-3 py-1.5 text-xs text-muted hover:text-foreground"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        Hint
                      </button>
                    )}
                  </div>

                  {practiceHintOpen[currentQ.number] && currentQ.hint && (
                    <p className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 text-xs text-foreground/90">
                      <strong className="text-blue-400">Hint:</strong>{" "}
                      {currentQ.hint}
                    </p>
                  )}

                  {isChecked && (
                    <div
                      className={cn(
                        "space-y-2 rounded-lg border p-3.5 text-xs leading-relaxed",
                        isCurrentCorrect
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-rose-500/30 bg-rose-500/10"
                      )}
                    >
                      <p
                        className={cn(
                          "font-semibold",
                          isCurrentCorrect ? "text-emerald-400" : "text-rose-400"
                        )}
                      >
                        {isCurrentCorrect
                          ? "Correct!"
                          : `Incorrect — Answer: ${
                              currentQ.options
                                ? optionLetters[Number(currentQ.correctAnswer)]
                                : currentQ.correctAnswer
                            }`}
                      </p>
                      <p className="text-foreground/90">
                        {currentQ.explanation}
                      </p>
                      <Link
                        href={currentQ.noteRef.href}
                        className="inline-block text-accent hover:underline"
                      >
                        Review notes: {currentQ.noteRef.title} →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Navigation Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleMarkForReview(currentQ.number)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium",
                      isMarked
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                        : "border-border bg-elevated text-muted hover:text-foreground"
                    )}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {isMarked ? "Marked" : "Mark for Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => clearAnswer(currentQ.number)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
                  >
                    <Eraser className="h-3.5 w-3.5" />
                    Clear
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentIdx <= 0}
                    onClick={() =>
                      currentIdx > 0 &&
                      goToQuestion(visibleNumbers[currentIdx - 1])
                    }
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={currentIdx >= visibleNumbers.length - 1}
                    onClick={() =>
                      currentIdx < visibleNumbers.length - 1 &&
                      goToQuestion(visibleNumbers[currentIdx + 1])
                    }
                    className="inline-flex items-center gap-1 rounded-md bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Question Navigation Palette */}
        <aside className="space-y-4 rounded-xl border border-border bg-surface p-4 lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Question Palette
            </p>
            <span className="font-mono text-xs text-muted">
              {answeredCount}/{visibleNumbers.length}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 lg:grid-cols-5">
            {visibleNumbers.map((num) => {
              const isCurr = num === currentQ.number;
              const isAns =
                attempt.answers[num] !== undefined &&
                attempt.answers[num].trim() !== "";
              const isRev = attempt.markedForReview.includes(num);
              const isVis = attempt.visited.includes(num);

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => goToQuestion(num)}
                  title={`Question ${num}${isRev ? " (Marked)" : ""}${
                    isAns ? " (Answered)" : ""
                  }`}
                  className={cn(
                    "relative flex h-9 items-center justify-center rounded-md border font-mono text-xs font-medium transition-colors",
                    isCurr && "ring-2 ring-accent ring-offset-1 ring-offset-background",
                    isAns && isRev
                      ? "border-amber-500 bg-emerald-500/20 text-emerald-300"
                      : isAns
                      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                      : isRev
                      ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
                      : isVis
                      ? "border-border-strong bg-elevated text-foreground"
                      : "border-border bg-background text-subtle"
                  )}
                >
                  <span>{num}</span>
                  {isRev && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend (non-colour-only cues) */}
          <div className="space-y-1.5 border-t border-border pt-3 text-[11px] text-muted">
            <p className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded border border-emerald-500/50 bg-emerald-500/15" />
              Answered (green tint)
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded border border-amber-500/50 bg-amber-500/15" />
              Marked for review (amber + corner dot)
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded border border-border-strong bg-elevated" />
              Visited / Unanswered
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded border border-border bg-background" />
              Not visited
            </p>
          </div>
        </aside>
      </div>

      {/* Submission Confirmation Modal */}
      {confirmSubmitOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md space-y-4 rounded-xl border border-border-strong bg-surface p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold">Submit Examination?</h3>
            </div>
            <p className="text-sm text-muted">
              You have answered{" "}
              <strong className="text-foreground">{answeredCount}</strong> out
              of{" "}
              <strong className="text-foreground">
                {visibleNumbers.length}
              </strong>{" "}
              questions. Unanswered questions receive 0 points (no negative
              marking).
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmSubmitOpen(false)}
                className="rounded-md border border-border bg-elevated px-4 py-2 text-xs font-medium text-foreground"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={() => submitExam(attempt)}
                className="rounded-md bg-accent px-4 py-2 text-xs font-medium text-accent-fg hover:bg-accent-hover"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
