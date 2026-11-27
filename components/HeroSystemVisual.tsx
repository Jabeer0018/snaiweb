"use client";

import { useState } from "react";
import { ArrowRight, Cpu, FolderTree, Layers, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineStage {
  id: string;
  label: string;
  title: string;
  command: string;
  detail: string;
  output: string;
  icon: typeof Terminal;
}

const STAGES: PipelineStage[] = [
  {
    id: "cli",
    label: "01 · Shell / CLI",
    title: "Command Parsing & PATH Lookup",
    command: "which python3 && ls -la",
    detail:
      "Your shell (zsh) tokenizes input, searches PATH directories left-to-right, and spawns a child process.",
    output: "/usr/bin/python3\n-rw-r--r--  1 student  staff  app.py",
    icon: Terminal,
  },
  {
    id: "fs",
    label: "02 · Filesystem & Permissions",
    title: "Permission Bits & Ownership",
    command: "chmod 755 run.sh && ./run.sh",
    detail:
      "The OS verifies execute bit (x=1) and file content before allowing execution—regardless of filename extension.",
    output: "-rwxr-xr-x  1 student  staff  run.sh\nExecuting run.sh...",
    icon: FolderTree,
  },
  {
    id: "os",
    label: "03 · OS & Process Scheduling",
    title: "RAM Isolation & CPU Timeslicing",
    command: "ps aux | grep python3",
    detail:
      "The OS allocates exclusive RAM to each process and switches CPU slices rapidly so multiple apps run concurrently.",
    output: "student  4213  12.4  1.8  python3 app.py",
    icon: Layers,
  },
  {
    id: "hw",
    label: "04 · Hardware & Binary",
    title: "Machine Code & Byte Representation",
    command: "echo 'A' -> 65 -> 01000001",
    detail:
      "Every instruction, character (ASCII/UTF-8), and pixel (RGB) reduces to sequences of bytes executed by transistors.",
    output: "ASCII 'A' = 65 (0x41) = 01000001₂",
    icon: Cpu,
  },
];

export function HeroSystemVisual() {
  const [activeId, setActiveId] = useState<string>("cli");
  const active = STAGES.find((s) => s.id === activeId) || STAGES[0];

  return (
    <div className="border border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-elevated px-4 py-2.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">
          Interactive System Pipeline
        </span>
        <span className="font-mono text-[11px] text-muted">
          Click a layer to inspect
        </span>
      </div>

      {/* Stage Selector */}
      <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const isActive = stage.id === activeId;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveId(stage.id)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-2.5 text-left font-mono text-xs transition-colors",
                isActive
                  ? "border-foreground bg-background font-medium text-foreground"
                  : "border-transparent text-muted hover:bg-elevated hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="leading-snug">{stage.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Layer Detail */}
      <div className="space-y-4 bg-background p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {active.title}
          </h3>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-subtle">
            {active.label} <ArrowRight className="h-3 w-3" />
          </span>
        </div>

        <p className="text-xs leading-relaxed text-muted sm:text-sm">
          {active.detail}
        </p>

        <div className="border border-border bg-surface p-3.5 font-mono text-xs">
          <div className="flex items-center gap-2 text-foreground">
            <span className="select-none text-subtle">$</span>
            <span>{active.command}</span>
          </div>
          <pre className="mt-2 whitespace-pre-wrap border-t border-border pt-2 text-[11.5px] leading-relaxed text-muted">
            {active.output}
          </pre>
        </div>
      </div>
    </div>
  );
}
