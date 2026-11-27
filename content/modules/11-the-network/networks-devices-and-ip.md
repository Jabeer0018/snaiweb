---
title: "The Network: Topology, Devices, URLs, DNS & Packets"
description: "Zero-to-advanced guide to how computers connect, why mesh wiring fails (n(n-1)/2), Hub vs Switch vs Router, URL anatomy, DNS, IPv4/IPv6, and HTTP packets."
order: 1
source: "HYD - Computer Network - Presentation_compressed.pdf (C11, pp. 1–38)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["network", "hub", "switch", "router", "IP", "DNS", "URL", "packets", "ping"]
estimatedMinutes: 12
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [GitHub & Team Collaboration](/notes/10-github-collaboration/github-remotes-collaboration) and [Interfaces (CLI, GUI, API)](/notes/04-interfaces/cli-gui-api).

In Module C10, you typed `git push origin main` and your code magically appeared on GitHub's servers thousands of kilometers away. In this lesson, you will learn how computers actually find and talk to one another across cables, Wi-Fi, switches, routers, DNS, and IP packets.

---

## 2. Stage 1 & 2: Intuition — Why Direct Wiring Collapses ($n(n-1)/2$)

Suppose 3 laptops in a room want to share files directly with point-to-point cables: you need **3 cables**. With 10 laptops, each connected to the other 9, you need:
$$rac{10 	imes 9}{2} = 45	ext{ cables}$$
With 100 laptops, you would need **4,950 cables**—complete chaos!

Instead of wiring every machine to every other machine, engineers place **central networking devices** in the middle—just like a postal system routes letters through local post offices rather than building a private road between every two houses.

---

## 3. Stage 3 & 4: Networking Devices, URLs, DNS & Packets

![Client-Server Network Flow: Browser, DNS Lookup, IP Packets, and Server Response](/diagrams/client-server-network.svg)

| Device | How It Forwards Data | Intelligence Level |
| --- | --- | --- |
| **Hub** | Broadcasts incoming signal out to **every** port blindly | Dumb physical repeater (wastes bandwidth, zero privacy) |
| **Switch** | Reads **MAC address** and sends data *only* to the exact target port on the **same local network (LAN)** | Smart local traffic cop |
| **Router** | Reads **IP address** and forwards packets **between different networks** (e.g., your home Wi-Fi -> ISP -> GitHub) | Global postal router connecting LAN to the Internet |

### URL Anatomy (`https://github.com/areen2026/github-lab-A1`)
1. **Protocol (`https`):** Rules governing communication (`HTTPS` encrypts HTTP with TLS so Wi-Fi eavesdroppers cannot read your data).
2. **Domain (`github.com`):** Human-readable website name.
3. **Path (`/areen2026/github-lab-A1`):** Exact resource/page on that server.

### DNS & IP Addresses (`IPv4` vs. `IPv6`)
Computers do not route packets using English words like `github.com`—they route using numeric **IP addresses**:
- **IPv4:** 32-bit address written as 4 dot-separated bytes (`0–255`), e.g., `192.168.1.1` (~4.3 billion addresses).
- **IPv6:** 128-bit hexadecimal address solving IPv4 exhaustion (`2001:0db8::1`).
- **DNS (Domain Name System):** The **phonebook of the internet** that translates `github.com` -> `20.207.73.82` before your browser or `git push` opens a connection!

Large files never travel in one giant blob; they are sliced into numbered **packets** (headers + payload), routed across hops, and reassembled at the destination.

---

## 4. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Mesh Cabling Math
How many cables does a 12-computer direct mesh need vs. connecting those 12 computers to one **Switch**?
- Direct mesh: $rac{12 	imes 11}{2} = \mathbf{66	ext{ cables}}$.
- Switch star topology: **`12 cables`** (1 per computer).

### Intermediate Example: What Happens When You Open `amazon.in`
1. Browser parses `https://www.amazon.in`.
2. **DNS** resolves `www.amazon.in` to Amazon's server **IP**.
3. Your laptop sends packets through your **Switch/Wi-Fi -> Router -> Internet** to Amazon's server.
4. Amazon returns **HTML** (structure), **CSS** (visual style), **JavaScript** (interactivity), and images.

### Advanced Example: Troubleshooting DNS vs. IP Reachability (`ping`)
Suppose `ping -c 4 github.com` prints `ping: cannot resolve github.com: Unknown host`, **but** `ping -c 4 8.8.8.8` succeeds with `0.0% packet loss`. What is broken? Physical Wi-Fi and Router connectivity to the internet work fine (`8.8.8.8` replied!), so the failure is strictly **DNS resolution**.

---

## 5. Common Misconceptions & Quick Revision

- **Misconception:** *"A Switch and a Router do the exact same thing."*  
  **Reality:** A **Switch** connects devices inside *one* LAN via MAC addresses; a **Router** connects *different* networks together via IP addresses.
- **Quick Revision:** Mesh = $n(n-1)/2$; Switch = MAC/LAN; Router = IP/WAN; URL = `Protocol + Domain + Path`; DNS = Domain -> IP.
- **Source Reference:** `HYD - Computer Network - Presentation_compressed.pdf` (C11, pp. 1–38).
