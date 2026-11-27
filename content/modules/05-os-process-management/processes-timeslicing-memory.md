---
title: "Processes, PID/PPID, Time-Slicing & Virtual Memory"
description: "Zero-to-advanced guide to how a passive program becomes a live process, PID/PPID trees, CPU time-slicing, virtual memory isolation, and process control."
order: 1
source: "HYD_Lecture 5 - The OS and Process .pptx_compressed.pdf (C05, pp. 1–53)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["process", "program", "PID", "PPID", "time-slicing", "virtual memory", "kill", "ps", "top"]
estimatedMinutes: 12
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [Hardware, CPU, Memory & Bottlenecks](/notes/02-hardware-software/hardware-and-memory) and [Software Stack & Operating Systems](/notes/02-hardware-software/software-and-operating-systems).

If your laptop only has a handful of CPU cores, how can it play music, download a file, render a browser video, and run a Python script *all at the exact same time*? And why doesn't a buggy browser tab crash your entire Operating System? This lesson explains how the OS turns passive files on disk into **isolated, scheduled Processes**.

---

## 2. Stage 1 & 2: Intuition — Recipe vs. Cooking & The Restaurant Kitchen

- A **Program** is like a **printed recipe** sitting on a shelf: passive instructions stored on your SSD (`/usr/bin/python3` or Chrome's binary). You can copy it 10 times, and nothing happens until someone cooks it.
- A **Process** is **actually cooking that recipe**: it has a chef's station (assigned **RAM**), a ticket number (**PID**), ingredients currently on the counter (open files, variables), and knows *which line of the recipe it is currently on*.

If two people open two separate Terminal windows, **one program** (`zsh`) is running as **two independent processes**—each with its own current directory (`pwd`) and variables!

**Where the analogy stops being accurate:** A human kitchen only switches chefs slowly. A modern OS **context-switches** between dozens of processes thousands of times per second so fast that human eyes perceive true simultaneous execution.

---

## 3. Stage 3 & 4: Internal Working — PIDs, Time-Slicing & Virtual Memory

![OS Process Management: CPU Time-Slicing and Process States](/diagrams/os-process-timeslicing.svg)

### Process Identity (`PID` & `PPID`)
Every time a process launches, the OS kernel assigns:
1. **`PID` (Process ID):** A unique positive integer identifying this live running instance (e.g., `4213`).
2. **`PPID` (Parent Process ID):** The `PID` of whichever process spawned it (e.g., when you type `python3 app.py` inside `zsh`, `zsh` is the parent and `python3` is the child). Every user process traces back up a tree to the OS's initial boot process (`PID 1`).

### How One CPU Core Runs 50 Processes (`Time-Slicing`)
A single CPU core can execute **only one instruction stream at any instant**. The OS **Scheduler** creates the illusion of multitasking using **time-slicing**:
1. Process A runs on the CPU for a tiny **quantum** (e.g., a few milliseconds).
2. A hardware timer interrupts the CPU; the OS performs a **context switch** (saves Process A's CPU registers, loads Process B's saved registers).
3. Process B runs for its slice. Processes waiting on disk or keyboard input stay in **Waiting/Sleeping** state so they don't waste CPU slices!

### Virtual Memory Isolation (Why Apps Don't Corrupt Each Other)
If Chrome could directly read or overwrite Spotify's RAM addresses, any bug or malicious website would crash the whole computer. Instead, the OS + CPU hardware give every process its own **Virtual Address Space**: Process A thinks it owns addresses `0x0000`–`0xFFFF`, mapped secretly by the OS to isolated physical RAM frames. Touching memory outside its own space triggers a **Segmentation Fault** and terminates only that process.

---

## 4. Stage 5: Inspecting & Controlling Processes (`ps`, `top`, `kill`)

```bash
ps aux | grep python3     # Snapshot of running processes matching python3
top                       # Live updating CPU, RAM, and PID monitor (press q to quit)
kill 4213                 # Sends SIGTERM (polite shutdown request to PID 4213)
kill -9 4213              # Sends SIGKILL (immediate kernel termination—last resort!)
```

---

## 5. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Program vs. Process Count
You open three separate tabs in Python or three Terminal windows. How many **programs** are stored on disk for `zsh`? **One** (`/bin/zsh`). How many **processes** exist in RAM? **Three**, each with a distinct `PID`.

### Intermediate Example: Parent-Child Termination
In your terminal (`zsh`, `PID 1100`), you run `python3 server.py` (`PID 1142`). Checking `ps -ef` shows `PID=1142, PPID=1100`. If you close the terminal or send `SIGTERM`, child processes tied to that shell receive a hangup signal unless detached.

### Advanced Example: `kill 4213` vs `kill -9 4213`
A frozen script ignores `kill 4213` (`SIGTERM`, signal `15`) because `SIGTERM` asks the process politely to clean up files and exit—and a hung process might ignore or never reach its signal handler. `kill -9 4213` (`SIGKILL`, signal `9`) cannot be caught or ignored: the OS kernel immediately reclaims its RAM and destroys the process (though temporary files won't be flushed cleanly).

---

## 6. Common Misconceptions & Quick Revision

- **Misconception:** *"Multitasking means a 1-core CPU literally executes 50 apps at the exact same nanosecond."*  
  **Reality:** It switches rapidly between processes (**time-slicing** + **context switching**).
- **Quick Revision:** Program = passive file on disk; Process = live execution (`PID`, `PPID`, isolated Virtual Memory); `SIGTERM (15)` = polite stop, `SIGKILL (9)` = forced kernel stop.
- **Source Reference:** `HYD_Lecture 5 - The OS and Process .pptx_compressed.pdf` (C05, pp. 1–53).
