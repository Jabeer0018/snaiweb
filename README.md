# SNAI Course — Student Knowledge Hub

**Learn. Practise. Understand.**

## Why We Built SNAI Course

University students often struggle with scattered lecture PDFs, screenshots, terminal command sheets, and revision notes spread across multiple chats and drives. **SNAI Course** was built to solve that problem by creating a single, fast, distraction-free, publicly accessible Student Knowledge Hub—requiring no login, no paid subscriptions, and no local software installation.

Students can:
- Read structured, well-formatted **Course Notes** (`C00`–`C16`) with diagrams, callouts, and tables of contents.
- Browse and filter **30+ CLI & Git/GitHub Commands** with syntax highlighting, copy buttons, flags, and common mistakes.
- Practise **100 Easy, Medium, and Hard CLI & Git challenges** inside an interactive in-browser Bash & Git **Playground** with live output and requirement checks.
- Revise quickly before exams using **Quick Revision** cheat sheets and comparisons, search everything via `Cmd+K` / `Ctrl+K`, and save bookmarks locally in their browser.

---

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + `@tailwindcss/typography`
- **Icons:** Lucide React
- **Content:** Structured Markdown (`gray-matter` + `react-markdown` + `remark-gfm` + `rehype-slug`) and JSON
- **Syntax Highlighting:** Shiki (dual light/dark themes)
- **Personalisation:** Browser `localStorage` for bookmarks, reading progress, and theme preference (dark mode default + light mode)

---

## Project Structure

```text
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard
│   ├── notes/              # Module & topic lecture notes
│   ├── commands/           # Command library & individual command references
│   ├── revision/           # Quick revision guides
│   ├── saved/              # Bookmarks & local reading progress
│   └── resources/          # Authorised course documents & links
├── components/             # Reusable UI components
├── content/                # Course material (stored separately from UI)
│   ├── modules/            # Module folders (<module-slug>/_module.json + <topic>.md)
│   ├── commands/           # Command reference JSON files (<command-slug>.json)
│   ├── revision/           # Revision Markdown files (<slug>.md)
│   ├── resources/          # Resource index (index.json)
│   └── changelog.json      # Record of newly added & updated material
├── lib/                    # Content loaders, Shiki highlighter, localStorage helpers
├── public/                 # Static assets & downloadable authorised resources
└── styles/                 # Global styles & theme CSS variables
```

---

## Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run quality checks:**

   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

---

## Adding Course Material

Course content is stored separately in `content/` so new material can be added without modifying application code.

### 1. Modules & Topics (`content/modules/`)

Create a folder per module, e.g. `content/modules/01-networking-basics/`:

- `_module.json`:
  ```json
  {
    "slug": "01-networking-basics",
    "title": "Networking Basics",
    "description": "Introduction to network layers and protocols.",
    "order": 1,
    "source": "Lecture 1 Slides",
    "addedAt": "2026-11-25"
  }
  ```
- `<topic-slug>.md`:
  ```markdown
  ---
  title: "OSI Model Overview"
  description: "Summary of the seven layers of the OSI model."
  order: 1
  source: "Lecture 1 PDF, pp. 3-10"
  addedAt: "2026-11-25"
  updatedAt: "2026-11-25"
  keywords: ["osi", "layers", "networking"]
  estimatedMinutes: 6
  ---

  ## Introduction
  ...
  ```

### 2. Commands (`content/commands/<slug>.json`)

```json
{
  "slug": "ping",
  "name": "ping",
  "purpose": "Test network reachability to a host.",
  "syntax": "ping [options] <destination>",
  "explanation": "Sends ICMP Echo Request packets to a target host and measures round-trip time.",
  "parameters": [
    { "flag": "-c <count>", "description": "Stop after sending count packets." }
  ],
  "example": "ping -c 4 example.com",
  "expectedOutput": "PING example.com ...",
  "outputVerified": false,
  "whenToUse": "When verifying basic IP connectivity.",
  "commonMistakes": ["Forgetting -c on Linux, causing ping to run indefinitely."],
  "relatedCommands": ["traceroute"],
  "moduleSlug": "01-networking-basics",
  "moduleTitle": "Networking Basics",
  "category": "Diagnostics",
  "source": "Lab 1 Sheet",
  "addedAt": "2026-11-25"
}
```

### 3. Quick Revision (`content/revision/<slug>.md`)

Use frontmatter `type` set to one of: `definition`, `concept`, `cheatsheet`, `comparison`, `confused-commands`, `syntax`, or `summary`.

### 4. Resources (`content/resources/index.json`)

Add authorised files to `public/resources/` and list them in `content/resources/index.json`.

---

## Deploying Publicly (GitHub + Vercel)

1. **Create a GitHub repository** and push this project:
   ```bash
   git init
   git add .
   git commit -m "Initial SNAI Course hub"
   git branch -M main
   git remote add origin https://github.com/<your-username>/snai-course.git
   git push -u origin main
   ```
2. **Deploy on Vercel (Free Tier):**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub.
   - Click **Add New → Project** and select your `snai-course` repository.
   - Keep the default Next.js settings (Build Command: `npm run build`, Output Directory: `.next`).
   - Click **Deploy**.
3. Once deployed, Vercel provides a public `https://*.vercel.app` URL that students can access immediately with no account or installation required.
