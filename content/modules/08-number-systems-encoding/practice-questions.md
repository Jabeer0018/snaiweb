---
title: "Practice Questions & Worked Answers"
description: "10 practice questions with step-by-step solutions from the Number Systems & Data Encoding notes."
order: 4
source: "Number Systems & Data Encoding PDF (pp. 7-8)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["practice", "questions", "answers", "binary", "ascii", "hex"]
estimatedMinutes: 5
---

## Practice Questions & Answers

| # | Question | Answer | Working |
| --- | --- | --- | --- |
| 1 | Convert `10110₂` to decimal | `22` | `16 + 4 + 2` |
| 2 | Convert `42` to binary | `101010` | `42/2=21 r0, 21/2=10 r1, 10/2=5 r0, 5/2=2 r1, 2/2=1 r0, 1/2=0 r1` (reverse) |
| 3 | How many values can 6 bits represent, and what is the range? | `64 values, 0 to 63` | `2⁶ = 64` |
| 4 | ASCII value of `'c'` given `'C' = 67` | `99` | `67 + 32` |
| 5 | Convert `11010110₂` to hex | `D6` | `1101 = D`, `0110 = 6` |
| 6 | Uncompressed `100 × 50` RGB image size | `15,000 bytes` | `100 × 50 × 3` |
| 7 | Add 1 to 255 in unsigned 8-bit | Overflows and wraps to `0` | `256` needs 9 bits |
| 8 | `250 + 10` in unsigned 8-bit | `4` | `260 - 256` |
| 9 | How many values can 5 bits represent, and range? | `32 values, 0 to 31` | `2⁵ = 32` |
| 10 | Bits in a nibble and in a byte | `4 bits` and `8 bits` | `nibble = 4`, `byte = 8 = 2 nibbles` |
