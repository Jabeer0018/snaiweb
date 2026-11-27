---
title: "Git Workflow, Staging Mechanics, Remotes & Pull Requests"
description: "Deep mechanism of Git's working directory, staging index, HEAD snapshots, shell redirection interaction, GitHub remotes, and Pull Requests."
order: 1
source: "Ultimate System & AI Essentials Notes (Modules 1 & 2)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["git", "github", "staging", "HEAD", "Linus Torvalds", "pull request", "clone", "pull"]
estimatedMinutes: 9
---

## A. What Is It?

**Git** is a distributed Version Control System (created in **2005** by **Linus Torvalds** in two weeks for Linux kernel development) that records project history as snapshots inside a hidden `.git` folder. **GitHub** (acquired by Microsoft in **2018**) is a cloud platform hosting Git repositories as a shared "Single Source of Truth."

## B. Why Does It Exist?

Saving manual copies like `notes.txt`, `notes-old.txt`, and `notes-final.txt` is error-prone, and `Ctrl+Z` (Undo) cannot explain *who* changed something or *why*. Git solves local version tracking; GitHub solves team collaboration without emailing ZIP files or passing USB drives.

## C. How Does It Work? (The Three-State Mechanism)

Git separates files into three distinct areas:
1. **Working Directory:** The actual files on your disk that you edit.
2. **Staging Area (Index):** The proposed snapshot you are preparing for the next commit.
3. **Local Repository (`.git`):** Permanent commit history; **`HEAD`** marks the checkpoint you are currently viewing.

![5-step Git and GitHub workflow diagram](/diagrams/git-workflow.svg)

## D. Worked Example — Why Staging Matters

Assume an initialized repository with `notes.txt` containing `A`. Watch what happens when you stage `A`, overwrite the working file with `B`, and then commit:

```bash
echo "A" > notes.txt
git add notes.txt
echo "B" > notes.txt
git commit -m "Add notes"
```

**State-by-state trace:**
1. After `git add notes.txt`: Working file = `A`; **Staged snapshot = `A`**.
2. After `echo "B" > notes.txt`: Working file = `B` (overwritten by `>`); **Staged snapshot is STILL `A`** because editing a file does not automatically update the Staging Area.
3. After `git commit -m "Add notes"`: **`HEAD` records `A`**, while working file `B` remains an unstaged modification in `git status`.

To commit `B`, you must run `git add notes.txt` again before committing—and a later edit never alters an existing past commit!

## E. Visual Explanation — Remote Collaboration

| Command | Purpose |
| --- | --- |
| `git remote add origin <URL>` | Links local repo to GitHub under nickname `origin` |
| `git remote -v` | Displays `fetch` (download) and `push` (upload) URLs |
| `git push -u origin main` | Uploads `main` to `origin` and saves upstream link (future: `git push`) |
| `git clone <URL>` | Downloads entire project + full history for the **first time** |
| `git pull` | Downloads only the **latest changes** into an existing local repo |

## F. Technical Details — Feature Branches & Pull Requests

Teams do not commit directly to `main`. Instead:
1. Create a branch: `git checkout -b feature-login`.
2. Commit changes and push the branch to GitHub.
3. Open a **Pull Request (PR)** so teammates can review code, leave feedback, approve, and merge into `main`.

## G. Common Misconceptions

> [!WARNING]
> **"Editing a file after `git add` automatically updates what `git commit` will save."**
> False. `git commit` snapshots the **Staging Area**, not the current working directory.

- **"`git pull` and `git clone` do the same thing."** False. `git clone` is for a first-time download; `git pull` updates an existing local repository.

## H. Exam Perspective

Expect questions tracing `echo "..." > file` interleaved with `git add` and `git commit`, distinguishing `git status` vs `git log --oneline`, and choosing `git clone` vs `git pull`.

## I. Related Concepts

- Commands: [git init](/commands/git-init), [git status](/commands/git-status), [git add](/commands/git-add), [git commit](/commands/git-commit), [git log](/commands/git-log), [git push](/commands/git-push), [git clone](/commands/git-clone), [git pull](/commands/git-pull)
- [C11 — Networks, Devices, Internet & IPv4](/notes/11-the-network/networks-devices-and-ip)

## J. Quick Revision

- 5-step workflow: `Change -> Check (git status) -> Select (git add) -> Record (git commit) -> Read (git log)`.
- `.git` is Git's memory; `HEAD` points to the current version.
- Never write vague commit messages like `"fixed stuff"`.
