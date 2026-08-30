import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import QuestionFilters from "./QuestionFilters";

export default async function QuestionsListPage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string; topicId?: string; difficulty?: string }>;
}) {
  const params = await searchParams;

  const [subjects, topics, questions] = await Promise.all([
    prisma.subject.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
    prisma.topic.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true, subjectId: true } }),
    prisma.question.findMany({
      where: {
        ...(params.subjectId ? { subjectId: params.subjectId } : {}),
        ...(params.topicId ? { topicId: params.topicId } : {}),
        ...(params.difficulty ? { difficulty: params.difficulty as never } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        subject: { select: { name: true } },
        topic: { select: { name: true } },
      },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Question Bank</h1>
          <p className="mt-1 text-text-secondary">
            {questions.length} question{questions.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link
          href="/dashboard/admin/questions/new"
          className="rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy"
        >
          Add Question
        </Link>
      </div>

      <QuestionFilters subjects={subjects} topics={topics} />

      <div className="overflow-x-auto rounded-lg border border-border-default bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="max-w-md truncate text-text-primary">
                  {q.questionText}
                </TableCell>
                <TableCell className="text-text-secondary">{q.subject.name}</TableCell>
                <TableCell className="text-text-secondary">{q.topic.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{q.difficulty.replace("_", "-")}</Badge>
                </TableCell>
                <TableCell className="text-text-secondary">{q.marks}</TableCell>
                <TableCell>
                  <Badge variant={q.status === "APPROVED" ? "default" : "secondary"}>
                    {q.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {questions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-text-secondary">
                  No questions match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}