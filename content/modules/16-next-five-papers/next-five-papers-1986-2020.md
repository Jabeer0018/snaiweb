---
title: "From Training to Scale: The Next Five Papers (1986–2020)"
description: "Zero-to-advanced narrative connecting Backpropagation (1986), PageRank (1998), AlexNet (2012), Transformers (2017), and GPT-3 (2020)."
order: 1
source: "Lecture 16 Notes.pdf (14p), Student Worksheet (8p), Paper 9 & 10 Slides (16p) & Papers 6–10"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["Backpropagation", "PageRank", "AlexNet", "Transformer", "Attention", "GPT-3"]
estimatedMinutes: 12
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [The Five Foundational Papers (1936–1978)](/notes/15-five-foundational-papers/five-papers-1936-1978).

By 1978, AI faced a wall: single-layer perceptrons couldn't solve non-linear problems like XOR, and nobody had popularized a practical way to train hidden layers. This lesson traces the **five breakthroughs (1986–2020)** that unlocked deep neural training, web-scale text, GPU vision, parallel **Self-Attention**, and **175B-parameter** few-shot language models.

---

## 2. Stage 1–4: The Five Modern AI Breakthroughs

| Year | Author(s) / Paper | The Problem & Breakthrough | Deep Study Guide |
| --- | --- | --- | --- |
| **1986** | **Rumelhart, Hinton & Williams** | **Backpropagation:** Solved the hidden-layer credit assignment problem using the chain rule: `PREDICT -> COMPARE -> WORK BACKWARD -> ADJUST -> REPEAT`, enabling multi-layer networks to learn internal features and solve XOR. | [Study Paper 6 →](/papers/rumelhart-1986-backpropagation) |
| **1998** | **Brin & Page** | **PageRank:** Ranked web pages by treating hyperlinks as weighted authority votes, driving web-scale crawling and digitization that later supplied training corpora. | [Study Paper 7 →](/papers/brin-page-1998-pagerank) |
| **2012** | **Krizhevsky, Sutskever & Hinton** | **AlexNet:** Combined deep CNNs + ImageNet (`1.2M` labeled images) + **GPUs**, slashing ImageNet top-5 error from `~26%` to `~15%` and igniting the GPU Deep Learning era. | [Study Paper 8 →](/papers/krizhevsky-2012-alexnet) |
| **2017** | **Vaswani et al.** | **Transformer (*Attention Is All You Need*):** Replaced sequential RNNs with parallel **Self-Attention**, letting every token attend directly to long-range context across GPUs. | [Study Paper 9 →](/papers/vaswani-2017-transformer) |
| **2020** | **Brown et al. (OpenAI)** | **GPT-3:** Scaled a decoder Transformer to **175B parameters**, showing **zero-shot and few-shot prompting** adapts behavior purely inside the context window without updating weights. | [Study Paper 10 →](/papers/brown-2020-gpt3) |

---

## 3. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Tracing the Backpropagation Loop
Suppose a multi-layer network predicts `0.2` when the target label is `1.0`. Backpropagation computes the error (`0.8`), uses calculus backward through each layer to measure which weights pushed the answer too low, nudges those weights up slightly (**gradient descent**), and repeats across thousands of examples.

### Intermediate Example: Why Self-Attention Beat RNNs
In *"The trophy didn't fit in the suitcase because **it** was too big"*, an RNN reads left-to-right one word at a time and struggles when sentences span 100+ words. A **Transformer** computes **Self-Attention** across all words in parallel on GPUs, directly connecting `"it"` to `"trophy"` and `"fit"`.

### Advanced Example: Few-Shot Prompting Without Retraining
You paste 3 English-to-French examples into a GPT-3 prompt and ask for a 4th translation. Do GPT-3's `175 billion` weights change? **No!** Weights are frozen during inference; the examples steer next-token probabilities purely via the **context window**.

---

## 4. Common Misconceptions & Quick Revision

- **Misconception:** *"15% vs 26% in AlexNet means general AI accuracy."*  
  **Reality:** Those figures are specifically **2012 ImageNet top-5 classification error rates**.
- **Misconception:** *"PageRank trained LLMs."*  
  **Reality:** PageRank ranked web search links; its indirect legacy was fueling web-scale text digitization.
- **Quick Revision:** `1986 Backprop` (train hidden layers) -> `1998 PageRank` (web graph & text scale) -> `2012 AlexNet` (CNNs + ImageNet + GPUs) -> `2017 Transformer` (parallel Self-Attention) -> `2020 GPT-3` (175B scale + few-shot prompting).
- **Source Reference:** `Lecture 16 Notes.pdf` (14p), `Lecture-16-student-worksheet.pdf` (8p), `Research paper 9 and 10 - Presentation.pdf` (16p), Papers 6–10.
