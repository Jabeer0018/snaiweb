---
title: "Bases, Binary ↔ Decimal & Hexadecimal"
description: "Unary vs positional systems, binary-to-decimal, decimal-to-binary division method, and binary-to-hex."
order: 1
source: "Number Systems & Data Encoding PDF (pp. 1-3, 6)"
addedAt: "2026-11-26"
updatedAt: "2026-11-27"
keywords: ["binary", "decimal", "hexadecimal", "base", "conversion"]
estimatedMinutes: 9
---

## Intuition & Core Principle

> [!IMPORTANT]
> A **number system's base ($b$)** defines how many unique digit symbols it uses (`0` through `b - 1`) and the **power of $b$** each place-value column represents.

Humans count in **Decimal (Base-10)** largely because of ten fingers. Computers count in **Binary (Base-2)** because physical transistors reliably distinguish two voltage states (**OFF = 0**, **ON = 1**). Because long binary strings like `110110101111` are hard for humans to read, engineers group binary into **Hexadecimal (Base-16)**—where every single hex digit cleanly represents **4 bits (1 nibble)**.

---

## Unary vs. Positional Systems

- **Unary (Tally marks):** Value depends solely on count (`||||| = 5`). Compactness is terrible—writing `1,000,000` takes a million marks.
- **Positional Systems:** Value equals each digit multiplied by its column weight ($b^k$):
  $$3423_{10} = 3 \times 10^3 + 4 \times 10^2 + 2 \times 10^1 + 3 \times 10^0$$

| System | Base | Allowed Digits | Primary Role |
| --- | --- | --- | --- |
| **Binary** | 2 | `0, 1` | Native hardware logic, CPU instructions, memory storage |
| **Octal** | 8 | `0–7` | Compact 3-bit grouping (Unix `chmod` permissions like `755`) |
| **Decimal** | 10 | `0–9` | Everyday human arithmetic |
| **Hexadecimal** | 16 | `0–9, A–F` (`A=10..F=15`) | Memory addresses, RGB colors (`#FF00AA`), hex dumps |

---

## Binary ↔ Decimal Conversion

### 1. Binary -> Decimal (Sum of Powers of 2)

Assign powers of 2 from right ($2^0 = 1$) to left ($2^1=2, 2^2=4, 2^3=8, \dots$) and sum the weights where the bit is `1`.

**Worked Example:** Convert `101101₂` to decimal:

| Bit | `1` | `0` | `1` | `1` | `0` | `1` |
| --- | --- | --- | --- | --- | --- | --- |
| **Weight** | $2^5 = 32$ | $2^4 = 16$ | $2^3 = 8$ | $2^2 = 4$ | $2^1 = 2$ | $2^0 = 1$ |

$$32 + 0 + 8 + 4 + 0 + 1 = 45_{10}$$

### 2. Decimal -> Binary (Repeated Division by 2)

Divide repeatedly by `2`, record each remainder (`0` or `1`), and read remainders **from bottom to top** (last remainder = Most Significant Bit).

**Worked Example:** Convert `45₁₀` to binary:

- `45 / 2 = 22` remainder **`1`** (LSB)
- `22 / 2 = 11` remainder **`0`**
- `11 / 2 = 5` remainder **`1`**
- `5 / 2 = 2` remainder **`1`**
- `2 / 2 = 1` remainder **`0`**
- `1 / 2 = 0` remainder **`1`** (MSB)

Reading bottom-to-top -> **`101101₂`**.

---

## Binary ↔ Hexadecimal (4-Bit Grouping)

Since $16 = 2^4$, **each hex digit maps to exactly 4 bits**. Pad the left with zeros if the bit count is not a multiple of 4.

**Worked Example:** Convert `1101011₂` to hexadecimal:

1. Pad to 8 bits and split into 4-bit nibbles: `0110` `1011`
2. Convert each nibble:
   - `0110₂ = 4 + 2 = 6` -> `6`
   - `1011₂ = 8 + 2 + 1 = 11` -> `B`
3. Result: **`0x6B`** (in decimal: $6 	imes 16 + 11 = 107_{10}$).

---

## Common Misconceptions

- **Misconception:** *"In repeated division by 2, you read the remainders top-to-bottom."*  
  **Reality:** The first division yields the **Least Significant Bit** ($2^0$), so remainders must be read **bottom-to-top**.
- **Misconception:** *"Hexadecimal letters A–F represent values 11–16."*  
  **Reality:** `A=10, B=11, C=12, D=13, E=14, F=15` (16 symbols total: `0–15`).

---

## Exam Perspective

- Practice converting 8-bit binary values to both **decimal** and **hexadecimal** without a calculator.
- Remember the **4-bit nibble rule** for Hex and **3-bit rule** for Octal (`chmod 755` = `111 101 101` = `rwxr-xr-x`).

---

## Related Concepts

- [Bits, Nibbles, Bytes, Storage Units & Overflow](/notes/08-number-systems-encoding/bits-bytes-and-overflow)
- [Number System Converter (Interactive Playground)](/playground)

---

## Quick Revision

- **Binary weights:** `128, 64, 32, 16, 8, 4, 2, 1` (for 8 bits).
- **Decimal -> Binary:** Divide by `2`, read remainders **bottom-to-top**.
- **Binary -> Hex:** Group into **4-bit nibbles** from the right (`A=10` .. `F=15`).
