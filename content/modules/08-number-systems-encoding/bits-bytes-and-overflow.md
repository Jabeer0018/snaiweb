---
title: "Bits, Bytes, Storage Units (kB vs KiB) & Integer Overflow"
description: "Zero-to-advanced guide to fixed-width n-bit integer limits (0 to 2^n - 1), binary addition with carry, 8-bit wrap-around overflow, and SI vs IEC storage math."
order: 2
source: "HYD- Lecture 8 - Number Systems - Session 2_compressed.pdf (pp. 20–42)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["bit", "nibble", "byte", "overflow", "KiB", "kB", "binary addition", "2^n - 1"]
estimatedMinutes: 10
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [Number Systems & Conversions](/notes/08-number-systems-encoding/number-systems-and-conversions).

In mathematics, numbers can grow forever. Inside a computer, numbers live in **fixed-width hardware boxes** (8 bits, 16 bits, 32 bits, 64 bits). In this lesson, you will learn why `8 bits` maxes out at `255` (never `256`), what happens when you add `255 + 1` (**integer overflow**), and why buying a "1 TB" drive shows `~931 GiB` on your laptop.

---

## 2. Stage 1 & 2: Intuition — The Car Odometer & Fixed Boxes

Think of an old mechanical car odometer with **3 digits (`000` to `999`)**:
- There are $10^3 = 1,000$ distinct readings, starting at `000` and ending at `999` ($10^3 - 1$).
- If you are at `999` and drive 1 more mile, there is no 4th wheel for the carry `1`, so the odometer silently **wraps around to `000`**!

Computer hardware works the exact same way—in **Base-2** instead of Base-10.

---

## 3. Stage 3 & 4: Bits, Nibbles, Bytes & The $2^n - 1$ Formula

- **Bit (`b`):** 1 binary digit (`0` or `1`).
- **Nibble:** `4 bits` ($2^4 = 16$ values: `0–15`; equals **1 Hex digit**).
- **Byte (`B`, Octet):** `8 bits` = 2 nibbles ($2^8 = 256$ values: `0–255`).

> [!IMPORTANT]
> An **$n$-bit unsigned integer** holds **$2^n$ distinct values**, spanning **`0` to $2^n - 1$**. Because `0` uses the first slot, the maximum value is always **1 less than $2^n$**!

### Binary Addition Rules & 8-Bit Overflow
Binary addition has 4 simple rules: `0+0=0`, `0+1=1`, `1+1=10` (write `0`, carry `1`), `1+1+1=11` (write `1`, carry `1`).

When adding two 8-bit numbers whose sum reaches `256` (`1 0000 0000₂`), the 9th carry bit falls off the left edge of the 8-bit register—leaving `(sum) mod 256`:

```text
  1111 1111   (255)
+ 0000 0001   (  1)
-----------
1 0000 0000   -> 8-bit register keeps only 0000 0000 (0)!
```

---

## 4. Storage Units: Decimal (SI) vs. Binary (IEC) & `b` vs `B`

| Decimal / SI (Drive Makers, Networks) | Binary / IEC (OS Memory / RAM) |
| --- | --- |
| `1 kB` (kilobyte) = $10^3 = 1,000	ext{ B}$ | `1 KiB` (kibibyte) = $2^{10} = 1,024	ext{ B}$ |
| `1 MB` = $10^6 = 1,000,000	ext{ B}$ | `1 MiB` = $2^{20} = 1,048,576	ext{ B}$ |
| `1 GB` = $10^9	ext{ B}$ | `1 GiB` = $2^{30} = 1,073,741,824	ext{ B}$ |

---

## 5. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Unsigned Range of 5 Bits
How many distinct values can `5 bits` hold, and what is the maximum?
- Distinct values: $2^5 = \mathbf{32}$.
- Unsigned range: `0` to $2^5 - 1 = \mathbf{31}$ (`11111₂`).

### Intermediate Example: 8-Bit Overflow (`240 + 25`)
In an 8-bit unsigned register, what does `240 + 25` evaluate to?
- Mathematical sum = `265`.
- Since $265 \ge 256$, the 9th bit (`256`) overflows: $265 - 256 = \mathbf{9}$ (`0000 1001₂`).

### Advanced Example: Why a 1 TB SSD Shows ~931 GiB + `Mbps` vs `MB/s`
1. Drive capacity advertised in SI: $1	ext{ TB} = 10^{12}	ext{ bytes}$.
2. Divided by binary gibibytes ($2^{30} = 1,073,741,824$): $10^{12} \div 2^{30} pprox \mathbf{931.32	ext{ GiB}}$.
3. Similarly, an internet plan advertised at `80 Mbps` (mega**bits**/sec) transfers $80 \div 8 = \mathbf{10	ext{ MB/s}}$ (mega**Bytes**/sec).

---

## 6. Common Misconceptions & Quick Revision

- **Misconception:** *"8 bits can store the number 256."*  
  **Reality:** 8 bits store `256` *different numbers*, from **`0` to `255`**. Storing `256` requires `9 bits`.
- **Quick Revision:** $n$-bit unsigned max = $2^n - 1$; Overflow wraps modulo $2^n$; `b` = bits, `B` = Bytes (`8 bits`); `kB = 1000`, `KiB = 1024`.
- **Source Reference:** `HYD- Lecture 8 - Number Systems - Session 2_compressed.pdf` (pp. 20–42).
