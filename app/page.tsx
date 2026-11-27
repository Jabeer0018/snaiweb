import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Clock,
  FolderOpen,
  Layers,
  Play,
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
import { HeroSystemVisual } from "@/components/HeroSystemVisual";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const stats = getCourseStats();
  const modules = getAllModules();
  const changelog = getChangelog().slice(0, 5);

  const statItems = [
    { label: "Modules", value: stats.totalModules, href: "/notes", icon: Layers },
    { label: "Topics", value: stats.totalTopics, href: "/notes", icon: BookOpen },
    { label: "Commands", value: stats.totalCommands, href: "/commands", icon: Terminal },
    { label: "Mock Tests", value: stats.totalMockTests ?? 0, href: "/mock-tests", icon: ClipboardCheck },
    { label: "Revision", value: stats.totalRevisionItems, href: "/revision", icon: Sparkles },
  ];

  return (
    <div className="space-y-14">
      {/* Editorial Monochromatic Hero */}
      <section className="relative border-b border-border pb-12 pt-2">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <div className="inline-flex items-center gap-2 border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
              <span>SNAI Course V3.0</span>
              <span className="text-subtle">·</span>
              <span>Learn. Understand. Master.</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                SNAI Course.
              </h1>
              <p className="text-lg font-medium leading-snug text-muted sm:text-xl">
                Understand computing.
                <br />
                Master the systems.
                <br />
                Build real knowledge.
              </p>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              A structured university knowledge hub uniting system architecture
              notes, verified terminal &amp; Git references, interactive visual
              simulators, foundational AI research papers, and 10 full-length mock examinations.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/notes"
                className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-xs font-medium text-accent-fg transition-colors hover:bg-accent-hover sm:text-sm"
              >
                <BookOpen className="h-4 w-4" />
                Start Learning
              </Link>
              <Link
                href="/papers"
                className="inline-flex items-center gap-2 border border-border-strong bg-background px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-surface sm:text-sm"
              >
                <Layers className="h-4 w-4" />
                Research Papers
              </Link>
              <Link
                href="/mock-tests"
                className="inline-flex items-center gap-2 border border-border-strong bg-background px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-surface sm:text-sm"
              >
                <ClipboardCheck className="h-4 w-4" />
                Take a Mock Test
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HeroSystemVisual />
          </div>
        </div>
      </section>

      {/* Calculated Course Metrics (Editorial Strip) */}
      <section
        aria-label="Course statistics"
        className="grid grid-cols-2 border border-border bg-surface sm:grid-cols-5"
      >
        {statItems.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`group flex flex-col justify-between p-4 transition-colors hover:bg-elevated ${
                idx > 0 ? "border-t sm:border-l sm:border-t-0 border-border" : ""
              }`}
            >
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{stat.label}</span>
                <Icon className="h-3.5 w-3.5 text-subtle group-hover:text-foreground transition-colors" />
              </div>
              <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </section>

      {/* Platform Pillars */}
      <section className="grid gap-4 border-b border-border pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Command Library",
            desc: "Syntax, flags, before/after state, common errors, and copyable examples.",
            href: "/commands",
            cta: "Explore commands",
            icon: Terminal,
          },
          {
            title: "Interactive Learning",
            desc: "Terminal sandbox, 100 CLI/Git challenges, and 6 interactive concept visualizers.",
            href: "/playground",
            cta: "Open playground",
            icon: Play,
          },
          {
            title: "Mock Examinations",
            desc: "10 full-length 35-question / 124-point tests with Real Exam & Practice modes.",
            href: "/mock-tests",
            cta: "Start a mock test",
            icon: ClipboardCheck,
          },
          {
            title: "Quick Revision",
            desc: "Cheat sheets, comparisons, flashcards, and printable exam summaries.",
            href: "/revision",
            cta: "Revise now",
            icon: Sparkles,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col justify-between border border-border bg-background p-5 transition-colors hover:border-border-strong hover:bg-surface"
            >
              <div>
                <Icon className="h-4 w-4 text-foreground" />
                <h2 className="mt-3 text-sm font-semibold text-foreground">
                  {item.title}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                {item.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </section>

      {/* Continue Learning & Recently Added */}
      <section className="grid gap-6 lg:grid-cols-2">
        <ContinueReading />

        <div className="min-w-0 border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-subtle">
              <Clock className="h-3.5 w-3.5" />
              Recently Added Material
            </div>
            <span className="text-xs text-subtle">Content log</span>
          </div>

          {changelog.length === 0 ? (
            <p className="mt-2 text-sm text-muted">
              No material updates have been logged yet.
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
                      <span className="border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted">
                        {entry.action}
                      </span>
                      <p className="truncate text-sm font-medium text-foreground group-hover:underline">
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

      {/* Explore Modules */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Explore Modules
            </h2>
            <p className="text-xs text-muted">
              Complete syllabus notes organised by module and topic.
            </p>
          </div>
          {modules.length > 0 && (
            <Link
              href="/notes"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              All modules
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {modules.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Awaiting course material"
            description="No course modules have been added yet."
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
