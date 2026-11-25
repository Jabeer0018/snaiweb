import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { CodeBlock } from "./CodeBlock";
import { Callout, CalloutVariant } from "./Callout";

interface MarkdownRendererProps {
  content: string;
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractText(props.children);
  }
  return "";
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-base sm:prose-lg prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:border-b prose-h2:border-border prose-h2:pb-2.5 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-lg prose-p:text-[16.5px] prose-p:leading-8 prose-p:text-foreground/90 prose-li:text-[16.5px] prose-li:leading-7 prose-li:text-foreground/90 prose-strong:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeText = String(children).replace(/\n$/, "");
            const isBlock = Boolean(match) || codeText.includes("\n");

            if (isBlock) {
              return (
                <CodeBlock
                  code={codeText}
                  language={match ? match[1] : "bash"}
                />
              );
            }

            return (
              <code
                className="rounded border border-border bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-foreground before:content-none after:content-none"
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote({ children }) {
            const rawText = extractText(children).trim();
            const calloutMatch = /^\[!(NOTE|TIP|IMPORTANT|WARNING)\]\s*/i.exec(
              rawText
            );
            if (calloutMatch) {
              const variant = calloutMatch[1].toLowerCase() as CalloutVariant;
              const cleaned = rawText.replace(
                /^\[!(NOTE|TIP|IMPORTANT|WARNING)\]\s*/i,
                ""
              );
              return (
                <Callout variant={variant}>
                  <p>{cleaned}</p>
                </Callout>
              );
            }
            return (
              <blockquote className="my-5 border-l-2 border-accent/60 pl-4 italic text-muted">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="my-5 overflow-x-auto rounded-lg border border-border">
                <table className="m-0 w-full text-left text-sm">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="border-b border-border bg-elevated/60 text-xs uppercase tracking-wider text-muted">
                {children}
              </thead>
            );
          },
          th({ children }) {
            return <th className="px-4 py-2.5 font-medium">{children}</th>;
          },
          td({ children }) {
            return (
              <td className="border-t border-border px-4 py-2.5 text-muted">
                {children}
              </td>
            );
          },
          a({ href, children }) {
            if (!href) return <span>{children}</span>;
            if (href.startsWith("http://") || href.startsWith("https://")) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            }
            return <Link href={href}>{children}</Link>;
          },
          img({ src, alt }) {
            if (!src) return null;
            return (
              <figure className="my-6 overflow-hidden rounded-lg border border-border bg-surface p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || "Course diagram"}
                  className="mx-auto max-h-[480px] w-auto rounded"
                  loading="lazy"
                />
                {alt && (
                  <figcaption className="mt-2 text-center text-xs text-muted">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
