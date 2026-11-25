---
title: "Text (ASCII/UTF-8), Images (RGB), Magic Numbers & Encryption"
description: "ASCII vs Unicode/UTF-8, RGB/RGBA image size, file signatures & hex dumps, and Encoding vs Encryption."
order: 3
source: "Number Systems & Data Encoding PDF (pp. 5-8)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["ASCII", "Unicode", "UTF-8", "RGB", "RGBA", "magic number", "hex dump", "encryption"]
estimatedMinutes: 7
---

## Text: ASCII, Unicode & UTF-8

- **ASCII:** 7-bit encoding defining 128 characters (often padded to 1 byte).
  - `'A' = 65`, `'a' = 97`. **Lowercase = Uppercase + 32** (only bit 5 changes).
- **Unicode & UTF-8:** **Unicode** assigns every character in every language a unique **code point** (`'A' = U+0041`, Devanagari NA = `U+0928`, emoji = `U+1F600`). **UTF-8** converts code points into **1 to 4 bytes** for storage/transmission.

## Images: Pixels, RGB & RGBA

- **RGB:** 3 channels (Red, Green, Blue), each `0–255` = **3 bytes per pixel**.
- **RGBA:** Adds a 4th **Alpha** channel for transparency (`0` = transparent, `255` = opaque).
- **Uncompressed RGB size:** `width × height × 3 bytes` (e.g., `1920 × 1080 × 3 = 6,220,800 bytes ≈ 6 MB`).

## File Signatures (Magic Numbers) & Hex Dumps

- **PNG:** `89 50 4E 47 0D 0A 1A 0A` (chunks: `IHDR`, `IDAT`, `IEND`)
- **PDF:** `25 50 44 46` (`%PDF`)
- **JPEG:** `FF D8 FF`
- A **hex dump** shows 3 parts: **Offset**, **Hex bytes**, and **ASCII preview**.

## Encoding vs. Encryption

| Feature | Encoding | Encryption |
| --- | --- | --- |
| **Purpose** | Represents data | Protects data |
| **Rule** | Known, public rule (ASCII, UTF-8, Hex) | Needs a **secret key** |
| **Who can read it** | Anyone who knows the rule | Only someone with the correct key |
