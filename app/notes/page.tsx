import { BookOpen } from "lucide-react";
import { getAllModules } from "@/lib/content";
import { ModuleCard } from "@/components/ModuleCard";
import { EmptyState } from "@/components/EmptyState";

export const metadata = {
  title: "Course Notes",
  description: "Module-based structured lecture notes and explanations.",
};

export default function NotesIndexPage() {
  const modules = getAllModules();

  return (
    <div className="space-y-8">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Course Notes
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Structured documentation-style lecture notes organised by module and
          topic. Select a module below to begin reading.
        </p>
      </header>

      {modules.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No course notes available yet"
          description="Course modules and lecture topics will appear here as soon as your original course materials (PDFs, screenshots, or notes) are ingested."
          hint="content/modules/<module-slug>/<topic-slug>.md"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <ModuleCard key={mod.slug} module={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
