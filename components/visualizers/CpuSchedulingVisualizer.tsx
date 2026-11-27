"use client";

import { useState } from "react";
import { RotateCcw, StepForward } from "lucide-react";

const PROCESSES = [
  { pid: 1012, name: "Chrome" },
  { pid: 1408, name: "VS Code" },
  { pid: 1890, name: "Spotify" },
  { pid: 2341, name: "python3 loop.py" },
];

export function CpuSchedulingVisualizer() {
  const [tick, setTick] = useState(0);
  const [killed2341, setKilled2341] = useState(false);

  const activeList = killed2341
    ? PROCESSES.filter((p) => p.pid !== 2341)
    : PROCESSES;
  const running = activeList[tick % activeList.length];

  return (
    <div className="space-y-4 border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            CPU Timeslicing &amp; Process State Visualizer
          </h3>
          <p className="text-xs text-muted">
            Step through 6 ms CPU time slices to observe context switching and{" "}
            <code>kill -9 2341</code> termination.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTick((t) => t + 1)}
            className="inline-flex items-center gap-1 bg-accent px-3 py-1.5 font-mono text-xs font-medium text-accent-fg"
          >
            <StepForward className="h-3.5 w-3.5" />
            Next Slice (+6ms)
          </button>
          <button
            type="button"
            onClick={() => setKilled2341(true)}
            disabled={killed2341}
            className="border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 font-mono text-xs text-rose-500 disabled:opacity-40"
          >
            kill -9 2341
          </button>
          <button
            type="button"
            onClick={() => {
              setTick(0);
              setKilled2341(false);
            }}
            className="border border-border bg-background px-2.5 py-1.5 text-xs text-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {PROCESSES.map((proc) => {
          const isDead = killed2341 && proc.pid === 2341;
          const isRunning = !isDead && running.pid === proc.pid;
          return (
            <div
              key={proc.pid}
              className={`border p-3 font-mono text-xs ${
                isDead
                  ? "border-border bg-background/40 opacity-50"
                  : isRunning
                  ? "border-foreground bg-background"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-subtle">PID {proc.pid}</span>
                <span
                  className={
                    isDead
                      ? "text-rose-500"
                      : isRunning
                      ? "text-emerald-500 font-semibold"
                      : "text-muted"
                  }
                >
                  {isDead ? "TERMINATED" : isRunning ? "RUNNING" : "READY"}
                </span>
              </div>
              <p className="mt-1.5 font-semibold text-foreground">{proc.name}</p>
            </div>
          );
        })}
      </div>

      <p className="font-mono text-xs text-muted">
        Clock: <strong className="text-foreground">{tick * 6} ms</strong> ·
        Active CPU slice:{" "}
        <strong className="text-foreground">
          {running.name} (PID {running.pid})
        </strong>
      </p>
    </div>
  );
}
