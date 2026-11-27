---
title: "What Is AI? Calculate vs. Predict, Four Faces, GPUs & Coding 2.0"
description: "Zero-to-advanced introduction to Artificial Intelligence: Coding 1.0 vs Coding 2.0, Turing Test, Russell & Norvig's Four Faces, 8 disciplines, and why GPUs power AI."
order: 1
source: "Lecture-14-What-is-AI.pdf (C14, pp. 1–40)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["AI", "Turing Test", "Four Faces", "Rational Agent", "GPU", "Coding 2.0", "calculate vs predict"]
estimatedMinutes: 11
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [Hardware, CPU & Bottlenecks](/notes/02-hardware-software/hardware-and-memory) and [How Software Works](/notes/07-how-software-works/compilers-vs-interpreters).

For your entire life, software followed exact instructions written by humans. Now computers recognize faces, translate languages, and write code. In this lesson, you will learn **what Artificial Intelligence actually means** without hype, why human-written `if/else` rules (**Coding 1.0**) hit a wall, how **Coding 2.0** learns from data, and why graphics cards (**GPUs**) became AI's engine.

---

## 2. Stage 1 & 2: Intuition — Calculate vs. Predict

Suppose you want a computer to do two tasks:
1. **Task A (Calculate):** Add up a grocery bill (`total = sum(prices)`). You know the exact rule beforehand. Traditional **Coding 1.0** (`Input + Rules -> Output`) works 100% reliably here.
2. **Task B (Predict):** Look at a photo of `1920 × 1080` RGB pixel numbers and answer: *"Is this a cat?"* Try writing `if/else` rules for every breed, lighting angle, and fur color—it is impossible!

Instead, **Artificial Intelligence / Machine Learning (Coding 2.0)** flips the equation: give the computer **thousands of labeled examples** (`Input + Desired Output`), and let it **learn the internal rules (weights)** automatically!

---

## 3. Stage 3 & 4: History, Eight Disciplines & The Four Faces of AI

- **1950 — Alan Turing:** Proposed the **Turing Test** (Imitation Game): instead of debating *"Can machines think?"*, test whether an evaluator chatting via text can distinguish a machine from a human.
- **1956 — Dartmouth Workshop:** **John McCarthy** coined the term **"Artificial Intelligence"**.
- **2014 — Eugene Goostman:** A chatbot fooled ~33% of judges in a 5-minute chat—showing why brief conversational tricks do not prove true general understanding.

AI blends **8 contributing disciplines**: Philosophy, Mathematics, Economics, Neuroscience, Psychology, Computer Engineering, Control Theory & Cybernetics, and Linguistics.

### Russell & Norvig's Four Faces of AI (2×2 Matrix)

| | **Human-Like** | **Rational (Ideal Goal-Maximizing)** |
| --- | --- | --- |
| **Thinking (Internal)** | **Thinking Humanly:** Cognitive science modeling human brains | **Thinking Rationally:** Formal logic & valid deduction |
| **Acting (External)** | **Acting Humanly:** Turing Test behavior | **Acting Rationally:** **Rational Agent** — chooses the best action given evidence & goals |

Modern AI focuses on **Acting Rationally (Rational Agents)**—just as engineers built airplanes to fly via aerodynamics rather than flapping feathers like birds.

---

## 4. Stage 5: Why GPUs Power AI (CPU vs. GPU)

| Dimension | CPU | GPU |
| --- | --- | --- |
| **Architecture** | Few (`4–64`) fast, complex cores with large caches | Thousands of simpler cores built for **massive parallelism** |
| **Best At** | Sequential decisions, OS scheduling, general logic | Multiplying huge **matrices of numbers** simultaneously |

Training a neural network requires billions of simple multiply-and-add operations at once—making **GPUs** orders of magnitude faster than CPUs for AI.

---

## 5. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Coding 1.0 vs. Coding 2.0
- Calculating compound interest (`P * (1 + r)^t`) -> **Coding 1.0** (known exact formula).
- Detecting fraudulent credit card transactions across millions of subtle patterns -> **Coding 2.0** (learned model).

### Intermediate Example: Classifying a Chess Engine in the Four Faces
A chess engine searches millions of board states per second using math—completely unlike human intuition—to pick the move with the highest win probability. Which quadrant is it? **Acting Rationally (Rational Agent)**.

### Advanced Example: Why CPUs Still Matter in GPU AI Training
You cannot build an AI server with *only* GPUs and zero CPU: the **CPU** runs Linux, reads image/text files from SSD into RAM, schedules processes, and feeds data batches to the GPU.

---

## 6. Common Misconceptions & Quick Revision

- **Misconception:** *"Passing a 5-minute chat test proves human-level intelligence."*  
  **Reality:** Short chat bots exploit human projection rather than general reasoning.
- **Quick Revision:** Calculate = Coding 1.0 (`Input + Rules -> Output`); Predict = Coding 2.0 (`Input + Labels -> Learned Model`); Four Faces = `Thinking/Acting × Humanly/Rationally`; GPUs excel at parallel matrix math.
- **Source Reference:** `Lecture-14-What-is-AI.pdf` (C14, pp. 1–40).
