export interface FsNode {
  type: "file" | "dir";
  perm: number; // e.g. 0o755 -> 755 decimal representation like 755, 644, 555, 444, 000
  content?: string;
  children?: Record<string, FsNode>;
  owner?: string;
}

export interface GitCommit {
  id: string;
  message: string;
  branch: string;
  files: string[];
}

export interface GitState {
  initialized: boolean;
  branch: string;
  branches: string[];
  staged: string[];
  commits: GitCommit[];
  remotes: Record<string, string>;
  pushedBranches: string[];
}

export interface SandboxState {
  root: FsNode;
  cwd: string[]; // e.g. ["workspace"]
  git: GitState;
}

export type ChallengeCheck =
  | { type: "fileExists"; path: string; label: string }
  | { type: "dirExists"; path: string; label: string }
  | { type: "notExists"; path: string; label: string }
  | { type: "fileEquals"; path: string; expected: string; label: string }
  | { type: "fileContains"; path: string; expected: string; label: string }
  | { type: "permEquals"; path: string; perm: number; label: string }
  | { type: "gitInitialized"; label: string }
  | { type: "gitBranch"; branch: string; label: string }
  | { type: "gitMinCommits"; count: number; label: string }
  | { type: "gitHasCommit"; messageSubstr: string; label: string }
  | { type: "gitRemote"; name: string; url: string; label: string }
  | { type: "gitPushed"; branch: string; label: string }
  | { type: "stdoutContains"; expected: string; label: string };

export interface PlaygroundProblem {
  id: string;
  number: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  directoryTree: string;
  preExistingNotes: string[];
  actions: string[];
  hint: string;
  solution: string;
  initialFs: Record<string, FsNode>;
  initialCwd?: string[];
  initialGit?: Partial<GitState>;
  checks: ChallengeCheck[];
}

export interface CheckResult {
  label: string;
  passed: boolean;
  detail?: string;
}

export interface ExecutionResult {
  stdout: string[];
  stderr: string[];
  state: SandboxState;
  checks: CheckResult[];
  allPassed: boolean;
}

function permToString(node: FsNode): string {
  const prefix = node.type === "dir" ? "d" : "-";
  const digits = String(node.perm).padStart(3, "0");
  const mapDigit = (d: string) => {
    const n = Number(d);
    return `${n & 4 ? "r" : "-"}${n & 2 ? "w" : "-"}${n & 1 ? "x" : "-"}`;
  };
  return `${prefix}${mapDigit(digits[0])}${mapDigit(digits[1])}${mapDigit(digits[2])}`;
}

function canRead(node: FsNode): boolean {
  const ownerDigit = Math.floor(node.perm / 100);
  return Boolean(ownerDigit & 4);
}

function canWrite(node: FsNode): boolean {
  const ownerDigit = Math.floor(node.perm / 100);
  return Boolean(ownerDigit & 2);
}

function resolveParts(cwd: string[], rawPath: string): string[] {
  const clean = rawPath.replace(/\/+$/, "");
  if (clean === "" || clean === "/") return [];
  const base = clean.startsWith("/") ? [] : [...cwd];
  for (const part of clean.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      if (base.length > 0) base.pop();
    } else {
      base.push(part);
    }
  }
  return base;
}

function getNode(root: FsNode, parts: string[]): FsNode | null {
  let curr: FsNode = root;
  for (const p of parts) {
    if (curr.type !== "dir" || !curr.children || !curr.children[p]) return null;
    curr = curr.children[p];
  }
  return curr;
}

function getParentAndName(
  root: FsNode,
  parts: string[]
): { parent: FsNode | null; name: string } {
  if (parts.length === 0) return { parent: null, name: "" };
  const name = parts[parts.length - 1];
  const parent = getNode(root, parts.slice(0, -1));
  return { parent, name };
}

function expandBraces(arg: string): string[] {
  const m = /^(.*)\{(\d+)\.\.(\d+)\}(.*)$/.exec(arg);
  if (!m) return [arg];
  const [, pre, startStr, endStr, post] = m;
  const start = Number(startStr);
  const end = Number(endStr);
  if (Math.abs(end - start) > 2000) return [arg];
  const out: string[] = [];
  const step = start <= end ? 1 : -1;
  for (let i = start; step > 0 ? i <= end : i >= end; i += step) {
    out.push(`${pre}${i}${post}`);
  }
  return out;
}

