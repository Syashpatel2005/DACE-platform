import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeTestAccess } from "@/lib/testAuth";
import type { SaveAnswerInput, SaveAnswerResponse } from "@/lib/types";
import { Prisma } from "@/lib/generated/prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await params;
    const authResult = await authorizeTestAccess(testId);

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error } satisfies SaveAnswerResponse,
        { status: authResult.status }
      );
    }

    const test = await prisma.test.findUnique({ where: { id: testId } });
    if (test!.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { success: false, error: "Test is not in progress" } satisfies SaveAnswerResponse,
        { status: 409 }
      );
    }

    const body: SaveAnswerInput = await request.json();

    if (!Number.isInteger(body.position) || body.position < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid position" } satisfies SaveAnswerResponse,
        { status: 400 }
      );
    }

    const testQuestion = await prisma.testQuestion.findUnique({
      where: { testId_position: { testId, position: body.position } },
    });

    if (!testQuestion) {
      return NextResponse.json(
        { success: false, error: `No question at position ${body.position}` } satisfies SaveAnswerResponse,
        { status: 404 }
      );
    }

  await prisma.testQuestion.update({
    where: { id: testQuestion.id },
    data: {
      userAnswer: body.answer === null ? Prisma.JsonNull : body.answer,
      ...(body.timeSpentSec !== undefined
        ? { timeSpentSec: { increment: body.timeSpentSec } }
        : {}),
      ...(body.isMarkedReview !== undefined ? { isMarkedReview: body.isMarkedReview } : {}),
    },
  });

    return NextResponse.json({ success: true } satisfies SaveAnswerResponse);
  } catch (error) {
    console.error("Failed to save answer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save answer" } satisfies SaveAnswerResponse,
      { status: 500 }
    );
  }
}