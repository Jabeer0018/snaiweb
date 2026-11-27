"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Info,
  Play,
  RotateCcw,
} from "lucide-react";
import { MockExam } from "@/lib/types";
import { loadMockStorage, MockStorageState } from "@/lib/mock-storage";
import { cn } from "@/lib/utils";

interface MockTestsHubProps {
  exams: MockExam[];
}

export function MockTestsHub({ exams }: MockTestsHubProps) {
  const [storage, setStorage] = useState<MockStorageState>({
    inProgress: {},
    completed: {},
  });

  useEffect(() => {
    setStorage(loadMockStorage());
  }, []);

  const completedExamsCount = exams.filter(
    (e) => (storage.completed[e.id] || []).length > 0
  ).length;

  const totalAttemptsCount = Object.values(storage.completed).reduce(
    (acc, list) => acc + list.length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Local Persistence & Benchmark Notice */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-xs leading-relaxed text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p>
          All 10 mock tests follow the 35-question / 124-point blueprint
          (Sections A–E). Progress, timers, and analytics are saved locally in
          this browser and are not automatically synced across devices. These
          tests are practice simulations, not official college papers or a
          proctored examination environment.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-muted">Full-Length Mock Tests</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-foreground">
            {exams.length}{" "}
            <span className="text-sm text-subtle">
              ({exams.reduce((a, e) => a + e.totalQuestions, 0)} questions)
            </span>
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-muted">Tests Completed</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-foreground">
            {completedExamsCount}{" "}
            <span className="text-sm text-subtle">/ {exams.length}</span>
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-muted">Total Attempts Logged</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-foreground">
            {totalAttemptsCount}
          </p>
        </div>
      </div>

      {/* 10 Mock Test Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {exams.map((exam) => {
          const inProg = storage.inProgress[exam.id];
          const attempts = storage.completed[exam.id] || [];
          const prevAttempt = attempts[0];
          const bestAttempt =
            attempts.length > 0
              ? attempts.reduce((best, curr) =>
                  curr.score > best.score ? curr : best
                )
              : null;

          const statusLabel = inProg
            ? "In Progress"
            : attempts.length > 0
            ? "Completed"
            : "Not Started";

          return (
            <div
              key={exam.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent">
                    <ClipboardCheck className="h-3.5 w-3.5" />
                    MOCK TEST {String(exam.number).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "rounded border px-2 py-0.5 text-[11px] font-medium",
                      inProg
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : attempts.length > 0
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-border bg-elevated text-muted"
                    )}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {exam.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{exam.subtitle}</p>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-subtle">
                  <span>{exam.totalQuestions} Questions</span>
                  <span>•</span>
                  <span>{exam.maxPoints} Points</span>
                  <span>•</span>
                  <span>{exam.difficultyLabel}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {exam.recommendedMinutes} min
                  </span>
                </div>

                {(prevAttempt || bestAttempt) && (
                  <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-background/70 px-3.5 py-2.5 font-mono text-xs">
                    {prevAttempt && (
                      <span className="text-muted">
                        Previous:{" "}
                        <strong className="text-foreground">
                          {prevAttempt.score}/{prevAttempt.maxPoints}
                        </strong>{" "}
                        ({prevAttempt.percentage}%)
                      </span>
                    )}
                    {bestAttempt && (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <Award className="h-3.5 w-3.5" />
                        Best: {bestAttempt.score}/{bestAttempt.maxPoints} (
                        {bestAttempt.percentage}%)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                {inProg ? (
                  <Link
                    href={`/mock-tests/${exam.id}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-xs font-medium text-accent-fg hover:bg-accent-hover"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Resume Examination
                  </Link>
                ) : (
                  <Link
                    href={`/mock-tests/${exam.id}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-xs font-medium text-accent-fg hover:bg-accent-hover"
                  >
                    {attempts.length > 0 ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        Retake Examination
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        Start Examination
                      </>
                    )}
                  </Link>
                )}

                {prevAttempt && (
                  <Link
                    href={`/mock-tests/${exam.id}?view=review`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-3.5 py-2 text-xs font-medium text-foreground hover:border-border-strong"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Review Results
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
