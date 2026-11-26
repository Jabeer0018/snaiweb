import { getAllMockExams } from "@/lib/content";
import { MockTestsHub } from "@/components/MockTestsHub";

export const metadata = {
  title: "Mock Tests",
  description:
    "10 full-length SNAI mock examinations (350 original questions, 124 points each) with Real Exam Mode, Practice Mode, and concept analytics.",
};

export default function MockTestsPage() {
  const exams = getAllMockExams();

  return (
    <div className="space-y-6">
      <header className="space-y-2 border-b border-border pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          SNAI Mock Tests
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          10 full-length, mixed-syllabus practice examinations (35 questions ·
          124 points each) covering Scenario MCQs, Numerical/Typed problems,
          two Integrated Case Studies, and Matching pairs.
        </p>
      </header>

      <MockTestsHub exams={exams} />
    </div>
  );
}
