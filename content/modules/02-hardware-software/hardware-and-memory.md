---
title: "Hardware, CPU vs GPU & Memory (RAM vs Storage)"
description: "Deep dive into physical hardware categories, CPU vs GPU parallelism, volatile RAM vs persistent storage, memory pressure, and troubleshooting."
order: 1
source: "System & AI Essentials (C02)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["hardware", "CPU", "GPU", "RAM", "HDD", "SSD", "volatile", "memory pressure"]
estimatedMinutes: 10
---

## A. What Is It?

**Hardware** refers to the physical parts of a computer—the components you can see and touch (Monitor, Keyboard & Mouse, CPU, RAM, Hard Disk, Printer). Inside the system, **Primary Memory (RAM)** is the computer's high-speed temporary workspace directly accessed by the CPU, while **Secondary Storage (SSD/HDD)** is long-term persistent storage.

## B. Why Does It Exist?

A CPU executes instructions billions of times per second. Secondary storage devices like hard drives and even SSDs are far too slow to feed the CPU directly for every single instruction. **RAM exists as a fast bridge** between long-term storage and the CPU so active programs and data can be read and updated almost instantaneously.

## C. How Does It Work?

1. **Program Launch:** When you open an application (like Chrome or VS Code), the OS locates the program file on secondary storage (SSD/HDD) and loads its code and active data into **RAM**.
2. **CPU–RAM–Storage Loop:** The CPU fetches instructions and variables directly from RAM, processes them, and writes results back to RAM. Only when you explicitly save (or the OS flushes buffers) is data written back to persistent storage.
3. **Volatility:** RAM stores bits using electrical charges that vanish the instant power is lost. Persistent storage (SSD flash cells or HDD magnetic platters) retains data without power.
4. **Memory Pressure (Supplementary Detail):** If you open too many heavy applications and available RAM fills up, the OS must shuffle inactive memory pages to disk (swapping/paging), causing severe slowdowns and stutter.

## D. Practical Example

Suppose a student is editing a 50 MB document while running 25 browser tabs and a Python script:
- **Normal operation:** Active tab data, Python variables, and document edits live in RAM for instant switching.
- **Insufficient RAM:** Once RAM is exhausted, switching tabs freezes for seconds as the OS struggles to free memory.
- **Sudden power loss:** Unsaved edits residing only in RAM are lost, while previously saved files on the SSD remain intact.

## E. Visual Explanation

### Five Hardware Sub-Categories

| Category | Role | Examples |
| --- | --- | --- |
| **Input Devices** | Send data/commands to the computer | Keyboard, Mouse, Mic, Digital Pen, Webcam, Touchscreen, Scanner, Game controller |
| **Output Devices** | Show results/feedback to the user | Monitor, Headset (without Mic), Speaker, Projector, Printer |
| **Storage Devices** | Long-term persistent data retention | HDD, SSD, Memory card |
| **Compute Devices** | Perform calculations and parallel processing | CPU, GPU |
| **Internal Components** | Core internal system infrastructure | RAM, Motherboard, Cooling Fan |

### CPU vs. GPU

| Feature | CPU (Central Processing Unit) | GPU (Graphics Processing Unit) |
| --- | --- | --- |
| **Role** | Brain of the computer — general tasks and decision-making | Specialized processor for graphics & parallel tasks |
| **Cores** | Few, powerful cores | Thousands of smaller cores |
| **Best for** | General tasks, OS logic, branching decisions | Gaming, video editing, 3D modeling, VR, and AI |

### HDD vs. SSD

| HDD (Hard Disk Drive) | SSD (Solid State Drive) |
| --- | --- |
| Uses magnetic disks to store data | Uses flash memory (no moving parts) |
| Has moving parts (spinning platters, read/write heads) | Much faster than HDD in reading and writing data |

## F. Technical Details

- **Dual Categorisation:** In C02, `Monitor` appears in both the general 6-item hardware list and Output Devices; `RAM` appears in both general hardware and Internal Components. It is the same component viewed from two angles.
- **Exclusive Allocation:** As covered in C05, the OS assigns each running process its own isolated region of RAM.

## G. Common Misconceptions

> [!WARNING]
> **"My photos stayed safe after a power cut, so RAM is permanent storage."**
> False. RAM is **volatile memory**, not permanent storage. Your photos survived because they were saved on secondary storage (SSD/HDD).

- **"Upgrading RAM makes raw CPU math faster."** Adding RAM prevents slowdowns caused by running out of memory (memory pressure), but does not increase CPU clock speed or GPU core count.

## H. Exam Perspective

Expect scenario questions testing:
- Identifying whether an issue is a RAM capacity bottleneck vs. a CPU/GPU compute bottleneck.
- Predicting what happens to unsaved data in RAM during a crash or power failure.
- Distinguishing all 5 hardware categories and knowing why SSDs outperform HDDs.

## I. Related Concepts

- [Software Stack & Operating Systems](/notes/02-hardware-software/software-and-operating-systems)
- [C05 — OS Roles, Processes, Timeslicing & Memory](/notes/05-os-process-management/processes-timeslicing-memory)
- [C08 — Bits, Bytes & Storage Units](/notes/08-number-systems-encoding/bits-bytes-and-overflow)

## J. Quick Revision

- **Hardware** = physical parts; **Software** = instructions telling hardware what to do.
- **CPU** = few fast sequential cores; **GPU** = thousands of parallel cores.
- **RAM** = fast, **volatile** primary working memory; **SSD/HDD** = **non-volatile** secondary storage.
