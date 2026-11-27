import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Lightbulb,
} from "lucide-react";
import { getAllPapers, getPaper } from "@/lib/content";

export function generateStaticParams() {
  return getAllPapers().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getPaper(slug);
  if (!paper) return { title: "Paper Not Found" };
  return {
    title: `${paper.year} — ${paper.title}`,
    description: paper.oneLineTakeaway,
  };
}

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getPaper(slug);
  if (!paper) notFound();

  const all = getAllPapers();
  const idx = all.findIndex((p) => p.slug === paper.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;
  const related = all.filter((p) => paper.connections.includes(p.slug));

  return (
    <article className="mx-auto max-w-4xl space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/papers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Research Paper Library
        </Link>
        <Link
          href={paper.moduleHref}
          className="border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted hover:border-foreground hover:text-foreground"
        >
          Open Course Module Lesson →
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-3 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-subtle">
          <span className="border border-border bg-elevated px-2 py-0.5 text-foreground">
            PAPER {String(paper.order).padStart(2, "0")}
          </span>
          <span>{paper.year}</span>
          <span>·</span>
          <span>{paper.act}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {paper.title}
        </h1>
        <p className="text-sm font-medium text-foreground/90">{paper.authors}</p>
        <p className="text-xs text-subtle">
          {paper.venue} · Source: {paper.sourceFile}
        </p>
        <div className="border-l-2 border-foreground bg-surface p-4 text-sm leading-relaxed text-foreground">
          {paper.oneLineTakeaway}
        </div>
      </header>

      {/* Core Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-2 border border-border bg-surface p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">
            1. Historical Context
          </h2>
          <p className="text-sm leading-relaxed text-foreground/90">
            {paper.historicalContext}
          </p>
        </section>
        <section className="space-y-2 border border-border bg-surface p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">
            2. Problem Solved
          </h2>
          <p className="text-sm leading-relaxed text-foreground/90">
            {paper.problemSolved}
          </p>
        </section>
        <section className="space-y-2 border border-border bg-surface p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">
            3. Why Prior Approaches Failed
          </h2>
          <p className="text-sm leading-relaxed text-foreground/90">
            {paper.whyPriorFailed}
          </p>
        </section>
        <section className="space-y-2 border border-border bg-surface p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">
            4. Main Idea Introduced
          </h2>
          <p className="text-sm leading-relaxed text-foreground/90">
            {paper.mainIdea}
          </p>
        </section>
      </div>

      {/* Methodology & Mathematical Intuition */}
      <section className="space-y-4">
        <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
          Methodology &amp; Mathematical Intuition
        </h2>
        <p className="text-base leading-relaxed text-foreground/90">
          {paper.methodology}
        </p>
        <div className="flex gap-3 border border-border bg-elevated p-5">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Intuition
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              {paper.mathIntuition}
            </p>
          </div>
        </div>
      </section>

      {/* Key Terminology */}
      <section className="space-y-3">
        <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">
          Key Terminology
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {paper.terminology.map((t) => (
            <div key={t.term} className="border border-border bg-surface p-4">
              <p className="font-mono text-xs font-semibold text-foreground">
                {t.term}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {t.definition}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Results, Limitations & Influence */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 border border-border bg-surface p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Key Results
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            {paper.keyResults}
          </p>
        </div>
        <div className="space-y-2 border border-border bg-surface p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Limitations
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            {paper.limitations}
          </p>
        </div>
        <div className="space-y-2 border border-border bg-surface p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Lasting Influence
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            {paper.influence}
          </p>
        </div>
      </section>

      {/* Exam Perspective & Common Misconceptions */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Compass className="h-4 w-4" />
            Examination Concepts
          </h2>
          <ul className="space-y-2 text-sm text-muted">
            {paper.examConcepts.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 border border-amber-500/30 bg-amber-500/5 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-500">
            <AlertTriangle className="h-4 w-4" />
            Common Misconceptions
          </h2>
          {paper.misconceptions.map((m) => (
            <div key={m.myth} className="space-y-1 text-sm">
              <p className="font-medium text-foreground">Myth: {m.myth}</p>
              <p className="text-muted">Reality: {m.reality}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Connected Papers & Quick Revision */}
      <section className="space-y-4 border-t border-border pt-6">
        <div className="border border-border bg-elevated p-5">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            <BookOpen className="h-3.5 w-3.5" />
            Quick Revision Summary
          </h2>
          <p className="mt-2 text-sm font-medium text-foreground">
            {paper.revisionSummary}
          </p>
        </div>

        {related.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Connected Papers
            </p>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/papers/${r.slug}`}
                  className="border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:border-foreground"
                >
                  {r.year} · {r.title} →
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Prev / Next */}
      <nav className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        {prev ? (
          <Link
            href={`/papers/${prev.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {prev.year} · Paper {prev.order}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/papers/${next.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"
          >
            {next.year} · Paper {next.order}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </nav>
    </article>
  );
}
