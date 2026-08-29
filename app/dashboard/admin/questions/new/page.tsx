import { prisma } from "@/lib/prisma";
import QuestionForm from "./QuestionForm";

export default async function NewQuestionPage() {
  const [subjects, topics] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
    prisma.topic.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, subjectId: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Add Question</h1>
        <p className="mt-1 text-text-secondary">
          Manually add a new MCQ question to the bank.
        </p>
      </div>
      <div className="max-w-2xl rounded-lg border border-border-default bg-surface p-6">
        <QuestionForm subjects={subjects} topics={topics} />
      </div>
    </div>
  );
}