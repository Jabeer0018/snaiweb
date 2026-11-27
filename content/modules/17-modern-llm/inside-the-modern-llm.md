---
title: "Inside the Modern LLM: Tokens, Parameters & Next-Token Prediction"
description: "Demis Hassabis's intelligence framing, what makes an LLM 'Large', next-token prediction, tokenization, and numerical representation."
order: 1
source: "Inside the Modern LLM Part 1- Presentation.pdf (C17, pp. 1–36)"
addedAt: "2026-11-28"
updatedAt: "2026-11-28"
keywords: ["LLM", "Large Language Model", "tokenization", "parameters", "next-token prediction", "Transformer"]
estimatedMinutes: 9
---

## Introduction & Intuition

For most of history, living organisms learned while machines only followed fixed, human-written rules. Machine learning shifted that boundary: machines now recognize faces, play complex games, and work fluently with human language. Today's flagship example is the **Large Language Model (LLM)**.

As Google DeepMind CEO **Demis Hassabis** frames it: *"Intelligence can be viewed as a process that converts unstructured information into useful and actionable knowledge."*

---

## Breaking Down "Large Language Model"

| Term | Exact Course Meaning (C17 Slides, pp. 7–11) |
| --- | --- |
| **Model** | A system that learns patterns from examples and uses those patterns to make predictions (e.g., *"The sun rises in the `___`"* -> `"east"`). |
| **Language** | The type of data it learns from: websites, books, articles, conversations, and source code—learning how words, syntax, and ideas connect. |
| **Large** | **Lots of training text** + **billions of parameters** (tiny adjustable numbers inside the neural network tuned during training). Crucially, **"Large" is a moving label**, not a fixed scientific boundary—yesterday's huge model looks small today. |

---

## Technical Definition & Core Objective

> [!IMPORTANT]
> A **Large Language Model (LLM)** is a very large neural network built using the **Transformer architecture**, trained on massive text corpora to perform **one core task: predict the next token**.

From this single statistical objective—predicting the most plausible next token given preceding context—an LLM learns to summarize documents, translate languages, answer questions, and write code.

---

## Internal Working: How Computers Process Human Language

Remember from Module C08: **computers only understand numbers**, never raw English letters or concepts. To predict the next token, an LLM converts text through a numerical pipeline:

1. **Tokenization:** Input text is split into small chunks called **tokens** (common words, subwords, punctuation, or spaces). For example, `"unbelievable"` might split into `["un", "believ", "able"]`.
2. **Token IDs:** Every token in the model's vocabulary maps to a unique integer ID (e.g., `15496`).
3. **Embeddings (Vectors):** Each Token ID is mapped to a dense list of numbers capturing semantic context.
4. **Transformer Layers & Self-Attention:** Billions of learned **parameters** mix information across all tokens in the prompt simultaneously.
5. **Probability Distribution:** The output layer assigns a probability score to every token in the vocabulary and samples/selects the **next token**—then appends it and repeats!

---

## Worked Example: Next-Token Prediction Step-by-Step

Prompt: `"The trophy didn't fit in the suitcase because it was too "`

1. The prompt is tokenized into numeric IDs and passed through Transformer layers.
2. Self-attention links `"it"` strongly to `"trophy"` and `"fit"`.
3. The model outputs top candidate probabilities: `"big"` (`0.68`), `"large"` (`0.18`), `"wide"` (`0.06`), `"small"` (`0.02`), ...
4. Selecting `"big"` produces `"The trophy didn't fit in the suitcase because it was too big"`, which becomes the new input for the next token!

---

## Common Misconceptions

- **Misconception:** *"There is a strict threshold (like 10 billion parameters) that makes a model an LLM."*  
  **Reality:** "Large" is a **moving label** relative to the era's compute and dataset scale, not a fixed scientific threshold.
- **Misconception:** *"LLMs look up full answers inside a hidden database of memorized paragraphs."*  
  **Reality:** LLMs generate text **one token at a time** using learned numerical parameters encoding statistical relationships in language.
- **Misconception:** *"One token always equals one English word."*  
  **Reality:** Tokens are subword units—short common words are 1 token, long/rare words split into multiple tokens, and punctuation/spaces count as tokens too.

---

## Examination Perspective

- Be ready to explain **Model + Language + Large** and why **"Large"** is not a fixed constant.
- Know the **single core training task** of an LLM (**predict the next token**) and why **tokenization -> numbers** is necessary before any neural computation can occur.

---

## Concept Connections

- **Previous Module:** [The Next Five Papers (Transformers & GPT-3)](/notes/16-next-five-papers/next-five-papers-1986-2020)
- **Foundations:** [Text (ASCII/UTF-8) & Binary Representation](/notes/08-number-systems-encoding/text-images-signatures-encryption)
- **Interactive Lab:** [AI & LLM Tokenization / Perceptron Lab](/playground)

---

## Quick Revision

- **LLM =** Very large **Transformer** neural network trained to **predict the next token**.
- **Large =** Massive training text + **billions of parameters** (a moving label, not a fixed cutoff).
- **Pipeline:** Text -> **Tokens** -> **Token IDs (numbers)** -> **Embeddings & Transformer layers** -> **Next-token probabilities**.
