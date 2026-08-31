import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { GET } from "./route";

describe("/api/tests/[id]/question/[position]", () => {
  let testUserId: string;
  let testId: string;

  beforeAll(async () => {
    const user = await prisma.user.upsert({
      where: { clerkId: "test_clerk_id_day43" },
      update: {},
      create: { clerkId: "test_clerk_id_day43", email: "test-day43@example.com" },
    });
    testUserId = user.id;

    const questions = await prisma.question.findMany({
      where: { status: "APPROVED" },
      take: 2,
    });
    if (questions.length < 2) throw new Error("Need at least 2 approved questions — run seed first");

    const test = await prisma.test.create({
      data: {
        userId: testUserId,
        testType: "QUICK_PRACTICE",
        title: "Test Day 43",
        durationMin: 10,
        questionCount: 2,
        config: {},
        status: "IN_PROGRESS",
        startedAt: new Date(),
        questions: {
          create: [
            { questionId: questions[0].id, position: 1 },
            { questionId: questions[1].id, position: 2 },
          ],
        },
      },
    });
    testId = test.id;

    vi.mocked(auth).mockResolvedValue({ userId: "test_clerk_id_day43" } as never);
  });

  afterAll(async () => {
    await prisma.testQuestion.deleteMany({ where: { testId } });
    await prisma.test.delete({ where: { id: testId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("fetches question at position 1 without exposing the correct answer", async () => {
    const request = new Request(`http://localhost/api/tests/${testId}/question/1`);
    const response = await GET(request, {
      params: Promise.resolve({ id: testId, position: "1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.testQuestion.position).toBe(1);
    expect(data.testQuestion.question).not.toHaveProperty("correctAnswer");
    expect(data.testQuestion.isVisited).toBe(true);
  });

  it("returns 404 for a position that doesn't exist", async () => {
    const request = new Request(`http://localhost/api/tests/${testId}/question/99`);
    const response = await GET(request, {
      params: Promise.resolve({ id: testId, position: "99" }),
    });

    expect(response.status).toBe(404);
  });

  it("rejects an invalid (non-numeric) position", async () => {
    const request = new Request(`http://localhost/api/tests/${testId}/question/abc`);
    const response = await GET(request, {
      params: Promise.resolve({ id: testId, position: "abc" }),
    });

    expect(response.status).toBe(400);
  });
});