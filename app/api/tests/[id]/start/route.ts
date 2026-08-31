import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeTestAccess } from "@/lib/testAuth";

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
        { success: false, error: "This test has already been submitted" },
        { status: 409 }
      );
    }

    // If already in progress, don't reset startedAt - just return current state.
    // This makes the endpoint safe to call again after a refresh.
    const updatedTest =
      test!.status === "NOT_STARTED"
        ? await prisma.test.update({
            where: { id: testId },
            data: { status: "IN_PROGRESS", startedAt: new Date() },
          })
        : test!;

    const firstQuestion = await prisma.testQuestion.findFirst({
      where: { testId },
      orderBy: { position: "asc" },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            questionType: true,
            options: true,
            marks: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      test: {
        id: updatedTest.id,
        status: updatedTest.status,
        startedAt: updatedTest.startedAt,
        durationMin: updatedTest.durationMin,
        questionCount: updatedTest.questionCount,
      },
      firstQuestion,
    });
  } catch (error) {
    console.error("Failed to start test:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start test" },
      { status: 500 }
    );
  }
}