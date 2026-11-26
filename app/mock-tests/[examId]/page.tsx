import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllMockExams, getMockExamById } from "@/lib/content";
import { MockExamRunner } from "@/components/MockExamRunner";

export function generateStaticParams() {
  return getAllMockExams().map((e) => ({ examId: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const exam = getMockExamById(examId);
  if (!exam) return { title: "Mock Test Not Found" };
  return {
    title: `${exam.title} — Mock Tests`,
    description: exam.subtitle,
  };
}

export default async function MockExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const exam = getMockExamById(examId);
  if (!exam) notFound();

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted">
          Loading examination...
        </div>
      }
    >
      <MockExamRunner exam={exam} />
    </Suspense>
  );
}
