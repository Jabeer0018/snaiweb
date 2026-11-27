"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, X } from "lucide-react";
import { ModuleMeta } from "@/lib/types";
import { GLOBAL_NAV_ITEMS } from "./Navbar";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  modules: ModuleMeta[];
}

export function MobileNav({ open, onClose, modules }: MobileNavProps) {
  const pathname = usePathname();
  if (!open) return null;

  const activeModule = modules.find((m) =>
    pathname.startsWith(`/notes/${m.slug}`)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-full w-72 flex-col border-r border-border bg-background">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link
            href="/"
            onClick={onClose}
            className="font-mono text-base font-bold text-foreground"
          >
            SNAI.
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center border border-border bg-surface text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <nav className="space-y-1">
            {GLOBAL_NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "block border px-3 py-2 text-sm transition-colors",
                    active
                      ? "border-border-strong bg-surface font-medium text-foreground"
                      : "border-transparent text-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/saved"
              onClick={onClose}
              className={cn(
                "flex items-center gap-2 border px-3 py-2 text-sm transition-colors",
                pathname === "/saved"
                  ? "border-border-strong bg-surface font-medium text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              <Bookmark className="h-3.5 w-3.5" />
              Saved
            </Link>
          </nav>

          {activeModule && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">
                Current Module Lessons
              </p>
              <p className="text-xs font-semibold text-foreground">
                {activeModule.title}
              </p>
              <div className="space-y-1">
                {activeModule.topics.map((t) => {
                  const href = `/notes/${activeModule.slug}/${t.slug}`;
                  const active = pathname === href;
                  return (
                    <Link
                      key={t.slug}
                      href={href}
                      onClick={onClose}
                      className={cn(
                        "block px-2.5 py-1.5 text-xs leading-snug",
                        active
                          ? "bg-surface font-medium text-foreground"
                          : "text-muted hover:text-foreground"
                      )}
                    >
                      {t.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
