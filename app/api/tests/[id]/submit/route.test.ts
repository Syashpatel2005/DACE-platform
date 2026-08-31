import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { POST } from "./route";

describe("/api/tests/[id]/submit", () => {
  let testUserId: string;
  let testId: string;
  let correctIndex: number;

  beforeAll(async () => {
    const user = await prisma.user.upsert({
      where: { clerkId: "test_clerk_id_day49" },
      update: {},
      create: { clerkId: "test_clerk_id_day49", email: "test-day49@example.com" },
    });
    testUserId = user.id;

    const questions = await prisma.question.findMany({
      where: { status: "APPROVED", questionType: "MCQ" },
      take: 3,
    });
    if (questions.length < 3) throw new Error("Need at least 3 approved MCQs — run seed first");

    correctIndex = questions[0].correctAnswer as number;
    const wrongIndex = correctIndex === 0 ? 1 : 0;

    const test = await prisma.test.create({
      data: {
        userId: testUserId,
        testType: "QUICK_PRACTICE",
        title: "Test Day 49",
        durationMin: 10,
        questionCount: 3,
        config: {},
        status: "IN_PROGRESS",
        startedAt: new Date(),
        questions: {
          create: [
            { questionId: questions[0].id, position: 1, userAnswer: correctIndex },
            { questionId: questions[1].id, position: 2, userAnswer: wrongIndex },
            { questionId: questions[2].id, position: 3, userAnswer: null },
          ],
        },
      },
    });
    testId = test.id;

    vi.mocked(auth).mockResolvedValue({ userId: "test_clerk_id_day49" } as never);
  });

  afterAll(async () => {
    await prisma.testQuestion.deleteMany({ where: { testId } });
    await prisma.test.delete({ where: { id: testId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("submits and correctly scores CORRECT/INCORRECT/SKIPPED", async () => {
    const request = new Request(`http://localhost/api/tests/${testId}/submit`, { method: "POST" });
    const response = await POST(request, { params: Promise.resolve({ id: testId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.summary.correct).toBe(1);
    expect(data.summary.incorrect).toBe(1);
    expect(data.summary.skipped).toBe(1);

    const test = await prisma.test.findUnique({ where: { id: testId } });
    expect(test?.status).toBe("SUBMITTED");
    expect(test?.submittedAt).not.toBeNull();
  });

  it("rejects submitting an already-submitted test", async () => {
    const request = new Request(`http://localhost/api/tests/${testId}/submit`, { method: "POST" });
    const response = await POST(request, { params: Promise.resolve({ id: testId }) });

    expect(response.status).toBe(409);
  });
});