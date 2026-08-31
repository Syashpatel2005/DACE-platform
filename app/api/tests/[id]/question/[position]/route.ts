import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeTestAccess } from "@/lib/testAuth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; position: string }> }
) {
  try {
    const { id: testId, position: positionParam } = await params;
    const position = Number(positionParam);

    if (!Number.isInteger(position) || position < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid question position" },
        { status: 400 }
      );
    }

    const authResult = await authorizeTestAccess(testId);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const test = await prisma.test.findUnique({ where: { id: testId } });
    if (test!.status === "NOT_STARTED") {
      return NextResponse.json(
        { success: false, error: "Test has not been started yet" },
        { status: 409 }
      );
    }
    if (test!.status === "SUBMITTED") {
      return NextResponse.json(
        { success: false, error: "This test has already been submitted" },
        { status: 409 }
      );
    }

    const testQuestion = await prisma.testQuestion.findUnique({
      where: { testId_position: { testId, position } },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            questionType: true,
            options: true,
            marks: true,
            natTolerance: true,
          },
        },
      },
    });

    if (!testQuestion) {
      return NextResponse.json(
        { success: false, error: `No question at position ${position}` },
        { status: 404 }
      );
    }

    // Mark as visited the first time it's fetched, without overwriting an existing answer
    if (!testQuestion.isVisited) {
      await prisma.testQuestion.update({
        where: { id: testQuestion.id },
        data: { isVisited: true },
      });
    }

    return NextResponse.json({
      success: true,
      testQuestion: {
        id: testQuestion.id,
        position: testQuestion.position,
        userAnswer: testQuestion.userAnswer,
        isMarkedReview: testQuestion.isMarkedReview,
        isVisited: true,
        question: testQuestion.question,
      },
      totalQuestions: test!.questionCount,
    });
  } catch (error) {
    console.error("Failed to fetch test question:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}