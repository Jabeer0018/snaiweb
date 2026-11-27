---
title: "How Software Works: Compilers, Interpreters & Shebangs"
description: "Zero-to-advanced guide to machine code, Grace Hopper's compiler insight, C vs Python execution, shebang (#!) rules, and path resolution."
order: 1
source: "HYD - S&AI Lecture 7.pdf (C07, pp. 1–32)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["compiler", "interpreter", "Grace Hopper", "shebang", "gcc", "python3", "machine code"]
estimatedMinutes: 10
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [CLI Fundamentals](/notes/03-terminal-cli/cli-fundamentals-and-piping) and [Filesystem & Permissions](/notes/06-os-filesystem/filesystem-permissions-path).

You write `print("Hello")` in Python or `printf("Hello");` in C—both look like readable English words, yet earlier we learned a CPU only understands binary `0`s and `1`s. How does English-like code become electrical signals? And why does C require an extra `gcc` step while Python runs immediately?

---

## 2. Stage 1 & 2: Intuition — Translating a Book vs. a Live Interpreter

Imagine reading a novel written in Japanese when you only speak English:
- **Compiler (Book Translator):** Translates the **entire novel upfront** into a printed English book (`hello` executable binary). Once translated, anyone who speaks English reads it at full speed without needing the translator in the room—**unless** there was a typo on page 190, in which case the translator stops before publishing the book.
- **Interpreter (Live Simultaneous Interpreter):** Sits next to you while you read line by line (`python3 hello.py`), translating each sentence on the spot. You start reading immediately, and sentences 1–5 work fine—until you hit an untranslatable typo on sentence 6 and stop mid-way.

**Where the analogy stops being accurate:** Modern Python actually compiles `.py` source internally into compact **bytecode** (`.pyc`) before its virtual machine interprets that bytecode—still slower than native C machine code, and still requiring the Python interpreter binary at runtime.

---

## 3. Stage 3 & 4: Grace Hopper, Machine Code & Two-Program Execution

**Grace Hopper** pioneered the first compiler in the 1950s, proving humans could write symbolic instructions and let a program translate them into CPU **machine code**.

> [!IMPORTANT]
> Every high-level program ends up executing as **machine code** on the CPU. The only difference between compiled and interpreted languages is **when translation happens** and **whether a standalone binary is saved to disk**.

When you run `python3 hello.py`, **two separate programs** are involved:
1. `/usr/bin/python3` — the **compiled machine-code interpreter** running as a process.
2. `hello.py` — your **plain-text script** passed as an argument for `python3` to read and execute.

| Feature | Compiler (`gcc hello.c -o hello`) | Interpreter (`python3 hello.py`) |
| --- | --- | --- |
| **When Translation Happens** | **Ahead of time** (before running) | **At runtime** (as the script runs) |
| **Output Artifact** | Standalone native binary (`./hello`) | None required to run; source `.py` stays text |
| **Execution Speed** | Very fast (native CPU instructions) | Slower (interpreter overhead during execution) |
| **Error Detection** | Syntax/type errors caught **before** any line runs | Earlier lines execute and print output before crashing at a broken line |
| **Portability** | Binary is tied to one OS + CPU architecture | Same `.py` script runs anywhere Python is installed |

---

## 4. Stage 5: Shebangs (`#!`) & Direct Script Execution

If you want to run `./greet.py` directly without typing `python3` in front, the OS kernel needs two things:
1. **Shebang on Line 1:** The exact first two characters `#!` followed by the interpreter path:
   ```python
   #!/usr/bin/env python3
   print("Hello from executable script!")
   ```
   Using `/usr/bin/env python3` looks up `python3` via `$PATH` instead of hardcoding a machine-specific folder.
2. **Execute Permission:** `chmod +x greet.py` (without `+x`, the OS refuses to launch it).

---

## 5. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Partial Output Trap
Consider `test.py`:
```python
print("Step 1 OK")
print(undefined_variable)
```
Running `python3 test.py` prints `Step 1 OK` **first**, then crashes with `NameError`. In C (`gcc`), a similar undeclared identifier fails during compilation so **nothing runs at all**.

### Intermediate Example: Moving a Binary Across OSes
You compile `gcc app.c -o app` on macOS (Apple Silicon ARM64) and send `app` to a friend on Ubuntu x86_64 Linux. It fails with `cannot execute binary file: Exec format error` because compiled binaries encode OS system calls and CPU-specific machine instructions. Sharing `app.c` so they recompile on Ubuntu solves it.

### Advanced Example: Why Putting `#!/usr/bin/env python3` on Line 2 Fails
If line 1 is a blank line or `# comment`, the OS kernel does not see `#!` at byte offset `0`. It falls back to your default shell (`zsh`/`bash`), which tries to run Python syntax like `def main():` as shell commands and fails with `syntax error`!

---

## 6. Common Misconceptions & Quick Revision

- **Misconception:** *"Interpreted languages run without ever becoming machine code."*  
  **Reality:** The CPU only executes machine code; the interpreter binary executes machine instructions on your script's behalf.
- **Quick Revision:** `gcc` = ahead-of-time native binary (fast, OS/CPU-specific); `python3` = runtime interpreter (portable source, partial execution before runtime errors); `./script` needs **Line 1 `#!`** + **`chmod +x`**.
- **Source Reference:** `HYD - S&AI Lecture 7.pdf` (C07, pp. 1–32).
