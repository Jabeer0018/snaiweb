---
title: "Number Systems & Data Encoding Cheat Sheet"
moduleSlug: "08-number-systems-encoding"
moduleTitle: "C08 — Number Systems & Data Encoding"
type: "cheatsheet"
summary: "Essential formulas, conversions, ASCII values, RGB sizing, magic numbers, and overflow rules."
source: "Number Systems & Data Encoding PDF (p. 8)"
addedAt: "2026-11-26"
keywords: ["cheat sheet", "binary", "hex", "ASCII", "UTF-8", "RGB", "magic numbers"]
---

| Topic | Remember |
| --- | --- |
| **Place values** | `1, 2, 4, 8, 16, 32, 64, 128` |
| **Binary to decimal** | Multiply each bit by its place value and add |
| **Decimal to binary** | Divide by 2, collect remainders, read bottom to top |
| **Bit / Nibble / Byte** | `1 / 4 / 8` bits |
| **n bits** | `2ⁿ` values, unsigned range `0` to `2ⁿ - 1` |
| **8-bit max** | `255`; adding `1` overflows and wraps to `0` |
| **ASCII** | 7 bits, 128 chars; `'A' = 65`, `'a' = 97` (difference `32`) |
| **Unicode / UTF-8** | Unicode = code point; UTF-8 = bytes (`1 to 4` bytes) |
| **RGB / RGBA** | `3` bytes / `4` bytes per pixel; Alpha = transparency |
| **Image size** | `width × height × 3` bytes |
| **Hex** | Base-16; `4` bits = `1` hex digit; `1` byte = `2` hex digits |
| **Magic numbers** | PNG `89 50 4E 47`, PDF `25 50 44 46`, JPEG `FF D8 FF` |
| **Encoding vs Encryption** | Encoding = known rule, no secret. Encryption = needs secret key |
