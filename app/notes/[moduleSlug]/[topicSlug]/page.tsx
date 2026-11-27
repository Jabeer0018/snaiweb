import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, Clock } from "lucide-react";
import {
  getAdjacentTopics,
  getAllModules,
  getModuleKnowledgeChecks,
  getTopic,
} from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { TableOfContents } from "@/components/TableOfContents";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ReadingProgress } from "@/components/ReadingProgress";
import { LessonInteractiveLab } from "@/components/LessonInteractiveLab";
import { LessonKnowledgeChecks } from "@/components/LessonKnowledgeChecks";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  const modules = getAllModules();
  return modules.flatMap((m) =>
    m.topics.map((t) => ({
      moduleSlug: m.slug,
      topicSlug: t.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string; topicSlug: string }>;
}) {
  const { moduleSlug, topicSlug } = await params;
  const topic = getTopic(moduleSlug, topicSlug);
  if (!topic) return { title: "Topic Not Found" };
  return {
    title: `${topic.title} — ${topic.moduleTitle}`,
    description: topic.description,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; topicSlug: string }>;
}) {
  const { moduleSlug, topicSlug } = await params;
  const topic = getTopic(moduleSlug, topicSlug);
  if (!topic) notFound();

  const { prev, next } = getAdjacentTopics(moduleSlug, topicSlug);
  const knowledgeChecks = getModuleKnowledgeChecks(moduleSlug);
  const topicHref = `/notes/${moduleSlug}/${topicSlug}`;

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1 space-y-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-muted"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-subtle" />
          <Link href="/notes" className="hover:text-foreground transition-colors">
            Course Notes
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-subtle" />
          <Link
            href={`/notes/${moduleSlug}`}
            className="hover:text-foreground transition-colors"
          >
            {topic.moduleTitle}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-subtle" />
          <span className="font-medium text-foreground">{topic.title}</span>
        </nav>

        {/* Header */}
        <header className="space-y-4 border-b border-border pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2.5">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {topic.title}
              </h1>
              {topic.description && (
                <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                  {topic.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ReadingProgress
                id={`${moduleSlug}/${topicSlug}`}
                title={topic.title}
                moduleTitle={topic.moduleTitle}
                href={topicHref}
              />
              <BookmarkButton
                id={`topic:${moduleSlug}/${topicSlug}`}
                type="topic"
                title={topic.title}
                subtitle={topic.moduleTitle}
                href={topicHref}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-subtle">
            {topic.estimatedMinutes && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {topic.estimatedMinutes} min read
              </span>
            )}
            {topic.source && <span>Source: {topic.source}</span>}
            {topic.updatedAt && (
              <span>Updated {formatDate(topic.updatedAt)}</span>
            )}
          </div>
        </header>

        {/* Content */}
        <MarkdownRenderer content={topic.content} />

        {/* In-Lesson Interactive Experiment */}
        <LessonInteractiveLab moduleSlug={moduleSlug} />

        {/* Progressive Knowledge Checks (Beginner / Intermediate / Advanced) */}
        <LessonKnowledgeChecks questions={knowledgeChecks} />

        {/* Prev / Next Navigation */}
        <nav
          aria-label="Topic pagination"
          className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={`/notes/${prev.moduleSlug}/${prev.slug}`}
              className="group flex flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-elevated/50"
            >
              <span className="inline-flex items-center gap-1 text-xs text-subtle">
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous
              </span>
              <span className="mt-1 text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/notes/${next.moduleSlug}/${next.slug}`}
              className="group flex flex-col items-end rounded-lg border border-border bg-surface p-4 text-right transition-colors hover:border-border-strong hover:bg-elevated/50"
            >
              <span className="inline-flex items-center gap-1 text-xs text-subtle">
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="mt-1 text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </article>

      <TableOfContents headings={topic.headings} />
    </div>
  );
}
