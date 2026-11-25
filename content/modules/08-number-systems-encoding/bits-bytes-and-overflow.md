---
title: "Bits, Nibbles, Bytes, Storage Units & Overflow"
description: "n-bit range formula (0 to 2^n - 1), kB vs KiB, and 8-bit binary overflow."
order: 2
source: "Number Systems & Data Encoding PDF (pp. 3-5)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["bit", "nibble", "byte", "overflow", "KiB", "kB", "octet"]
estimatedMinutes: 6
---

## Bits, Nibbles & Bytes

- **Bit:** 1 binary digit (`0` or `1`) — smallest unit of information.
- **Nibble:** 4 bits (`2⁴ = 16` values, `0–15`; 1 hex digit).
- **Byte (Octet):** 8 bits = 2 nibbles (`2⁸ = 256` values, `0–255`).

> [!IMPORTANT]
> **`n` bits** give **`2ⁿ` values**, with an unsigned range of **`0` to `2ⁿ - 1`**. (Common mistake: 6 bits = 64 values, range `0 to 63`, not `0 to 64`.)

## Decimal vs. Binary Storage Units

| Decimal (Powers of 1000) | Binary (Powers of 1024) |
| --- | --- |
| `1 kB = 1,000 bytes` | `1 KiB = 1,024 bytes` |
| `1 MB = 1,000 kB` | `1 MiB = 1,024 KiB` |
| `1 GB = 1,000 MB` | `1 GiB = 1,024 MiB` |
| `1 TB = 1,000 GB` | `1 TiB = 1,024 GiB` |

## Binary Overflow

An unsigned 8-bit value holds at most `11111111₂ = 255`. Adding `1` produces `100000000₂ = 256` (9 bits). Because there is no 9th slot, the high bit is dropped and the value **wraps around to `00000000₂ = 0`**.

- Example: `250 + 10 = 260` → `260 - 256 = 4` in an unsigned 8-bit integer.
