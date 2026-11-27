---
title: "System Logs, CLI Filtering & Log Privacy"
description: "Why operating systems record logs, Clifford Stoll's 75-cent investigation, reading macOS/Linux logs, and PII redaction."
order: 1
source: "worksheet-12a.pdf (Lecture 12, Part 1 of 2, pp. 1–14)"
addedAt: "2026-11-28"
updatedAt: "2026-11-28"
keywords: ["logs", "Clifford Stoll", "log show", "/var/log", "grep", "PII", "privacy"]
estimatedMinutes: 9
---

## Introduction & Intuition: The 75-Cent Clue

In August 1986 at Lawrence Berkeley Laboratory, astronomer **Clifford Stoll** noticed a **75-cent discrepancy** in computer billing logs. A \$1,000 error looks like a broken system; a 75-cent error means the system is working accurately and reporting something subtle you do not understand yet. By inspecting system accounting logs, Stoll uncovered an unauthorized user (**Markus Hess**) using the lab as a bridge into military networks—one of the earliest documented computer espionage investigations in history.

Every modern computer keeps similar continuous logs: every shell command, app crash, lid-close sleep event, 3:00 a.m. background wake, and Wi-Fi association is recorded with timestamps on disk.

---

## Technical Definition & Purpose

> [!IMPORTANT]
> A **system log** is an append-only, timestamped record written by the OS kernel, background daemons, and applications to document events, errors, and state transitions for debugging, auditing, and security forensics.

Logs exist because software runs asynchronously and unattended. Without logs, diagnosing why a laptop drained 15% battery overnight or why a server crashed would be pure guesswork.

---

## Internal Working: Where Logs Live & Slicing Them

Operating systems store logs differently across platforms:

| Platform | Log Location / Interface | How to Inspect a Slice |
| --- | --- | --- |
| **macOS** | Unified binary log database | `log show --last 1h > mylog.txt` |
| **Linux (Ubuntu / WSL)** | Plain-text files in `/var/log/` (`syslog`, `auth.log`, `kern.log`) | `head -n 50 /var/log/syslog` or `grep "wake" /var/log/syslog` |

Because raw logs can contain millions of lines, engineers follow an **8-step investigation pipeline** (Worksheet 12a):

1. **Locate** the log source (`log show` or `/var/log/`).
2. **Capture** a manageable slice (`log show --last 30m > slice.txt`).
3. **Read one line** carefully to identify fields (timestamp, hostname, process/PID, subsystem, message).
4. **Filter** for specific events (`grep -i "wake" slice.txt | wc -l`).
5. **Identify sensitive data (PII)** before sharing!
6. **Count/summarize** patterns with a script (`python3`).
7. **Test edge cases** (break it deliberately to verify assumptions).
8. **Store** clean, redacted outputs in version control.

---

## Worked Example: Log Privacy & PII Redaction

Suppose you capture a slice of your laptop's log to debug a Wi-Fi drop and want to share it with a teammate or commit it to GitHub. Inspecting one line reveals:

```text
2026-11-28 03:14:09.412 MacBook-Jabeer kernel[0]: WiFi joined "HomeNetwork_5G" MAC=a4:83:e7:11:22:33
```

**Why you must never commit raw logs:** System logs contain **Personally Identifiable Information (PII)** and security metadata—your username, machine hostname, Wi-Fi SSIDs, MAC/IP addresses, and file paths. Always **sanitize/redact** identifying fields before sharing or committing logs.

---

## Common Misconceptions

- **Misconception:** *"Big errors are more informative than tiny log anomalies."*  
  **Reality:** Huge crashes are obvious; tiny consistent discrepancies (like Stoll's 75 cents or an unexpected 3 a.m. wake event) often reveal subtle security or concurrency bugs.
- **Misconception:** *"Logs are safe to paste directly into public repos."*  
  **Reality:** Logs routinely leak usernames, hostnames, tokens, IP addresses, and SSIDs.

---

## Examination Perspective

- Know how CLI pipes (`grep`, `wc -l`, `head`, `tail`, `less`) isolate events from large system logs.
- Recognize why **step 5 (checking for identifying PII)** is mandatory before publishing or committing diagnostic logs.

---

## Concept Connections

- **Next Lesson:** [Iterative Releases & Knight Capital Case](/notes/12-system-logs-releases/iterative-releases-and-shipping)
- **Commands:** `log`, `grep`, `less`, `head`, `tail`, `wc`

---

## Quick Revision

- **Clifford Stoll (1986):** Traced a 75-cent log anomaly to espionage.
- **macOS logs:** `log show`; **Linux logs:** `/var/log/`.
- **Always redact PII** (usernames, IPs, MACs, tokens) before sharing logs.
