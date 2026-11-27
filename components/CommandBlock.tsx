import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Compass,
  Info,
  Link2,
  ListChecks,
  Monitor,
  Terminal,
} from "lucide-react";
import { CommandEntry } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";
import { BookmarkButton } from "./BookmarkButton";

interface CommandBlockProps {
  command: CommandEntry;
  syntaxHtml?: string;
  exampleHtml?: string;
  outputHtml?: string;
}

function InlineCodeText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, idx) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code
            key={idx}
            className="border border-border bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        )
      )}
    </>
  );
}

export function CommandBlock({
  command,
  syntaxHtml,
  exampleHtml,
  outputHtml,
}: CommandBlockProps) {
  return (
    <article className="space-y-8">
      {/* Header: 1. Command name, 2. Purpose, 17. Source */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="border border-border bg-elevated px-2 py-0.5 font-medium text-foreground">
                {command.category}
              </span>
              {command.isSupplementary ? (
                <span className="border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] text-amber-500">
                  Supplementary Command
                </span>
              ) : (
                <span className="border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-subtle">
                  Core Syllabus
                </span>
              )}
              {command.moduleTitle && (
                <>
                  <span>/</span>
                  <span>{command.moduleTitle}</span>
                </>
              )}
              {command.source && (
                <>
                  <span>•</span>
                  <span className="text-subtle">Source: {command.source}</span>
                </>
              )}
            </div>
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {command.name}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              {command.purpose}
            </p>
          </div>

          <BookmarkButton
            id={`command:${command.slug}`}
            type="command"
            title={command.name}
            subtitle={command.purpose}
            href={`/commands/${command.slug}`}
          />
        </div>
      </header>

      {/* 3. Syntax */}
      <section className="space-y-2">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
          <Terminal className="h-3.5 w-3.5 text-foreground" />
          Syntax
        </h2>
        <CodeBlock
          code={command.syntax}
          highlightedHtml={syntaxHtml}
          title="syntax"
        />
      </section>

      {/* 4. Detailed Explanation */}
      <section className="space-y-2">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
          <Info className="h-3.5 w-3.5 text-foreground" />
          Detailed Explanation
        </h2>
        <p className="text-[16px] leading-8 text-foreground/90">
          <InlineCodeText text={command.explanation} />
        </p>
      </section>

      {/* 5. When to use it & 15. Platform compatibility */}
      <section className="grid gap-4 sm:grid-cols-2">
        {command.whenToUse && (
          <div className="space-y-2 border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Compass className="h-4 w-4" />
              When to Use It
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              <InlineCodeText text={command.whenToUse} />
            </p>
          </div>
        )}
        <div className="space-y-2 border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Monitor className="h-4 w-4" />
            Platform Compatibility
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            <InlineCodeText
              text={
                command.platformCompatibility ||
                "macOS (zsh/bash) and GNU/Linux terminals."
              }
            />
          </p>
        </div>
      </section>

      {/* 6 & 7. Arguments, Parameters & Important Flags */}
      {command.parameters.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            <ListChecks className="h-3.5 w-3.5 text-foreground" />
            Arguments, Parameters &amp; Flags
          </h2>
          <div className="overflow-hidden border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-elevated text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Flag / Parameter</th>
                  <th className="px-4 py-2.5 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {command.parameters.map((param) => (
                  <tr key={param.flag}>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">
                      {param.flag}
                      {param.required && (
                        <span className="ml-2 border border-border bg-background px-1.5 py-0.5 font-sans text-[10px] font-medium text-foreground">
                          required
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      <InlineCodeText text={param.description} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 8, 9, 10. Practical Examples, Expected Output & Explanation of Output */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">
          Practical Example
        </h2>
        <CodeBlock
          code={command.example}
          highlightedHtml={exampleHtml}
          title="example"
        />

        {command.expectedOutput && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="font-medium text-foreground">Expected Output</span>
              {command.outputVerified ? (
                <span className="inline-flex items-center gap-1 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified output
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-500">
                  Simulated / illustrative output
                </span>
              )}
            </div>
            <CodeBlock
              code={command.expectedOutput}
              highlightedHtml={outputHtml}
              title="output"
              language="text"
            />
            {command.explanationOfOutput && (
              <p className="border-l-2 border-border-strong pl-3.5 text-sm leading-relaxed text-muted">
                <strong className="text-foreground">Output explained: </strong>
                <InlineCodeText text={command.explanationOfOutput} />
              </p>
            )}
          </div>
        )}
      </section>

      {/* 11. Before-and-After System State */}
      {command.beforeAfterState && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Before &amp; After System State
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-border bg-surface p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">
                Before Execution
              </p>
              <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted">
                <InlineCodeText text={command.beforeAfterState.before} />
              </p>
            </div>
            <div className="border border-border bg-surface p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-foreground">
                After Execution
              </p>
              <p className="mt-1.5 font-mono text-xs leading-relaxed text-foreground">
                <InlineCodeText text={command.beforeAfterState.after} />
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 12 & 13. Common Errors & Misconceptions */}
      {(command.commonMistakes.length > 0 ||
        (command.commonErrors && command.commonErrors.length > 0)) && (
        <section className="grid gap-4 sm:grid-cols-2">
          {command.commonErrors && command.commonErrors.length > 0 && (
            <div className="space-y-2.5 border border-rose-500/30 bg-rose-500/5 p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-rose-500">
                <AlertCircle className="h-4 w-4" />
                Common Errors
              </h2>
              <ul className="list-disc space-y-1.5 pl-5 font-mono text-xs leading-relaxed text-foreground/90">
                {command.commonErrors.map((err, index) => (
                  <li key={index}>
                    <InlineCodeText text={err} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {command.commonMistakes.length > 0 && (
            <div className="space-y-2.5 border border-amber-500/30 bg-amber-500/5 p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-500">
                <AlertCircle className="h-4 w-4" />
                Common Misconceptions
              </h2>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90">
                {command.commonMistakes.map((mistake, index) => (
                  <li key={index}>
                    <InlineCodeText text={mistake} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 14 & 16. Related Commands & Relevant Course Concepts */}
      <section className="grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
        {command.relatedCommands.length > 0 && (
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
              <Link2 className="h-3.5 w-3.5 text-foreground" />
              Related Commands
            </h2>
            <div className="flex flex-wrap gap-2">
              {command.relatedCommands.map((rel) => (
                <Link
                  key={rel}
                  href={`/commands/${rel}`}
                  className="border border-border bg-surface px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-border-strong hover:bg-elevated"
                >
                  {rel}
                </Link>
              ))}
            </div>
          </div>
        )}

        {command.relevantConcepts && command.relevantConcepts.length > 0 && (
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
              <BookOpen className="h-3.5 w-3.5 text-foreground" />
              Relevant Course Concepts
            </h2>
            <div className="flex flex-wrap gap-2">
              {command.relevantConcepts.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="border border-border bg-surface px-3 py-1.5 text-xs text-foreground transition-colors hover:border-border-strong hover:bg-elevated"
                >
                  {c.title} →
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
