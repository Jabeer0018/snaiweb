import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Compass,
  Info,
  Link2,
  ListChecks,
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

export function CommandBlock({
  command,
  syntaxHtml,
  exampleHtml,
  outputHtml,
}: CommandBlockProps) {
  return (
    <article className="space-y-8">
      {/* Header: 1. Command name & 2. Purpose */}
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="rounded border border-border bg-elevated px-2 py-0.5 font-medium text-foreground">
                {command.category}
              </span>
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
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
          <Terminal className="h-4 w-4 text-accent" />
          Syntax
        </h2>
        <CodeBlock
          code={command.syntax}
          highlightedHtml={syntaxHtml}
          title="syntax"
        />
      </section>

      {/* 4. Explanation in simple language */}
      <section className="space-y-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
          <Info className="h-4 w-4 text-accent" />
          Explanation
        </h2>
        <p className="text-[16px] leading-8 text-foreground/90">
          {command.explanation}
        </p>
      </section>

      {/* 5. Parameters and flags */}
      {command.parameters.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
            <ListChecks className="h-4 w-4 text-accent" />
            Parameters &amp; Flags
          </h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-elevated/60 text-xs uppercase tracking-wider text-muted">
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
                        <span className="ml-2 rounded bg-accent-muted px-1.5 py-0.5 text-[10px] font-sans font-medium text-accent">
                          required
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 6. Practical example & 7. Expected output */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Practical Example
        </h2>
        <CodeBlock
          code={command.example}
          highlightedHtml={exampleHtml}
          title="example"
        />

        {command.expectedOutput && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="font-medium text-foreground">Expected Output</span>
              {command.outputVerified ? (
                <span className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified output
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
                  Illustrative output (not verified via execution)
                </span>
              )}
            </div>
            <CodeBlock
              code={command.expectedOutput}
              highlightedHtml={outputHtml}
              title="output"
              language="text"
            />
          </div>
        )}
      </section>

      {/* 8. When to use it */}
      {command.whenToUse && (
        <section className="space-y-2 rounded-lg border border-border bg-surface p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Compass className="h-4 w-4 text-accent" />
            When to Use It
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            {command.whenToUse}
          </p>
        </section>
      )}

      {/* 9. Common mistakes */}
      {command.commonMistakes.length > 0 && (
        <section className="space-y-3 rounded-lg border border-amber-500/25 bg-amber-500/5 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-400">
            <AlertCircle className="h-4 w-4" />
            Common Mistakes
          </h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/90">
            {command.commonMistakes.map((mistake, index) => (
              <li key={index}>{mistake}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 10. Related commands */}
      {command.relatedCommands.length > 0 && (
        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
            <Link2 className="h-4 w-4 text-accent" />
            Related Commands
          </h2>
          <div className="flex flex-wrap gap-2">
            {command.relatedCommands.map((rel) => (
              <Link
                key={rel}
                href={`/commands/${rel}`}
                className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-border-strong hover:bg-elevated"
              >
                {rel}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
