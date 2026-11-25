"use client";

import { X } from "lucide-react";
import { ModuleMeta } from "@/lib/types";
import { Sidebar } from "./Sidebar";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  modules: ModuleMeta[];
}

export function MobileNav({ open, onClose, modules }: MobileNavProps) {
  if (!open) return null;

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
      <div className="relative z-10 flex h-full">
        <Sidebar modules={modules} collapsed={false} onNavigate={onClose} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="ml-2 mt-3 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
