"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Menu, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
}

export const GLOBAL_NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/notes", label: "Learn" },
  { href: "/papers", label: "Papers" },
  { href: "/commands", label: "Commands" },
  { href: "/playground", label: "Playground" },
  { href: "/mock-tests", label: "Mock Tests" },
  { href: "/revision", label: "Revision" },
  { href: "/resources", label: "Resources" },
];

export function Navbar({ onOpenMobileNav, onOpenSearch }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Open navigation menu"
            className="inline-flex h-8 w-8 items-center justify-center border border-border bg-surface text-muted hover:text-foreground lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-base font-bold tracking-tight text-foreground"
          >
            <span>SNAI.</span>
          </Link>

          <nav
            aria-label="Global navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {GLOBAL_NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-2.5 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "text-foreground underline decoration-foreground underline-offset-8"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex h-8 items-center gap-2 border border-border bg-surface px-2.5 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground sm:w-48 sm:justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search...</span>
            </span>
            <kbd className="hidden border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-subtle sm:inline">
              ⌘K
            </kbd>
          </button>

          <Link
            href="/saved"
            aria-label="Saved content"
            title="Saved content"
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center border border-border bg-surface transition-colors hover:border-border-strong hover:text-foreground",
              pathname === "/saved" ? "text-foreground" : "text-muted"
            )}
          >
            <Bookmark className="h-3.5 w-3.5" />
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
