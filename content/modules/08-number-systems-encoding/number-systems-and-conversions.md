---
title: "Number Systems: Why Binary Exists, Positional Bases & Conversions"
description: "Zero-to-advanced guide from tally marks and base-10 intuition to binary positional notation, decimal-to-binary division, octal permissions, and hexadecimal grouping."
order: 1
source: "HYD- Lecture 8 - Number Systems - Part 1.pdf (20p) & Session 2_compressed.pdf (pp. 1–25)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["number system", "base", "binary", "decimal", "hexadecimal", "octal", "conversion"]
estimatedMinutes: 13
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** None (only basic arithmetic).

Why do computers count in `0`s and `1`s instead of `0` through `9`? What does **"Base-2"** or **"Base-16"** actually mean? In this lesson, we start from how humans invented counting, derive positional notation from scratch, and master **Binary ↔ Decimal ↔ Hexadecimal** conversions step by step.

---

## 2. Stage 1 & 2: From Tally Marks to Bases & Why Computers Use Binary

Suppose you want to count sheep with scratches on a stick: `||||| ||||| ||` (12 marks). That is a **Unary (tally)** system—every mark adds `1`, regardless of position. Writing `1,000,000` would take a million scratches!

To fix that, humans invented **Positional Number Systems**: instead of adding new symbols forever, a digit's value depends on **which column (position)** it sits in. Because humans have ten fingers, we settled on **Decimal (Base-10)** using ten digits (`0–9`), where each column moving left multiplies by `10`:
$$3423_{10} = (3 \times 10^3) + (4 \times 10^2) + (2 \times 10^1) + (3 \times 10^0)$$

### Why Computers Don't Use Base-10
Inside a microchip sit billions of microscopic electrical switches called **transistors**. Measuring 10 delicate voltage levels (`0.1V`, `0.2V`, ..., `1.0V`) reliably when wires heat up or pick up electrical noise is fragile. Distinguishing just **two clear states—OFF (`0`) and ON (`1`)**—is fast, cheap, and rock-solid. That is why computers use **Binary (Base-2)**.

---

## 3. Stage 3 & 4: Positional Notation in Base-2, Base-8 & Base-16

| System | Base ($b$) | Digit Symbols | Column Weights (Right to Left) | Primary Computing Role |
| --- | --- | --- | --- | --- |
| **Binary** | `2` | `0, 1` | $1, 2, 4, 8, 16, 32, 64, 128, \dots$ ($2^k$) | Hardware logic, CPU instructions, RAM |
| **Octal** | `8` | `0–7` | $1, 8, 64, 512, \dots$ ($8^k$) | Compact **3-bit** grouping (`chmod 755`) |
| **Decimal** | `10` | `0–9` | $1, 10, 100, 1000, \dots$ ($10^k$) | Everyday human math |
| **Hexadecimal** | `16` | `0–9, A–F` (`A=10..F=15`) | $1, 16, 256, 4096, \dots$ ($16^k$) | Compact **4-bit** grouping (memory addresses, `#RRGGBB`, hex dumps) |

### Why Hexadecimal Exists
Reading `1101101011110010₂` hurts human eyes and invites typos. Since $16 = 2^4$, **every single hexadecimal digit cleanly represents 4 binary bits (1 nibble)**. That shrinks a 16-bit binary string into just 4 readable hex digits (`DAF2`)!

---

## 4. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Binary -> Decimal (`101101₂`)
Write the powers of `2` from right ($2^0=1$) to left ($2^5=32$) above each bit, then add ONLY the weights with a `1`:

| Bit | `1` | `0` | `1` | `1` | `0` | `1` |
| --- | --- | --- | --- | --- | --- | --- |
| **Weight** | $32$ | $16$ | $8$ | $4$ | $2$ | $1$ |

$$32 + 0 + 8 + 4 + 0 + 1 = \mathbf{45_{10}}$$

### Intermediate Example: Decimal -> Binary (`45₁₀` via Repeated Division)
Repeatedly divide by `2` and record each remainder (`0` or `1`). Because the first division tests whether the number is odd/even (the $2^0$ ones place), read the remainders **from bottom to top**:
- `45 ÷ 2 = 22` remainder **`1`** (Least Significant Bit)
- `22 ÷ 2 = 11` remainder **`0`**
- `11 ÷ 2 = 5` remainder **`1`**
- `5 ÷ 2 = 2` remainder **`1`**
- `2 ÷ 2 = 1` remainder **`0`**
- `1 ÷ 2 = 0` remainder **`1`** (Most Significant Bit)

Reading bottom-to-top gives **`101101₂`**.

### Advanced Example: Binary <-> Hexadecimal (`1101011₂` -> Hex -> Decimal)
1. Pad on the left with `0`s so the length is a multiple of 4: `0110 1011`
2. Convert each 4-bit nibble independently:
   - `0110₂` = `4 + 2` = **`6`**
   - `1011₂` = `8 + 2 + 1` = `11` = **`B`**
3. Result in Hex: **`0x6B`** (in Decimal: $(6 	imes 16) + 11 = 96 + 11 = \mathbf{107_{10}}$).

---

## 5. Common Misconceptions, Interactive Practice & Quick Revision

- **Misconception:** *"In Hexadecimal, `A–F` stand for `11–16`."*  
  **Reality:** Zero takes one slot, so the 16 digits are `0–9` and **`A=10, B=11, C=12, D=13, E=14, F=15`**.
- **Misconception:** *"Remainders from repeated division by 2 are read top-to-bottom."*  
  **Reality:** Always read **bottom-to-top** (last remainder is the leftmost/largest bit).
- **Try It Below:** Toggle individual bits in the interactive **Binary & Base Converter** at the bottom of this page!
- **Source Reference:** `HYD- Lecture 8 - Number Systems - Part 1.pdf` (pp. 1–20) & `Session 2_compressed.pdf` (pp. 1–25).
