"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Bookmark,
  CheckCircle2,
  ClipboardCheck,
  Download,
  LogOut,
  Trash2,
  User,
} from "lucide-react";
import {
  BookmarkItem,
  clearCurrentUserProgress,
  getBookmarks,
  getReadingProgress,
  hasLegacyAnonymousProgress,
  importLegacyProgressForCurrentUser,
  ReadingProgressItem,
} from "@/lib/storage";
import { loadMockStorage, MockStorageState } from "@/lib/mock-storage";

export function ProfileClient({
  user,
}: {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string;
  };
}) {
  const [progress, setProgress] = useState<ReadingProgressItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [mocks, setMocks] = useState<MockStorageState>({
    inProgress: {},
    completed: {},
  });
  const [hasLegacy, setHasLegacy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  function refresh() {
    setProgress(getReadingProgress());
    setBookmarks(getBookmarks());
    setMocks(loadMockStorage());
    setHasLegacy(hasLegacyAnonymousProgress());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("snai-storage-change", refresh);
    return () => window.removeEventListener("snai-storage-change", refresh);
  }, []);

  const completedTopics = progress.filter((p) => p.completed).length;
  const totalMockAttempts = Object.values(mocks.completed).reduce(
    (acc, list) => acc + list.length,
    0
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          {user.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={user.image}
              alt={user.name || "Student"}
              className="h-14 w-14 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center border border-border bg-surface text-foreground">
              <User className="h-6 w-6" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {user.name || "SNAI Student"}
            </h1>
            <p className="font-mono text-xs text-muted">
              {user.email || "Private Relay / Hidden Email"} · Signed in with{" "}
              <span className="capitalize">{user.provider || "OAuth"}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="inline-flex items-center gap-2 border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/20"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </header>

      {statusMsg && (
        <div className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-500">
          {statusMsg}
        </div>
      )}

      {/* Account-Scoped Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-border bg-surface p-5">
          <p className="flex items-center gap-2 font-mono text-xs uppercase text-subtle">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed Lessons
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold text-foreground">
            {completedTopics}
          </p>
        </div>
        <div className="border border-border bg-surface p-5">
          <p className="flex items-center gap-2 font-mono text-xs uppercase text-subtle">
            <Bookmark className="h-3.5 w-3.5" />
            Saved Items
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold text-foreground">
            {bookmarks.length}
          </p>
        </div>
        <div className="border border-border bg-surface p-5">
          <p className="flex items-center gap-2 font-mono text-xs uppercase text-subtle">
            <ClipboardCheck className="h-3.5 w-3.5" />
            Mock Exam Attempts
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold text-foreground">
            {totalMockAttempts}
          </p>
        </div>
      </div>

      {/* Explicit Legacy Migration Option */}
      {hasLegacy && (
        <div className="flex flex-wrap items-center justify-between gap-4 border border-border-strong bg-surface p-5">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-foreground">
              Previous Browser Progress Found
            </h2>
            <p className="text-xs text-muted">
              This browser has pre-login study progress. Import it explicitly
              into your account, or leave it separate.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              importLegacyProgressForCurrentUser();
              refresh();
              setStatusMsg(
                "Previous browser progress imported into your account."
              );
            }}
            className="inline-flex items-center gap-2 bg-accent px-4 py-2 text-xs font-medium text-accent-fg hover:bg-accent-hover"
          >
            <Download className="h-3.5 w-3.5" />
            Import to My Account
          </button>
        </div>
      )}

      {/* Storage Note & Clear Data */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-border bg-surface p-5">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-foreground">
            Account-Scoped Local Storage
          </h2>
          <p className="text-xs text-muted">
            Your progress is isolated to your signed-in account on this browser
            and does not mix with other students on shared devices. Progress does
            not automatically sync across separate devices.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/settings"
            className="border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground hover:border-border-strong"
          >
            Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              clearCurrentUserProgress();
              refresh();
              setStatusMsg(
                "Cleared your account's locally stored progress on this browser."
              );
            }}
            className="inline-flex items-center gap-1.5 border border-rose-500/30 bg-background px-3.5 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear My Progress
          </button>
        </div>
      </div>
    </div>
  );
}
