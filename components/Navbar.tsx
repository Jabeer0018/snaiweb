"use client";

import Link from "next/link";
import { Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
}

export function Navbar({
  collapsed,
  onToggleCollapse,
  onOpenMobileNav,
  onOpenSearch,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted hover:text-foreground lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Desktop sidebar collapse */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:border-border-strong hover:text-foreground lg:inline-flex"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground lg:hidden"
        >
          SNAI Course
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-3 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground sm:w-56 sm:justify-between"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search course...</span>
          </span>
          <kbd className="hidden rounded border border-border bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-subtle sm:inline">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
