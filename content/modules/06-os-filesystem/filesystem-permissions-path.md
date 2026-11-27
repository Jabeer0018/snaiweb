---
title: "Filesystem, Permissions & PATH"
description: "Deep dive into Unix root (/), 'Everything is a file', executability rules, rwx vs octal permissions, chmod/chown, PATH, and which."
order: 1
source: "System & AI Essentials (C06)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["filesystem", "permissions", "chmod", "chown", "PATH", "which", "644", "755", "555"]
estimatedMinutes: 10
---

## A. What Is It?

The **Filesystem** is the organised hierarchical tree (rooted at `/`) where the OS stores all files, folders, programs, and device interfaces. **Permissions** (`r`, `w`, `x`) define who—Owner, Group, or Others—can read, modify, or execute each item. **`PATH`** is the shell's environment variable listing directories searched to locate commands.

## B. Why Does It Exist?

Without a structured filesystem and strict permissions, any user or buggy script could accidentally overwrite critical OS files or execute untrusted downloads. `PATH` exists so you can type `ls` from any folder without typing `/bin/ls` every time.

## C. How Does It Work?

1. **Unix Philosophy ("Everything Is a File"):** Regular files (`notes.txt`), executables (`/bin/ls`), and even hardware/terminal interfaces (`/dev/pts`, `/dev/input`) live under `/`.
2. **Executability Check:** To execute `./file`, the OS checks two conditions: (a) does it contain valid executable instructions/shebang, and (b) does the user have **execute (`x`) permission**? File extensions (`.txt`, `.sh`, `.banana`) do **not** determine executability.
3. **Directory vs. File Permissions:**
   - On a **file**: `r` = read contents, `w` = edit contents, `x` = run as program.
   - On a **directory**: `w` is required to create, rename, move, or delete entries inside that directory (`555` blocks `rm` or `mv` even if the file inside is `644`!).
4. **`PATH` Lookup:** The shell splits `PATH` by colons (`:`), e.g. `/usr/local/bin:/usr/bin:/bin`, and searches **left to right** until it finds the command.

## D. Practical Example

```bash
echo "echo Hello from a script" > hello.txt
./hello.txt          # FAILS: Permission denied (default 644 lacks x)
chmod +x hello.txt
mv hello.txt run_me.banana
./run_me.banana      # WORKS: prints "Hello from a script"
```

## E. Visual Explanation

| Permission | Symbol | Numeric Value |
| --- | --- | --- |
| Read | `r` | `4` |
| Write | `w` | `2` |
| Execute | `x` | `1` |
| None | `-` | `0` |

| Alphabetic (`ls -l`) | Owner | Group | Others | Octal Mode | Meaning |
| --- | --- | --- | --- | --- | --- |
| `-rw-r--r--` | `4+2=6` | `4` | `4` | **`644`** | Default new file (not executable) |
| `-rw-------` | `4+2=6` | `0` | `0` | **`600`** | Private file (owner read/write only) |
| `-rwxr-xr-x` | `4+2+1=7` | `4+1=5` | `4+1=5` | **`755`** | Standard executable / directory |
| `dr-xr-xr-x` | `4+1=5` | `4+1=5` | `4+1=5` | **`555`** | Read-only directory (blocks `rm`/`mv`) |
| `-rwxrwxrwx` | `7` | `7` | `7` | **`777`** | Full permissions for everyone |

## F. Technical Details

- **`chmod` vs. `chown`:** `chmod` changes permission bits (`chmod +x file`, `chmod 600 secret.txt`), whereas `chown newOwner file` transfers ownership to another user.
- **Empty `PATH`:** If `PATH=""`, typing `ls` fails (`command not found`), **but `/bin/ls` still works** because its exact absolute path bypasses `PATH`.
- **`which`:** `which ls` searches `PATH` and prints `/bin/ls`.

## G. Common Misconceptions

> [!WARNING]
> **"Renaming `script.txt` to `script.sh` makes it executable."**
> False. Extensions do not grant execution rights. Only `chmod` can set the execute (`x`) bit.

- **"If I own a `644` file inside a `555` folder, I can delete it."** False. Deleting or moving a file modifies the parent directory—you must temporarily add write permission (`chmod 755 dir`) first.

## H. Exam Perspective

Expect multi-step permission troubleshooting scenarios (like locking/unlocking `444` files inside `555` folders), octal ↔ symbolic conversions, and `PATH=""` edge cases.

## I. Related Concepts

- Commands: [chmod](/commands/chmod), [chown](/commands/chown), [ls](/commands/ls), [which](/commands/which)
- [C07 — Compilers vs Interpreters & Shebangs](/notes/07-how-software-works/compilers-vs-interpreters)

## J. Quick Revision

- Root = `/`; Everything is a file.
- `r=4, w=2, x=1`; default new file = `644` (`rw-r--r--`).
- Directory `w` bit controls adding/removing/moving entries inside it.
- `PATH` = colon-separated list searched left-to-right; `which` reveals the match.
