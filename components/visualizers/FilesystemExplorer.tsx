"use client";

import { useState } from "react";
import { Folder, FileText, Eye, EyeOff } from "lucide-react";

interface TreeItem {
  name: string;
  type: "dir" | "file";
  hidden?: boolean;
  children?: TreeItem[];
}

const INITIAL_TREE: TreeItem = {
  name: "/Users/student",
  type: "dir",
  children: [
    { name: ".git", type: "dir", hidden: true, children: [{ name: "HEAD", type: "file" }] },
    { name: ".env", type: "file", hidden: true },
    {
      name: "practice",
      type: "dir",
      children: [
        { name: "hello.txt", type: "file" },
        { name: "notes.md", type: "file" },
      ],
    },
    { name: "readme.txt", type: "file" },
  ],
};

export function FilesystemExplorer() {
  const [showHidden, setShowHidden] = useState(false);
  const [selectedPath, setSelectedPath] = useState("/Users/student/practice/hello.txt");

  const relPath = selectedPath.replace("/Users/student/", "./");

  const renderNode = (node: TreeItem, prefix: string, depth: number) => {
    if (node.hidden && !showHidden) return null;
    const fullPath = depth === 0 ? node.name : `${prefix}/${node.name}`;
    return (
      <div key={fullPath} style={{ paddingLeft: `${depth * 16}px` }}>
        <button
          type="button"
          onClick={() => setSelectedPath(fullPath)}
          className={`flex w-full items-center gap-2 px-2 py-1 text-left font-mono text-xs transition-colors ${
            selectedPath === fullPath
              ? "bg-elevated font-semibold text-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          {node.type === "dir" ? (
            <Folder className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <FileText className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>{node.name}</span>
          {node.hidden && (
            <span className="border border-border px-1 text-[10px] text-subtle">
              hidden
            </span>
          )}
        </button>
        {node.children?.map((c) => renderNode(c, fullPath, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-4 border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Filesystem &amp; Path Explorer
          </h3>
          <p className="text-xs text-muted">
            Click any file/folder to compare Absolute vs. Relative paths and
            toggle hidden dotfiles (<code>ls -a</code>).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowHidden((s) => !s)}
          className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground"
        >
          {showHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showHidden ? "Hide dotfiles (ls)" : "Show hidden (ls -a)"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-border bg-background p-3">
          {renderNode(INITIAL_TREE, "", 0)}
        </div>

        <div className="space-y-3 border border-border bg-background p-4 font-mono text-xs">
          <div>
            <p className="text-[11px] uppercase text-subtle">
              Absolute Path (from root /)
            </p>
            <p className="mt-1 break-all text-foreground">{selectedPath}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase text-subtle">
              Relative Path (from /Users/student)
            </p>
            <p className="mt-1 break-all text-foreground">
              {selectedPath === "/Users/student" ? "." : relPath}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase text-subtle">
              Parent Directory (cd ..)
            </p>
            <p className="mt-1 break-all text-muted">
              {selectedPath.split("/").slice(0, -1).join("/") || "/"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
