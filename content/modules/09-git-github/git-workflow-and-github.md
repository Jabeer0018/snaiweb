---
title: "Version Control with Git: Staging, Commits, Branches & Merging"
description: "Zero-to-advanced guide to why manual copies fail, .git & HEAD, the 3-area Git workflow, branching, fast-forward vs 3-way merges, and conflict resolution."
order: 1
source: "HYD - S&AI Git-2026 NEW (1)_compressed.pdf (C09, pp. 1–86)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["git", "version control", "staging", "commit", "branch", "merge", "HEAD", "conflict"]
estimatedMinutes: 13
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [Filesystem & Paths](/notes/06-os-filesystem/filesystem-permissions-path).

Every student has saved files like `project-final.txt`, `project-final-v2.txt`, and `project-final-actual.txt`. Within a week, nobody remembers what changed between `v2` and `actual`, or which version broke the working code. In this lesson, you will learn how **Git** replaces messy copies with a **time machine for your project**.

---

## 2. Stage 1 & 2: Intuition — The Photography Shoot Analogy

Think of taking a family portrait:
- **Working Directory:** Your living room where people move around, change outfits, and rearrange chairs (files you are actively editing).
- **Staging Area (`git add`):** Asking specific people to **step onto the stage** for the photo. Unrelated edits stay in the living room out of this shot!
- **Local Repository (`git commit`):** Clicking the camera shutter—saving a **permanent, timestamped snapshot** with a caption (`-m "Add login validation"`) inside the hidden `.git/` vault.

**Where the analogy stops being accurate:** A camera only keeps isolated photos. Git links each snapshot to its **parent commit**, forming a traceable graph where you can jump to any commit (`HEAD`), compare exact line diffs (`git diff`), and split timelines with **branches**.

---

## 3. Stage 3 & 4: Internal Working — `.git`, `HEAD` & The 3-Area Workflow

![Git Workflow: Working Directory, Staging Area, Local Repo, and Remote GitHub](/diagrams/git-workflow.svg)

When you run `git init` inside `my_app/`, Git creates a hidden `.git/` directory containing your entire commit database, branch pointers, and `HEAD` (a pointer telling Git *which branch or commit you are currently standing on*).

Every file in your folder sits in one of four states:
1. **Untracked:** Brand-new file Git has never seen (`git status` lists it under *Untracked files*).
2. **Modified:** Tracked file edited since the last commit, not yet staged.
3. **Staged:** Marked with `git add` to go into the *next* snapshot.
4. **Committed:** Safely stored as an immutable snapshot in `.git/`.

### Branching & Merging (`branch`, `switch`, `merge`)
A **branch** in Git is **not** a full copy of your folder—it is simply a lightweight 41-byte movable pointer to a commit!
- `git switch -c feat/login` creates a new branch pointer and moves `HEAD` onto it, letting you experiment safely without touching `main`.
- **Fast-Forward Merge:** If `main` has zero new commits since you branched, `git merge feat/login` simply slides the `main` pointer forward.
- **3-Way Merge & Merge Conflicts:** If both `main` and `feat/login` edited different files, Git combines both automatically. If both edited the **exact same lines**, Git pauses and marks the conflict (`<<<<<<< HEAD ... ======= ... >>>>>>>`) so *you* choose the right code, `git add`, and `git commit`.

---

## 4. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Initializing & Making Your First Snapshot
```bash
mkdir notes_repo && cd notes_repo
git init
echo "Lecture 1" > readme.md
git status                # Shows readme.md as Untracked
git add readme.md         # Moves readme.md to Staging Area
git commit -m "Add readme"
git log --oneline         # Displays commit hash + message
```

### Intermediate Example: Staged vs. Unstaged Trap (Exam Classic!)
Suppose `app.py` is committed with `v1`. You edit `app.py` to `v2`, run `git add app.py`, and **then edit `app.py` again to `v3` without running `git add`**. Now you run `git commit -m "Update"`. What gets saved in the commit? **`v2`!** Because `git commit` only captures whatever snapshot was in the **Staging Area**, leaving `v3` as an uncommitted modification in your Working Directory.

### Advanced Example: Branching, Merging & Conflict Markers
1. On `main`, `config.txt` has `PORT=3000`.
2. Create branch `dev`: `git switch -c dev`, change line 1 to `PORT=8080`, commit.
3. Switch back to `main`: `git switch main`, change line 1 to `PORT=5000`, commit.
4. Run `git merge dev` -> **CONFLICT**! Open `config.txt`, delete the `<<<<<<<` / `=======` / `>>>>>>>` markers leaving `PORT=8080`, then run `git add config.txt && git commit -m "Resolve port conflict"`.

---

## 5. Common Misconceptions & Quick Revision

- **Misconception:** *"git add uploads my files to GitHub."*  
  **Reality:** `git add` is 100% local—it only prepares files in your laptop's Staging Area.
- **Misconception:** *"Deleting `.git/` only deletes settings while keeping my commit history."*  
  **Reality:** Deleting `.git/` destroys **every commit, branch, and history** stored locally!
- **Quick Revision:** `Working Tree` -> `git add` -> `Staging Area` -> `git commit` -> `.git Repo`; **Branch** = lightweight movable commit pointer; **Conflict** = same lines edited on two branches.
- **Source Reference:** `HYD - S&AI Git-2026 NEW (1)_compressed.pdf` (C09, pp. 1–86).
