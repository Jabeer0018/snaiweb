import { getAllCommands } from "@/lib/content";
import { CommandExplorer } from "@/components/CommandExplorer";

export const metadata = {
  title: "Command Library",
  description:
    "Searchable command reference with syntax, parameters, practical examples, expected output, and common mistakes.",
};

export default function CommandsPage() {
  const commands = getAllCommands();

  return (
    <div className="space-y-8">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Command Library
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Searchable reference of commands covered in the course. Filter by
          module, category, or topic, and copy syntax directly.
        </p>
      </header>

      <CommandExplorer commands={commands} />
    </div>
  );
}
