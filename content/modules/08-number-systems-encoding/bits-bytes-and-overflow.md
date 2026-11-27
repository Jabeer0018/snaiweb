---
title: "Bits, Nibbles, Bytes, Storage Units & Overflow"
description: "n-bit range formula (0 to 2^n - 1), kB vs KiB, and 8-bit binary overflow."
order: 2
source: "Number Systems & Data Encoding PDF (pp. 3-5)"
addedAt: "2026-11-26"
updatedAt: "2026-11-27"
keywords: ["bit", "nibble", "byte", "overflow", "KiB", "kB", "octet"]
estimatedMinutes: 7
---

## Intuition & Core Principle

> [!IMPORTANT]
> An **$n$-bit unsigned integer** can represent **$2^n$ distinct values**, spanning **`0` to $2^n - 1$**. When a calculation exceeds $2^n - 1$, the extra carry bit cannot fit in fixed hardware registers—causing **integer overflow (wrap-around)**.

Unlike pure mathematics where numbers grow infinitely, computer memory allocates **fixed-width boxes** (8 bits, 16 bits, 32 bits, 64 bits). Understanding box widths explains everything from RGB color limits (`0–255`) to why a 1 TB drive shows fewer gigabytes in your OS.

---

## Fundamental Data Units

- **Bit (`b`):** A single binary digit (`0` or `1`)—smallest unit of information.
- **Nibble:** `4` bits ($2^4 = 16$ values: `0–15`; equals **1 hexadecimal digit**).
- **Byte (`B`, Octet):** `8` bits = `2` nibbles ($2^8 = 256$ values: `0–255`).

| Bit Width ($n$) | Total Distinct Values ($2^n$) | Unsigned Range ($0 	ext{ to } 2^n - 1$) | Common Use |
| --- | --- | --- | --- |
| **4 bits** | 16 | `0–15` | 1 hex digit |
| **8 bits (1 Byte)** | 256 | `0–255` | 1 ASCII char, 1 RGB channel |
| **16 bits (2 Bytes)** | 65,536 | `0–65,535` | TCP/UDP port numbers (`0–65535`) |
| **32 bits (4 Bytes)** | ~4.29 billion | `0–4,294,967,295` | IPv4 addresses, 32-bit integers |

---

## Decimal (SI) vs. Binary (IEC) Storage Units

Storage manufacturers advertise drives in **powers of 10** (SI), while many OS utilities report memory/storage in **powers of 2** (IEC):

| Decimal / SI (Powers of 10) | Binary / IEC (Powers of 2) |
| --- | --- |
| `1 kB` (kilobyte) = $10^3 = 1,000$ bytes | `1 KiB` (kibibyte) = $2^{10} = 1,024$ bytes |
| `1 MB` (megabyte) = $10^6 = 1,000,000$ bytes | `1 MiB` (mebibyte) = $2^{20} = 1,048,576$ bytes |
| `1 GB` (gigabyte) = $10^9$ bytes | `1 GiB` (gibibyte) = $2^{30} = 1,073,741,824$ bytes |

**Why a "1 TB" drive shows ~931 GiB:**  
$1,000,000,000,000 	ext{ bytes} \div 2^{30} pprox \mathbf{931.32	ext{ GiB}}$. Neither number is "lying"—they simply use different bases ($1000$ vs. $1024$).

---

## Binary Addition & 8-Bit Overflow

Binary addition follows four rules: `0+0=0`, `0+1=1`, `1+1=10` (write `0`, carry `1`), `1+1+1=11` (write `1`, carry `1`).

**Worked Example (8-bit Overflow):** Add `255 + 1` in an **8-bit unsigned** register:

```text
  1111 1111   (255)
+ 0000 0001   (  1)
-----------
1 0000 0000   (256 requires 9 bits!)
```

Because an 8-bit register only stores the lowest 8 bits, the leading carry `1` is discarded/trapped in a carry flag, leaving **`0000 0000` (`0`)**! Similarly, `250 + 10 = 260` wraps around to `260 mod 256 = 4` (`0000 0100`).

---

## Common Misconceptions

- **Misconception:** *"An $n$-bit unsigned integer has maximum value $2^n$."*  
  **Reality:** Counting starts at `0`, so the maximum value is **$2^n - 1$** (e.g., 8 bits maxes at `255`, not `256`).
- **Misconception:** *"1 MB and 1 MiB are identical."*  
  **Reality:** `1 MB = 1,000,000 B`, whereas `1 MiB = 1,048,576 B` (~4.86% larger).

---

## Exam Perspective

- Expect questions asking for the **maximum value** or **number of distinct values** for $n$ bits, and **8-bit overflow** results (`(a + b) mod 256`).
- Watch capitalization carefully: **`b` = bits**, **`B` = Bytes** (`8 bits`). Downloading at `80 Mbps` (megabits/sec) transfers `10 MB/s` (megabytes/sec).

---

## Related Concepts

- [Bases, Binary ↔ Decimal & Hexadecimal](/notes/08-number-systems-encoding/number-systems-and-conversions)
- [Memory & Storage Calculator (Interactive Playground)](/playground)

---

## Quick Revision

- **Unsigned $n$-bit range:** `0` to $2^n - 1$ ($2^n$ values).
- **8-bit max:** `255` (`1111 1111`); `255 + 1` wraps to `0` (overflow).
- **SI vs. IEC:** `kB = 1000`, `KiB = 1024`; `b` = bit, `B` = byte (`8 bits`).
