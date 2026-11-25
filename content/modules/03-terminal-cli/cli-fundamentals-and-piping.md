---
title: "CLI Fundamentals, Command Structure & Piping"
description: "Why developers use the CLI, command anatomy (command + option + argument), piping, and package managers."
order: 1
source: "System & AI Essentials (C03)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["CLI", "shell", "piping", "package manager", "homebrew", "command not found"]
estimatedMinutes: 6
---

## What Is a CLI?

> [!IMPORTANT]
> **CLI (Command Line Interface)** = a text-based user interface where users interact with a computer system by typing commands.

While creating 10 folders in a GUI is fine, creating 1000 folders via `mkdir folder_{1..1000}` takes a single command.

## Command Structure

Every CLI command follows the pattern: **`Command + Option/Flag + Argument(s)`**

```bash
cowsay -f dragon "I am a dragon"
```

- `cowsay` → the **command**
- `-f` → the **option/flag** (modifies behaviour)
- `dragon "I am a dragon"` → the **arguments**

Same pattern for `cp -r folder1 folder2`: `cp` is the command, `-r` is the option, `folder1 folder2` are the arguments.

## Piping (`|`)

Piping passes the **output** of one command as the **input** to the next command:

```bash
fortune | cowsay | lolcat
```

1. `fortune` generates a random quote
2. `cowsay` draws it in ASCII art
3. `lolcat` adds rainbow colours

## Why Commands Fail (`command not found`)

A command is simply an executable program. Built-in macOS commands like `say "text"` work immediately, while `cowsay` fails with `zsh: command not found: cowsay` until installed because the terminal can only run programs it can find.

## Package Managers by OS

| Package Manager | Operating System |
| --- | --- |
| **Homebrew (`brew`)** | macOS |
| **Chocolatey** | Windows |
| **`apt`** | Linux (Debian-based) |
| **`yum`** | Linux (RedHat/Yellowdog-based) |
| **`pacman`** | Linux (Arch-based) |
| **`flatpak`** | Linux (universal) |

> [!TIP]
> Browse every individual CLI command with syntax, flags, examples, and common mistakes in the **Command Library**.
