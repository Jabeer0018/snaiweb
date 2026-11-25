---
title: "The Next Five Papers (1986–2020)"
description: "Backprop, PageRank, AlexNet, Attention/Transformers, and GPT-3 scale and few-shot prompting."
order: 1
source: "Revision Notes (Lecture 16)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["Backpropagation", "PageRank", "AlexNet", "Transformer", "Attention", "GPT-3"]
estimatedMinutes: 7
---

## From Training to Scale

| Year | Paper | What It Added | Key Distinction |
| --- | --- | --- | --- |
| **1986** | **Rumelhart, Hinton & Williams** | **Backpropagation:** sends error backward to compute weight contributions (`PREDICT -> COMPARE -> WORK BACKWARD -> ADJUST -> REPEAT`). | Mathematical calculation (gradient descent updates weights); not conscious understanding. |
| **1998** | **Page & Brin** | **PageRank:** web links act as weighted votes; web growth created massive digital text. | Ranks web pages; did not directly train LLMs. |
| **2012** | **Krizhevsky, Sutskever & Hinton** | **AlexNet:** deep networks + ImageNet labelled data + GPUs (`~15%` vs `~26%` top-5 error). | `15%` vs `26%` are 2012 ImageNet results, not general AI accuracy. |
| **2017** | **Vaswani et al.** | **Transformer & Attention:** models relationships across all words in parallel. | "Attention" is weighted computation, not human focus. |
| **2020** | **Brown et al. (GPT-3)** | **175B parameters:** one model performs many tasks via **few-shot prompting**. | Prompting does **not** update internal parameters; fluent text is not guaranteed correct. |
