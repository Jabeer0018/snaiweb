"use client";

import dynamic from "next/dynamic";

const PermissionsVisualizer = dynamic(
  () => import("./visualizers/PermissionsVisualizer").then((m) => m.PermissionsVisualizer),
  { ssr: false }
);
const NumberSystemConverter = dynamic(
  () => import("./visualizers/NumberSystemConverter").then((m) => m.NumberSystemConverter),
  { ssr: false }
);
const GitWorkflowVisualizer = dynamic(
  () => import("./visualizers/GitWorkflowVisualizer").then((m) => m.GitWorkflowVisualizer),
  { ssr: false }
);
const CpuSchedulingVisualizer = dynamic(
  () => import("./visualizers/CpuSchedulingVisualizer").then((m) => m.CpuSchedulingVisualizer),
  { ssr: false }
);
const NetworkPacketVisualizer = dynamic(
  () => import("./visualizers/NetworkPacketVisualizer").then((m) => m.NetworkPacketVisualizer),
  { ssr: false }
);
const AiLlmVisualizer = dynamic(
  () => import("./visualizers/AiLlmVisualizer").then((m) => m.AiLlmVisualizer),
  { ssr: false }
);

export function LessonInteractiveLab({ moduleSlug }: { moduleSlug: string }) {
  if (moduleSlug === "05-os-process-management") {
    return (
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
          Interactive Experiment — Process &amp; CPU Lab
        </h2>
        <CpuSchedulingVisualizer />
      </section>
    );
  }
  if (moduleSlug === "06-os-filesystem") {
    return (
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
          Interactive Experiment — Linux Permissions Lab
        </h2>
        <PermissionsVisualizer />
      </section>
    );
  }
  if (moduleSlug === "08-number-systems-encoding") {
    return (
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
          Interactive Experiment — Binary &amp; Base Converter
        </h2>
        <NumberSystemConverter />
      </section>
    );
  }
  if (moduleSlug === "09-git-github" || moduleSlug === "10-github-collaboration") {
    return (
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
          Interactive Experiment — Git Staging &amp; Branching Lab
        </h2>
        <GitWorkflowVisualizer />
      </section>
    );
  }
  if (moduleSlug === "11-the-network") {
    return (
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
          Interactive Experiment — Network &amp; Packet Tracer
        </h2>
        <NetworkPacketVisualizer />
      </section>
    );
  }
  if (
    moduleSlug === "15-five-foundational-papers" ||
    moduleSlug === "16-next-five-papers" ||
    moduleSlug === "17-modern-llm"
  ) {
    return (
      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="font-mono text-xs uppercase tracking-wider text-subtle">
          Interactive Experiment — Perceptron &amp; LLM Lab
        </h2>
        <AiLlmVisualizer />
      </section>
    );
  }
  return null;
}
