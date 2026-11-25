---
title: "Filesystem, Permissions & PATH"
description: "Unix file philosophy, alphabetic vs numeric permissions (644, 755, 600), chmod/chown, and how PATH + which locate commands."
order: 1
source: "System & AI Essentials (C06)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["filesystem", "permissions", "chmod", "chown", "PATH", "which", "644", "755"]
estimatedMinutes: 7
---

## The Filesystem & Unix Philosophy

- Everything on your computer is stored under the **root** location (`/`).
- **Unix philosophy:** *"Everything is a file"* — including device interfaces like `/dev/pts` and `/dev/input`.
- **Key distinction:** Program on disk = **File**. Program in execution = **Process**.

## What Makes a File Executable?

For a file to run, the OS checks **two** things:
1. Does it contain executable instructions?
2. Does the user have **execute (`x`) permission**?

The filename or extension does **not** matter (`mv hello.txt run_me.banana` still executes once `chmod +x` is applied).

## File Permissions (`rwx` & Numeric)

Permissions apply to three categories: **Owner**, **Group**, and **Others**.

| Permission | Symbol | Numeric Value |
| --- | --- | --- |
| Read | `r` | `4` |
| Write | `w` | `2` |
| Execute | `x` | `1` |
| None | `-` | `0` |

- New files default to `rw-r--r--` (**`644`**) — not executable by default for security.
- Full permissions `rwxrwxrwx` = **`777`**.
- `rwxr-xr-x` = **`755`**.
- Private file `rw-------` = **`600`**.

## `PATH` and `which`

- **`PATH`** is an environment variable containing a colon-separated list of directories (e.g., `/usr/local/bin:/usr/bin:/bin`) searched left-to-right by the shell.
- If `PATH` is empty, `ls` fails with `command not found`, while `/bin/ls` (absolute path) still works.
- **`which ls`** searches `PATH` and prints the exact executable location.

**Summary Flow:** `Filesystem stores files -> Permissions decide who executes -> PATH helps shell locate commands -> which shows the location.`
