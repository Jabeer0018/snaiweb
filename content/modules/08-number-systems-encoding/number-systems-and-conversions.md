---
title: "Bases, Binary ↔ Decimal & Hexadecimal"
description: "Unary vs positional systems, binary-to-decimal, decimal-to-binary division method, and binary-to-hex."
order: 1
source: "Number Systems & Data Encoding PDF (pp. 1-3, 6)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["binary", "decimal", "hexadecimal", "base", "conversion"]
estimatedMinutes: 8
---

## Number System Basics

- **Base:** The number of unique symbols a number system uses:
  - **Binary (Base-2):** `0, 1` (maps naturally to transistors being ON or OFF)
  - **Decimal (Base-10):** `0–9`
  - **Hexadecimal (Base-16):** `0–9, A–F` (`A=10` to `F=15`)
- **Positional System:** A digit's value depends on its position (e.g., `3423 = 3×10³ + 4×10² + 2×10¹ + 3×10⁰`).
- **Unary System:** One symbol per item (like tally marks); becomes tedious for large quantities.

## Binary to Decimal

Multiply each bit by its power-of-2 place value (`128, 64, 32, 16, 8, 4, 2, 1` from right to left) and sum:

- `1001₂` = `1×8 + 0×4 + 0×2 + 1×1` = **`9`**
- `1011₂` = `1×8 + 0×4 + 1×2 + 1×1` = **`11`**
- `10110₂` = `16 + 0 + 4 + 2 + 0` = **`22`**

## Decimal to Binary (Division Method)

Repeatedly divide by 2, record remainders, stop when quotient is `0`, and **read remainders bottom-to-top**:

Example (`25` to binary):
- `25 / 2 = 12` r `1`
- `12 / 2 = 6` r `0`
- `6 / 2 = 3` r `0`
- `3 / 2 = 1` r `1`
- `1 / 2 = 0` r `1`
- Bottom-to-top: **`11001₂`** (Check: `16 + 8 + 1 = 25`).

## Hexadecimal (Base-16)

- **4 bits = 1 hex digit**, so **1 byte (8 bits) = 2 hex digits**.
- Split binary into groups of 4 from the right:
  - `1010 1111₂` → `A` `F` = **`AF₁₆`**
  - `1101 0110₂` → `D` `6` = **`D6₁₆`**
- Used in colour codes (`#FF5733`), memory addresses (`0x7FFFE`), MAC addresses (`00:1A:2B:3C:4D:5E`), and hex dumps.
