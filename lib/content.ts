import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  ChangelogEntry,
  CommandEntry,
  CourseStats,
  MockExam,
  ModuleMeta,
  PlaygroundChallenge,
  ResearchPaper,
  ResourceEntry,
  RevisionEntry,
  SearchDocument,
  TheoryMcq,
  TheoryQuiz,
  TocHeading,
  Topic,
  TopicMeta,
} from "./types";
import type { PlaygroundProblem } from "./sandbox-engine";
import { slugify } from "./utils";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MODULES_DIR = path.join(CONTENT_DIR, "modules");
const COMMANDS_DIR = path.join(CONTENT_DIR, "commands");
const REVISION_DIR = path.join(CONTENT_DIR, "revision");
const RESOURCES_FILE = path.join(CONTENT_DIR, "resources", "index.json");
const CHANGELOG_FILE = path.join(CONTENT_DIR, "changelog.json");
const PLAYGROUND_FILE = path.join(CONTENT_DIR, "playground", "challenges.json");
const PLAYGROUND_100_FILE = path.join(CONTENT_DIR, "playground", "challenges-100.json");
const MCQS_FILE = path.join(CONTENT_DIR, "mcqs", "theory-mcqs.json");
const QUIZZES_FILE = path.join(CONTENT_DIR, "mcqs", "theory-quizzes.json");
const MOCK_EXAMS_DIR = path.join(CONTENT_DIR, "quizzes");
const PAPERS_FILE = path.join(CONTENT_DIR, "papers", "papers.json");
const KNOWLEDGE_CHECKS_DIR = path.join(CONTENT_DIR, "knowledge-checks");

function safeReadDir(dirPath: string): fs.Dirent[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath, { withFileTypes: true });
}

function safeReadJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split("\n");
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[`*_~]/g, "").trim();
      headings.push({
        id: slugify(text),
        text,
        level,
      });
    }
  }
  return headings;
}

export function getAllModules(): ModuleMeta[] {
  const dirs = safeReadDir(MODULES_DIR).filter((d) => d.isDirectory());
  const modules: ModuleMeta[] = [];

  for (const dir of dirs) {
    const modulePath = path.join(MODULES_DIR, dir.name);
    const metaPath = fs.existsSync(path.join(modulePath, "_module.json"))
      ? path.join(modulePath, "_module.json")
      : path.join(modulePath, "module.json");

    const rawMeta = safeReadJson<Partial<ModuleMeta>>(metaPath, {});
    const moduleSlug = rawMeta.slug || dir.name;
    const moduleTitle = rawMeta.title || dir.name;

    const topicFiles = safeReadDir(modulePath).filter(
      (f) => f.isFile() && (f.name.endsWith(".md") || f.name.endsWith(".mdx"))
    );

    const topics: TopicMeta[] = topicFiles
      .map((file) => {
        const filePath = path.join(modulePath, file.name);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);
        const topicSlug = file.name.replace(/\.(md|mdx)$/, "");

        return {
          slug: topicSlug,
          moduleSlug,
          moduleTitle,
          title: (data.title as string) || topicSlug,
          description: (data.description as string) || "",
          order: typeof data.order === "number" ? data.order : 999,
          source: data.source as string | undefined,
          addedAt: data.addedAt as string | undefined,
          updatedAt: data.updatedAt as string | undefined,
          keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
          estimatedMinutes:
            typeof data.estimatedMinutes === "number" ? data.estimatedMinutes : undefined,
        };
      })
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

    modules.push({
      slug: moduleSlug,
      title: moduleTitle,
      description: rawMeta.description || "",
      order: typeof rawMeta.order === "number" ? rawMeta.order : 999,
      source: rawMeta.source,
      addedAt: rawMeta.addedAt,
      topics,
    });
  }

  return modules.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getModuleBySlug(moduleSlug: string): ModuleMeta | null {
  const modules = getAllModules();
  return modules.find((m) => m.slug === moduleSlug) || null;
}

export function getTopic(moduleSlug: string, topicSlug: string): Topic | null {
  const modules = getAllModules();
  const mod = modules.find((m) => m.slug === moduleSlug);
  if (!mod) return null;

  const dirs = safeReadDir(MODULES_DIR).filter((d) => d.isDirectory());
  for (const dir of dirs) {
    const modulePath = path.join(MODULES_DIR, dir.name);
    const metaPath = fs.existsSync(path.join(modulePath, "_module.json"))
      ? path.join(modulePath, "_module.json")
      : path.join(modulePath, "module.json");
    const rawMeta = safeReadJson<Partial<ModuleMeta>>(metaPath, {});
    const resolvedSlug = rawMeta.slug || dir.name;

    if (resolvedSlug !== moduleSlug) continue;

    for (const ext of [".md", ".mdx"]) {
      const filePath = path.join(modulePath, `${topicSlug}${ext}`);
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);
        return {
          slug: topicSlug,
          moduleSlug,
          moduleTitle: mod.title,
          title: (data.title as string) || topicSlug,
          description: (data.description as string) || "",
          order: typeof data.order === "number" ? data.order : 999,
          source: data.source as string | undefined,
          addedAt: data.addedAt as string | undefined,
          updatedAt: data.updatedAt as string | undefined,
          keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
          estimatedMinutes:
            typeof data.estimatedMinutes === "number" ? data.estimatedMinutes : undefined,
          content,
          headings: extractHeadings(content),
        };
      }
    }
  }

  return null;
}

export function getAdjacentTopics(
  moduleSlug: string,
  topicSlug: string
): { prev: TopicMeta | null; next: TopicMeta | null } {
  const modules = getAllModules();
  const flatTopics = modules.flatMap((m) => m.topics);
  const idx = flatTopics.findIndex(
    (t) => t.moduleSlug === moduleSlug && t.slug === topicSlug
  );
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? flatTopics[idx - 1] : null,
    next: idx < flatTopics.length - 1 ? flatTopics[idx + 1] : null,
  };
}

export function getAllCommands(): CommandEntry[] {
  const files = safeReadDir(COMMANDS_DIR).filter(
    (f) => f.isFile() && f.name.endsWith(".json")
  );

  const commands: CommandEntry[] = [];
  for (const file of files) {
    const filePath = path.join(COMMANDS_DIR, file.name);
    const data = safeReadJson<Partial<CommandEntry>>(filePath, {});
    if (!data.name) continue;
    commands.push({
      slug: data.slug || file.name.replace(/\.json$/, ""),
      name: data.name,
      purpose: data.purpose || "",
      syntax: data.syntax || "",
      explanation: data.explanation || "",
      parameters: Array.isArray(data.parameters) ? data.parameters : [],
      example: data.example || "",
      expectedOutput: data.expectedOutput,
      outputVerified: Boolean(data.outputVerified),
      explanationOfOutput: data.explanationOfOutput,
      beforeAfterState: data.beforeAfterState,
      whenToUse: data.whenToUse || "",
      commonMistakes: Array.isArray(data.commonMistakes) ? data.commonMistakes : [],
      commonErrors: Array.isArray(data.commonErrors) ? data.commonErrors : [],
      relatedCommands: Array.isArray(data.relatedCommands) ? data.relatedCommands : [],
      platformCompatibility: data.platformCompatibility,
      relevantConcepts: Array.isArray(data.relevantConcepts) ? data.relevantConcepts : [],
      isSupplementary: Boolean(data.isSupplementary),
      moduleSlug: data.moduleSlug,
      moduleTitle: data.moduleTitle,
      category: data.category || "General",
      topicSlug: data.topicSlug,
      topicTitle: data.topicTitle,
      source: data.source,
      addedAt: data.addedAt,
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
    });
  }

  return commands.sort((a, b) => a.name.localeCompare(b.name));
}

export function getCommandBySlug(slug: string): CommandEntry | null {
  const commands = getAllCommands();
  return commands.find((c) => c.slug === slug) || null;
}

export function getAllRevisionEntries(): RevisionEntry[] {
  const files = safeReadDir(REVISION_DIR).filter(
    (f) => f.isFile() && (f.name.endsWith(".md") || f.name.endsWith(".mdx"))
  );

  const entries: RevisionEntry[] = [];
  for (const file of files) {
    const filePath = path.join(REVISION_DIR, file.name);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const slug = file.name.replace(/\.(md|mdx)$/, "");

    entries.push({
      slug,
      title: (data.title as string) || slug,
      moduleSlug: data.moduleSlug as string | undefined,
      moduleTitle: data.moduleTitle as string | undefined,
      type: (data.type as RevisionEntry["type"]) || "summary",
      summary: (data.summary as string) || "",
      content,
      source: data.source as string | undefined,
      addedAt: data.addedAt as string | undefined,
      keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
    });
  }

  return entries.sort((a, b) => a.title.localeCompare(b.title));
}

export function getAllResources(): ResourceEntry[] {
  const data = safeReadJson<ResourceEntry[]>(RESOURCES_FILE, []);
  return Array.isArray(data) ? data : [];
}

export function getChangelog(): ChangelogEntry[] {
  const data = safeReadJson<ChangelogEntry[]>(CHANGELOG_FILE, []);
  if (!Array.isArray(data)) return [];
  return [...data].sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllChallenges(): PlaygroundChallenge[] {
  const data = safeReadJson<PlaygroundChallenge[]>(PLAYGROUND_FILE, []);
  return Array.isArray(data) ? data : [];
}

export function getAllPlaygroundProblems(): PlaygroundProblem[] {
  const data = safeReadJson<PlaygroundProblem[]>(PLAYGROUND_100_FILE, []);
  return Array.isArray(data) ? data : [];
}

export function getAllTheoryMcqs(): TheoryMcq[] {
  const data = safeReadJson<TheoryMcq[]>(MCQS_FILE, []);
  return Array.isArray(data) ? data : [];
}

export function getAllTheoryQuizzes(): TheoryQuiz[] {
  const data = safeReadJson<TheoryQuiz[]>(QUIZZES_FILE, []);
  return Array.isArray(data) ? data : [];
}

export function getAllMockExams(): MockExam[] {
  const files = safeReadDir(MOCK_EXAMS_DIR)
    .filter((f) => f.isFile() && f.name.endsWith(".json"))
    .sort((a, b) => a.name.localeCompare(b.name));

  const exams: MockExam[] = [];
  for (const file of files) {
    const data = safeReadJson<MockExam | null>(
      path.join(MOCK_EXAMS_DIR, file.name),
      null
    );
    if (data && data.id) exams.push(data);
  }
  return exams.sort((a, b) => a.number - b.number);
}

export function getMockExamById(id: string): MockExam | null {
  return getAllMockExams().find((e) => e.id === id) || null;
}

export function getAllPapers(): ResearchPaper[] {
  const data = safeReadJson<ResearchPaper[]>(PAPERS_FILE, []);
  return Array.isArray(data)
    ? [...data].sort((a, b) => a.order - b.order)
    : [];
}

export function getPaper(slug: string): ResearchPaper | null {
  return getAllPapers().find((p) => p.slug === slug) || null;
}

export function getModuleKnowledgeChecks(moduleSlug: string) {
  const filePath = path.join(KNOWLEDGE_CHECKS_DIR, `${moduleSlug}.json`);
  const data = safeReadJson<
    {
      id: string;
      level: "Beginner" | "Intermediate" | "Advanced";
      question: string;
      options: [string, string, string, string];
      correctIndex: 0 | 1 | 2 | 3;
      explanation: string;
      optionFeedback?: [string, string, string, string];
    }[]
  >(filePath, []);
  return Array.isArray(data) ? data : [];
}

export function getCourseStats(): CourseStats {
  const modules = getAllModules();
  const totalTopics = modules.reduce((acc, m) => acc + m.topics.length, 0);
  const commands = getAllCommands();
  const revision = getAllRevisionEntries();
  const resources = getAllResources();
  const mockTests = getAllMockExams();

  return {
    totalModules: modules.length,
    totalTopics,
    totalCommands: commands.length,
    totalRevisionItems: revision.length,
    totalResources: resources.length,
    totalMockTests: mockTests.length,
  };
}

export function getSearchIndex(): SearchDocument[] {
  const docs: SearchDocument[] = [];
  const modules = getAllModules();

  for (const mod of modules) {
    docs.push({
      id: `module:${mod.slug}`,
      type: "module",
      title: mod.title,
      subtitle: `${mod.topics.length} topic${mod.topics.length === 1 ? "" : "s"}`,
      excerpt: mod.description,
      href: `/notes/${mod.slug}`,
      keywords: [mod.title, mod.description],
    });

    for (const topic of mod.topics) {
      docs.push({
        id: `topic:${mod.slug}/${topic.slug}`,
        type: "topic",
        title: topic.title,
        subtitle: mod.title,
        excerpt: topic.description,
        href: `/notes/${mod.slug}/${topic.slug}`,
        moduleTitle: mod.title,
        keywords: [topic.title, topic.description, mod.title, ...(topic.keywords || [])],
      });
    }
  }

  for (const cmd of getAllCommands()) {
    docs.push({
      id: `command:${cmd.slug}`,
      type: "command",
      title: cmd.name,
      subtitle: cmd.category,
      excerpt: `${cmd.purpose} ${cmd.explanation}`.trim(),
      href: `/commands/${cmd.slug}`,
      moduleTitle: cmd.moduleTitle,
      keywords: [
        cmd.name,
        cmd.purpose,
        cmd.syntax,
        cmd.category,
        cmd.example,
        cmd.whenToUse,
        ...cmd.parameters.map((p) => `${p.flag} ${p.description}`),
        ...(cmd.keywords || []),
      ],
    });
  }

  for (const rev of getAllRevisionEntries()) {
    docs.push({
      id: `revision:${rev.slug}`,
      type: "revision",
      title: rev.title,
      subtitle: rev.type,
      excerpt: rev.summary,
      href: `/revision#${rev.slug}`,
      moduleTitle: rev.moduleTitle,
      keywords: [rev.title, rev.summary, rev.type, ...(rev.keywords || [])],
    });
  }

  for (const res of getAllResources()) {
    docs.push({
      id: `resource:${res.id}`,
      type: "resource",
      title: res.title,
      subtitle: res.type.toUpperCase(),
      excerpt: res.description,
      href: `/resources`,
      moduleTitle: res.moduleTitle,
      keywords: [res.title, res.description, res.type],
    });
  }

  for (const paper of getAllPapers()) {
    docs.push({
      id: `paper:${paper.slug}`,
      type: "paper",
      title: `${paper.year} — ${paper.title}`,
      subtitle: paper.authors,
      excerpt: paper.oneLineTakeaway,
      href: `/papers/${paper.slug}`,
      moduleTitle: paper.act,
      keywords: [
        paper.title,
        paper.authors,
        String(paper.year),
        paper.mainIdea,
        ...paper.terminology.map((t) => t.term),
        ...paper.examConcepts,
      ],
    });
  }

  return docs;
}
