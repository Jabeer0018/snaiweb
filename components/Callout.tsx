import { AlertTriangle, Info, Lightbulb, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalloutVariant = "note" | "tip" | "important" | "warning";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  CalloutVariant,
  {
    label: string;
    icon: typeof Info;
    borderClass: string;
    bgClass: string;
    titleClass: string;
  }
> = {
  note: {
    label: "Note",
    icon: Info,
    borderClass: "border-border-strong",
    bgClass: "bg-surface",
    titleClass: "text-foreground",
  },
  tip: {
    label: "Key Takeaway",
    icon: Lightbulb,
    borderClass: "border-border-strong",
    bgClass: "bg-surface",
    titleClass: "text-foreground",
  },
  important: {
    label: "Important Concept",
    icon: ShieldAlert,
    borderClass: "border-foreground/30",
    bgClass: "bg-elevated",
    titleClass: "text-foreground",
  },
  warning: {
    label: "Common Misconception / Warning",
    icon: AlertTriangle,
    borderClass: "border-amber-500/40",
    bgClass: "bg-amber-500/5",
    titleClass: "text-amber-500",
  },
};

export function Callout({
  variant = "note",
  title,
  children,
  className,
}: CalloutProps) {
  const cfg = variantConfig[variant];
  const Icon = cfg.icon;

  return (
    <div
      className={cn(
        "my-6 rounded-md border-l-2 border px-4 py-3.5 text-sm leading-relaxed",
        cfg.borderClass,
        cfg.bgClass,
        className
      )}
    >
      <div className={cn("mb-1.5 flex items-center gap-2 font-medium", cfg.titleClass)}>
        <Icon className="h-4 w-4 shrink-0" />
        <span>{title || cfg.label}</span>
      </div>
      <div className="text-foreground/90 [&>p:last-child]:mb-0">{children}</div>
    </div>
  );
}
