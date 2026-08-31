import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { POST } from "./route";

describe("/api/tests/[id]/answer", () => {
  let testUserId: string;
  let testId: string;

  beforeAll(async () => {
    const user = await prisma.user.upsert({
      where: { clerkId: "test_clerk_id_day45" },
      update: {},
      create: { clerkId: "test_clerk_id_day45", email: "test-day45@example.com" },
    });
    testUserId = user.id;

    const question = await prisma.question.findFirst({ where: { status: "APPROVED" } });
    if (!question) throw new Error("No approved questions found — run seed first");

    const test = await prisma.test.create({
      data: {
        userId: testUserId,
        testType: "QUICK_PRACTICE",
        title: "Test Day 45",
        durationMin: 10,
        questionCount: 1,
        config: {},
        status: "IN_PROGRESS",
        startedAt: new Date(),
        questions: { create: [{ questionId: question.id, position: 1 }] },
      },
    });
    testId = test.id;

    vi.mocked(auth).mockResolvedValue({ userId: "test_clerk_id_day45" } as never);
  });

  afterAll(async () => {
    await prisma.testQuestion.deleteMany({ where: { testId } });
    await prisma.test.delete({ where: { id: testId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("saves an answer for a valid position", async () => {
    const request = new Request(`http://localhost/api/tests/${testId}/answer`, {
      method: "POST",
      body: JSON.stringify({ position: 1, answer: 2 }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: testId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    const tq = await prisma.testQuestion.findUnique({
      where: { testId_position: { testId, position: 1 } },
    });
    expect(tq?.userAnswer).toBe(2);
  });

  it("clears an answer when answer is null", async () => {
    const request = new Request(`http://localhost/api/tests/${testId}/answer`, {
      method: "POST",
      body: JSON.stringify({ position: 1, answer: null }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: testId }) });

    expect(response.status).toBe(200);

    const tq = await prisma.testQuestion.findUnique({
      where: { testId_position: { testId, position: 1 } },
    });
    expect(tq?.userAnswer).toBeNull();
  });

  it("rejects an invalid position", async () => {
    const request = new Request(`http://localhost/api/tests/${testId}/answer`, {
      method: "POST",
      body: JSON.stringify({ position: 0, answer: 1 }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: testId }) });

    expect(response.status).toBe(400);
  });
});