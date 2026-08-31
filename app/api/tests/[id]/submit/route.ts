import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeTestAccess } from "@/lib/testAuth";
import { calculateScore } from "@/lib/scoring";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await params;
    const authResult = await authorizeTestAccess(testId);

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const test = await prisma.test.findUnique({ where: { id: testId } });

    if (test!.status === "SUBMITTED") {
      return NextResponse.json(
        { success: false, error: "Test has already been submitted" },
        { status: 409 }
      );
    }
    if (test!.status === "NOT_STARTED") {
      return NextResponse.json(
        { success: false, error: "Cannot submit a test that hasn't started" },
        { status: 409 }
      );
    }

    const testQuestions = await prisma.testQuestion.findMany({
      where: { testId },
      include: { question: { select: { correctAnswer: true, marks: true, questionType: true } } },
    });

    const updates = testQuestions.map((tq) => {
      let result: "CORRECT" | "INCORRECT" | "SKIPPED";

      if (tq.userAnswer === null) {
        result = "SKIPPED";
      } else if (tq.userAnswer === tq.question.correctAnswer) {
        result = "CORRECT";
      } else {
        result = "INCORRECT";
      }

      return prisma.testQuestion.update({
        where: { id: tq.id },
        data: { result },
      });
    });

    const updatedQuestions = await prisma.$transaction(updates);

    const activeRules = await prisma.examRules.findFirst({ where: { isActive: true } });
    if (!activeRules) {
      return NextResponse.json(
        { success: false, error: "No active exam rules configured" },
        { status: 500 }
      );
    }

    const scoreSummary = calculateScore(
      testQuestions.map((tq, i) => ({
        marks: tq.question.marks,
        questionType: tq.question.questionType,
        result: updatedQuestions[i].result,
      })),
      activeRules
    );

    const submittedTest = await prisma.test.update({
      where: { id: testId },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
        score: scoreSummary.score,
        maxMarks: scoreSummary.maxMarks,
        accuracy: scoreSummary.accuracy,
      },
    });

    return NextResponse.json({
      success: true,
      summary: {
        ...scoreSummary,
        submittedAt: submittedTest.submittedAt,
      },
    });
  } catch (error) {
    console.error("Failed to submit test:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit test" },
      { status: 500 }
    );
  }
}