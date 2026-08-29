import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateFingerprint } from "@/lib/fingerprint";
import { validateMCQ, type MCQInput } from "@/lib/questionValidation";

export async function POST(request: Request) {
  try {
    const body: MCQInput = await request.json();

    const validation = validateMCQ(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const [subject, topic] = await Promise.all([
      prisma.subject.findUnique({ where: { id: body.subjectId } }),
      prisma.topic.findUnique({ where: { id: body.topicId } }),
    ]);

    if (!subject) {
      return NextResponse.json(
        { success: false, errors: ["subjectId does not reference a real Subject"] },
        { status: 400 }
      );
    }
    if (!topic) {
      return NextResponse.json(
        { success: false, errors: ["topicId does not reference a real Topic"] },
        { status: 400 }
      );
    }

    const fingerprint = generateFingerprint(body.questionText);

    const existing = await prisma.question.findUnique({ where: { fingerprint } });
    if (existing) {
      return NextResponse.json(
        { success: false, errors: ["A question with this exact text already exists"] },
        { status: 409 }
      );
    }

    const question = await prisma.question.create({
      data: {
        questionText: body.questionText,
        questionType: body.questionType,
        subjectId: body.subjectId,
        topicId: body.topicId,
        subtopic: body.subtopic,
        difficulty: body.difficulty,
        marks: body.marks,
        options: body.options,
        correctAnswer: body.correctAnswer,
        explanation: body.explanation,
        concept: body.concept,
        estimatedTime: body.estimatedTime,
        sourceType: body.sourceType,
        sourceYear: body.sourceYear,
        sourceReference: body.sourceReference,
        tags: body.tags ?? [],
        status: "APPROVED",
        fingerprint,
      },
    });

    return NextResponse.json({ success: true, question }, { status: 201 });
  } catch (error) {
    console.error("Failed to create question:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create question" },
      { status: 500 }
    );
  }
}