import { BookOpen } from "lucide-react";
import { getAllModules } from "@/lib/content";
import { CurriculumExplorer } from "@/components/CurriculumExplorer";
import { EmptyState } from "@/components/EmptyState";

export const metadata = {
  title: "Learn — Curriculum Explorer",
  description: "Explore all SNAI Course modules, learning paths, and detailed lessons.",
};

export default function NotesIndexPage() {
  const modules = getAllModules();

  return (
    <div className="space-y-8">
      <header className="space-y-2 border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-subtle">
          Your Learning Workspace
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Explore the course.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Understand computing, one concept at a time. Select a module below to
          view its overview and contextual lessons.
        </p>
      </header>

      {modules.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No course notes available yet"
          description="Course modules and lecture topics will appear here."
        />
      ) : (
        <CurriculumExplorer modules={modules} />
      )}
    </div>
  );
}
