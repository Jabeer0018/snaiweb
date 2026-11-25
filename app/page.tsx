import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  FolderOpen,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react";
import {
  getAllModules,
  getChangelog,
  getCourseStats,
} from "@/lib/content";
import { ModuleCard } from "@/components/ModuleCard";
import { ContinueReading } from "@/components/ContinueReading";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const stats = getCourseStats();
  const modules = getAllModules();
  const changelog = getChangelog().slice(0, 5);

  const statCards = [
    {
      label: "Course Modules",
      value: stats.totalModules,
      icon: Layers,
      href: "/notes",
    },
    {
      label: "Available Topics",
      value: stats.totalTopics,
      icon: BookOpen,
      href: "/notes",
    },
    {
      label: "Command Reference",
      value: stats.totalCommands,
      icon: Terminal,
      href: "/commands",
    },
    {
      label: "Revision Guides",
      value: stats.totalRevisionItems,
      icon: Sparkles,
      href: "/revision",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero / Course Intro */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <div className="bg-grid-subtle pointer-events-none absolute inset-0 opacity-35" />
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-muted px-3 py-1 text-xs font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Student Knowledge Hub</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              SNAI Course
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-accent sm:text-sm">
              Learn. Practise. Understand.
            </p>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            A centralised reference platform for university students. Access
            structured lecture notes, verified command syntax, practical examples,
            revision summaries, and original course materials in one place.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/notes"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-accent-hover sm:text-sm"
            >
              <BookOpen className="h-4 w-4" />
              Browse Course Notes
            </Link>
            <Link
              href="/commands"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-elevated sm:text-sm"
            >
              <Terminal className="h-4 w-4 text-accent" />
              Command Library
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-elevated sm:text-sm"
            >
              <Terminal className="h-4 w-4 text-accent" />
              CLI &amp; Git Playground
            </Link>
            <Link
              href="/revision"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/80 px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-elevated sm:text-sm"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              Quick Revision
            </Link>
          </div>
        </div>
      </section>

      {/* Calculated Statistics */}
      <section aria-label="Course statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 text-subtle group-hover:text-accent transition-colors" />
              </div>
              <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </section>

      {/* Continue Reading & Quick Access */}
      <section className="grid gap-6 lg:grid-cols-2">
        <ContinueReading />

        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-subtle">
              <Clock className="h-3.5 w-3.5" />
              Recently Added Material
            </div>
            <span className="text-xs text-subtle">Content log</span>
          </div>

          {changelog.length === 0 ? (
            <p className="mt-2 text-sm text-muted">
              No material updates have been logged yet. Newly ingested lectures,
              commands, and revision notes will be tracked here automatically.
            </p>
          ) : (
            <div className="mt-3 divide-y divide-border">
              {changelog.map((entry) => (
                <Link
                  key={entry.id}
                  href={entry.href}
                  className="group flex items-center justify-between gap-3 py-2.5 first:pt-1 last:pb-1"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-border bg-elevated px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted">
                        {entry.action}
                      </span>
                      <p className="truncate text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                        {entry.title}
                      </p>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-subtle">
                      {entry.itemType}
                      {entry.source ? ` • ${entry.source}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-subtle">
                    {formatDate(entry.date)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Course Modules */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Course Modules
            </h2>
            <p className="text-xs text-muted">
              Structured notes organised by module and topic.
            </p>
          </div>
          {modules.length > 0 && (
            <Link
              href="/notes"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              All notes
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {modules.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Awaiting course material"
            description="No course modules have been added yet. Supply lecture PDFs, screenshots, or notes to populate modules, topics, commands, and revision guides."
            hint="content/modules/<module-slug>/"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <ModuleCard key={mod.slug} module={mod} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
