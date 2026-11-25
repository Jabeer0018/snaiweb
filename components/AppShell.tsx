"use client";

import { useEffect, useState } from "react";
import { ModuleMeta, SearchDocument } from "@/lib/types";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { SearchModal } from "./SearchModal";

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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:shrink-0">
        <Sidebar modules={modules} collapsed={collapsed} />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        modules={modules}
      />

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          onOpenMobileNav={() => setMobileOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
          {children}
        </main>

        <footer className="border-t border-border px-4 py-5 text-xs text-subtle sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
            <span>SNAI Course — Student Knowledge Hub</span>
            <span>Learn. Practise. Understand.</span>
          </div>
        </footer>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        documents={searchDocuments}
      />
    </div>
  );
}
