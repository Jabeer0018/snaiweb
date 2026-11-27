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
        "not-prose my-4 overflow-hidden rounded-lg border border-code-border bg-code-bg",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-code-border bg-code-header px-3.5 py-2">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Terminal className="h-3.5 w-3.5 text-subtle" />
          <span className="font-mono font-medium text-foreground">
            {title || language}
          </span>
          {badge && (
            <span className="rounded border border-code-border bg-code-bg px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
              {badge}
            </span>
          )}
        </div>
        <CopyButton text={code} />
      </div>

      {highlightedHtml ? (
        <div
          className="shiki-wrapper overflow-x-auto bg-code-bg"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className="m-0 overflow-x-auto bg-transparent p-4 font-mono text-[13.5px] leading-relaxed text-code-fg">
          <code className="bg-transparent text-inherit">{code}</code>
        </pre>
      )}
    </div>
  );
}
