"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FolderOpen,
  LayoutGrid,
  Play,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { ModuleMeta } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  modules: ModuleMeta[];
  collapsed: boolean;
  onNavigate?: () => void;
}

const navItems = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/notes", label: "Learn", icon: BookOpen },
  { href: "/commands", label: "Commands", icon: Terminal },
  { href: "/playground", label: "Playground", icon: Play },
  { href: "/mock-tests", label: "Mock Tests", icon: ClipboardCheck },
  { href: "/revision", label: "Revision", icon: Sparkles },
  { href: "/resources", label: "Resources", icon: FolderOpen },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

export function Sidebar({ modules, collapsed, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      for (const m of modules) {
        if (pathname.startsWith(`/notes/${m.slug}`)) {
          initial[m.slug] = true;
        }
      }
      return initial;
    }
  );

  function toggleModule(slug: string) {
    setExpandedModules((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  return (
    <aside
      aria-label="Primary navigation"
      className={cn(
        "flex h-full flex-col border-r border-border bg-surface transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border-strong bg-background font-mono text-xs font-bold text-foreground">
            SN
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                SNAI Course
              </p>
              <p className="truncate text-[11px] text-subtle">
                Learn. Understand. Master.
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Main Nav */}
      <div className="flex-1 space-y-6 overflow-y-auto px-2.5 py-4">
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-background font-medium text-foreground shadow-sm border border-border"
                    : "text-muted hover:bg-elevated hover:text-foreground border border-transparent",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-foreground" : "text-subtle"
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Module Tree */}
        {!collapsed && (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">
              Modules
            </p>
            {modules.length === 0 ? (
              <p className="px-2.5 text-xs text-subtle">
                Awaiting course material
              </p>
            ) : (
              <div className="space-y-0.5">
                {modules.map((mod) => {
                  const isOpen = Boolean(expandedModules[mod.slug]);
                  const isModuleActive = pathname.startsWith(
                    `/notes/${mod.slug}`
                  );

                  return (
                    <div key={mod.slug} className="space-y-0.5">
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => toggleModule(mod.slug)}
                          aria-label={`Toggle ${mod.title}`}
                          className="rounded p-1 text-subtle hover:text-foreground"
                        >
                          {isOpen ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <Link
                          href={`/notes/${mod.slug}`}
                          onClick={onNavigate}
                          className={cn(
                            "flex-1 truncate rounded px-1.5 py-1 text-xs transition-colors",
                            isModuleActive
                              ? "font-medium text-foreground"
                              : "text-muted hover:text-foreground"
                          )}
                        >
                          {mod.title}
                        </Link>
                      </div>

                      {isOpen && mod.topics.length > 0 && (
                        <div className="ml-4 space-y-0.5 border-l border-border pl-2.5">
                          {mod.topics.map((topic) => {
                            const topicHref = `/notes/${mod.slug}/${topic.slug}`;
                            const active = pathname === topicHref;
                            return (
                              <Link
                                key={topic.slug}
                                href={topicHref}
                                onClick={onNavigate}
                                className={cn(
                                  "flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors",
                                  active
                                    ? "bg-background font-medium text-foreground"
                                    : "text-muted hover:text-foreground"
                                )}
                              >
                                <FileText className="h-3 w-3 shrink-0 opacity-70" />
                                <span className="truncate">{topic.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
