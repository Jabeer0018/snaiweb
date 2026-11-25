---
title: "Networks, Devices, Internet & IPv4"
description: "Client/server communication, URLs, the cable problem, Hub vs Switch vs Router, LAN/MAN/WAN, and IPv4."
order: 1
source: "Revision Notes (Lecture 11)"
addedAt: "2026-11-26"
updatedAt: "2026-11-26"
keywords: ["network", "hub", "switch", "router", "LAN", "MAN", "WAN", "IPv4", "URL"]
estimatedMinutes: 7
---

## Client, Server & URLs

![Client, Switch, Router, and Web Server network flow](/diagrams/client-server-network.svg)

- **Client** (your browser) sends a **request**; **Server** (e.g., GitHub/Amazon data centre) sends back **HTML** (structure), **CSS** (style), **JavaScript** (interaction), and assets.
- **URL parts** (`https://github.com/areen2026/github-lab-A1`):
  - **Protocol** (`https://`) — rules for communication (`HTTPS` is encrypted; `DNS` maps domain names to IP addresses).
  - **Domain** (`github.com`) — human-readable address.
  - **Path** (`/areen2026/github-lab-A1`) — location of a specific resource.

## The Cable Problem & Networking Devices

Connecting every device directly to every other device requires `n(n-1)/2` cables (`100` devices = `4,950` cables). Instead, devices connect to central networking hardware:

| Device | What It Does | Key Distinction / Limitation |
| --- | --- | --- |
| **Hub** | Forwards data to **all** connected devices | Wastes bandwidth, collisions, less secure |
| **Switch** | Sends data **only to the intended device** using **MAC addresses** | Local network only |
| **Router** | Connects **different networks** using **IP addresses** | More complex/expensive |
| **Access Point** | Lets devices connect wirelessly (**Wi-Fi**) | Limited range; does not provide internet alone |
| **Modem** | Establishes connection between home and **ISP** | Router directs traffic inside/across networks |

## Network Types & The Internet

- **LAN (Local Area Network):** Limited area (home, school, office).
- **MAN (Metropolitan Area Network):** City or large campus connecting multiple LANs.
- **WAN (Wide Area Network):** Broad area across cities/countries (e.g., Pune–Delhi–New York).
- **The Internet:** A global network of interconnected LANs, MANs, and WANs relying on physical infrastructure like undersea cables.

## IPv4 Addresses

- **IPv4** (e.g., `192.168.1.1`) uses **32 bits** in **4 octets** of **8 bits (1 byte)** each (`0–255` per octet, ~4.3 billion addresses).
- **Private IPs** (e.g., `192.168.x.x`) can be reused across separate local networks; multiple devices share a **public IP** when accessing the internet.
