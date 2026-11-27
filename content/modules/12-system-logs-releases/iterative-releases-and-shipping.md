---
title: "Iterative Releases, CLI Args & Deployment Safety"
description: "Knight Capital's 2012 $460M deployment disaster, cross-OS log assumptions, sys.argv, dictionaries, and 5-release Git discipline."
order: 2
source: "worksheet-12b.pdf (Lecture 12, Part 2 of 2, pp. 1–13)"
addedAt: "2026-11-28"
updatedAt: "2026-11-28"
keywords: ["Knight Capital", "deployment", "sys.argv", "dictionaries", "releases", "git"]
estimatedMinutes: 9
---

## Introduction & Intuition: Eight Servers, One Disaster

On **1 August 2012**, **Knight Capital Group**—the largest US equities market maker—deployed updated trading software across **8 servers** by hand. A technician updated 7 servers, missing the 8th. That 8th server still held an old, dormant function called **Power Peg**, and the new code happened to reuse a flag Power Peg watched for. At 9:30 a.m. market open, the 8th server bought and sold 397 million shares in 45 minutes, losing **\$460 million** and bankrupting the firm by lunch.

Nobody wrote a syntax bug. The disaster happened because **nobody could prove which exact version was running where**.

---

## Technical Definition & Purpose

> [!IMPORTANT]
> **Iterative release engineering** means evolving software in small, verifiable increments—testing each release against diverse inputs, verifying results by hand, and committing + pushing each completed version before starting the next.

As Worksheet 12b emphasizes: **"A program that only works on your machine isn't a program yet. It's a note to yourself."**

---

## Internal Working: Removing Hardcoded Assumptions (`sys.argv` & Dictionaries)

When a macOS student swaps log files with an Ubuntu Linux student, a hardcoded parser fails because log column positions differ across operating systems. Turning a fragile script into a real CLI tool requires three upgrades:

1. **Command-Line Arguments (`sys.argv`):** Instead of hardcoding a filename or column index inside Python, read them dynamically from `sys.argv`:
   ```python
   import sys
   filename = sys.argv[1]       # e.g., "mylog.txt"
   position = int(sys.argv[2])  # sys.argv values arrive as strings!
   ```
2. **Case-Insensitive Matching (`.lower()`):** Normalize text lines (`line.lower()`) so `"Wake"` and `"wake"` are both matched.
3. **Aggregation with Dictionaries (`{}`):** Count occurrences per subsystem/process cleanly:
   ```python
   counts = {}
   for key in tokens:
       counts[key] = counts.get(key, 0) + 1
   ```

---

## Worked Example: The 5-Release Shipping Discipline (`v0.1` -> `v0.5`)

In Worksheet 12b, a scratch script becomes a verified tool across **5 small releases**, with a strict rule: **never start the next release until the current one is tested on both macOS & Linux logs, hand-checked, committed, and pushed**:

- **v0.1:** Reads a single hardcoded log file (`"it printed something"`).
- **v0.2:** Accepts `filename` and `position` via `sys.argv` (`python3 summary.py partnerlog.txt 6`).
- **v0.3:** Adds keyword filtering (`if keyword in line.lower()`).
- **v0.4:** Aggregates frequency counts using a Python dictionary.
- **v0.5:** Formats a visual ASCII bar chart (`"#" * count`) for terminal readability.

---

## Common Misconceptions

- **Misconception:** *"`sys.argv[2]` is automatically an integer if the user typed `4`."*  
  **Reality:** All CLI arguments arrive in `sys.argv` as **strings** (`"4"`). You must convert with `int(sys.argv[2])` before using it for indexing or math.
- **Misconception:** *"Because my script printed numbers, the output is correct."*  
  **Reality:** Always verify outputs **by hand** on a small sample—especially when switching between different OS log formats.

---

## Examination Perspective

- Connect the **Knight Capital (2012)** case study to **version control & deployment hygiene**: reproducible builds, automated deploys, and knowing exact committed versions per server.
- Understand why `sys.argv[0]` is the script name while `sys.argv[1]` is the first user argument, and why `int()` conversion is required.

---

## Concept Connections

- **Previous Lesson:** [System Logs, CLI Filtering & Log Privacy](/notes/12-system-logs-releases/system-logs-and-analysis)
- **Commands:** `python3`, `diff`, `git-commit`, `git-push`

---

## Quick Revision

- **Knight Capital (2012):** Missed 1 of 8 servers -> dormant Power Peg woke -> \$460M loss in 45 min.
- **`sys.argv`:** Arguments arrive as **strings**; `int(sys.argv[2])` converts to integer.
- **Release rule:** Write -> Test on diverse inputs -> Hand-verify -> Commit -> Push before starting next release.
