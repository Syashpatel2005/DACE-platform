import { prisma } from "@/lib/prisma";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { order: "asc" },
    include: {
      topics: {
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Subjects</h1>
        <p className="mt-1 text-text-secondary">
          The complete GATE DA syllabus — {subjects.length} subjects,{" "}
          {subjects.reduce((sum, s) => sum + s.topics.length, 0)} topics.
        </p>
      </div>

      <div className="rounded-lg border border-border-default bg-surface p-2">
        <Accordion multiple className="w-full">
          {subjects.map((subject) => (
            <AccordionItem key={subject.id} value={subject.id}>
              <AccordionTrigger className="px-4 text-text-primary hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="font-semibold">{subject.name}</span>
                  <span className="text-xs font-normal text-text-secondary">
                    {subject.topics.length} topics
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                  {subject.topics.map((topic) => (
                    <li
                      key={topic.id}
                      className="text-sm text-text-secondary before:mr-2 before:text-brand-blue before:content-['•']"
                    >
                      {topic.name}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}