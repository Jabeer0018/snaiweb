import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Clock, FileText } from "lucide-react";
import {
  getAllCommands,
  getAllModules,
  getModuleBySlug,
  getModuleKnowledgeChecks,
} from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { LessonInteractiveLab } from "@/components/LessonInteractiveLab";
import { LessonKnowledgeChecks } from "@/components/LessonKnowledgeChecks";

export function generateStaticParams() {
  return getAllModules().map((m) => ({ moduleSlug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;
  const mod = getModuleBySlug(moduleSlug);
  if (!mod) return { title: "Module Not Found" };
  return {
    title: mod.title,
    description: mod.description || `Lecture notes for ${mod.title}`,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;
  const mod = getModuleBySlug(moduleSlug);
  if (!mod) notFound();

  const moduleCommands = getAllCommands().filter(
    (c) => c.moduleSlug === mod.slug
  );
  const moduleChecks = getModuleKnowledgeChecks(mod.slug);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-subtle" />
        <Link href="/notes" className="hover:text-foreground transition-colors">
          Course Notes
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-subtle" />
        <span className="font-medium text-foreground">{mod.title}</span>
      </nav>

      {/* Header */}
      <header className="space-y-2 border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">
          Module {String(mod.order).padStart(2, "0")}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {mod.title}
        </h1>
        {mod.description && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            {mod.description}
          </p>
        )}
        {mod.source && (
          <p className="text-xs text-subtle">Source: {mod.source}</p>
        )}
      </header>

      {/* Topics */}
      {mod.topics.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No topics in this module yet"
          description="Topics and lecture notes for this module will appear here once added."
        />
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-surface">
          {mod.topics.map((topic, index) => (
            <Link
              key={topic.slug}
              href={`/notes/${mod.slug}/${topic.slug}`}
              className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-elevated/60 sm:p-5"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-subtle">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="truncate text-sm font-semibold text-foreground group-hover:text-accent transition-colors sm:text-base">
                    {topic.title}
                  </h2>
                </div>
                {topic.description && (
                  <p className="line-clamp-2 pl-7 text-xs leading-relaxed text-muted sm:text-sm">
                    {topic.description}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3 text-xs text-subtle">
                {topic.estimatedMinutes && (
                  <span className="hidden items-center gap-1 sm:inline-flex">
                    <Clock className="h-3.5 w-3.5" />
                    {topic.estimatedMinutes} min
                  </span>
                )}
                <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {moduleCommands.length > 0 && (
        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
            Commands Covered in This Module ({moduleCommands.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {moduleCommands.map((cmd) => (
              <Link
                key={cmd.slug}
                href={`/commands/${cmd.slug}`}
                className="border border-border bg-surface px-3 py-1.5 font-mono text-xs text-foreground hover:border-foreground"
              >
                {cmd.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <LessonInteractiveLab moduleSlug={mod.slug} />

      <LessonKnowledgeChecks
        questions={moduleChecks}
        title="Module Assessment (Beginner → Advanced)"
      />
    </div>
  );
}
