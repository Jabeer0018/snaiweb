---
title: "Encoding Text (ASCII/UTF-8), Images (RGB), Magic Numbers & Encryption"
description: "Zero-to-advanced guide to how computers store letters, emojis, photos, how file signatures identify real file types, and why Encoding is NOT Encryption."
order: 3
source: "HYD- Lecture 8 - Number Systems - Session 2_compressed.pdf (pp. 40–56)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["ASCII", "Unicode", "UTF-8", "RGB", "RGBA", "magic number", "hex dump", "encryption"]
estimatedMinutes: 11
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [Bits, Bytes & Integer Overflow](/notes/08-number-systems-encoding/bits-bytes-and-overflow).

Earlier we learned computers only store bytes (`0–255`). So how does a byte like `65` (`0x41`, `01000001₂`) become the letter `'A'` in a text file, a dark red tint in a photograph, or part of a PDF? In this lesson, you will learn how **encoding standards** give meaning to raw bytes, how **magic numbers** reveal a file's true identity, and why **encoding is never encryption**.

---

## 2. Stage 1 & 2: Text Encoding (`ASCII` -> `Unicode` -> `UTF-8`)

Imagine two friends agreeing on a secret-free codebook: `65` means `'A'`, `66` means `'B'`, `97` means `'a'`, `48` means `'0'`.
- **ASCII (American Standard Code for Information Interchange):** A 7-bit standard defining `128` English characters (`0–127`, stored in 1 byte). Notice a neat binary pattern: `'A' = 65` (`0100 0001₂`) and `'a' = 97` (`0110 0001₂`)—**Lowercase = Uppercase + 32** (only bit 5 flips!).
- **The Problem ASCII Couldn't Solve:** `128` slots cannot hold Hindi (`न`), Arabic, Chinese, accented European letters, or emojis (`😀`).
- **Unicode + UTF-8:** **Unicode** assigns every character in every human script a universal **code point** (`'A' = U+0041`, `'न' = U+0928`, `'😀' = U+1F600`). **UTF-8** is the variable-length byte encoding (**1 to 4 bytes** per character) that stores Unicode efficiently while remaining **100% backward-compatible with ASCII** (every ASCII character still takes just `1 byte`).

---

## 3. Stage 3 & 4: Images (`RGB` / `RGBA`) & Magic Numbers

### Uncompressed Images
A digital photo is a grid of tiny colored squares called **pixels**:
- **RGB (24-bit color):** Each pixel uses **3 bytes** — Red (`0–255`), Green (`0–255`), Blue (`0–255`).
  - `#FF0000` = pure Red; `#000000` = Black; `#FFFFFF` = White.
- **RGBA (32-bit color):** Adds an **Alpha (transparency)** byte -> **4 bytes per pixel**.

$$	ext{Uncompressed Size (bytes)} = 	ext{Width} 	imes 	ext{Height} 	imes 	ext{Bytes per Pixel}$$

### Magic Numbers (File Signatures) & Hex Dumps
If you rename `photo.png` to `photo.txt`, the bytes inside do **not** change! Programs like `file` inspect the first header bytes (**magic numbers**) via a **hex dump**:
- **PNG:** `89 50 4E 47 0D 0A 1A 0A` (`.PNG....`)
- **PDF:** `25 50 44 46` (`%PDF`)
- **ZIP / DOCX:** `50 4B 03 04` (`PK..`)

### Encoding vs. Encryption (Zero Security vs. Confidentiality)

| Concept | Purpose | Secret Key Required? | Who Can Decode? |
| --- | --- | --- | --- |
| **Encoding** (`ASCII`, `UTF-8`, `Base64`, `Hex`) | Public interoperability & format representation | **No** | Anyone following the public standard |
| **Encryption** (`AES`, `TLS/HTTPS`) | Confidentiality & secrecy | **Yes** | Only holders of the secret key |

---

## 4. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Converting `'C'` to `'c'` and Binary
Given `'A' = 65`: `'C'` is 2 letters later (`67`). Adding `32` gives `'c' = 99` (`64 + 32 + 2 + 1 = 0110 0011₂` = `0x63`).

### Intermediate Example: Calculating Full HD Image Size
Compute the uncompressed size of a `1920 × 1080` **RGBA** (4 bytes/pixel) screenshot:
$$1920 	imes 1080 	imes 4 = 8,294,400	ext{ bytes}$$
In SI megabytes: `8.29 MB`. In binary mebibytes ($8,294,400 \div 1,048,576$): **`7.91 MiB`**.

### Advanced Example: Identifying a Disguised File
A suspicious attachment named `notes.txt` starts with hex bytes `25 50 44 46 2D 31 2E 37` in a hex dump. Converting `25 50 44 46` via ASCII (`0x25='%'`, `0x50='P'`, `0x44='D'`, `0x46='F'`) reveals **`%PDF-1.7`**—it is actually a PDF document disguised with a `.txt` extension!

---

## 5. Common Misconceptions & Quick Revision

- **Misconception:** *"Base64 or UTF-8 encrypts passwords safely."*  
  **Reality:** Base64 and UTF-8 are **encodings**—anyone can reverse them in milliseconds with no key.
- **Quick Revision:** `'A'=65`, `'a'=97` (`+32`), `'0'=48`; `UTF-8` = 1–4 bytes; `RGB` = 3 B/px, `RGBA` = 4 B/px; Magic numbers identify real formats; **Encoding ≠ Encryption**.
- **Source Reference:** `HYD- Lecture 8 - Number Systems - Session 2_compressed.pdf` (pp. 40–56).
