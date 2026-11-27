"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Bookmark,
  ChevronDown,
  ClipboardCheck,
  LogOut,
  Settings,
  User,
} from "lucide-react";

export interface AuthUserSummary {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
}

export function UserMenu({ user }: { user: AuthUserSummary }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const displayName = user.name?.trim() || "SNAI Student";
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="inline-flex h-8 items-center gap-2 border border-border bg-surface px-2 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-elevated focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      >
        {user.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={user.image}
            alt={displayName}
            className="h-5 w-5 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex h-5 w-5 items-center justify-center bg-accent font-mono text-[10px] font-semibold text-accent-fg">
            {initials}
          </span>
        )}
        <span className="hidden max-w-[100px] truncate sm:inline">
          {displayName}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-subtle" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 z-50 w-64 border border-border-strong bg-background p-2 shadow-xl"
        >
          <div className="border-b border-border px-2.5 py-2">
            <p className="truncate text-xs font-semibold text-foreground">
              {displayName}
            </p>
            <p className="truncate font-mono text-[11px] text-subtle">
              {user.email || "Private account"}
            </p>
          </div>

          <div className="space-y-0.5 py-1.5 text-xs">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-muted hover:bg-surface hover:text-foreground"
            >
              <User className="h-3.5 w-3.5" />
              Profile &amp; Progress
            </Link>
            <Link
              href="/saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-muted hover:bg-surface hover:text-foreground"
            >
              <Bookmark className="h-3.5 w-3.5" />
              Saved Content
            </Link>
            <Link
              href="/mock-tests"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-muted hover:bg-surface hover:text-foreground"
            >
              <ClipboardCheck className="h-3.5 w-3.5" />
              Mock Test History
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-muted hover:bg-surface hover:text-foreground"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings &amp; Privacy
            </Link>
          </div>

          <div className="border-t border-border pt-1.5">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs text-rose-500 hover:bg-rose-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
