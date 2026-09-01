import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeTestAccess } from "@/lib/testAuth";

export async function GET(
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

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          select: { result: true, timeSpentSec: true },
        },
      },
    });

    if (test!.status !== "SUBMITTED") {
      return NextResponse.json(
        { success: false, error: "Test has not been submitted yet" },
        { status: 409 }
      );
    }

    const correct = test!.questions.filter((q) => q.result === "CORRECT").length;
    const incorrect = test!.questions.filter((q) => q.result === "INCORRECT").length;
    const skipped = test!.questions.filter((q) => q.result === "SKIPPED").length;
    const attempted = correct + incorrect;

    const totalTimeSec = test!.questions.reduce((sum, q) => sum + q.timeSpentSec, 0);
    const avgTimePerQuestionSec =
      test!.questions.length > 0 ? Math.round(totalTimeSec / test!.questions.length) : 0;

    const percentage =
      test!.maxMarks && test!.maxMarks > 0
        ? Math.round(((test!.score ?? 0) / test!.maxMarks) * 10000) / 100
        : 0;

    const durationUsedSec =
      test!.startedAt && test!.submittedAt
        ? Math.round((test!.submittedAt.getTime() - test!.startedAt.getTime()) / 1000)
        : 0;

    return NextResponse.json({
      success: true,
      result: {
        testId: test!.id,
        title: test!.title,
        testType: test!.testType,
        score: test!.score,
        maxMarks: test!.maxMarks,
        percentage,
        accuracy: test!.accuracy,
        attempted,
        correct,
        incorrect,
        skipped,
        totalQuestions: test!.questionCount,
        durationUsedSec,
        avgTimePerQuestionSec,
        startedAt: test!.startedAt,
        submittedAt: test!.submittedAt,
      },
    });
  } catch (error) {
    console.error("Failed to fetch test result:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}