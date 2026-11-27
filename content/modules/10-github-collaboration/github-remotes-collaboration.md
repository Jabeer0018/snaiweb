---
title: "GitHub Remotes, Push/Pull & Pull Requests"
description: "Why local .git repositories need remote hosting, Git vs GitHub, origin, clone vs pull vs fetch, and Pull Request collaboration."
order: 1
source: "S&AI Github - Presentation_compressed.pdf (C10, pp. 1–42)"
addedAt: "2026-11-28"
updatedAt: "2026-11-28"
keywords: ["GitHub", "remote", "origin", "push", "pull", "fetch", "clone", "pull request"]
estimatedMinutes: 9
---

## Introduction & Intuition

In Module C09, Git gave you a local time machine inside the hidden `.git` directory on your laptop. However, every commit, branch, and snapshot lives on **one physical machine**. If that laptop is stolen, damaged, or wiped, your entire project history disappears. Furthermore, when Akash edits `payment.js` on his laptop and Priya edits `login.js`—or both edit `login.js` simultaneously—emailing zip files or passing USB drives quickly collapses into chaos.

**GitHub** solves both problems by acting as a **central remote host** in the cloud where teams synchronize their Git repositories.

---

## Technical Definition & Purpose

> [!IMPORTANT]
> **Git** is the distributed version control tool running locally on your machine. **GitHub** is a cloud hosting platform for Git repositories—providing backup, synchronization (`push`/`pull`), permissions, and **Pull Requests** for code review.

**Git ≠ GitHub:** You can use Git completely offline without GitHub, and GitHub itself hosts open-source ecosystems such as VS Code, React, Python, and the Linux kernel.

---

## Internal Working: Local `.git` ↔ Remote `origin`

1. **Local Repository (`.git`):** Stores your commits, branches (`main`), and `HEAD` pointer on disk.
2. **Remote Pointer (`origin`):** A named bookmark stored in `.git/config` pointing to a remote URL (e.g., `https://github.com/student/project.git`), added via `git remote add origin <url>`.
3. **Upstream Tracking (`-u`):** Running `git push -u origin main` uploads your local commits to GitHub and links your local `main` to `origin/main` so future `git push` and `git pull` commands need no extra arguments.

| Operation | When to Use | What It Changes Locally |
| --- | --- | --- |
| `git clone <url>` | First time copying an existing remote repo | Creates a new folder, downloads full `.git` history, checks out files, sets `origin` |
| `git fetch` | Check what teammates pushed without touching your code | Downloads remote commits into `origin/main` tracking refs only; working tree untouched |
| `git pull` | Synchronize your current branch with remote changes | Runs `git fetch` + `git merge` (integrates remote commits into your checked-out branch) |
| `git push` | Share your local committed snapshots to GitHub | Uploads local commits on the current branch to the remote repository |

---

## Worked Example: Two-Developer Team Workflow

Suppose Akash and Priya collaborate on `project-a`:

1. Akash initializes the project, creates a GitHub repo, links `origin`, and runs `git push -u origin main`.
2. Priya runs `git clone https://github.com/akash/project-a.git` once to get her own full copy.
3. Priya creates a feature branch (`git switch -c feat/login`), edits `login.js`, commits, and runs `git push -u origin feat/login`.
4. On GitHub, Priya opens a **Pull Request (PR)** asking to merge `feat/login` into `main`. Akash reviews the diff, leaves comments, and approves the merge.
5. Back on his laptop, Akash runs `git switch main && git pull` to download the merged changes cleanly.

---

## Technical Depth: Merge Conflicts & Access Control

- **Non-Fast-Forward Push Rejected:** If Priya pushed new commits to `main` while Akash was offline, GitHub rejects Akash's `git push` to prevent overwriting Priya's work. Akash must `git pull` (merge/rebase), resolve any overlapping line conflicts, commit, and then `git push`.
- **Collaborators vs. Forks:** Direct collaborators push branches to the same repo; external contributors **fork** (copy to their own GitHub account), push to their fork, and open a cross-repository Pull Request.

---

## Common Misconceptions

- **Misconception:** *"Git and GitHub are the same software."*  
  **Reality:** Git is the CLI version control engine; GitHub is a web platform hosting Git repositories (alternatives include GitLab and Bitbucket).
- **Misconception:** *"Editing a file on my laptop automatically updates GitHub."*  
  **Reality:** Nothing leaves your machine until you `git add`, `git commit`, and explicitly run `git push`.
- **Misconception:** *"git fetch overwrites my uncommitted work."*  
  **Reality:** `git fetch` only updates remote-tracking references (`origin/*`); `git pull` is what merges into your branch.

---

## Examination Perspective

- Distinguish **`git clone`** (first-time download of a repo) from **`git pull`** (updating an already-cloned repo) and **`git fetch`** (safe inspect-only download).
- Explain why **`git push` gets rejected** when the remote has commits your local branch lacks, and the exact recovery sequence (`git pull` -> resolve/commit -> `git push`).

---

## Concept Connections

- **Previous Module:** [Git Workflow, Staging & Branches](/notes/09-git-github/git-workflow-and-github)
- **Next Module:** [The Network (How packets carry git push to GitHub)](/notes/11-the-network/networks-devices-and-ip)
- **Commands:** `git-clone`, `git-remote`, `git-push`, `git-pull`, `git-fetch`

---

## Quick Revision

- **Git** = local CLI tool; **GitHub** = remote hosting + collaboration platform.
- **`origin`** = default name for the remote repository URL.
- **`clone`** = first copy; **`fetch`** = download refs safely; **`pull`** = `fetch` + `merge`; **`push`** = upload local commits.
- **Pull Request (PR):** Structured review gate before merging a branch into `main`.
