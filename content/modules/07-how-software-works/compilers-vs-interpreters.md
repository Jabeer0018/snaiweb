---
title: "Compilers vs. Interpreters & Shebangs"
description: "Why translation always happens, Grace Hopper's insight, C vs Python history, and shebang/path rules."
order: 1
source: "System & AI Essentials (C07) & Ultimate Notes (Module 3)"
addedAt: "2026-11-26"
updatedAt: "2026-11-27"
keywords: ["compiler", "interpreter", "Grace Hopper", "shebang", "absolute path", "relative path"]
estimatedMinutes: 8
---

## Intuition & Core Principle

> [!IMPORTANT]
> The CPU **only** executes **machine code** (binary instructions). Every high-level program must be translated into binary—the only difference between a **compiler** and an **interpreter** is **when** translation happens and **whether a standalone binary is saved**.

**Grace Hopper** pioneered the first compiler in the 1950s so programmers could write human-readable symbols instead of hand-coding binary opcodes. When you run `python3 hello.py`, **two separate programs** are involved: the compiled Python interpreter binary (`/usr/bin/python3`) and your text source file (`hello.py`).

---

## Compilers vs. Interpreters

| Dimension | Compiler (e.g., `gcc` for C) | Interpreter (e.g., `python3` for Python) |
| --- | --- | --- |
| **Translation Timing** | **Ahead of time** (before execution): translates the entire source file into a machine-code executable (`./a.out`). | **At runtime** (line-by-line / bytecode): reads and executes instructions as the program runs. |
| **Runtime Speed** | Very fast—CPU runs native machine code directly with zero translation overhead. | Slower—interpreter software sits in the loop decoding instructions during execution. |
| **Error Discovery** | Catches syntax and type errors across the entire program **before** running a single line. | May run earlier lines successfully and crash only when execution reaches a broken line. |
| **Portability** | Compiled binary is tied to a specific OS + CPU architecture (e.g., macOS ARM64 binary won't run on Linux x86). | Same `.py` source runs anywhere a matching interpreter is installed. |

---

## Historical Context: C vs. Python

- **C (1972, Dennis Ritchie):** Built alongside UNIX so operating systems could be written in portable high-level code instead of hardware-locked assembly, while compiling down to near-assembly speed.
- **Python (1991, Guido van Rossum):** Designed for **programmer readability and rapid iteration**, trading raw execution speed for clean syntax and dynamic interpretation.

---

## Shebangs (`#!`) & Path Resolution

On Unix-like systems (macOS/Linux), a text script can be run directly (`./script.py`) if two conditions hold:

1. **Shebang on Line 1:** Tells the OS kernel *which interpreter* should run the file:
   ```bash
   #!/usr/bin/env python3
   ```
   Using `/usr/bin/env python3` is preferred over hardcoding `/usr/bin/python3` because it looks up `python3` dynamically via `$PATH`.
2. **Execute Permission:** `chmod +x script.py` (or `chmod 755 script.py`).

Remember how paths resolve when invoking executables or scripts:

- **Absolute Path:** Starts at root `/` (e.g., `/Users/student/app/run.sh`). Works regardless of current directory.
- **Relative Path:** Resolved from `pwd` (e.g., `./run.sh` for current folder, `../data/input.txt` for parent). Typing `run.sh` without `./` fails unless the current folder is in `$PATH` (which is intentionally disabled for security).

---

## Worked Example: Tracing `gcc` vs. `python3`

1. **Compiled workflow:**
   ```bash
   gcc hello.c -o hello
   ./hello
   ```
   Step 1 produces a standalone binary `hello`. If `hello.c` has a syntax error on line 50, `hello` is not created at all.
2. **Interpreted workflow:**
   ```bash
   python3 hello.py
   ```
   Line 1 (`print("Start")`) actually prints `"Start"` even if line 10 has a `NameError`, because translation/execution happens sequentially at runtime.

---

## Common Misconceptions

- **Misconception:** *"Interpreted languages never become machine code."*  
  **Reality:** The CPU still only understands machine code; the interpreter binary translates and executes operations on the CPU's behalf at runtime.
- **Misconception:** *"Putting `#!/usr/bin/env python3` on line 2 works the same as line 1."*  
  **Reality:** The OS kernel checks only the **very first two bytes (`#!`)** of the file; a shebang anywhere else is treated as an ordinary comment.

---

## Exam Perspective

- Identify why a compiled program catches syntax errors before execution while an interpreted script can print partial output before failing.
- Know the two requirements to run `./myscript.sh` directly: **shebang on line 1** + **execute permission (`+x`)**.

---

## Related Concepts

- [Software Stack & Operating Systems](/notes/02-hardware-software/software-and-operating-systems)
- [Filesystem, Permissions & PATH](/notes/06-os-filesystem/filesystem-permissions-path)
- [Command Library: gcc, python3, bash](/commands)

---

## Quick Revision

- **CPU** executes only **machine code**.
- **Compiler (`gcc`):** Translates all code upfront -> fast native binary, compile-time checks, platform-specific binary.
- **Interpreter (`python3`):** Translates at runtime -> slower execution, portable source, runtime error discovery.
- **Shebang (`#!/usr/bin/env python3`):** Must be on **line 1** + `chmod +x`.
