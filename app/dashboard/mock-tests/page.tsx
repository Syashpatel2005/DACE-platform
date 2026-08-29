import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InstructionsAcknowledgment from "./InstructionsAcknowledgment";

export default async function MockTestsPage() {
  const rules = await prisma.examRules.findFirst({
    where: { isActive: true },
  });

  if (!rules) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Full Mock Tests</h1>
        <p className="mt-2 text-text-secondary">
          No active exam rules are configured. Please contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Full Mock Test</h1>
        <p className="mt-1 text-text-secondary">{rules.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-text-primary">Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InstructionStat label="Number of Questions" value={`${rules.fullMockQuestionCount}`} />
            <InstructionStat label="Duration" value={`${rules.durationMin} minutes`} />
            <InstructionStat label="Maximum Marks" value={`${rules.totalMarks}`} />
            <InstructionStat
              label="Section Split"
              value={`GA: ${rules.gaMarks} · DA: ${rules.daMarks}`}
            />
            <InstructionStat label="Question Types" value="MCQ, MSQ, NAT" />
            <InstructionStat label="Calculator" value="Available on-screen" />
          </div>

          <div className="rounded-md border border-border-default bg-surface-muted p-4">
            <h3 className="mb-2 font-semibold text-text-primary">Marking Scheme</h3>
            <ul className="flex flex-col gap-1 text-sm text-text-secondary">
              <li>
                MCQ (1 mark): +1 for correct, −
                {rules.mcq1MarkWrongPenalty.toFixed(2)} for incorrect
              </li>
              <li>
                MCQ (2 marks): +2 for correct, −
                {rules.mcq2MarkWrongPenalty.toFixed(2)} for incorrect
              </li>
              <li>
                MSQ: +marks for fully correct,{" "}
                {rules.msqNegativeMarking ? "negative marking applies" : "no negative marking"}
              </li>
              <li>
                NAT: +marks for correct (within tolerance),{" "}
                {rules.natNegativeMarking ? "negative marking applies" : "no negative marking"}
              </li>
              <li>Unattempted questions: 0 marks, no penalty</li>
            </ul>
          </div>

          <div className="rounded-md border border-border-default bg-surface-muted p-4">
            <h3 className="mb-2 font-semibold text-text-primary">Navigation Rules</h3>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-text-secondary">
              <li>You may navigate freely between questions using the palette or Next/Previous.</li>
              <li>Mark questions for review to revisit them before submitting.</li>
              <li>The timer counts down continuously and cannot be paused.</li>
              <li>The test auto-submits when time expires.</li>
            </ul>
          </div>

          <div className="rounded-md border border-border-default bg-surface-muted p-4">
            <h3 className="mb-2 font-semibold text-text-primary">Submission Rules</h3>
            <p className="text-sm text-text-secondary">
              Before final submission, you&apos;ll see a summary of answered, unanswered,
              marked-for-review, and not-visited questions, and must confirm before submitting.
              Once submitted, answers cannot be changed.
            </p>
          </div>
        </CardContent>
      </Card>

      <InstructionsAcknowledgment />
    </div>
  );
}

function InstructionStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-default p-3">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="mt-1 font-semibold text-text-primary">{value}</p>
    </div>
  );
}