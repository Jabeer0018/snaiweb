---
title: "The Filesystem, Paths, $PATH & Linux Permissions (chmod)"
description: "Zero-to-advanced guide to the Unix directory tree, absolute vs relative paths, $PATH command lookup, rwx octal permissions, directory traversal (x), and chown."
order: 1
source: "HYD_Lecture-6-The OS and the Filesystem_compressed.pdf (C06, pp. 1–39)"
addedAt: "2026-11-26"
updatedAt: "2026-11-28"
keywords: ["filesystem", "path", "PATH", "chmod", "permissions", "octal", "rwx", "chown"]
estimatedMinutes: 13
---

## 1. What You Will Learn & Prerequisites

**Prerequisites:** [CLI Fundamentals](/notes/03-terminal-cli/cli-fundamentals-and-piping) and [Processes & Virtual Memory](/notes/05-os-process-management/processes-timeslicing-memory).

Why does typing `./hello.sh` fail with `Permission denied` even though you just created the file? Why does `ls` work from any folder without typing `/bin/ls`? And why does removing the `x` bit from a **directory** lock you out even if you have `r` and `w`? This lesson builds your complete mental model of the Unix **Filesystem** and **Permissions**.

---

## 2. Stage 1 & 2: Intuition — The Inverted Tree & Building Security Badges

### The Inverted Directory Tree
Unlike Windows drive letters (`C:\`, `D:\`), macOS and Linux organize every file, folder, and even hardware device into **one single upside-down tree** starting at **root (`/`)**:
- `/bin` and `/usr/bin` hold system commands (`ls`, `cat`, `python3`).
- `/Users/<name>` (macOS) or `/home/<name>` (Linux) is your personal **Home (`~`)** folder.
- `/var/log` holds system logs (covered in Module C12).

### Navigating Addresses: Absolute vs. Relative Paths
- **Absolute Path:** Full GPS coordinates starting at `/` (e.g., `/Users/student/lab06/notes.txt`). Works identically no matter where you currently stand.
- **Relative Path:** Directions starting from your current folder (`pwd`):
  - `.` = current directory
  - `..` = parent directory (one level up)
  - `data/report.txt` = go into `data/` inside current directory.

### How Your Shell Finds Commands (`$PATH`)
When you type `python3`, the shell does **not** search your entire hard drive (that would take minutes!). Instead, it reads an environment variable called **`$PATH`**—a colon-separated list of folders such as `/usr/local/bin:/usr/bin:/bin`—and searches **left to right** for the first executable matching `python3`. Run `which python3` to see which exact folder won!

> [!IMPORTANT]
> Your current folder (`.`) is **not** in `$PATH` by default for security. That is why running a script in your current folder requires `./script.sh` (explicitly telling the shell: *"look right here in `.`"*).

---

## 3. Stage 3 & 4: Permissions (`u/g/o`, `r/w/x` & Octal Math)

On multi-user OSes like Linux and macOS, every file and folder records three **permission groups** (`ls -l` shows 10 characters, e.g., `-rwxr-xr--`):

| Position | Meaning | Value |
| --- | --- | --- |
| Char `1` | File type (`-` = regular file, `d` = directory) | — |
| Chars `2–4` | **User / Owner (`u`)** permissions | `r=4`, `w=2`, `x=1` |
| Chars `5–7` | **Group (`g`)** permissions | `r=4`, `w=2`, `x=1` |
| Chars `8–10` | **Others (`o`)** permissions | `r=4`, `w=2`, `x=1` |

**Binary-to-Octal Rule:** Each 3-bit triplet adds up to a single digit from `0` to `7`:
- `rwx` = `4 + 2 + 1` = **`7`** (`111₂`)
- `r-x` = `4 + 0 + 1` = **`5`** (`101₂`)
- `rw-` = `4 + 2 + 0` = **`6`** (`110₂`)
- `r--` = `4 + 0 + 0` = **`4`** (`100₂`)

### Files vs. Directories: What `r`, `w`, `x` Really Mean (Exam Favorite!)

| Bit | Meaning on a **File** | Meaning on a **Directory** |
| --- | --- | --- |
| **`r` (4)** | Read file contents (`cat`, `head`) | List filenames inside (`ls`) |
| **`w` (2)** | Modify/overwrite contents | **Create, rename, or delete files inside** (even if the file inside is read-only!) |
| **`x` (1)** | Execute file as a program/script | **Enter/traverse** into the directory (`cd dir`, access `dir/file.txt`) |

---

## 4. Worked Examples (Beginner -> Intermediate -> Advanced)

### Basic Example: Running a Script Regardless of Extension
```bash
echo 'echo "Hello from a script"' > hello.txt
./hello.txt          # FAILS: Permission denied (default 644 lacks x)
chmod +x hello.txt   # Adds execute bit -> 755
mv hello.txt run_me.banana
./run_me.banana      # WORKS! OS checks permission bits & content, NOT extension
```

### Intermediate Example: Converting `chmod 750` to Symbolic Form
Break `750` into three digits:
- Owner = `7` = `4+2+1` = `rwx`
- Group = `5` = `4+0+1` = `r-x`
- Others = `0` = `0+0+0` = `---`
Result: `-rwxr-x---`.

### Advanced Example: Locked Directory (`chmod 555` vs `444`)
Suppose directory `evidence/` has mode `555` (`r-xr-xr-x` — no `w` bit) and contains `log.txt` (`644`):
- Can you `cat evidence/log.txt`? **Yes** (you have `x` on `evidence/` and `r` on `log.txt`).
- Can you `mv evidence/log.txt ./` or `rm evidence/log.txt`? **No (`Permission denied`)!** Creating, moving, or deleting entries inside a directory modifies the **directory's contents**, which requires **`w`** permission on `evidence/`! Temporarily run `chmod 755 evidence`, perform the move, and restore `chmod 555`.

---

## 5. Common Misconceptions & Quick Revision

- **Misconception:** *"Renaming `script.sh` to `script.txt` stops it from running."*  
  **Reality:** Linux/macOS check the **`x` permission bit** and file header/shebang, not the filename extension.
- **Misconception:** *"To delete a file, you need write (`w`) permission on the file itself."*  
  **Reality:** Deleting or renaming a file modifies its **parent directory**, so it requires `w` + `x` on the parent directory!
- **Quick Revision:** `r=4, w=2, x=1`; Owner/Group/Others; `755` = `rwxr-xr-x`, `644` = `rw-r--r--`, `600` = `rw-------`.
- **Source Reference:** `HYD_Lecture-6-The OS and the Filesystem_compressed.pdf` (C06, pp. 1–39).
