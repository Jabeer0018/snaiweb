---
title: "Git Workflow, Remotes & Pull Requests"
description: "History of Git, .git memory, HEAD, the 5-step workflow, GitHub collaboration, and Pull Requests."
order: 1
source: "Ultimate System & AI Essentials Notes (Modules 1 & 2)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["git", "github", "Linus Torvalds", "HEAD", "pull request", "clone", "pull"]
estimatedMinutes: 6
---

## Git Basics & History

- **Creator:** **Linus Torvalds** in **2005** (built in two weeks to support Linux kernel development).
- **`.git` folder:** Created by `git init`; stores all snapshots and history. **Do not edit or delete it manually.**
- **`HEAD`:** Git's marker for the version (checkpoint) you are currently viewing.

## The 5 Steps of the Git Workflow

![5-step Git and GitHub workflow diagram](/diagrams/git-workflow.svg)

1. **Change:** Edit your file (e.g., `notes.txt`).
2. **Check (`git status`):** See Untracked or Modified files.
3. **Select (`git add <file>`):** Move changes into the **Staging Area**.
4. **Record (`git commit -m "<msg>"`):** Save the snapshot permanently with a clear message (*"Add student registration form validation"*, not *"fixed stuff"*).
5. **Read History (`git log` / `git log --oneline`):** Inspect past commits.

## GitHub & Team Collaboration

**GitHub** (acquired by Microsoft in **2018**) hosts Git repositories in the cloud as a "Single Source of Truth".

- **Link remote:** `git remote add origin <URL>` (verify with `git remote -v`)
- **Upload:** `git push -u origin main` (then `git push` thereafter)
- **Download:**
  - `git clone <URL>` — downloads a whole project and its full history for the **first time**.
  - `git pull` — downloads only the **latest changes** to update an existing local repo.
- **Pull Requests (PRs):** Developers create a feature branch (e.g., `feature-login`), push, and open a **Pull Request** for teammates to review, approve, and merge into `main`.
