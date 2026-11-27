"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid, List, Search, Terminal } from "lucide-react";
import { CommandEntry } from "@/lib/types";
import { CopyButton } from "./CopyButton";
import { BookmarkButton } from "./BookmarkButton";
import { EmptyState } from "./EmptyState";

interface CommandExplorerProps {
  commands: CommandEntry[];
}

export function CommandExplorer({ commands }: CommandExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "cheatsheet">("cards");

  const modules = useMemo(() => {
    const set = new Set<string>();
    for (const c of commands) {
      if (c.moduleTitle) set.add(c.moduleTitle);
    }
    return Array.from(set).sort();
  }, [commands]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const c of commands) {
      if (c.category) set.add(c.category);
    }
    return Array.from(set).sort();
  }, [commands]);

  const topics = useMemo(() => {
    const set = new Set<string>();
    for (const c of commands) {
      if (c.topicTitle) set.add(c.topicTitle);
    }
    return Array.from(set).sort();
  }, [commands]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commands.filter((cmd) => {
      if (selectedModule !== "all" && cmd.moduleTitle !== selectedModule) {
        return false;
      }
      if (selectedCategory !== "all" && cmd.category !== selectedCategory) {
        return false;
      }
      if (selectedTopic !== "all" && cmd.topicTitle !== selectedTopic) {
        return false;
      }
      if (!q) return true;
      return (
        cmd.name.toLowerCase().includes(q) ||
        cmd.purpose.toLowerCase().includes(q) ||
        cmd.syntax.toLowerCase().includes(q) ||
        cmd.explanation.toLowerCase().includes(q) ||
        cmd.parameters.some(
          (p) =>
            p.flag.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        ) ||
        (cmd.keywords || []).some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [commands, query, selectedModule, selectedCategory, selectedTopic]);

  if (commands.length === 0) {
    return (
      <EmptyState
        icon={Terminal}
        title="Command Library is awaiting course material"
        description="Once course notes, PDFs, or lab sheets containing commands are supplied, every command will appear here with syntax, flags, examples, expected output, and common mistakes."
        hint="content/commands/<command-slug>.json"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter commands..."
            aria-label="Filter commands"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
          />
        </div>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          aria-label="Filter by module"
          className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="all">All Modules</option>
          {modules.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
          className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          aria-label="Filter by topic"
          className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="all">All Topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* View Switcher & Count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-subtle">
          Showing {filtered.length} of {commands.length} commands
        </p>
        <div className="inline-flex border border-border bg-surface p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "cards"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Detailed View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("cheatsheet")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "cheatsheet"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Cheat Sheet
          </button>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted">
          No commands match the current filters.
        </div>
      ) : viewMode === "cheatsheet" ? (
        <div className="overflow-x-auto border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-elevated font-mono text-[11px] uppercase tracking-wider text-subtle">
              <tr>
                <th className="px-4 py-2.5">Command</th>
                <th className="px-4 py-2.5">Syntax</th>
                <th className="px-4 py-2.5">Purpose</th>
                <th className="px-4 py-2.5 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((cmd) => (
                <tr key={cmd.slug} className="hover:bg-elevated/60">
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs font-semibold text-foreground">
                    <Link href={`/commands/${cmd.slug}`} className="hover:underline">
                      {cmd.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-foreground/90">
                    {cmd.syntax}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted">
                    {cmd.purpose}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <CopyButton text={cmd.syntax} label="" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((cmd) => (
            <div
              key={cmd.slug}
              className="flex flex-col justify-between rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="border border-border bg-elevated px-2 py-0.5 text-[11px] font-medium text-muted">
                        {cmd.category}
                      </span>
                      {cmd.isSupplementary && (
                        <span className="border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-500">
                          Supplementary
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-mono text-base font-semibold text-foreground">
                      <Link
                        href={`/commands/${cmd.slug}`}
                        className="hover:underline"
                      >
                        {cmd.name}
                      </Link>
                    </h3>
                  </div>
                  <BookmarkButton
                    id={`command:${cmd.slug}`}
                    type="command"
                    title={cmd.name}
                    subtitle={cmd.purpose}
                    href={`/commands/${cmd.slug}`}
                    compact
                  />
                </div>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {cmd.purpose}
                </p>

                <div className="mt-3 flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2">
                  <code className="truncate font-mono text-xs text-foreground">
                    {cmd.syntax}
                  </code>
                  <CopyButton text={cmd.syntax} label="" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-subtle">
                <span className="truncate">
                  {cmd.moduleTitle || "General"}
                </span>
                <Link
                  href={`/commands/${cmd.slug}`}
                  className="inline-flex items-center gap-1 font-medium text-foreground hover:text-accent transition-colors"
                >
                  Full reference
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
