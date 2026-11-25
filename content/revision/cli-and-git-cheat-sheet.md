---
title: "CLI & Git/GitHub Quick Reference"
moduleSlug: "03-terminal-cli"
moduleTitle: "C03 — Terminal & CLI Commands"
type: "confused-commands"
summary: "Side-by-side summary of CLI commands, redirection (> vs >>), recursive flags (-r), and Git/GitHub workflows."
source: "System & AI Essentials (C03) & Ultimate Notes (Modules 1-2)"
addedAt: "2026-11-26"
keywords: ["cli", "git", "github", "cheat sheet", "commands", "rm -r", "cp -r"]
---

### Frequently Confused Commands

- **`>` vs. `>>`:** `echo "hi" > file.txt` **overwrites** the file; `echo "hi" >> file.txt` **appends** to the end.
- **`cp` vs. `mv`:** `cp` copies and keeps the original (overwriting destination if it exists); `mv` moves or renames and removes the original path.
- **`cp` / `rm` on folders:** Both fail on directories with `Is a directory` unless you add **`-r`** (recursive).
- **`ps` vs. `ps aux`:** Plain `ps` shows only current terminal processes; `ps aux` shows all system processes.
- **`kill <PID>` vs. `kill -9 <PID>`:** `SIGTERM (15)` politely asks to exit; `SIGKILL (9)` forces immediate termination.
- **`git clone` vs. `git pull`:** `git clone <URL>` downloads a repo for the **first time**; `git pull` updates an **existing** local repo.

### 5-Step Git Workflow

`Change (edit) -> Check (git status) -> Select (git add <file>) -> Record (git commit -m "<msg>") -> Read (git log --oneline)`
