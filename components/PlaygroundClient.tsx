"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  HelpCircle,
  Play,
  RotateCcw,
  Search,
  Send,
  Terminal,
  XCircle,
} from "lucide-react";
import {
  executeScript,
  ExecutionResult,
  PlaygroundProblem,
} from "@/lib/sandbox-engine";
import { TheoryQuiz } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QuizExplorer } from "./QuizExplorer";

interface PlaygroundClientProps {
  problems: PlaygroundProblem[];
  quizzes?: TheoryQuiz[];
}

const SOLVED_KEY = "snai_playground_100_solved_v1";

const difficultyBadge: Record<PlaygroundProblem["difficulty"], string> = {
  Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Hard: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

export function PlaygroundClient({ problems, quizzes = [] }: PlaygroundClientProps) {
  const [section, setSection] = useState<"coding" | "quizzes">("coding");
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Solved" | "Unsolved">("All");
  const [tagFilter, setTagFilter] = useState<string>("All");

  // Solver state
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [outputTab, setOutputTab] = useState<"OUTPUT" | "CHECKS" | "ERROR">("OUTPUT");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SOLVED_KEY);
      if (raw) setSolvedIds(JSON.parse(raw) as string[]);
    } catch {
      // ignore
    }
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const p of problems) {
      for (const t of p.tags) s.add(t);
    }
    return ["All", ...Array.from(s).sort()];
  }, [problems]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return problems.filter((p) => {
      if (diffFilter !== "All" && p.difficulty !== diffFilter) return false;
      const isSolved = solvedIds.includes(p.id);
      if (statusFilter === "Solved" && !isSolved) return false;
      if (statusFilter === "Unsolved" && isSolved) return false;
      if (tagFilter !== "All" && !p.tags.includes(tagFilter)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        String(p.number) === q
      );
    });
  }, [problems, search, diffFilter, statusFilter, tagFilter, solvedIds]);

  const activeProblem = useMemo(
    () => problems.find((p) => p.id === activeId) || null,
    [problems, activeId]
  );

  function openProblem(problem: PlaygroundProblem) {
    setActiveId(problem.id);
    setCode("");
    setResult(null);
    setOutputTab("OUTPUT");
    setSubmittedSuccess(false);
    setShowHint(false);
    setShowSolution(false);
  }

  function handleRun() {
    if (!activeProblem) return;
    const res = executeScript(activeProblem, code);
    setResult(res);
    setSubmittedSuccess(false);
    if (res.stderr.length > 0 && res.stdout.length === 0) {
      setOutputTab("ERROR");
    } else {
      setOutputTab("OUTPUT");
    }
  }

  function handleSubmit() {
    if (!activeProblem) return;
    const res = executeScript(activeProblem, code);
    setResult(res);
    if (res.allPassed) {
      setSubmittedSuccess(true);
      setOutputTab("OUTPUT");
      if (!solvedIds.includes(activeProblem.id)) {
        const next = [...solvedIds, activeProblem.id];
        setSolvedIds(next);
        try {
          window.localStorage.setItem(SOLVED_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
      }
    } else {
      setSubmittedSuccess(false);
      setOutputTab("CHECKS");
    }
  }

  const easySolved = problems.filter(
    (p) => p.difficulty === "Easy" && solvedIds.includes(p.id)
  ).length;
  const medSolved = problems.filter(
    (p) => p.difficulty === "Medium" && solvedIds.includes(p.id)
  ).length;
  const hardSolved = problems.filter(
    (p) => p.difficulty === "Hard" && solvedIds.includes(p.id)
  ).length;

  // ============================================================
  // LIST VIEW (100 Questions — Easy / Medium / Hard)
  // ============================================================
  if (section === "quizzes") {
    return (
      <div className="space-y-6">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setSection("coding")}
            className="rounded-md px-3.5 py-1.5 text-xs font-medium text-muted hover:text-foreground sm:text-sm"
          >
            CLI &amp; Git Coding ({problems.length})
          </button>
          <button
            type="button"
            onClick={() => setSection("quizzes")}
            className="rounded-md bg-accent px-3.5 py-1.5 text-xs font-medium text-white sm:text-sm"
          >
            Theory Quizzes ({quizzes.length} Quizzes · 160 MCQs)
          </button>
        </div>

        <QuizExplorer quizzes={quizzes} />
      </div>
    );
  }

  if (!activeProblem) {
    return (
      <div className="space-y-6">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setSection("coding")}
            className="rounded-md bg-accent px-3.5 py-1.5 text-xs font-medium text-white sm:text-sm"
          >
            CLI &amp; Git Coding ({problems.length})
          </button>
          <button
            type="button"
            onClick={() => setSection("quizzes")}
            className="rounded-md px-3.5 py-1.5 text-xs font-medium text-muted hover:text-foreground sm:text-sm"
          >
            Theory Quizzes ({quizzes.length} Quizzes · 160 MCQs)
          </button>
        </div>
        {/* Progress Summary */}
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-muted">Total Solved</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-foreground">
              {solvedIds.length} <span className="text-sm text-subtle">/ {problems.length}</span>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-emerald-400">Easy</p>
            <p className="mt-1 font-mono text-xl font-semibold text-foreground">
              {easySolved} <span className="text-sm text-subtle">/ {problems.filter((p) => p.difficulty === "Easy").length}</span>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-amber-400">Medium</p>
            <p className="mt-1 font-mono text-xl font-semibold text-foreground">
              {medSolved} <span className="text-sm text-subtle">/ {problems.filter((p) => p.difficulty === "Medium").length}</span>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-rose-400">Hard</p>
            <p className="mt-1 font-mono text-xl font-semibold text-foreground">
              {hardSolved} <span className="text-sm text-subtle">/ {problems.filter((p) => p.difficulty === "Hard").length}</span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-subtle" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 100 questions..."
              aria-label="Search questions"
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
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            aria-label="Filter by topic tag"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Topics" : t}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            aria-label="Filter by completion status"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="Solved">Solved</option>
            <option value="Unsolved">Unsolved</option>
          </select>
        </div>

        {/* Questions Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">
                No questions match the selected filters.
              </div>
            ) : (
              filtered.map((p) => {
                const isSolved = solvedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => openProblem(p)}
                    className="group flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-elevated/60 sm:px-5"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {isSolved ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-subtle" />
                      )}
                      <span className="font-mono text-xs text-subtle w-7 shrink-0">
                        #{p.number}
                      </span>
                      <span className="truncate text-sm font-medium text-foreground group-hover:text-accent transition-colors sm:text-[15px]">
                        {p.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded border px-2 py-0.5 text-[11px] font-medium",
                          difficultyBadge[p.difficulty]
                        )}
                      >
                        {p.difficulty}
                      </span>
                      <div className="hidden flex-wrap gap-1.5 md:flex">
                        {p.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-border bg-background px-2 py-0.5 text-[11px] text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <ChevronRight className="h-4 w-4 text-subtle group-hover:text-accent transition-colors" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // SPLIT-PANE PROBLEM SOLVER VIEW
  // ============================================================
  const currentIdx = problems.findIndex((p) => p.id === activeProblem.id);
  const prevProblem = currentIdx > 0 ? problems[currentIdx - 1] : null;
  const nextProblem =
    currentIdx < problems.length - 1 ? problems[currentIdx + 1] : null;
  const lineCount = Math.max(code.split("\n").length, 10);

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-foreground hover:border-border-strong"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Questions
          </button>
          <span className="font-mono text-xs text-subtle">
            #{activeProblem.number}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {activeProblem.title}
          </span>
          <span
            className={cn(
              "rounded border px-2 py-0.5 text-[11px] font-medium",
              difficultyBadge[activeProblem.difficulty]
            )}
          >
            {activeProblem.difficulty}
          </span>
          {solvedIds.includes(activeProblem.id) && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Solved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!prevProblem}
            onClick={() => prevProblem && openProblem(prevProblem)}
            className="inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-xs text-muted hover:text-foreground disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev
          </button>
          <button
            type="button"
            disabled={!nextProblem}
            onClick={() => nextProblem && openProblem(nextProblem)}
            className="inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-xs text-muted hover:text-foreground disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Split Pane */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left Pane: Question Specification */}
        <div className="space-y-5 rounded-xl border border-border bg-surface p-5 lg:col-span-5 lg:max-h-[76vh] lg:overflow-y-auto">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {activeProblem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-border bg-elevated px-2 py-0.5 text-[11px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {activeProblem.description}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Given Directory Structure
            </h3>
            <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3.5 font-mono text-xs leading-relaxed text-foreground">
              {activeProblem.directoryTree}
            </pre>
          </div>

          {activeProblem.preExistingNotes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle">
                Pre-existing Permissions / State
              </h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted">
                {activeProblem.preExistingNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Actions to Perform
            </h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
              {activeProblem.actions.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            <button
              type="button"
              onClick={() => setShowSolution((s) => !s)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
            >
              {showSolution ? "Hide Solution" : "Show Solution"}
            </button>
          </div>

          {showHint && (
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 text-xs leading-relaxed text-foreground/90">
              <strong className="text-blue-400">Hint:</strong> {activeProblem.hint}
            </div>
          )}

          {showSolution && (
            <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed text-emerald-400">
              {activeProblem.solution}
            </pre>
          )}
        </div>

        {/* Right Pane: Code Editor + Output Console */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          {/* Code Editor */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border bg-elevated/60 px-4 py-2.5">
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <Terminal className="h-3.5 w-3.5 text-accent" />
                <span>Bash / Git Script</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCode("");
                    setResult(null);
                    setSubmittedSuccess(false);
                  }}
                  className="inline-flex items-center gap-1 rounded border border-border bg-surface px-2.5 py-1 text-xs text-muted hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleRun}
                  className="inline-flex items-center gap-1.5 rounded bg-elevated px-3 py-1 text-xs font-medium text-foreground border border-border hover:border-border-strong"
                >
                  <Play className="h-3 w-3 text-accent" />
                  Run
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-1.5 rounded bg-accent px-3.5 py-1 text-xs font-medium text-white hover:bg-accent-hover"
                >
                  <Send className="h-3 w-3" />
                  Submit
                </button>
              </div>
            </div>

            <div className="flex bg-background font-mono text-[13.5px] leading-6">
              <div
                aria-hidden="true"
                className="select-none border-r border-border bg-surface/50 px-3 py-3 text-right text-xs leading-6 text-subtle"
              >
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                placeholder={`# Write your Bash / Git commands here (one per line)\n# Click 'Run' to test output or 'Submit' to verify all tasks`}
                aria-label="Bash and Git script editor"
                rows={12}
                className="w-full resize-y bg-transparent p-3 text-foreground placeholder:text-subtle focus:outline-none"
              />
            </div>
          </div>

          {/* Output / Checks / Error Console */}
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center gap-1 border-b border-border bg-elevated/60 px-3 py-1.5">
              {(["OUTPUT", "CHECKS", "ERROR"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setOutputTab(tab)}
                  className={cn(
                    "rounded px-3 py-1 font-mono text-xs font-medium transition-colors",
                    outputTab === tab
                      ? "bg-background text-foreground"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {tab}
                  {tab === "ERROR" && result && result.stderr.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-rose-500/20 px-1.5 text-[10px] text-rose-400">
                      {result.stderr.length}
                    </span>
                  )}
                  {tab === "CHECKS" && result && (
                    <span className="ml-1.5 text-[10px] text-subtle">
                      ({result.checks.filter((c) => c.passed).length}/
                      {result.checks.length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[160px] max-h-[260px] overflow-y-auto bg-background p-4 font-mono text-xs leading-relaxed">
              {!result ? (
                <p className="text-subtle">
                  Run your commands or click Submit to see output and task verification.
                </p>
              ) : outputTab === "OUTPUT" ? (
                <div className="space-y-3">
                  {submittedSuccess && (
                    <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-400">
                      All requirements fulfilled! Tasks completed — SUCCESS
                    </div>
                  )}
                  {result.stdout.length > 0 ? (
                    <pre className="whitespace-pre-wrap text-foreground">
                      {result.stdout.join("\n")}
                    </pre>
                  ) : (
                    <p className="text-subtle">(No stdout output)</p>
                  )}
                  {result.stderr.length > 0 && (
                    <pre className="whitespace-pre-wrap text-rose-400">
                      {result.stderr.join("\n")}
                    </pre>
                  )}
                </div>
              ) : outputTab === "CHECKS" ? (
                <ul className="space-y-2">
                  {result.checks.map((chk, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {chk.passed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                      )}
                      <span
                        className={
                          chk.passed ? "text-emerald-400" : "text-rose-400"
                        }
                      >
                        [{chk.passed ? "PASS" : "FAIL"}]
                      </span>
                      <span className="text-foreground/90">{chk.label}</span>
                    </li>
                  ))}
                </ul>
              ) : result.stderr.length > 0 ? (
                <pre className="whitespace-pre-wrap text-rose-400">
                  {result.stderr.join("\n")}
                </pre>
              ) : (
                <p className="text-subtle">No errors.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