function tokenize(line: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (/\s/.test(ch)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export function createInitialState(problem: PlaygroundProblem): SandboxState {
  const root: FsNode = {
    type: "dir",
    perm: 755,
    children: structuredClone(problem.initialFs),
  };
  return {
    root,
    cwd: problem.initialCwd ? [...problem.initialCwd] : [],
    git: {
      initialized: problem.initialGit?.initialized ?? false,
      branch: problem.initialGit?.branch ?? "main",
      branches: problem.initialGit?.branches
        ? [...problem.initialGit.branches]
        : ["main"],
      staged: problem.initialGit?.staged ? [...problem.initialGit.staged] : [],
      commits: problem.initialGit?.commits
        ? structuredClone(problem.initialGit.commits)
        : [],
      remotes: problem.initialGit?.remotes
        ? { ...problem.initialGit.remotes }
        : {},
      pushedBranches: problem.initialGit?.pushedBranches
        ? [...problem.initialGit.pushedBranches]
        : [],
    },
  };
}

export function executeScript(
  problem: PlaygroundProblem,
  script: string
): ExecutionResult {
  const state = createInitialState(problem);
  const stdout: string[] = [];
  const stderr: string[] = [];

  const rawLines = script
    .split(/\r?\n/)
    .flatMap((l) => {
      const trimmed = l.trim();
      if (!trimmed || trimmed.startsWith("#")) return [];
      return trimmed.split(/\s*&&\s*/);
    });

  for (const rawLine of rawLines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    // Handle redirection: cmd > file or cmd >> file
    const redirMatch = /^(.*?)\s*(>>?)\s*(\S+)$/.exec(line);
    let cmdPart = line;
    let redirOp: ">" | ">>" | null = null;
    let redirTarget: string | null = null;

    if (redirMatch && !line.startsWith("git ")) {
      cmdPart = redirMatch[1].trim();
      redirOp = redirMatch[2] as ">" | ">>";
      redirTarget = redirMatch[3].trim();
    }

    const tokens = tokenize(cmdPart);
    if (tokens.length === 0) continue;
    const cmd = tokens[0];
    const args = tokens.slice(1);
    const localOut: string[] = [];

    if (cmd === "pwd") {
      localOut.push("/" + state.cwd.join("/"));
    } else if (cmd === "cd") {
      const target = args[0] || "/";
      if (target === "~") {
        state.cwd = [];
      } else {
        const parts = resolveParts(state.cwd, target);
        const node = getNode(state.root, parts);
        if (!node) {
          stderr.push(`cd: ${target}: No such file or directory`);
        } else if (node.type !== "dir") {
          stderr.push(`cd: ${target}: Not a directory`);
        } else {
          state.cwd = parts;
        }
      }
    } else if (cmd === "ls") {
      const flags = args.filter((a) => a.startsWith("-")).join("");
      const pathArg = args.find((a) => !a.startsWith("-"));
      const parts = pathArg ? resolveParts(state.cwd, pathArg) : state.cwd;
      const node = getNode(state.root, parts);
      if (!node) {
        stderr.push(`ls: ${pathArg}: No such file or directory`);
      } else if (node.type === "file") {
        localOut.push(
          flags.includes("l")
            ? `${permToString(node)}  student  ${parts[parts.length - 1]}`
            : parts[parts.length - 1]
        );
      } else {
        const entries = Object.entries(node.children || {}).filter(
          ([name]) => flags.includes("a") || !name.startsWith(".")
        );
        if (flags.includes("l")) {
          for (const [name, child] of entries) {
            localOut.push(`${permToString(child)}  student  ${name}`);
          }
        } else {
          localOut.push(entries.map(([name]) => name).join("  "));
        }
      }
    } else if (cmd === "mkdir") {
      const recursive = args.includes("-p");
      const targets = args.filter((a) => !a.startsWith("-")).flatMap(expandBraces);
      for (const t of targets) {
        const parts = resolveParts(state.cwd, t);
        if (recursive) {
          let curr = state.root;
          for (const p of parts) {
            curr.children = curr.children || {};
            if (!curr.children[p]) {
              curr.children[p] = { type: "dir", perm: 755, children: {} };
            }
            curr = curr.children[p];
          }
        } else {
          const { parent, name } = getParentAndName(state.root, parts);
          if (!parent || parent.type !== "dir") {
            stderr.push(`mkdir: cannot create directory '${t}': No such file or directory`);
          } else if (!canWrite(parent)) {
            stderr.push(`mkdir: cannot create directory '${t}': Permission denied`);
          } else if (parent.children?.[name]) {
            stderr.push(`mkdir: cannot create directory '${t}': File exists`);
          } else {
            parent.children = parent.children || {};
            parent.children[name] = { type: "dir", perm: 755, children: {} };
          }
        }
      }
    } else if (cmd === "touch") {
      const targets = args.filter((a) => !a.startsWith("-")).flatMap(expandBraces);
      for (const t of targets) {
        const parts = resolveParts(state.cwd, t);
        const { parent, name } = getParentAndName(state.root, parts);
        if (!parent || parent.type !== "dir") {
          stderr.push(`touch: cannot touch '${t}': No such file or directory`);
        } else if (!canWrite(parent)) {
          stderr.push(`touch: cannot touch '${t}': Permission denied`);
        } else {
          parent.children = parent.children || {};
          if (!parent.children[name]) {
            parent.children[name] = { type: "file", perm: 644, content: "" };
          }
        }
      }
    } else if (cmd === "echo") {
      localOut.push(args.join(" "));
    } else if (cmd === "cat") {
      for (const t of args.filter((a) => !a.startsWith("-"))) {
        const parts = resolveParts(state.cwd, t);
        const node = getNode(state.root, parts);
        if (!node) {
          stderr.push(`cat: ${t}: No such file or directory`);
        } else if (node.type === "dir") {
          stderr.push(`cat: ${t}: Is a directory`);
        } else if (!canRead(node)) {
          stderr.push(`cat: ${t}: Permission denied`);
        } else if (node.content) {
          localOut.push(node.content);
        }
      }
    } else if (cmd === "chmod") {
      const modeArg = args[0];
      const targets = args.slice(1);
      for (const t of targets) {
        const parts = resolveParts(state.cwd, t);
        const node = getNode(state.root, parts);
        if (!node) {
          stderr.push(`chmod: ${t}: No such file or directory`);
        } else if (/^[0-7]{3}$/.test(modeArg)) {
          node.perm = Number(modeArg);
        } else if (modeArg === "+x" || modeArg === "u+x" || modeArg === "a+x") {
          const o = Math.floor(node.perm / 100) | 1;
          const g = Math.floor((node.perm % 100) / 10);
          const ot = node.perm % 10;
          node.perm = o * 100 + g * 10 + ot;
        } else if (modeArg === "+w" || modeArg === "u+w") {
          const o = Math.floor(node.perm / 100) | 2;
          const g = Math.floor((node.perm % 100) / 10);
          const ot = node.perm % 10;
          node.perm = o * 100 + g * 10 + ot;
        } else if (modeArg === "-w") {
          const o = Math.floor(node.perm / 100) & ~2;
          const g = Math.floor((node.perm % 100) / 10) & ~2;
          const ot = (node.perm % 10) & ~2;
          node.perm = o * 100 + g * 10 + ot;
        }
      }
    } else if (cmd === "cp") {
      const recursive = args.includes("-r") || args.includes("-R");
      const paths = args.filter((a) => !a.startsWith("-"));
      if (paths.length >= 2) {
        const src = paths[0];
        const dest = paths[1];
        const srcParts = resolveParts(state.cwd, src);
        const srcNode = getNode(state.root, srcParts);
        if (!srcNode) {
          stderr.push(`cp: ${src}: No such file or directory`);
        } else if (srcNode.type === "dir" && !recursive) {
          stderr.push(`cp: -r not specified; omitting directory '${src}'`);
        } else if (!canRead(srcNode)) {
          stderr.push(`cp: cannot open '${src}': Permission denied`);
        } else {
          const destParts = resolveParts(state.cwd, dest);
          const destNode = getNode(state.root, destParts);
          const clone = structuredClone(srcNode) as FsNode;
          if (destNode && destNode.type === "dir") {
            if (!canWrite(destNode)) {
              stderr.push(`cp: cannot create '${dest}': Permission denied`);
            } else {
              destNode.children = destNode.children || {};
              destNode.children[srcParts[srcParts.length - 1]] = clone;
            }
          } else {
            const { parent, name } = getParentAndName(state.root, destParts);
            if (!parent || parent.type !== "dir") {
              stderr.push(`cp: cannot create '${dest}': No such file or directory`);
            } else if (!canWrite(parent)) {
              stderr.push(`cp: cannot create '${dest}': Permission denied`);
            } else {
              parent.children = parent.children || {};
              parent.children[name] = clone;
            }
          }
        }
      }
    } else if (cmd === "mv") {
      const paths = args.filter((a) => !a.startsWith("-"));
      if (paths.length >= 2) {
        const src = paths[0];
        const dest = paths[1];
        const srcParts = resolveParts(state.cwd, src);
        const { parent: srcParent, name: srcName } = getParentAndName(
          state.root,
          srcParts
        );
        const srcNode = getNode(state.root, srcParts);
        if (!srcNode || !srcParent) {
          stderr.push(`mv: cannot stat '${src}': No such file or directory`);
        } else if (srcNode.type === "dir" && !canWrite(srcNode)) {
          stderr.push(`mv: cannot move '${src}': Permission denied (directory is read-only)`);
        } else if (!canWrite(srcParent)) {
          stderr.push(`mv: cannot move '${src}': Permission denied`);
        } else {
          const destParts = resolveParts(state.cwd, dest);
          const destNode = getNode(state.root, destParts);
          if (destNode && destNode.type === "dir") {
            if (!canWrite(destNode)) {
              stderr.push(`mv: cannot move to '${dest}': Permission denied`);
            } else {
              destNode.children = destNode.children || {};
              destNode.children[srcName] = srcNode;
              delete srcParent.children![srcName];
            }
          } else {
            const { parent: destParent, name: destName } = getParentAndName(
              state.root,
              destParts
            );
            if (!destParent || destParent.type !== "dir") {
              stderr.push(`mv: cannot move to '${dest}': No such file or directory`);
            } else if (!canWrite(destParent)) {
              stderr.push(`mv: cannot move to '${dest}': Permission denied`);
            } else {
              destParent.children = destParent.children || {};
              destParent.children[destName] = srcNode;
              delete srcParent.children![srcName];
            }
          }
        }
      }
    } else if (cmd === "rm") {
      const recursive = args.some((a) => a.startsWith("-") && a.includes("r"));
      const targets = args.filter((a) => !a.startsWith("-"));
      for (const t of targets) {
        const parts = resolveParts(state.cwd, t);
        const { parent, name } = getParentAndName(state.root, parts);
        const node = getNode(state.root, parts);
        if (!node || !parent) {
          stderr.push(`rm: cannot remove '${t}': No such file or directory`);
        } else if (node.type === "dir" && !recursive) {
          stderr.push(`rm: cannot remove '${t}': Is a directory`);
        } else if (!canWrite(parent)) {
          stderr.push(`rm: cannot remove '${t}': Permission denied`);
        } else {
          delete parent.children![name];
        }
      }
    } else if (cmd === "grep") {
      const flags = args.filter((a) => a.startsWith("-")).join("");
      const rest = args.filter((a) => !a.startsWith("-"));
      const pattern = rest[0] || "";
      const fileArg = rest[1];
      if (fileArg) {
        const parts = resolveParts(state.cwd, fileArg);
        const node = getNode(state.root, parts);
        if (!node || node.type !== "file") {
          stderr.push(`grep: ${fileArg}: No such file`);
        } else {
          const lines = (node.content || "").split("\n");
          const matched: string[] = [];
          lines.forEach((l, idx) => {
            const hit = flags.includes("i")
              ? l.toLowerCase().includes(pattern.toLowerCase())
              : l.includes(pattern);
            const keep = flags.includes("v") ? !hit : hit;
            if (keep) {
              matched.push(flags.includes("n") ? `${idx + 1}:${l}` : l);
            }
          });
          if (flags.includes("c")) {
            localOut.push(String(matched.length));
          } else if (matched.length > 0) {
            localOut.push(...matched);
          }
        }
      }
    } else if (cmd === "gzip") {
      const flags = args.filter((a) => a.startsWith("-")).join("");
      const fileArg = args.find((a) => !a.startsWith("-"));
      if (fileArg) {
        const parts = resolveParts(state.cwd, fileArg);
        const { parent, name } = getParentAndName(state.root, parts);
        const node = getNode(state.root, parts);
        if (!node || !parent || node.type !== "file") {
          stderr.push(`gzip: ${fileArg}: No such file`);
        } else if (flags.includes("d")) {
          const outName = name.replace(/\.gz$/, "");
          parent.children![outName] = { type: "file", perm: node.perm, content: node.content || "" };
          if (!flags.includes("k")) delete parent.children![name];
        } else {
          parent.children![`${name}.gz`] = { type: "file", perm: node.perm, content: node.content || "" };
          if (!flags.includes("k")) delete parent.children![name];
        }
      }
    } else if (cmd === "git") {
      const sub = args[0];
      if (sub === "init") {
        state.git.initialized = true;
        localOut.push(`Initialized empty Git repository in /${state.cwd.join("/")}/.git/`);
      } else if (sub === "status") {
        if (!state.git.initialized) {
          stderr.push("fatal: not a git repository");
        } else {
          localOut.push(
            `On branch ${state.git.branch}\nStaged: ${state.git.staged.join(", ") || "(none)"}\nCommits: ${state.git.commits.length}`
          );
        }
      } else if (sub === "add") {
        if (!state.git.initialized) {
          stderr.push("fatal: not a git repository");
        } else {
          const target = args[1] || ".";
          if (target === ".") {
            const dir = getNode(state.root, state.cwd);
            const names = Object.keys(dir?.children || {});
            state.git.staged = Array.from(new Set([...state.git.staged, ...names]));
          } else {
            state.git.staged = Array.from(new Set([...state.git.staged, target]));
          }
        }
      } else if (sub === "commit") {
        if (!state.git.initialized) {
          stderr.push("fatal: not a git repository");
        } else {
          const mIdx = args.indexOf("-m");
          const msg = mIdx !== -1 ? args[mIdx + 1] : "";
          if (!msg) {
            stderr.push("error: commit message required with -m");
          } else if (state.git.staged.length === 0) {
            stderr.push("nothing to commit (use 'git add' first)");
          } else {
            const id = Math.random().toString(16).slice(2, 9);
            state.git.commits.unshift({
              id,
              message: msg,
              branch: state.git.branch,
              files: [...state.git.staged],
            });
            state.git.staged = [];
            localOut.push(`[${state.git.branch} ${id}] ${msg}`);
          }
        }
      } else if (sub === "log") {
        if (!state.git.initialized) {
          stderr.push("fatal: not a git repository");
        } else {
          for (const c of state.git.commits) {
            localOut.push(`${c.id} ${c.message}`);
          }
        }
      } else if (sub === "branch") {
        const name = args[1];
        if (!name) {
          localOut.push(state.git.branches.join("\n"));
        } else if (!state.git.branches.includes(name)) {
          state.git.branches.push(name);
        }
      } else if (sub === "checkout" || sub === "switch") {
        const create = args.includes("-b") || args.includes("-c");
        const name = args.find((a) => !a.startsWith("-"));
        if (name) {
          if (create && !state.git.branches.includes(name)) {
            state.git.branches.push(name);
          }
          if (state.git.branches.includes(name)) {
            state.git.branch = name;
            localOut.push(`Switched to branch '${name}'`);
          } else {
            stderr.push(`error: pathspec '${name}' did not match any branch`);
          }
        }
      } else if (sub === "merge") {
        const srcBranch = args[1];
        if (srcBranch && state.git.branches.includes(srcBranch)) {
          const id = Math.random().toString(16).slice(2, 9);
          state.git.commits.unshift({
            id,
            message: `Merge branch '${srcBranch}' into ${state.git.branch}`,
            branch: state.git.branch,
            files: [],
          });
          localOut.push(`Merge made by the 'ort' strategy.`);
        }
      } else if (sub === "remote") {
        if (args[1] === "add" && args[2] && args[3]) {
          state.git.remotes[args[2]] = args[3];
        } else if (args[1] === "-v") {
          for (const [k, v] of Object.entries(state.git.remotes)) {
            localOut.push(`${k}\t${v} (fetch)\n${k}\t${v} (push)`);
          }
        }
      } else if (sub === "push") {
        const branchArg = args.filter((a) => !a.startsWith("-"))[1] || state.git.branch;
        if (Object.keys(state.git.remotes).length === 0) {
          stderr.push("fatal: No configured push destination.");
        } else {
          if (!state.git.pushedBranches.includes(branchArg)) {
            state.git.pushedBranches.push(branchArg);
          }
          localOut.push(`To ${Object.values(state.git.remotes)[0]}\n * [new branch] ${branchArg} -> ${branchArg}`);
        }
      } else if (sub === "clone") {
        const url = args[1] || "";
        const repoName = url.split("/").pop()?.replace(/\.git$/, "") || "repo";
        const dir = getNode(state.root, state.cwd);
        if (dir && dir.type === "dir") {
          dir.children = dir.children || {};
          dir.children[repoName] = { type: "dir", perm: 755, children: {} };
        }
        state.git.initialized = true;
        state.git.remotes["origin"] = url;
        localOut.push(`Cloning into '${repoName}'...`);
      } else if (sub === "pull") {
        localOut.push("Already up to date.");
      }
    } else if (cmd === "which") {
      localOut.push(`/usr/bin/${args[0] || ""}`);
    } else {
      stderr.push(`bash: ${cmd}: command not found`);
    }

    // Handle file redirection
    if (redirOp && redirTarget) {
      const parts = resolveParts(state.cwd, redirTarget);
      const { parent, name } = getParentAndName(state.root, parts);
      const existing = getNode(state.root, parts);
      const text = localOut.join("\n");
      if (!parent || parent.type !== "dir") {
        stderr.push(`bash: ${redirTarget}: No such file or directory`);
      } else if (existing && !canWrite(existing)) {
        stderr.push(`bash: ${redirTarget}: Permission denied`);
      } else if (!existing && !canWrite(parent)) {
        stderr.push(`bash: ${redirTarget}: Permission denied`);
      } else {
        parent.children = parent.children || {};
        if (redirOp === ">>" && existing) {
          existing.content = existing.content ? `${existing.content}\n${text}` : text;
        } else {
          parent.children[name] = {
            type: "file",
            perm: existing?.perm ?? 644,
            content: text,
          };
        }
      }
    } else if (localOut.length > 0) {
      stdout.push(...localOut);
    }
  }

  // Evaluate checks
  const checks: CheckResult[] = problem.checks.map((chk) => {
    switch (chk.type) {
      case "fileExists": {
        const n = getNode(state.root, resolveParts([], chk.path));
        return { label: chk.label, passed: Boolean(n && n.type === "file") };
      }
      case "dirExists": {
        const n = getNode(state.root, resolveParts([], chk.path));
        return { label: chk.label, passed: Boolean(n && n.type === "dir") };
      }
      case "notExists": {
        const n = getNode(state.root, resolveParts([], chk.path));
        return { label: chk.label, passed: n === null };
      }
      case "fileEquals": {
        const n = getNode(state.root, resolveParts([], chk.path));
        return {
          label: chk.label,
          passed: Boolean(n && n.type === "file" && (n.content || "").trim() === chk.expected.trim()),
        };
      }
      case "fileContains": {
        const n = getNode(state.root, resolveParts([], chk.path));
        return {
          label: chk.label,
          passed: Boolean(n && n.type === "file" && (n.content || "").includes(chk.expected)),
        };
      }
      case "permEquals": {
        const n = getNode(state.root, resolveParts([], chk.path));
        return {
          label: chk.label,
          passed: Boolean(n && n.perm === chk.perm),
        };
      }
      case "gitInitialized":
        return { label: chk.label, passed: state.git.initialized };
      case "gitBranch":
        return { label: chk.label, passed: state.git.branch === chk.branch };
      case "gitMinCommits":
        return { label: chk.label, passed: state.git.commits.length >= chk.count };
      case "gitHasCommit":
        return {
          label: chk.label,
          passed: state.git.commits.some((c) =>
            c.message.toLowerCase().includes(chk.messageSubstr.toLowerCase())
          ),
        };
      case "gitRemote":
        return {
          label: chk.label,
          passed: state.git.remotes[chk.name] === chk.url,
        };
      case "gitPushed":
        return {
          label: chk.label,
          passed: state.git.pushedBranches.includes(chk.branch),
        };
      case "stdoutContains":
        return {
          label: chk.label,
          passed: stdout.join("\n").includes(chk.expected),
        };
    }
  });

  const allPassed = checks.length > 0 && checks.every((c) => c.passed);

  // Always give the user helpful output even if commands produced no stdout
  if (stdout.length === 0 && stderr.length === 0 && script.trim().length > 0) {
    stdout.push(`Executed ${rawLines.length} command(s) in sandbox.`);
  }

  return { stdout, stderr, state, checks, allPassed };
}
