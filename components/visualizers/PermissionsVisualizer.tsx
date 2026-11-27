"use client";

import { useState } from "react";
import { CopyButton } from "../CopyButton";
import { cn } from "@/lib/utils";

type PermTriad = { r: boolean; w: boolean; x: boolean };

export function PermissionsVisualizer() {
  const [targetType, setTargetType] = useState<"file" | "dir">("file");
  const [owner, setOwner] = useState<PermTriad>({ r: true, w: true, x: false });
  const [group, setGroup] = useState<PermTriad>({ r: true, w: false, x: false });
  const [others, setOthers] = useState<PermTriad>({ r: true, w: false, x: false });

  const toOctal = (p: PermTriad) => (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);
  const toSym = (p: PermTriad) =>
    `${p.r ? "r" : "-"}${p.w ? "w" : "-"}${p.x ? "x" : "-"}`;

  const octal = `${toOctal(owner)}${toOctal(group)}${toOctal(others)}`;
  const symbolic = `${targetType === "dir" ? "d" : "-"}${toSym(owner)}${toSym(
    group
  )}${toSym(others)}`;
  const cmd = `chmod ${octal} ${targetType === "dir" ? "folder/" : "file.txt"}`;

  const toggle = (
    who: "owner" | "group" | "others",
    bit: keyof PermTriad
  ) => {
    const setter =
      who === "owner" ? setOwner : who === "group" ? setGroup : setOthers;
    setter((prev) => ({ ...prev, [bit]: !prev[bit] }));
  };

  return (
    <div className="space-y-5 border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Linux Permissions Visualizer
          </h3>
          <p className="text-xs text-muted">
            Toggle read, write, and execute bits to see symbolic, octal, and
            file vs. directory behaviour.
          </p>
        </div>

        <div className="inline-flex border border-border bg-background p-0.5">
          <button
            type="button"
            onClick={() => setTargetType("file")}
            className={cn(
              "px-3 py-1 font-mono text-xs",
              targetType === "file"
                ? "bg-accent font-medium text-accent-fg"
                : "text-muted"
            )}
          >
            File (-)
          </button>
          <button
            type="button"
            onClick={() => setTargetType("dir")}
            className={cn(
              "px-3 py-1 font-mono text-xs",
              targetType === "dir"
                ? "bg-accent font-medium text-accent-fg"
                : "text-muted"
            )}
          >
            Directory (d)
          </button>
        </div>
      </div>

      {/* Interactive Toggle Grid */}
      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            { key: "owner", label: "Owner (User)", state: owner },
            { key: "group", label: "Group", state: group },
            { key: "others", label: "Others", state: others },
          ] as const
        ).map((cat) => (
          <div
            key={cat.key}
            className="space-y-2.5 border border-border bg-background p-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                {cat.label}
              </span>
              <span className="font-mono text-xs text-muted">
                {toOctal(cat.state)} ({toSym(cat.state)})
              </span>
            </div>
            <div className="flex gap-1.5">
              {(["r", "w", "x"] as const).map((bit) => (
                <button
                  key={bit}
                  type="button"
                  onClick={() => toggle(cat.key, bit)}
                  className={cn(
                    "flex-1 border py-1.5 font-mono text-xs transition-colors",
                    cat.state[bit]
                      ? "border-foreground bg-accent font-semibold text-accent-fg"
                      : "border-border bg-surface text-muted hover:text-foreground"
                  )}
                >
                  {bit} ({bit === "r" ? 4 : bit === "w" ? 2 : 1})
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Live Output */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="border border-border bg-background p-3">
          <p className="text-[11px] text-subtle">Symbolic (ls -l)</p>
          <p className="mt-1 font-mono text-base font-semibold text-foreground">
            {symbolic}
          </p>
        </div>
        <div className="border border-border bg-background p-3">
          <p className="text-[11px] text-subtle">Octal Mode</p>
          <p className="mt-1 font-mono text-base font-semibold text-foreground">
            {octal}
          </p>
        </div>
        <div className="flex items-center justify-between border border-border bg-background p-3">
          <div>
            <p className="text-[11px] text-subtle">Command</p>
            <p className="mt-1 font-mono text-xs font-semibold text-foreground">
              {cmd}
            </p>
          </div>
          <CopyButton text={cmd} label="" />
        </div>
      </div>

      <p className="border-l-2 border-border-strong pl-3 text-xs leading-relaxed text-muted">
        {targetType === "file" ? (
          <>
            <strong className="text-foreground">File meaning:</strong>{" "}
            <code>r</code> = view contents (<code>cat</code>), <code>w</code> =
            modify contents, <code>x</code> = run as a program/script.
          </>
        ) : (
          <>
            <strong className="text-foreground">Directory meaning:</strong>{" "}
            <code>r</code> = list filenames (<code>ls</code>), <code>w</code> =
            create/delete/rename entries inside (required for <code>rm</code> or{" "}
            <code>mv</code>), <code>x</code> = traverse into directory (
            <code>cd</code>).
          </>
        )}
      </p>
    </div>
  );
}
