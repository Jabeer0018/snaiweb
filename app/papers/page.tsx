import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Layers } from "lucide-react";
import { getAllPapers } from "@/lib/content";

export const metadata = {
  title: "Foundational Research Paper Library",
  description:
    "Chronological study guide to the 10 foundational computer science and AI papers from Turing (1936) to GPT-3 (2020).",
};

export default function PapersPage() {
  const papers = getAllPapers();
  const act1 = papers.filter((p) => p.act.startsWith("Foundations"));
  const act2 = papers.filter((p) => p.act.startsWith("Training"));

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="space-y-4 border-b border-border pb-8">
        <p className="font-mono text-xs uppercase tracking-wider text-subtle">
          Modules C15 &amp; C16 — Research Paper Library
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          The Ten Papers That Made Computing &amp; AI
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted">
          Explore every foundational paper in the SNAI syllabus—from Turing&apos;s
          1936 model of computation and Shannon&apos;s 1948 information theory to
          Backpropagation (1986), PageRank (1998), AlexNet (2012), Transformers
          (2017), and GPT-3 (2020).
        </p>
      </header>

      {/* Visual Timeline Strip */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-subtle">
          <Clock className="h-3.5 w-3.5" />
          Chronological Timeline (1936–2020)
        </div>
        <div className="grid gap-2 sm:grid-cols-5 lg:grid-cols-10">
          {papers.map((paper) => (
            <Link
              key={paper.slug}
              href={`/papers/${paper.slug}`}
              className="group border border-border bg-surface p-3 transition-colors hover:border-foreground hover:bg-elevated"
            >
              <span className="block font-mono text-xs font-semibold text-foreground">
                {paper.year}
              </span>
              <span className="mt-1 block text-[11px] leading-snug text-muted group-hover:text-foreground">
                #{paper.order} {paper.authors.split(",")[0].split(" ").slice(-1)[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Act 1 & Act 2 */}
      {[
        { title: "Act I — Foundations (1936–1978)", subtitle: "Module C15", items: act1 },
        { title: "Act II — From Training to Scale (1986–2020)", subtitle: "Module C16", items: act2 },
      ].map((group) => (
        <section key={group.title} className="space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
              <Layers className="h-4 w-4 text-subtle" />
              {group.title}
            </h2>
            <span className="font-mono text-xs text-subtle">{group.subtitle}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {group.items.map((paper) => (
              <Link
                key={paper.slug}
                href={`/papers/${paper.slug}`}
                className="group flex flex-col justify-between border border-border bg-surface p-6 transition-colors hover:border-border-strong hover:bg-elevated"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 font-mono text-xs text-subtle">
                    <span>
                      PAPER {String(paper.order).padStart(2, "0")} · {paper.year}
                    </span>
                    <BookOpen className="h-3.5 w-3.5 text-muted group-hover:text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold leading-snug text-foreground">
                    {paper.title}
                  </h3>
                  <p className="text-xs font-medium text-subtle">{paper.authors}</p>
                  <p className="text-sm leading-relaxed text-muted">
                    {paper.oneLineTakeaway}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs font-medium text-foreground">
                  <span>Study paper breakdown</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
