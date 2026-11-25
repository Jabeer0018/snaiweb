import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getAllCommands, getCommandBySlug } from "@/lib/content";
import { highlightCode } from "@/lib/highlight";
import { CommandBlock } from "@/components/CommandBlock";

export function generateStaticParams() {
  return getAllCommands().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmd = getCommandBySlug(slug);
  if (!cmd) return { title: "Command Not Found" };
  return {
    title: `${cmd.name} — Command Reference`,
    description: cmd.purpose,
  };
}

export default async function CommandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const command = getCommandBySlug(slug);
  if (!command) notFound();

  const [syntaxHtml, exampleHtml, outputHtml] = await Promise.all([
    highlightCode(command.syntax, "bash"),
    highlightCode(command.example, "bash"),
    command.expectedOutput
      ? highlightCode(command.expectedOutput, "text")
      : Promise.resolve(undefined),
  ]);

  return (
    <div className="space-y-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-subtle" />
        <Link
          href="/commands"
          className="hover:text-foreground transition-colors"
        >
          Command Library
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-subtle" />
        <span className="font-mono font-medium text-foreground">
          {command.name}
        </span>
      </nav>

      <CommandBlock
        command={command}
        syntaxHtml={syntaxHtml}
        exampleHtml={exampleHtml}
        outputHtml={outputHtml}
      />

      <div className="border-t border-border pt-6">
        <Link
          href="/commands"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Command Library
        </Link>
      </div>
    </div>
  );
}
