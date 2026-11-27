"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

export function GitWorkflowVisualizer() {
  const [workingModified, setWorkingModified] = useState(false);
  const [staged, setStaged] = useState(false);
  const [localCommits, setLocalCommits] = useState<
    { id: string; msg: string; branch: string }[]
  >([{ id: "a1b2c3", msg: "Initial commit", branch: "main" }]);
  const [remoteCommits, setRemoteCommits] = useState<number>(1);
  const [branch, setBranch] = useState<"main" | "feature">("main");

  function editFile() {
    setWorkingModified(true);
  }

  function stageFile() {
    if (!workingModified) return;
    setStaged(true);
    setWorkingModified(false);
  }

  function commitFile() {
    if (!staged) return;
    const id = Math.random().toString(16).slice(2, 8);
    setLocalCommits((prev) => [
      { id, msg: `Update on ${branch}`, branch },
      ...prev,
    ]);
    setStaged(false);
  }

  function pushRemote() {
    setRemoteCommits(localCommits.length);
  }

  function reset() {
    setWorkingModified(false);
    setStaged(false);
    setLocalCommits([{ id: "a1b2c3", msg: "Initial commit", branch: "main" }]);
    setRemoteCommits(1);
    setBranch("main");
  }

  return (
    <div className="space-y-5 border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Git Workflow &amp; Branch Visualizer
          </h3>
          <p className="text-xs text-muted">
            Step through Working Directory → Staging Area → Local Repo (.git) →
            Remote (GitHub).
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 border border-border bg-background px-2.5 py-1 text-xs text-muted hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={editFile}
          className="border border-border-strong bg-background px-3 py-1.5 font-mono text-xs text-foreground hover:bg-elevated"
        >
          1. Edit file
        </button>
        <button
          type="button"
          onClick={stageFile}
          disabled={!workingModified}
          className="border border-border-strong bg-background px-3 py-1.5 font-mono text-xs text-foreground hover:bg-elevated disabled:opacity-40"
        >
          2. git add .
        </button>
        <button
          type="button"
          onClick={commitFile}
          disabled={!staged}
          className="border border-border-strong bg-background px-3 py-1.5 font-mono text-xs text-foreground hover:bg-elevated disabled:opacity-40"
        >
          3. git commit -m &quot;...&quot;
        </button>
        <button
          type="button"
          onClick={() =>
            setBranch((b) => (b === "main" ? "feature" : "main"))
          }
          className="border border-border-strong bg-background px-3 py-1.5 font-mono text-xs text-foreground hover:bg-elevated"
        >
          git checkout {branch === "main" ? "feature" : "main"}
        </button>
        <button
          type="button"
          onClick={pushRemote}
          disabled={localCommits.length <= remoteCommits}
          className="bg-accent px-3 py-1.5 font-mono text-xs font-medium text-accent-fg hover:bg-accent-hover disabled:opacity-40"
        >
          4. git push origin {branch}
        </button>
      </div>

      {/* 4 Zones */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="border border-border bg-background p-3.5">
          <p className="font-mono text-[11px] uppercase text-subtle">
            1. Working Directory
          </p>
          <p className="mt-2 font-mono text-xs text-foreground">
            {workingModified ? "Modified: notes.txt" : "Clean working tree"}
          </p>
        </div>

        <div className="border border-border bg-background p-3.5">
          <p className="font-mono text-[11px] uppercase text-subtle">
            2. Staging Area
          </p>
          <p className="mt-2 font-mono text-xs text-foreground">
            {staged ? "Staged: notes.txt" : "(Empty)"}
          </p>
        </div>

        <div className="border border-border bg-background p-3.5">
          <p className="font-mono text-[11px] uppercase text-subtle">
            3. Local Repo (.git)
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted">
            HEAD → {branch}
          </p>
          <ul className="mt-1.5 space-y-1 font-mono text-[11px] text-foreground">
            {localCommits.slice(0, 3).map((c) => (
              <li key={c.id} className="truncate">
                {c.id} [{c.branch}] {c.msg}
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-border bg-background p-3.5">
          <p className="font-mono text-[11px] uppercase text-subtle">
            4. Remote (GitHub)
          </p>
          <p className="mt-2 font-mono text-xs text-foreground">
            {remoteCommits} commit(s) synced
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted">
            {localCommits.length > remoteCommits
              ? `${localCommits.length - remoteCommits} ahead of origin`
              : "Up to date with origin"}
          </p>
        </div>
      </div>
    </div>
  );
}
