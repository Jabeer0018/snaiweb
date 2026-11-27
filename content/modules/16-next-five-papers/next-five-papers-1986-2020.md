---
title: "The Next Five Papers (1986–2020)"
description: "Backprop, PageRank, AlexNet, Attention/Transformers, and GPT-3 scale and few-shot prompting."
order: 1
source: "Revision Notes (Lecture 16)"
addedAt: "2026-11-26"
updatedAt: "2026-11-27"
keywords: ["Backpropagation", "PageRank", "AlexNet", "Transformer", "Attention", "GPT-3"]
estimatedMinutes: 8
---

## Intuition & Core Principle

> [!IMPORTANT]
> Between 1986 and 2020, AI evolved from multi-layer weight training (**Backpropagation**) to web-scale text (**PageRank**), GPU deep learning (**AlexNet**), parallel sequence modeling (**Transformers**), and emergent **few-shot prompting** at massive scale (**GPT-3**).

---

## The Next Five Papers (1986–2020)

| Year | Author(s) / Paper | Core Breakthrough | Key Exam Distinction |
| --- | --- | --- | --- |
| **1986** | **Rumelhart, Hinton & Williams** | **Backpropagation:** Propagates output error backward through hidden layers using calculus (chain rule / gradient descent) to adjust weights: `PREDICT -> COMPARE -> WORK BACKWARD -> ADJUST -> REPEAT`. | Pure mathematical optimization of weights—not conscious reasoning or rule understanding. |
| **1998** | **Page & Brin (PageRank)** | **PageRank:** Modeled web hyperlinks as weighted votes of authority, spurring web indexing that created massive digital text corpora. | Ranks web pages by link graph—it did not train LLMs directly. |
| **2012** | **Krizhevsky, Sutskever & Hinton (AlexNet)** | **AlexNet:** Combined deep CNNs + ImageNet labeled data + **GPUs**, slashing ImageNet top-5 error from `~26%` to `~15%`. | `~15%` vs `~26%` are specific 2012 ImageNet benchmark error rates, not general "AI accuracy". |
| **2017** | **Vaswani et al. (*Attention Is All You Need*)** | **The Transformer:** Replaced sequential RNNs with **Self-Attention**, reading all tokens in a sequence **in parallel** and modeling long-range relationships across context. | Transformers still predict tokens statistically from context; attention is weighted relevance, not human understanding. |
| **2020** | **Brown et al. (GPT-3)** | **Scale & Few-Shot Prompting:** Scaled transformers to **175 billion parameters** on massive internet text, demonstrating **zero-shot / few-shot** task adaptation via prompting alone without weight updates. | Prompting guides next-token probabilities in-context; it does **not** permanently retrain model weights. |

---

## Worked Example: How Self-Attention Resolves Ambiguity

Consider the sentence: *"The trophy didn't fit in the suitcase because **it** was too big."*

- An older sequential model reads left-to-right and risks forgetting earlier nouns over long paragraphs.
- A **Transformer** uses **Self-Attention** to compute pairwise relevance scores across all words simultaneously—strongly linking **"it"** to **"trophy"** (because *"too big"* matches the object failing to fit) in parallel on GPUs.

---

## Common Misconceptions

- **Misconception:** *"Few-shot prompting in GPT-3 updates the neural network's weights during chat."*  
  **Reality:** The model's `175B` weights stay **frozen** during inference; examples inside the prompt steer predictions strictly through the **context window**.
- **Misconception:** *"Transformers were invented mainly because they are smaller than RNNs."*  
  **Reality:** Their key advantage is **parallelization** during training (eliminating step-by-step sequential bottlenecks) and direct attention over long contexts.

---

## Exam Perspective

- Trace the **10-paper arc** end-to-end: `Turing (1936)` -> `Shannon (1937/48)` -> `Rosenblatt (1958)` -> `Minsky/Papert (1969)` -> `Lamport (1978)` -> `Backprop (1986)` -> `PageRank (1998)` -> `AlexNet (2012)` -> `Transformer (2017)` -> `GPT-3 (2020)`.
- Know **Backpropagation's 5-step loop** and why **Self-Attention** enabled modern LLMs to scale on GPUs.

---

## Related Concepts

- [The Five Papers (1936–1978)](/notes/15-five-foundational-papers/five-papers-1936-1978)
- [Defining AI, Four Faces, GPUs & Coding 2.0](/notes/14-what-is-ai/four-faces-gpu-and-coding-2)

---

## Quick Revision

- **1986 Backprop:** Error flows backward to update hidden-layer weights.
- **1998 PageRank:** Link-vote web ranking; fueled web-scale digital text.
- **2012 AlexNet:** Deep CNN + ImageNet + GPUs (`~26% -> ~15%` top-5 error).
- **2017 Transformer:** **Self-Attention** processes tokens in parallel.
- **2020 GPT-3:** `175B` parameters; **zero/few-shot prompting** without updating weights.
