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

    const testQuestions = await prisma.testQuestion.findMany({
      where: { testId },
      orderBy: { position: "asc" },
      select: {
        position: true,
        userAnswer: true,
        isVisited: true,
        isMarkedReview: true,
      },
    });

    const palette = testQuestions.map((tq) => ({
      position: tq.position,
      isAnswered: tq.userAnswer !== null,
      isVisited: tq.isVisited,
      isMarkedReview: tq.isMarkedReview,
    }));

    return NextResponse.json({ success: true, palette });
  } catch (error) {
    console.error("Failed to fetch palette state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch palette state" },
      { status: 500 }
    );
  }
}