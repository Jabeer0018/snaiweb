import { getAllPlaygroundProblems } from "@/lib/content";
import { PlaygroundClient } from "@/components/PlaygroundClient";

export const metadata = {
  title: "CLI & Git Playground",
  description:
    "100 Easy, Medium, and Hard CLI and Git/GitHub practice problems with an interactive Bash & Git execution sandbox.",
};

export default function PlaygroundPage() {
  const problems = getAllPlaygroundProblems();

  return (
    <div className="space-y-6">
      <header className="space-y-2 border-b border-border pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          CLI &amp; Git Playground
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          100 hands-on CLI and Git/GitHub challenges across Easy, Medium, and
          Hard difficulty. Write multi-line Bash/Git scripts, run commands to
          inspect live output, and submit to verify every requirement.
        </p>
      </header>

      <PlaygroundClient problems={problems} />
    </div>
  );
}
