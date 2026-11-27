---
title: "The 5-Step Tool Discovery Method (ffmpeg & qrencode)"
description: "Fabrice Bellard's impact, why courses cannot teach every tool, and the repeatable 5-step method for mastering unfamiliar CLI tools."
order: 1
source: "worksheet-13a.pdf (Lecture 13, Part 1 of 2, pp. 1–10)"
addedAt: "2026-11-28"
updatedAt: "2026-11-28"
keywords: ["Fabrice Bellard", "ffmpeg", "qrencode", "man", "methodology", "CLI tools"]
estimatedMinutes: 8
---

## Introduction & Intuition: Fabrice Bellard & Unseen Infrastructure

French programmer **Fabrice Bellard** (born 1972) created **FFmpeg** (underpinning VLC, browsers, and nearly every video platform on Earth), **QEMU** (the machine emulator beneath modern cloud VMs), and the **Tiny C Compiler** (able to compile itself in under a second). Yet most students have never heard his name—nor can any university syllabus teach all hundreds of thousands of CLI tools that exist.

Because tools change every year, the goal is **not memorizing flags**, but mastering a **repeatable 5-step method** to learn any unfamiliar tool from its documentation and terminal alone.

---

## The 5-Step Method for Any New Tool

| Step | Name | What You Actually Do |
| --- | --- | --- |
| **1** | **What is this for?** | Read the docs / `man` page. Summarize its purpose in **one sentence in your own words**. |
| **2** | **Find the shape** | Find the simplest command pattern (`tool [options] input output`). |
| **3** | **Run the smallest thing that works** | Execute the minimal valid example (e.g., 3-second clip -> GIF), not a complex pipeline. |
| **4** | **Change exactly one thing** | Predict what will change, modify one flag, run, and explain any gap between prediction and result. |
| **5** | **Break it on purpose** | Pass a wrong filename or invalid flag while nothing is on fire so you learn how the tool reports errors. |

---

## Worked Example: Applying the Method to `ffmpeg` and `qrencode`

1. **Install via package manager:** `brew install ffmpeg qrencode` (macOS) or `sudo apt install ffmpeg qrencode` (Ubuntu Linux).
2. **Inspect docs:** `man ffmpeg` or `qrencode --help`.
3. **Minimal working command (`ffmpeg`):** Convert a 3-second screen recording into an animated GIF:
   ```bash
   ffmpeg -i clip.mov output.gif
   ```
4. **Minimal working command (`qrencode`):** Generate a QR code PNG pointing to your GitHub repo:
   ```bash
   qrencode -o repo_qr.png "https://github.com/student/project"
   ```
5. **Break it deliberately (Step 5):** Run `ffmpeg -i missing.mov out.gif` or `qrencode -o` without an output filename, and read the exact error message.

---

## Common Misconceptions

- **Misconception:** *"Good engineers memorize every CLI flag before running a tool."*  
  **Reality:** Engineers read `man` / `--help` / quickstarts, run the smallest working example, and iterate one change at a time.
- **Misconception:** *"Breaking a command intentionally wastes time."*  
  **Reality:** Deliberate failure in a safe lab teaches you to read a tool's error messages calmly before production breaks.

---

## Examination Perspective

- Know the **5 steps in order** and why **Step 5 (Break it on purpose)** and **Step 4 (Change exactly one thing)** isolate variables cleanly.
- Understand how package managers (`brew`, `apt`) install external binaries into `$PATH`.

---

## Concept Connections

- **Next Lesson:** [Python Libraries, Open Source & 3 Rules for AI](/notes/13-learning-new-tools/python-libraries-and-ai-rules)
- **Commands:** `ffmpeg`, `qrencode`, `man`, `brew`, `apt`, `sudo`

---

## Quick Revision

- **5 Steps:** What is it for -> Find the shape -> Smallest thing that works -> Change 1 thing -> Break it on purpose.
- **Fabrice Bellard:** Created **FFmpeg**, **QEMU**, and **TCC**.
