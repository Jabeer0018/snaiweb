import { getAllPlaygroundProblems, getAllTheoryQuizzes } from "@/lib/content";
import { PlaygroundClient } from "@/components/PlaygroundClient";

export const metadata = {
  title: "CLI, Git & Theory Playground",
  description:
    "100 Easy, Medium, and Hard CLI & Git coding challenges plus 10 interactive Theory Quizzes (160 tricky MCQs).",
};

export default function PlaygroundPage() {
  const problems = getAllPlaygroundProblems();
  const quizzes = getAllTheoryQuizzes();

  return (
    <div className="space-y-6">
      <header className="space-y-2 border-b border-border pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Practice Playground
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          100 hands-on CLI &amp; Git coding challenges plus 10 interactive Theory
          Quizzes (160 tricky Easy, Medium, and Hard MCQs).
        </p>
      </header>

      <PlaygroundClient problems={problems} quizzes={quizzes} />
    </div>
  );
}
