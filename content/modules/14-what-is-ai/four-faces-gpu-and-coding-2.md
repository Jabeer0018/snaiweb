---
title: "Defining AI, Four Faces, GPUs & Coding 2.0"
description: "History timeline, Russell & Norvig 2x2 matrix, 8 contributing disciplines, CPU vs GPU, and Coding 1.0 vs 2.0."
order: 1
source: "Revision Notes (Lecture 14)"
addedAt: "2026-11-26"
updatedAt: "2026-11-27"
keywords: ["AI", "Turing Test", "Four Faces", "Rational Agent", "GPU", "Coding 2.0"]
estimatedMinutes: 8
---

## Intuition & Core Principle

> [!IMPORTANT]
> Traditional software **calculates** deterministic outcomes from explicit human-written rules; Artificial Intelligence **predicts** or acts under uncertainty by learning patterns from data or reasoning over goals.

- **Calculate:** Totaling a grocery receipt (`sum(items)` — exact formula known upfront).
- **Predict:** *"Is this photo a cat?"* or *"What is the next token?"* (no clean `if/else` rule exists).

---

## Milestones & Contributing Disciplines

- **1950 — Alan Turing:** Proposed the **Turing Test** (Imitation Game): evaluate machine intelligence by observable conversational behavior via text rather than asking *"Can machines think?"*
- **1956 — Dartmouth Workshop:** **John McCarthy** coined the term **"Artificial Intelligence"**.
- **2014 — Eugene Goostman:** Sparked debate after convincing ~33% of judges in a 5-minute chat—highlighting limitations of short conversational tests.

AI draws on **8 contributing disciplines**: Philosophy, Mathematics, Economics, Neuroscience, Psychology, Computer Engineering, Control Theory & Cybernetics, and Linguistics.

---

## The Four Faces of AI (Russell & Norvig 2×2 Matrix)

| | **Human-Like** | **Rational (Ideal)** |
| --- | --- | --- |
| **Thinking (Internal)** | **Thinking Humanly:** Cognitive modeling—reproducing how human brains reason. | **Thinking Rationally:** Formal logic—valid syllogisms and provably sound inference. |
| **Acting (External)** | **Acting Humanly:** Turing Test—indistinguishable outward behavior from a human. | **Acting Rationally:** **Rational Agent**—choosing actions that maximize expected goal achievement. |

> [!TIP]
> Modern AI research emphasizes **Acting Rationally (Rational Agents)** because correctness and performance matter more than imitating human flaws (just as airplanes fly by aerodynamics, not by flapping feathers like birds).

---

## Why GPUs Power Modern AI (CPU vs. GPU)

| Dimension | CPU (Central Processing Unit) | GPU (Graphics Processing Unit) |
| --- | --- | --- |
| **Core Design** | Few (4–64) complex, high-speed cores with large caches. | Thousands of simpler cores optimized for parallel throughput. |
| **Strength** | Sequential branching, OS scheduling, general logic. | **Massive parallel matrix multiplication** (neural network weights & pixels). |

Training a neural network requires billions of simultaneous multiply-add operations across weight matrices—making GPUs orders of magnitude faster than CPUs for AI workloads.

---

## Coding 1.0 vs. Coding 2.0

- **Coding 1.0 (Explicit Rules):** Programmer writes explicit `if/else` logic (`Input + Rules -> Output`).
- **Coding 2.0 (Data-Driven Learning):** Programmer specifies architecture and objective, and the model **learns the rules/weights from data** (`Input + Desired Output -> Learned Program/Model`).

---

## Worked Example: Classifying Spam Email

- **Coding 1.0:** Manually write `if "FREE MONEY" in email: mark_spam()`. Spammers easily bypass it by writing `"FR33 M0NEY"`.
- **Coding 2.0 (Rational Agent):** Train a classifier on 100,000 labeled emails so it learns probabilistic weights across thousands of features and generalizes to unseen spam tactics.

---

## Common Misconceptions

- **Misconception:** *"Passing a 5-minute Turing Test proves general intelligence."*  
  **Reality:** Short chat tricks (like ELIZA or Eugene Goostman) exploit human projection rather than true reasoning.
- **Misconception:** *"GPUs replace CPUs completely."*  
  **Reality:** The CPU still runs the OS, loads data from disk, and dispatches parallel math batches to the GPU.

---

## Exam Perspective

- Memorize all **4 quadrants** of Russell & Norvig's matrix (`Thinking/Acting` × `Humanly/Rationally`) and why **Rational Agent** is the dominant modern framing.
- Know the difference between **Coding 1.0** (explicit rules) and **Coding 2.0** (weights learned from data).

---

## Related Concepts

- [The Five Papers (1936–1978)](/notes/15-five-foundational-papers/five-papers-1936-1978)
- [Hardware, CPU, Memory & Bottlenecks](/notes/02-hardware-software/hardware-and-memory)

---

## Quick Revision

- **1950:** Turing Test; **1956:** McCarthy coins "AI" at Dartmouth.
- **Four Faces:** Thinking/Acting × Humanly/Rationally (modern focus = **Rational Agent**).
- **GPU:** Thousands of parallel cores ideal for matrix math; **Coding 2.0:** learns rules from data.
