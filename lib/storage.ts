export interface BookmarkItem {
  id: string;
  type: "topic" | "command";
  title: string;
  subtitle?: string;
  href: string;
  savedAt: string;
}

export interface ReadingProgressItem {
  id: string; // e.g. "moduleSlug/topicSlug"
  title: string;
  moduleTitle: string;
  href: string;
  completed: boolean;
  lastVisitedAt: string;
}

const BOOKMARKS_KEY = "snai_bookmarks_v1";
const PROGRESS_KEY = "snai_progress_v1";
const MOCK_EXAMS_KEY = "snai_mock_exams_v1";
const THEME_KEY = "snai-theme";

let currentUserId: string | null = null;

export function setActiveUserId(userId: string | null) {
  currentUserId = userId;
}

export function getActiveUserId(): string | null {
  return currentUserId;
}

export function scopedStorageKey(baseKey: string): string {
  return currentUserId ? `${baseKey}::${currentUserId}` : baseKey;
}

export function hasLegacyAnonymousProgress(): boolean {
  if (typeof window === "undefined" || !currentUserId) return false;
  try {
    const b = window.localStorage.getItem(BOOKMARKS_KEY);
    const p = window.localStorage.getItem(PROGRESS_KEY);
    const m = window.localStorage.getItem(MOCK_EXAMS_KEY);
    return Boolean(
      (b && b !== "[]") ||
        (p && p !== "[]") ||
        (m && m !== '{"inProgress":{},"completed":{}}')
    );
  } catch {
    return false;
  }
}

export function importLegacyProgressForCurrentUser(): boolean {
  if (typeof window === "undefined" || !currentUserId) return false;
  try {
    const legacyB = window.localStorage.getItem(BOOKMARKS_KEY);
    const legacyP = window.localStorage.getItem(PROGRESS_KEY);
    const legacyM = window.localStorage.getItem(MOCK_EXAMS_KEY);

    if (legacyB) {
      const targetKey = scopedStorageKey(BOOKMARKS_KEY);
      if (!window.localStorage.getItem(targetKey)) {
        window.localStorage.setItem(targetKey, legacyB);
      }
    }
    if (legacyP) {
      const targetKey = scopedStorageKey(PROGRESS_KEY);
      if (!window.localStorage.getItem(targetKey)) {
        window.localStorage.setItem(targetKey, legacyP);
      }
    }
    if (legacyM) {
      const targetKey = scopedStorageKey(MOCK_EXAMS_KEY);
      if (!window.localStorage.getItem(targetKey)) {
        window.localStorage.setItem(targetKey, legacyM);
      }
    }
    window.dispatchEvent(new Event("snai-storage-change"));
    return true;
  } catch {
    return false;
  }
}

export function clearCurrentUserProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(scopedStorageKey(BOOKMARKS_KEY));
  window.localStorage.removeItem(scopedStorageKey(PROGRESS_KEY));
  window.localStorage.removeItem(scopedStorageKey(MOCK_EXAMS_KEY));
  window.dispatchEvent(new Event("snai-storage-change"));
}

export function getBookmarks(): BookmarkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(scopedStorageKey(BOOKMARKS_KEY));
    return raw ? (JSON.parse(raw) as BookmarkItem[]) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().some((b) => b.id === id);
}

export function toggleBookmark(item: Omit<BookmarkItem, "savedAt">): boolean {
  if (typeof window === "undefined") return false;
  const current = getBookmarks();
  const exists = current.some((b) => b.id === item.id);
  const next = exists
    ? current.filter((b) => b.id !== item.id)
    : [{ ...item, savedAt: new Date().toISOString() }, ...current];
  window.localStorage.setItem(scopedStorageKey(BOOKMARKS_KEY), JSON.stringify(next));
  window.dispatchEvent(new Event("snai-storage-change"));
  return !exists;
}

export function getReadingProgress(): ReadingProgressItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(scopedStorageKey(PROGRESS_KEY));
    return raw ? (JSON.parse(raw) as ReadingProgressItem[]) : [];
  } catch {
    return [];
  }
}

export function recordTopicVisit(item: Omit<ReadingProgressItem, "lastVisitedAt" | "completed">) {
  if (typeof window === "undefined") return;
  const current = getReadingProgress();
  const existing = current.find((p) => p.id === item.id);
  const updated: ReadingProgressItem = {
    ...item,
    completed: existing?.completed ?? false,
    lastVisitedAt: new Date().toISOString(),
  };
  const next = [updated, ...current.filter((p) => p.id !== item.id)].slice(0, 50);
  window.localStorage.setItem(scopedStorageKey(PROGRESS_KEY), JSON.stringify(next));
  window.dispatchEvent(new Event("snai-storage-change"));
}

export function toggleTopicCompleted(id: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getReadingProgress();
  const existing = current.find((p) => p.id === id);
  if (!existing) return false;
  const nextCompleted = !existing.completed;
  const next = current.map((p) =>
    p.id === id ? { ...p, completed: nextCompleted } : p
  );
  window.localStorage.setItem(scopedStorageKey(PROGRESS_KEY), JSON.stringify(next));
  window.dispatchEvent(new Event("snai-storage-change"));
  return nextCompleted;
}

export type ThemePreference = "dark" | "light" | "system";

export function getStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "dark";
}

export function applyThemePreference(pref: ThemePreference) {
  if (typeof window === "undefined") return;
  const isDark =
    pref === "dark" ||
    (pref === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
}

export function setStoredTheme(theme: ThemePreference) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
  applyThemePreference(theme);
  window.dispatchEvent(new Event("snai-theme-change"));
}
