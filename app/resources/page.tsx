import { ExternalLink, FileText, FolderOpen } from "lucide-react";
import { getAllResources } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Resources",
  description:
    "Original course documents, reference materials, and supplementary study resources.",
};

export default function ResourcesPage() {
  const resources = getAllResources();

  return (
    <div className="space-y-8">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Resource Library
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Authorised course documents, reference sheets, slides, and
          supplementary materials shared for student study.
        </p>
      </header>

      {resources.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No resources uploaded yet"
          description="Original course PDFs, reference sheets, and supplementary links that you have permission to share will appear here."
          hint="content/resources/index.json"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {resources.map((res) => (
            <a
              key={res.id}
              href={res.url}
              target={res.url.startsWith("http") ? "_blank" : undefined}
              rel={
                res.url.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="group flex flex-col justify-between rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-elevated/50"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded border border-border bg-elevated px-2 py-0.5 font-mono text-[11px] uppercase text-muted">
                    <FileText className="h-3 w-3 text-accent" />
                    {res.type}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-subtle group-hover:text-accent transition-colors" />
                </div>
                <h2 className="mt-3 text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                  {res.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {res.description}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-subtle">
                <span>{res.moduleTitle || res.source || "Course resource"}</span>
                {res.addedAt && <span>{formatDate(res.addedAt)}</span>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
