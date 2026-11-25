---
title: "OS Roles, Processes, Timeslicing & Memory"
description: "How the OS manages processes, parent/child hierarchies, CPU timeslicing, memory isolation, and SIGTERM vs SIGKILL."
order: 1
source: "System & AI Essentials (C05)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["OS", "process", "timeslicing", "SIGTERM", "SIGKILL", "memory isolation"]
estimatedMinutes: 6
---

## Four Roles of an Operating System

1. **Manage Process & Memory:** Creates, schedules, and manages running programs while allocating RAM.
2. **Manage Devices:** Controls hardware (keyboard, mouse, printer, storage) via device drivers.
3. **Manage Files & Storage:** Organises files/folders, controls access, manages SSDs/HDDs.
4. **Provide User Interface:** Provides a GUI or CLI for user interaction.

## Program vs. Process

- **Program:** Instructions stored on disk.
- **Process:** A program currently being executed in RAM. One installed program (e.g., Chrome) can create multiple independent processes (e.g., separate tabs—if one crashes, others keep running).

### Parent & Child Processes

- **Parent Process:** Creates one or more child processes (e.g., the Shell).
- **Child Process:** Created by a parent and executes independently (e.g., `pwd`, `ls`, `mkdir`, `touch`, `cat` run as child processes of the shell).

## Timeslicing & Memory Isolation

![Parent/Child processes and CPU timeslicing diagram](/diagrams/os-process-timeslicing.svg)

- **Timeslicing:** The CPU gives each process a tiny time slice (switching thousands of times per second), creating the illusion of simultaneous execution. Even if a runaway Python script consumes high CPU, the OS keeps other apps running without crashing.
- **Memory Management:** Each process receives its own **exclusive RAM space** so Chrome cannot read VS Code's memory.

## Process CLI Tools & Signals

- `ps` (current terminal only) vs. `ps aux` (all system processes) vs. `top` / `htop` (live views).
- `kill <PID>` sends **SIGTERM (15)** — polite request allowing cleanup.
- `kill -9 <PID>` sends **SIGKILL (9)** — forced immediate termination without cleanup.
