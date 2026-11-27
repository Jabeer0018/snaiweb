---
title: "The Five Foundational Papers (1936–1978)"
description: "Zero-to-advanced narrative connecting Turing (1936), Shannon (1937/1948), Rosenblatt (1958), Minsky & Papert (1969), and Lamport (1978), plus ELIZA and ML (T, P, E)."
order: 1
source: "S&AI - Lecture 15.pptx_compressed.pdf (80p), Lecture 15 Notes (13p), Worksheet (8p) & Papers 1–5"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["Turing", "Shannon", "Rosenblatt", "Minsky", "Lamport", "ELIZA", "XOR", "perceptron", "T P E"]
estimatedMinutes: 12
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [What Is AI?](/notes/14-what-is-ai/four-faces-gpu-and-coding-2) and [Number Systems](/notes/08-number-systems-encoding/number-systems-and-conversions).

You do **not** need prior academic research experience to understand these five landmark papers. Together, they tell one connected story: how we defined **computation** (1936), **digital information** (1948), **trainable artificial neurons** (1958), **their geometric limits** (1969), and **how distributed machines agree on order** (1978).

---

## 2. Stage 1: Two Crucial Framing Ideas (ELIZA & `T, P, E`)

1. **ELIZA (1966, Joseph Weizenbaum):** An early chatbot simulating a therapist by rephrasing user sentences using **hand-written pattern rules** (`"I feel X" -> "Why do you feel X?"`). ELIZA had **zero learning**. People still felt understood—a psychological bias called the **ELIZA effect**.
2. **Machine Learning (`T, P, E` — Tom Mitchell):** A computer learns from **Experience (`E`)** on **Task (`T`)** measured by **Performance (`P`)** if its performance on `T` improves with `E`.

---

## 3. Stage 2–4: The Five Papers Explained Step by Step

| Year | Author(s) | The Problem & Main Idea | Deep Study Guide |
| --- | --- | --- | --- |
| **1936** | **Alan Turing** | Modeled mechanical computation as an abstract tape + rules (**Turing Machine**) and proved one **Universal Machine** can simulate any algorithm—while proving some problems (Halting / Entscheidungsproblem) are unsolvable. | [Study Paper 1 →](/papers/turing-1936-computable-numbers) |
| **1937 / 1948** | **Claude Shannon** | Mapped Boolean True/False to electrical switches (1937) and defined the **bit** & **entropy** (1948), proving compression and error-free communication limits for *all* digital data. | [Study Paper 2 →](/papers/shannon-1948-communication-theory) |
| **1958** | **Frank Rosenblatt** | Built the **Perceptron**—a single-layer neuron (`weighted sum + threshold`) that automatically adjusts its **weights** whenever it misclassifies a training example. | [Study Paper 3 →](/papers/rosenblatt-1958-perceptron) |
| **1969** | **Minsky & Papert** | Proved geometrically that a **single-layer** perceptron draws one straight line, so it can **never** solve **XOR** (non-linearly separable data)—triggering the first **AI Winter**. | [Study Paper 5 →](/papers/minsky-papert-1969-perceptrons) |
| **1978** | **Leslie Lamport** | Showed physical wall clocks drift across networked servers; introduced causal **Happened-Before** partial ordering (`->`) and **Logical Clocks** (`max(local, msg) + 1`). | [Study Paper 4 →](/papers/lamport-1978-logical-clocks) |

---

## 4. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Identifying `T`, `P`, `E`
For a spam filter: **Task (`T`)** = classifying emails as spam vs. inbox; **Performance (`P`)** = % of emails classified accurately; **Experience (`E`)** = thousands of labeled historical emails.

### Intermediate Example: Why Single-Layer Perceptrons Fail XOR
Plot `(0,0)->0`, `(1,1)->0`, `(0,1)->1`, `(1,0)->1` on a 2D graph. The `1` points sit on opposite corners (`(0,1)` and `(1,0)`) and the `0` points sit on the other diagonal. **Try testing this in the Perceptron Lab below:** no slider combination of `w₁`, `w₂`, and `bias` can draw one straight line separating them!

### Advanced Example: Lamport Logical Clocks in Action
Server A (clock `5`) sends a message to Server B (whose local logical clock is `2`). Upon receiving the message, Server B sets its clock to `max(2, 5) + 1 = 6`, guaranteeing the causal rule: `Send -> Receive` implies `C(Send) < C(Receive)`.

---

## 5. Common Misconceptions & Quick Revision

- **Misconception:** *"Minsky & Papert proved multi-layer neural networks can never solve XOR."*  
  **Reality:** Their proof applied strictly to **single-layer** perceptrons; adding hidden layers solves XOR cleanly.
- **Quick Revision:** `1936 Turing` (computability) -> `1948 Shannon` (bits & entropy) -> `1958 Rosenblatt` (trainable perceptron) -> `1969 Minsky/Papert` (XOR limit) -> `1978 Lamport` (logical clocks).
- **Source Reference:** `S&AI - Lecture 15.pptx_compressed.pdf` (80p), `S&AI Lecture 15 Notes.pdf` (13p), `Worksheet.pdf` (8p), and Papers 1–5.
