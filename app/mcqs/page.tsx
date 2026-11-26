import { getAllTheoryQuizzes } from "@/lib/content";
import { QuizExplorer } from "@/components/QuizExplorer";

export const metadata = {
  title: "Theory Quizzes",
  description:
    "10 interactive theory quizzes (16 tricky MCQs each) covering all SNAI Course modules.",
};

export default function McqsPage() {
  const quizzes = getAllTheoryQuizzes();

  return (
    <div className="space-y-6">
      <header className="space-y-2 border-b border-border pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Theory Quizzes
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          10 topic-based quizzes (16 tricky Easy, Medium, and Hard MCQs per
          quiz) with instant explanations and score tracking.
        </p>
      </header>

      <QuizExplorer quizzes={quizzes} />
    </div>
  );
}
