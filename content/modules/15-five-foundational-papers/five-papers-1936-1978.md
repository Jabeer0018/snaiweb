---
title: "The Five Papers (1936–1978)"
description: "From Turing machines and digital bits to perceptrons, XOR limits, and Lamport logical clocks."
order: 1
source: "Revision Notes (Lecture 15)"
addedAt: "2026-11-26"
updatedAt: "2026-11-27"
keywords: ["Turing", "Shannon", "Rosenblatt", "Minsky", "Lamport", "ELIZA", "XOR"]
estimatedMinutes: 8
---

## Intuition & Core Principle

> [!IMPORTANT]
> Every modern AI system rests on five pre-1980 breakthroughs that established **what can be computed**, **how logic maps to circuits**, **how machines learn weights**, **where single-layer networks fail**, and **how distributed machines agree on event order**.

Before exploring those five papers, keep two framing concepts in mind:

- **ELIZA (1966, Joseph Weizenbaum):** Simulated a psychotherapist using **hand-written pattern-matching rules** (no learning at all). The **ELIZA effect** describes the human tendency to attribute real understanding to fluent text output.
- **Tom Mitchell's Machine Learning Definition (`T, P, E`):** A program learns from **Experience (`E`)** with respect to some **Task (`T`)** and **Performance measure (`P`)**, if its performance at `T`, as measured by `P`, improves with `E`.

---

## The Five Foundational Papers (1936–1978)

| Year | Author(s) | Core Contribution | Key Exam Distinction |
| --- | --- | --- | --- |
| **1936** | **Alan Turing** | **Turing Machine:** Mathematical model proving a single universal machine can execute any computable algorithm via tape symbols + rules. | Conceptual/mathematical model of computation—not a physical machine built in 1936. |
| **1937 / 1948** | **Claude Shannon** | **Boolean Circuits & Information Theory:** Mapped True/False logic to electrical switches (1937) and defined the **bit** as the universal unit of information (1948). | Applies to *all* digital data (text, audio, video, AI), not just text compression. |
| **1958** | **Frank Rosenblatt** | **The Perceptron:** First trainable single-layer neural unit (`weighted sum + threshold`) that adjusts weights from mistakes. | Single-layer linear classifier—cannot solve non-linear boundaries alone. |
| **1969** | **Minsky & Papert** | **Perceptrons (XOR Limit):** Mathematically proved a single-layer perceptron cannot solve **XOR** (non-linearly separable data), triggering the first **AI Winter**. | Proved the limit of **single-layer** perceptrons, *not* multi-layer neural networks. |
| **1978** | **Leslie Lamport** | **Logical Clocks (`Happened-Before`):** Ordered events across distributed computers using logical counters instead of unreliable physical wall clocks. | Essential for distributed systems & cluster training; does not synchronize physical quartz clocks. |

---

## Worked Example: Why Single-Layer Perceptrons Fail XOR

Consider the **XOR** truth table (`output = 1` iff inputs differ):

- `(0, 0) -> 0`
- `(0, 1) -> 1`
- `(1, 0) -> 1`
- `(1, 1) -> 0`

Plot these four points on a 2D plane: the `1` points sit on opposite diagonals (`(0,1)` and `(1,0)`), while the `0` points sit on the other diagonal (`(0,0)` and `(1,1)`). **No single straight line** can separate the `1`s from the `0`s. Adding **hidden layers** (multi-layer perceptrons) bends the boundary and solves XOR cleanly.

---

## Common Misconceptions

- **Misconception:** *"Minsky & Papert proved neural networks can never solve XOR."*  
  **Reality:** Their proof applied strictly to **single-layer** perceptrons; multi-layer networks solve XOR easily once trained with backpropagation.
- **Misconception:** *"ELIZA was an early machine learning model."*  
  **Reality:** ELIZA used fixed, manually authored `if/else` substitution rules with zero learning from experience (`E`).

---

## Exam Perspective

- Connect each paper's **year**, **author**, and **exact scope** (e.g., Shannon -> Boolean switches + bits; Lamport -> distributed event ordering; Minsky/Papert -> single-layer XOR limit).
- Know the **T, P, E** definition of Machine Learning and how to identify `T`, `P`, and `E` in a real problem (e.g., chess: `T` = playing chess, `P` = win rate, `E` = games played).

---

## Related Concepts

- [Defining AI, Four Faces, GPUs & Coding 2.0](/notes/14-what-is-ai/four-faces-gpu-and-coding-2)
- [The Next Five Papers (1986–2020)](/notes/16-next-five-papers/next-five-papers-1986-2020)

---

## Quick Revision

- **1936 Turing:** Universal computability.
- **1937/48 Shannon:** Boolean switches + the **bit**.
- **1958 Rosenblatt:** Trainable single-layer **Perceptron**.
- **1969 Minsky & Papert:** Single-layer **XOR** limit -> AI Winter.
- **1978 Lamport:** Logical clocks (`happened-before`) for distributed systems.
