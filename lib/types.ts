export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface TopicMeta {
  slug: string;
  moduleSlug: string;
  moduleTitle: string;
  title: string;
  description: string;
  order: number;
  source?: string;
  addedAt?: string;
  updatedAt?: string;
  keywords?: string[];
  estimatedMinutes?: number;
}

export interface Topic extends TopicMeta {
  content: string;
  headings: TocHeading[];
}

export interface ModuleMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
  source?: string;
  addedAt?: string;
  topics: TopicMeta[];
}

export interface CommandParameter {
  flag: string;
  description: string;
  required?: boolean;
}

export interface CommandEntry {
  slug: string;
  name: string;
  purpose: string;
  syntax: string;
  explanation: string;
  parameters: CommandParameter[];
  example: string;
  expectedOutput?: string;
  outputVerified?: boolean;
  whenToUse: string;
  commonMistakes: string[];
  relatedCommands: string[];
  moduleSlug?: string;
  moduleTitle?: string;
  category: string;
  topicSlug?: string;
  topicTitle?: string;
  source?: string;
  addedAt?: string;
  keywords?: string[];
}

export interface RevisionDifference {
  itemA: string;
  itemB: string;
  points: {
    aspect: string;
    a: string;
    b: string;
  }[];
}

export interface RevisionEntry {
  slug: string;
  title: string;
  moduleSlug?: string;
  moduleTitle?: string;
  type: "definition" | "concept" | "cheatsheet" | "comparison" | "confused-commands" | "syntax" | "summary";
  summary: string;
  content: string;
  source?: string;
  addedAt?: string;
  keywords?: string[];
}

export interface ResourceEntry {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "slides" | "notes" | "cheatsheet" | "link" | "image";
  url: string;
  moduleTitle?: string;
  source?: string;
  addedAt?: string;
  permissionNote?: string;
}

export interface ChangelogEntry {
  id: string;
  date: string;
  action: "added" | "updated";
  itemType: "module" | "topic" | "command" | "revision" | "resource";
  title: string;
  href: string;
  source?: string;
  note?: string;
}

export interface SearchDocument {
  id: string;
  type: "module" | "topic" | "command" | "revision" | "resource";
  title: string;
  subtitle?: string;
  excerpt: string;
  href: string;
  moduleTitle?: string;
  keywords: string[];
}

export interface CourseStats {
  totalModules: number;
  totalTopics: number;
  totalCommands: number;
  totalRevisionItems: number;
  totalResources: number;
}

export interface PlaygroundChallenge {
  id: string;
  title: string;
  category: "CLI Basics" | "Files & Permissions" | "Process & Search" | "Git & GitHub";
  difficulty: "Beginner" | "Intermediate";
  prompt: string;
  hint: string;
  acceptedPatterns: string[];
  solution: string;
  simulatedOutput: string;
  explanation: string;
  source?: string;
}

export interface TheoryMcq {
  id: string;
  number: number;
  module: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface TheoryQuiz {
  id: string;
  number: number;
  title: string;
  description: string;
  modules: string[];
  questions: TheoryMcq[];
}

export type MockQuestionType =
  | "mcq"
  | "numerical"
  | "case-study-mcq"
  | "matching";

export type MockDifficulty = "Foundational" | "Intermediate" | "Advanced";

export interface MockPassage {
  id: string;
  title: string;
  content: string;
  tables?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  }[];
  codeBlock?: string;
}

export interface MockMatchingPair {
  left: string;
  right: string;
}

export interface MockQuestion {
  id: string;
  testId: string;
  number: number;
  type: MockQuestionType;
  primaryConcept: string;
  secondaryConcepts: string[];
  difficulty: MockDifficulty;
  points: 2 | 4 | 6;
  question: string;
  passageId?: string;
  codeBlock?: string;
  options?: [string, string, string, string];
  correctAnswer: string | number;
  acceptedAnswers?: string[];
  answerFormatHint?: string;
  pairs?: MockMatchingPair[];
  hint?: string;
  explanation: string;
  incorrectOptionExplanations?: string[];
  noteRef: {
    title: string;
    href: string;
  };
  sourceRef: string;
}

export interface MockExam {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  difficultyLabel: string;
  totalQuestions: number;
  maxPoints: number;
  recommendedMinutes: number;
  passages: MockPassage[];
  questions: MockQuestion[];
}
