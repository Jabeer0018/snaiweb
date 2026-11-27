# THEME AUDIT — SNAI COURSE

## 1. Root Cause of the Attached Light-Mode Code Block Bug
In Light Mode on lesson pages (e.g. `/notes/06-os-filesystem/filesystem-permissions-path` -> `D. Practical Example`), `<CodeBlock>` rendered a dark background (`#27272a`) with dark text (`#171717`), making commands unreadable.

**Root Cause:**
1. `MarkdownRenderer.tsx` wraps lesson markdown inside `@tailwindcss/typography` (`prose prose-zinc dark:prose-invert`).
2. `@tailwindcss/typography` sets `background-color: var(--tw-prose-pre-bg)` (`#27272a` dark charcoal) on `.prose pre` even in Light Mode.
3. In `CodeBlock.tsx`, when `highlightedHtml` was not passed (all markdown lesson code blocks), `<pre>` had `text-foreground` (`#171717` in Light Mode) **without** an explicit background class or `not-prose` isolation—causing `.prose pre`'s dark `#27272a` background to pair with Light Mode's dark `#171717` foreground text.

## 2. Additional Theme Issues Found
- `components/MockExamRunner.tsx`: `Retry Incorrect` button used `hover:bg-accent hover:text-white`. In Dark Mode `--accent` is `#FAFAFA` (white), which would produce white-on-white text on hover. Replaced with `hover:text-accent-fg`.
- `lib/storage.ts` & `components/ThemeToggle.tsx`: Added `data-theme="light" | "dark"` alongside `.dark` class and a `snai-theme-change` custom event so multiple mounted `ThemeToggle` instances stay synchronized without page refresh.

## 3. Systemic Semantic Token Architecture (`styles/globals.css` & `tailwind.config.ts`)
Added dedicated semantic CSS variables for both `:root` (Light) and `.dark` (Dark):
- `--bg-primary`, `--bg-surface`, `--bg-elevated`
- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--border-subtle`, `--border-strong`
- `--accent`, `--accent-hover`, `--accent-muted`, `--accent-fg`
- `--code-bg`, `--code-fg`, `--code-header-bg`, `--code-border`
- `--inline-code-bg`, `--inline-code-fg`
- `--terminal-bg`, `--terminal-fg`
- `--status-success`, `--status-error`, `--status-warning`

`CodeBlock.tsx` now uses `not-prose border-code-border bg-code-bg` + `bg-code-header` + `text-code-fg` with `bg-transparent` on `<pre>`, guaranteeing matched foreground/background contrast in Light, Dark, and System themes.
