---
title: "Inside the Modern LLM: Tokens, Embeddings, Parameters & Next-Token Prediction"
description: "Zero-to-advanced guide to Large Language Models: Hassabis's intelligence framing, Model/Language/Large, tokenization, numerical representation, and next-token probabilities."
order: 1
source: "Inside the Modern LLM Part 1- Presentation.pdf (C17, pp. 1–36)"
addedAt: "2026-11-28"
updatedAt: "2026-11-28"
keywords: ["LLM", "Large Language Model", "tokenization", "parameters", "next-token prediction", "embeddings"]
estimatedMinutes: 11
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [Number Systems & Encoding](/notes/08-number-systems-encoding/text-images-signatures-encryption) and [The Next Five Papers (1986–2020)](/notes/16-next-five-papers/next-five-papers-1986-2020).

You use AI chat tools every day—but how does a machine made of `0`s and `1`s actually read your question and write an answer? This lesson opens the hood of a **Large Language Model (LLM)** from absolute fundamentals, connecting everything you learned in binary encoding (C08) and Transformers (C16).

---

## 2. Stage 1 & 2: Breaking Down "Large Language Model"

Google DeepMind CEO **Demis Hassabis** describes intelligence as *"a process that converts unstructured information into useful and actionable knowledge."* For centuries, living organisms learned while machines followed rigid rules. Today's **LLM** learns statistical patterns in human language at massive scale:

1. **Model:** A mathematical system that learns patterns from examples to make predictions (e.g., `"The sun rises in the ___"` -> `"east"`).
2. **Language:** The domain it studies—billions of pages from books, websites, articles, conversations, and source code—learning grammar, facts, reasoning patterns, and code syntax.
3. **Large:** Trained on **massive text corpora** with **billions of parameters** (tiny adjustable numbers tuned during training). Crucially, **"Large" is a moving label**, not a fixed cutoff—what looked huge in 2020 looks modest a few years later.

---

## 3. Stage 3 & 4: One Core Task & Turning Words into Numbers

> [!IMPORTANT]
> An LLM is a large **Transformer** neural network trained to do **one core task: predict the next token**. Fluent conversation, translation, summarization, and coding all emerge from doing that single task extraordinarily well.

Remember from Module C08: **computers only understand numbers**, never raw English words. Here is the exact step-by-step pipeline inside an LLM:

1. **Tokenization:** Text splits into subword chunks called **tokens** (common words = 1 token; rare/long words like `"unbelievable"` split into `["un", "believ", "able"]`).
2. **Token IDs:** Each token maps to an integer index in the model's vocabulary (e.g., `"The"` -> `464`).
3. **Embeddings (Vectors):** Each Token ID becomes a list of floating-point numbers representing meaning and relationships.
4. **Transformer Self-Attention:** Billions of trained **parameters** blend context across all tokens in the prompt simultaneously on GPUs.
5. **Next-Token Probability Distribution:** The model scores every vocabulary token (`"big": 68%`, `"large": 19%`, ...), picks one, appends it, and repeats!

---

## 4. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Word vs. Token Count
Does `"Hello, world!"` equal 2 tokens? Usually no: `"Hello"`, `","`, `" world"`, and `"!"` often split into `3–4` tokens because punctuation and spaces matter to subword tokenizers. *(Try the interactive **LLM Tokens & Prediction Lab** below!)*

### Intermediate Example: Why "Large" Has No Fixed Boundary
If a student asks in an exam: *"Is a 7-billion-parameter model officially 'Large' forever?"* **No**—as Lecture 17 explains, *"Large" is a moving label, not a precise scientific threshold.*

### Advanced Example: Frozen Weights vs. Context Window
When you paste a 500-line Python file into ChatGPT and ask for a bug fix, the model is **not retraining** its billions of parameters on your file. Those parameters stay frozen; your code enters as **Token IDs inside the context window**, steering the next-token probability distribution at inference time.

---

## 5. Common Misconceptions & Quick Revision

- **Misconception:** *"LLMs store complete pre-written answers in a hidden database and copy-paste them."*  
  **Reality:** LLMs generate responses **one token at a time** from learned numerical parameters.
- **Quick Revision:** LLM = Transformer trained to **predict the next token**; Large = massive text + billions of parameters (moving label); Pipeline = Text -> Tokens -> Token IDs -> Embeddings -> Transformer -> Next-Token Probabilities.
- **Source Reference:** `Inside the Modern LLM Part 1- Presentation.pdf` (C17, pp. 1–36).
