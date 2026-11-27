"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ModuleMeta, SearchDocument } from "@/lib/types";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { SearchModal } from "./SearchModal";
import { ContextualModuleSidebar } from "./ContextualModuleSidebar";

interface AppShellProps {
  modules: ModuleMeta[];
  searchDocuments: SearchDocument[];
  children: React.ReactNode;
}

export function AppShell({
  modules,
  searchDocuments,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isInsideModule = modules.some((m) =>
    pathname.startsWith(`/notes/${m.slug}`)
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar
        onOpenMobileNav={() => setMobileOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        modules={modules}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {isInsideModule && <ContextualModuleSidebar modules={modules} />}

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <footer className="border-t border-border px-4 py-6 text-xs text-subtle sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <span>SNAI Course — Digital Textbook · Practical Lab · Mock Exam Centre</span>
          <span className="font-mono">Learn. Understand. Master.</span>
        </div>
      </footer>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        documents={searchDocuments}
      />
    </div>
  );
}
