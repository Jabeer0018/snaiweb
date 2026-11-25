import { Terminal } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  highlightedHtml?: string;
  language?: string;
  title?: string;
  badge?: string;
  className?: string;
}

export function CodeBlock({
  code,
  highlightedHtml,
  language = "bash",
  title,
  badge,
  className,
}: CodeBlockProps) {
  return (
    <div
      className={cn(
        "my-4 overflow-hidden rounded-lg border border-border bg-surface",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-elevated/60 px-3.5 py-2">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Terminal className="h-3.5 w-3.5 text-subtle" />
          <span className="font-mono font-medium text-foreground/90">
            {title || language}
          </span>
          {badge && (
            <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
              {badge}
            </span>
          )}
        </div>
        <CopyButton text={code} />
      </div>

      {highlightedHtml ? (
        <div
          className="shiki-wrapper overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 font-mono text-[13.5px] leading-relaxed text-foreground">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
