---
title: "The Five Papers (1936–1978)"
description: "From Turing machines and digital bits to perceptrons, XOR limits, and Lamport logical clocks."
order: 1
source: "Revision Notes (Lecture 15)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["Turing", "Shannon", "Rosenblatt", "Minsky", "Lamport", "ELIZA", "XOR"]
estimatedMinutes: 7
---

## Context: ELIZA & Machine Learning (T, P, E)

- **ELIZA (1966, Joseph Weizenbaum):** Imitated a therapist using **manually written rules** (no learning). The **ELIZA effect** is the human tendency to perceive understanding from convincing responses.
- **Machine Learning (T, P, E):** **Task (T)**, **Performance measure (P)**, **Experience (E)**.

## The Five Foundational Papers

| Year | Author(s) | Core Contribution | Key Distinction |
| --- | --- | --- | --- |
| **1936** | **Alan Turing** | Theoretical general-purpose computing machine (tape, head, rules). | Did not build a physical computer or modern AI. |
| **1948** | **Claude Shannon** | Digital representation of messages as sequences of bits (`0`s and `1`s). | Focused on digital representation for communication. |
| **1958** | **Frank Rosenblatt** | **Perceptron:** adjusts weights via `GUESS -> CHECK -> ADJUST -> REPEAT`. | Simple linear boundary, not a modern LLM. |
| **1969** | **Minsky & Papert** | Showed a single perceptron cannot solve non-linear problems like **XOR**. | Book alone did not cause the first AI winter. |
| **1978** | **Leslie Lamport** | **Logical clocks:** `New counter = max(local, received) + 1`. | Gives causal ordering, not real physical time. |
