---
title: "Networks, Devices, Internet & IPv4"
description: "Deep dive into client/server architecture, URLs, the n(n-1)/2 cable problem, Hub/Switch/Router/Modem, LAN/MAN/WAN, and IPv4 addressing."
order: 1
source: "Revision Notes (Lecture 11)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["network", "hub", "switch", "router", "modem", "LAN", "MAN", "WAN", "IPv4", "URL", "DNS"]
estimatedMinutes: 9
---

## A. What Is It?

A **computer network** is a group of interconnected devices that communicate and share resources (data and hardware) over wired (Ethernet, fibre-optic) or wireless (Wi-Fi, Bluetooth, cellular) links. **The Internet** is a global network of networks connecting LANs, MANs, and WANs worldwide.

## B. Why Does It Exist?

A standalone computer can store and process local data, but modern workflows—pushing code to GitHub, loading Amazon, sending messages—require computers to exchange requests and replies across rooms, cities, and continents.

## C. How Does It Work?

1. **Client & Server:** Your browser (**client**) requests a resource from a remote machine (**server**), which sends back **HTML** (structure), **CSS** (style), **JavaScript** (interaction), and media.
2. **URL Anatomy (`https://github.com/areen2026/github-lab-A1`):**
   - **Protocol (`https://`):** Rules for communication (`HTTPS` encrypts traffic; **DNS**—supplementary note—maps domain names like `github.com` to IP addresses).
   - **Domain (`github.com`):** Human-readable address.
   - **Path (`/areen2026/github-lab-A1`):** Resource location on that server.
3. **The Cable Problem:** Connecting every device directly to every other device requires `n(n-1)/2` cables (`10` devices = `45` cables; `100` devices = `4,950` cables). Central networking devices eliminate this cable explosion.

## D. Practical Example — Home Network to GitHub

![Client, Switch, Router, and Web Server network flow](/diagrams/client-server-network.svg)

1. Your laptop (`192.168.0.2`, private IP) sends data to a **Switch** (or Wi-Fi **Access Point**), which uses **MAC addresses** inside your local LAN.
2. Your **Router** uses **IP addresses** to forward packets through your **Modem** (which connects your home to your ISP) onto the wider Internet.
3. Multiple devices in your home share one **public IP** (e.g. `68.195.213.248`) seen by the outside internet.

## E. Visual Explanation — Networking Devices & Scale

| Device | What It Does | Key Limitation / Rule |
| --- | --- | --- |
| **Hub** | Forwards incoming data to **all** connected devices | Wastes bandwidth, causes collisions, less secure |
| **Switch** | Sends data **only to the intended device** via **MAC** | Local network only; cannot route between different IP networks |
| **Router** | Connects **different networks** using **IP addresses** | More complex/expensive; failure stops inter-network traffic |
| **Access Point** | Provides wireless (**Wi-Fi**) access to a network | Limited range; walls/distance weaken signal; no internet by itself |
| **Modem** | Links your home to your **Internet Service Provider (ISP)** | Pairs with a router to direct home device traffic |

| Scale | Full Name | Example |
| --- | --- | --- |
| **LAN** | Local Area Network | Home, school, office |
| **MAN** | Metropolitan Area Network | Buildings 1, 2, 3 connected across a city |
| **WAN** | Wide Area Network | Pune – Delhi – New York |

## F. Technical Details — IPv4 Addressing

- **IPv4** (e.g. `192.168.1.1`) uses **32 bits** split into **4 octets** of **8 bits (1 byte)** each.
- Each octet ranges from `0` to `255`, giving `2^32` (about **4.3 billion**) total addresses.
- Despite being called "the cloud," the Internet relies on massive physical infrastructure including undersea cables.

## G. Common Misconceptions

> [!WARNING]
> **"Two laptops in different homes cannot both have `192.168.0.2`."**
> False. `192.168.x.x` addresses are **private** local IPs and can be reused across separate networks without conflict because each home has its own public IP.

## H. Exam Perspective

Remember the quick rule: **Switch = MAC, Router = IP**; `n(n-1)/2` cables; `LAN < MAN < WAN`; `IPv4 = 32 bits = 4 octets × 8 bits`.

## I. Related Concepts

- [C09 — Git & GitHub Collaboration](/notes/09-git-github/git-workflow-and-github)
- [C04 — Interfaces (CLI, GUI, API)](/notes/04-interfaces/cli-gui-api)

## J. Quick Revision

- Hub = broadcast to all; Switch = targeted via MAC; Router = between networks via IP; Modem = ISP link.
- `100` devices in direct mesh = `4,950` cables.
- IPv4 = 32 bits, 4 octets (`0–255` each).
