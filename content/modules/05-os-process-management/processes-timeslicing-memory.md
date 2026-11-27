---
title: "OS Roles, Processes, Timeslicing & Memory"
description: "Deep dive into the 4 OS roles, program vs process, parent/child hierarchies, CPU timeslicing, memory isolation, and SIGTERM vs SIGKILL."
order: 1
source: "System & AI Essentials (C05)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["OS", "process", "timeslicing", "SIGTERM", "SIGKILL", "memory isolation", "PID"]
estimatedMinutes: 9
---

## A. What Is It?

An **Operating System (OS)** is the system software that acts as a bridge between the user and computer hardware. A **program** is a passive collection of instructions stored on disk, whereas a **process** is a program that has been loaded into RAM and is actively executing.

## B. Why Does It Exist?

Modern computers run dozens of tasks simultaneously—playing music, rendering a browser, compiling code, and handling network packets—often on a limited number of CPU cores. Without an OS coordinating **process scheduling** and **memory isolation**, one buggy or CPU-hungry program would freeze the entire machine or corrupt another app's data.

## C. How Does It Work?

1. **Launching a Process:** When you double-click an app or run a command, the OS (1) finds the program on disk, (2) loads it into RAM, (3) creates a process with a unique **PID** (Process ID), and (4) schedules it on the CPU.
2. **Parent & Child Processes:** A running process (such as your Shell) can spawn **child processes** (`pwd`, `ls`, `mkdir`, `cat`). Each child executes independently while maintaining a parent relationship.
3. **Timeslicing:** The CPU gives each process a tiny slice of time (a few milliseconds) before switching to the next process thousands of times per second, creating the illusion of simultaneous execution.
4. **Memory Isolation:** The OS allocates an **exclusive** portion of RAM to each process so Chrome cannot read VS Code's variables or overwrite Apple Music's memory.

## D. Practical Example

Suppose a student runs a CPU-intensive infinite loop in Python while Spotify and a browser are open:
- Running `htop` or Activity Monitor shows the Python process at the top consuming ~99% CPU.
- Other apps become slightly slower, **but the system does not crash**.
- Finding the Python PID (e.g. `2341`) and running `kill -9 2341` terminates the runaway process immediately and restores normal responsiveness.

## E. Visual Explanation

![Parent/Child processes and CPU timeslicing diagram](/diagrams/os-process-timeslicing.svg)

### Four Roles of an Operating System

| Role | Responsibility |
| --- | --- |
| **Manage Process & Memory** | Creates, schedules, and manages running programs while allocating isolated RAM |
| **Manage Devices** | Controls hardware (keyboard, mouse, printer, storage) via device drivers |
| **Manage Files & Storage** | Organises files/folders, enforces permissions, manages SSDs and HDDs |
| **Provide User Interface** | Offers a GUI or CLI so users can interact with the system |

## F. Technical Details

- **`ps` vs. `ps aux`:** Plain `ps` shows only processes in the current terminal session. `ps aux` shows **all** system-wide processes with columns `USER`, `PID`, `%CPU`, `%MEM`, and `COMMAND`.
- **`top` vs. `htop`:** Live updating views of CPU and memory usage (press `q` to quit). `htop` adds colour-coded bars and interactive controls.
- **`kill <PID>` vs. `kill -9 <PID>`:**
  - `kill <PID>` sends **`SIGTERM (15)`** — politely requests the process to clean up and exit.
  - `kill -9 <PID>` sends **`SIGKILL (9)`** — forces immediate termination without cleanup.

## G. Common Misconceptions

> [!WARNING]
> **"Running `ps` shows every program running on my computer."**
> False. Plain `ps` only lists processes attached to your current terminal session. Use `ps aux` to see system-wide processes.

- **"One installed program can only ever have one process."** False. Installing Chrome once on disk can spawn multiple independent processes (e.g. one per browser tab).

## H. Exam Perspective

Scenario questions frequently test:
- Identifying why an OS stays responsive during a CPU-heavy loop (timeslicing + memory isolation).
- Choosing `kill -9 <PID>` when `SIGTERM` (`kill <PID>`) is ignored.
- Interpreting `ps aux` columns to spot a runaway PID.

## I. Related Concepts

- Commands: [ps](/commands/ps), [top](/commands/top), [htop](/commands/htop), [kill](/commands/kill)
- [C06 — Filesystem, Permissions & PATH](/notes/06-os-filesystem/filesystem-permissions-path)

## J. Quick Revision

- **Program** = on disk; **Process** = executing in RAM.
- **Shell** = parent process; terminal commands = child processes.
- **Timeslicing** switches CPU rapidly; **RAM isolation** protects each process.
- **`SIGTERM (15)`** = polite stop; **`SIGKILL (9)`** = forced immediate stop.
