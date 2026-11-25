import { getAllRevisionEntries } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { RevisionExplorer } from "@/components/RevisionExplorer";

export const metadata = {
  title: "Quick Revision",
  description:
    "Exam-oriented revision summaries, definitions, cheat sheets, and concept comparisons derived from course material.",
};

export default function RevisionPage() {
  const entries = getAllRevisionEntries().map((entry) => ({
    ...entry,
    renderedContent: <MarkdownRenderer content={entry.content} />,
  }));

  return (
    <div className="space-y-8">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Quick Revision
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Concise definitions, key concepts, command cheat sheets, concept
          comparisons, and topic summaries derived strictly from the supplied
          course materials.
        </p>
      </header>

      <RevisionExplorer entries={entries} />
    </div>
  );
}
