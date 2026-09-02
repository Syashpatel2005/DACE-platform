import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { shuffle } from "@/lib/shuffle";
import type { GenerateTestInput, GenerateTestResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" } satisfies GenerateTestResponse,
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User record not found" } satisfies GenerateTestResponse,
        { status: 404 }
      );
    }

    const body: GenerateTestInput = await request.json();

    // --- FULL_MOCK: derive everything from ExamRules ---
    if (body.testType === "FULL_MOCK") {
      const rules = await prisma.examRules.findFirst({ where: { isActive: true } });
      if (!rules) {
        return NextResponse.json(
          { success: false, error: "No active exam rules configured" } satisfies GenerateTestResponse,
          { status: 500 }
        );
      }

      const gaSubject = await prisma.subject.findUnique({ where: { slug: "general-aptitude" } });
      if (!gaSubject) {
        return NextResponse.json(
          { success: false, error: "General Aptitude subject not found" } satisfies GenerateTestResponse,
          { status: 500 }
        );
      }

      const daSubjects = await prisma.subject.findMany({
        where: { slug: { not: "general-aptitude" } },
      });
      const daSubjectIds = daSubjects.map((s) => s.id);

      const [gaQuestions, daQuestions] = await Promise.all([
        prisma.question.findMany({
          where: { subjectId: gaSubject.id, status: "APPROVED" },
        }),
        prisma.question.findMany({
          where: { subjectId: { in: daSubjectIds }, status: "APPROVED" },
        }),
      ]);

      const selectedGA = shuffle(gaQuestions).slice(0, rules.gaQuestionCount);
      const selectedDA = shuffle(daQuestions).slice(0, rules.daQuestionCount);
      const selected = [...selectedGA, ...selectedDA];

      if (selected.length === 0) {
        return NextResponse.json(
          { success: false, error: "No approved questions available for a full mock test" } satisfies GenerateTestResponse,
          { status: 404 }
        );
      }

      const totalMarks = selected.reduce((sum, q) => sum + q.marks, 0);

      const test = await prisma.test.create({
        data: {
          userId: user.id,
          testType: "FULL_MOCK",
          title: rules.name,
          durationMin: rules.durationMin,
          questionCount: selected.length,
          config: {
            gaRequested: rules.gaQuestionCount,
            gaActual: selectedGA.length,
            daRequested: rules.daQuestionCount,
            daActual: selectedDA.length,
          },
          maxMarks: totalMarks,
          status: "NOT_STARTED",
          questions: {
            create: selected.map((q, index) => ({
              questionId: q.id,
              position: index + 1,
            })),
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          testId: test.id,
          actualQuestionCount: selected.length,
        } satisfies GenerateTestResponse,
        { status: 201 }
      );
    }

    // --- Existing subject/topic/custom logic ---
    if (!body.subjectIds || body.subjectIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one subject must be selected" } satisfies GenerateTestResponse,
        { status: 400 }
      );
    }
    if (!body.questionCount || body.questionCount < 1) {
      return NextResponse.json(
        { success: false, error: "questionCount must be at least 1" } satisfies GenerateTestResponse,
        { status: 400 }
      );
    }
    if (!body.durationMin || body.durationMin < 1) {
      return NextResponse.json(
        { success: false, error: "durationMin must be at least 1" } satisfies GenerateTestResponse,
        { status: 400 }
      );
    }

    const candidateQuestions = await prisma.question.findMany({
      where: {
        subjectId: { in: body.subjectIds },
        ...(body.topicIds && body.topicIds.length > 0
          ? { topicId: { in: body.topicIds } }
          : {}),
        ...(body.difficulty ? { difficulty: body.difficulty } : {}),
        status: "APPROVED",
      },
    });

    if (candidateQuestions.length === 0) {
      return NextResponse.json(
        { success: false, error: "No approved questions found matching the selected criteria" } satisfies GenerateTestResponse,
        { status: 404 }
      );
    }

    const shuffled = shuffle(candidateQuestions);
    const selected = shuffled.slice(0, body.questionCount);
    const totalMarks = selected.reduce((sum, q) => sum + q.marks, 0);

    const test = await prisma.test.create({
      data: {
        userId: user.id,
        testType: body.testType,
        title: `${body.testType.replace("_", " ")} Test`,
        durationMin: body.durationMin,
        questionCount: selected.length,
        config: {
          subjectIds: body.subjectIds,
          topicIds: body.topicIds ?? [],
          difficulty: body.difficulty ?? "MIXED",
          requestedCount: body.questionCount,
        },
        maxMarks: totalMarks,
        status: "NOT_STARTED",
        questions: {
          create: selected.map((q, index) => ({
            questionId: q.id,
            position: index + 1,
          })),
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        testId: test.id,
        actualQuestionCount: selected.length,
      } satisfies GenerateTestResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to generate test:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate test" } satisfies GenerateTestResponse,
      { status: 500 }
    );
  }
}