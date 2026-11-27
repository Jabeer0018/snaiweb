"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  applyThemePreference,
  getStoredTheme,
  setStoredTheme,
  ThemePreference,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyThemePreference(stored);
    setMounted(true);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (getStoredTheme() === "system") {
        applyThemePreference("system");
      }
    };
    const onThemeSync = () => {
      setTheme(getStoredTheme());
    };
    mq.addEventListener("change", onSystemChange);
    window.addEventListener("snai-theme-change", onThemeSync);
    return () => {
      mq.removeEventListener("change", onSystemChange);
      window.removeEventListener("snai-theme-change", onThemeSync);
    };
  }, []);

  function selectTheme(next: ThemePreference) {
    setTheme(next);
    setStoredTheme(next);
  }

  const options: { key: ThemePreference; label: string; icon: typeof Sun }[] = [
    { key: "light", label: "Light", icon: Sun },
    { key: "dark", label: "Dark", icon: Moon },
    { key: "system", label: "System", icon: Monitor },
  ];

  return (
    <div
      role="group"
      aria-label="Theme preference"
      className="inline-flex items-center rounded-md border border-border bg-surface p-0.5"
    >
      {options.map(({ key, label, icon: Icon }) => {
        const active = mounted && theme === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => selectTheme(key)}
            aria-label={`${label} theme`}
            aria-pressed={active}
            title={`${label} theme`}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-subtle hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
