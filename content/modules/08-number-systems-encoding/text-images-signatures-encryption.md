---
title: "Text (ASCII/UTF-8), Images (RGB), Magic Numbers & Encryption"
description: "ASCII vs Unicode/UTF-8, RGB/RGBA image size, file signatures & hex dumps, and Encoding vs Encryption."
order: 3
source: "Number Systems & Data Encoding PDF (pp. 5-8)"
addedAt: "2026-11-26"
updatedAt: "2026-11-27"
keywords: ["ASCII", "Unicode", "UTF-8", "RGB", "RGBA", "magic number", "hex dump", "encryption"]
estimatedMinutes: 8
---

## Intuition & Core Principle

> [!IMPORTANT]
> Inside RAM and on disk, **everything is just bytes**. Whether a sequence of bytes represents the letter `'A'`, a bright red pixel, or a PNG image depends entirely on the **encoding standard** interpreting those bytes.

For example, the byte `0x41` (`65₁₀`, `01000001₂`) is `'A'` in ASCII text, a dark intensity value in an image channel, or an assembly opcode inside an executable. File formats, character tables, and magic numbers exist so software knows how to decode raw binary accurately.

---

## Text: ASCII, Unicode & UTF-8

- **ASCII:** A 7-bit encoding defining `128` English characters (`0–127`, typically stored in 1 byte).
  - `'A' = 65` (`0x41`), `'a' = 97` (`0x61`), `'0' = 48` (`0x30`).
  - **Key Trick:** `Lowercase = Uppercase + 32` (flipping only bit 5: `01000001` -> `01100001`).
- **Unicode:** Universal character set assigning every symbol in every human language + emoji a unique **code point** (e.g., `'A' = U+0041`, Devanagari `'न' = U+0928`, `'😀' = U+1F600`).
- **UTF-8:** Variable-length encoding (**1 to 4 bytes** per code point) that is **100% backward-compatible with ASCII** (all ASCII characters remain 1 byte).

---

## Images: Pixels, RGB & RGBA

A raster image is a 2D grid of **pixels**:

- **RGB (24-bit color):** Each pixel uses **3 bytes** (Red `0–255`, Green `0–255`, Blue `0–255`).
  - `#FF0000` = pure Red; `#000000` = Black; `#FFFFFF` = White.
- **RGBA (32-bit color):** Adds a 4th **Alpha (transparency)** channel -> **4 bytes per pixel**.

**Uncompressed Image Size Formula:**
$$	ext{Size (bytes)} = 	ext{Width} 	imes 	ext{Height} 	imes 	ext{Bytes per Pixel}$$

**Worked Example:** A `1920 × 1080` RGB image (3 bytes/pixel):
$$1920 	imes 1080 	imes 3 = 6,220,800	ext{ bytes} pprox 6.22	ext{ MB (SI) or } 5.93	ext{ MiB (IEC)}$$

---

## File Signatures (Magic Numbers) & Hex Dumps

Renaming `photo.png` to `photo.txt` does **not** convert it to text. OS tools (`file`) inspect the first few header bytes—called **magic numbers**—via a **hex dump**:

| Format | Magic Bytes (Hex) | ASCII Header Preview |
| --- | --- | --- |
| **PNG** | `89 50 4E 47 0D 0A 1A 0A` | `.PNG....` |
| **PDF** | `25 50 44 46` | `%PDF` |
| **ZIP / DOCX** | `50 4B 03 04` | `PK..` |

---

## Encoding vs. Encryption

| Concept | Purpose | Secret Key Required? | Reversible by Anyone? |
| --- | --- | --- | --- |
| **Encoding** (ASCII, UTF-8, Base64) | **Data representation & compatibility** across systems | **No** | **Yes**—uses a public specification |
| **Encryption** (AES, TLS) | **Confidentiality & security** against unauthorized readers | **Yes** | **No**—computationally infeasible without the key |

---

## Common Misconceptions

- **Misconception:** *"Unicode and UTF-8 are two competing encodings."*  
  **Reality:** Unicode is the **table of code points**; UTF-8 is the **byte-encoding scheme** used to store those code points.
- **Misconception:** *"Base64 or Hex encoding protects sensitive data."*  
  **Reality:** Encoding provides **zero security**—anyone can decode Base64 or ASCII immediately without a key.

---

## Exam Perspective

- Memorize `'A'=65`, `'a'=97`, `'0'=48` (`+32` case shift).
- Be ready to compute uncompressed RGB (`× 3`) vs. RGBA (`× 4`) image sizes in bytes, MB, or MiB.
- Distinguish **Encoding** (no key, representation) from **Encryption** (key required, secrecy).

---

## Related Concepts

- [Bases, Binary ↔ Decimal & Hexadecimal](/notes/08-number-systems-encoding/number-systems-and-conversions)
- [Bits, Nibbles, Bytes, Storage Units & Overflow](/notes/08-number-systems-encoding/bits-bytes-and-overflow)

---

## Quick Revision

- **ASCII:** `'A'=65`, `'a'=97`, `'0'=48`; `UTF-8` = 1–4 bytes, ASCII-compatible.
- **Images:** `RGB` = 3 B/px; `RGBA` = 4 B/px.
- **Magic numbers:** Header bytes (`%PDF`, `89 50 4E 47` for PNG) identify true file type.
- **Encoding ≠ Encryption:** Encoding = public format; Encryption = secret key required.
