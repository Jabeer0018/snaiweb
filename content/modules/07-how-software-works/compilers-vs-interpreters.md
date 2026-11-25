---
title: "Compilers vs. Interpreters & Shebangs"
description: "Why translation always happens, Grace Hopper's insight, C vs Python history, and shebang/path rules."
order: 1
source: "System & AI Essentials (C07) & Ultimate Notes (Module 3)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["compiler", "interpreter", "Grace Hopper", "shebang", "absolute path", "relative path"]
estimatedMinutes: 6
---

## Machine Code & Grace Hopper

The CPU **only** understands **machine code** (binary instructions). Every program ends up as binary—the only question is **when** translation happens and **who** does it. **Grace Hopper** pioneered the idea of translating human-readable code into machine code.

When you run `python3 hello.py`, **two** programs are involved: the Python interpreter (`/usr/bin/python3`) and your script (`hello.py`).

## Compilers vs. Interpreters

| Feature | Compilers (e.g., C — 1972, Dennis Ritchie) | Interpreters (e.g., Python — 1989, Guido van Rossum) |
| --- | --- | --- |
| **How it translates** | Translates the **whole program** at once | Translates **line by line** |
| **When it translates** | **Before** running the program | **While** running the program |
| **Output** | Creates an executable binary (`.exe`, `a.out`) | Immediate execution (no output file) |
| **Why it was created** | Machine time was expensive; optimised for fast CPU execution (`~0.001 s`) | Programmer time was expensive; optimised for developer productivity (`~0.1 s`) |

## Shebang (`#!`) & Paths

- **Shebang (`#!/bin/bash`):** Placed at the very top of a script to tell the OS which interpreter should run it. Combined with `chmod +x`, `./script.sh` runs automatically.
- **Absolute Path:** Complete path starting from root `/` (e.g., `/Users/karansharma/practice/hello.py`).
- **Relative Path:** Path starting from your current directory (e.g., `./hello.py` or `Desktop/Git/notes.txt`).
