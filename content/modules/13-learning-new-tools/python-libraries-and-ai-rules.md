---
title: "Python Libraries, Open Source & 3 Rules for AI Coding"
description: "Fredrik Lundh & Pillow's open-source legacy, pip install/pip show, quickstart vs API reference, and the 3 Rules for using AI."
order: 2
source: "worksheet-13b.pdf (Lecture 13, Part 2 of 2, pp. 1–10)"
addedAt: "2026-11-28"
updatedAt: "2026-11-28"
keywords: ["pip", "Pillow", "open source", "API reference", "AI coding rules", "libraries"]
estimatedMinutes: 8
---

## Introduction & Intuition: PIL -> Pillow & Open-Source Continuity

In 1995, **Fredrik Lundh** released the **Python Imaging Library (PIL)**, which powered Python image processing for 15 years until maintenance stopped around 2009. In 2010, **Jeffrey Clark** forked the permissively licensed code, fixed packaging, and published **Pillow**—now a dependency of over two million repositories maintained by volunteers.

Just like CLI tools, Python offers hundreds of thousands of third-party libraries (`pyfiglet`, `qrcode`, `Pillow`, `graphviz`, `pytesseract`). You learn them using the exact same 5-step method—plus **3 strict rules when pairing with AI**.

---

## Installing & Locating Libraries (`pip`)

- **`pip install <package>`:** Downloads and installs a Python library (and its dependencies, e.g., `qrcode` pulls in `Pillow`) into your Python environment's `site-packages` folder.
- **`pip show <package>`:** Prints the exact version, dependencies, and **`Location:`** on disk where Python stores that library—resolved via `sys.path` just like the shell resolves binaries via `$PATH`.
- **Two Parts of Documentation:** Every library site splits into a **Quickstart / Tutorial** (written for newcomers—start here for Steps 1–3) and an **API Reference** (exhaustive parameters—use in Step 4).

---

## The 3 Rules for Using AI in Engineering (Worksheet 13b)

> [!IMPORTANT]
> **"AI proposes. The output decides."** To remain the engineer rather than being steered blindly by generated code, follow these three non-negotiable rules:

1. **Read the docs first, then ask.** Five minutes with official documentation turns a vague prompt into an accurate specification.
2. **Never paste code you can't read.** If a generated line uses an unfamiliar function or flag, look it up before committing it to your repository.
3. **Decide what "correct" looks like before you run it.** Write down your expected output first—otherwise whatever AI prints will look "about right", and you will miss silent bugs.

---

## Worked Example: Applying the 3 Rules with `qrcode`

1. **Docs first:** Quickstart shows `import qrcode; img = qrcode.make("https://example.com"); img.save("qr.png")`.
2. **Expectation first (Rule 3):** Before running, decide: *"A `qr.png` file must appear on disk, non-zero size, and scanning it with my phone must open `https://example.com`."*
3. **Inspect installation:** Run `pip show qrcode` to see its `Location:` and verify `Requires: pillow`.

---

## Common Misconceptions

- **Misconception:** *"If AI-generated code runs without an error, it is correct."*  
  **Reality:** Code can execute cleanly and still compute the wrong answer; only pre-defined expectations (Rule 3) catch silent logic errors.
- **Misconception:** *"Wrapper libraries like `pytesseract` or `graphviz` contain the entire engine inside Python."*  
  **Reality:** Many Python libraries are thin wrappers around separate OS binaries (`tesseract`, `dot`) that must also be installed via `brew` or `apt`.

---

## Examination Perspective

- Understand **`pip install` vs `pip show`** and the parallel between Python `site-packages` lookup and shell `$PATH` lookup.
- Recall the **3 Rules for AI Coding** and why Rule 3 (*decide expected output before running*) prevents automation bias.

---

## Concept Connections

- **Previous Lesson:** [The 5-Step Tool Discovery Method](/notes/13-learning-new-tools/five-step-tool-discovery)
- **Commands:** `pip`, `python3`, `which`

---

## Quick Revision

- **PIL -> Pillow:** Open-source fork kept an abandoned library alive for millions of repos.
- **`pip show <pkg>`:** Reveals exact disk `Location:` and dependencies.
- **3 AI Rules:** Docs first -> Never paste unreadable code -> Decide expected output before running.
