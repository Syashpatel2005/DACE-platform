import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { POST } from "./route";

describe("/api/tests/[id]/start", () => {
  let testUserId: string;
  let testId: string;

  beforeAll(async () => {
    const user = await prisma.user.upsert({
      where: { clerkId: "test_clerk_id_day42" },
      update: {},
      create: { clerkId: "test_clerk_id_day42", email: "test-day42@example.com" },
    });
    testUserId = user.id;

    const question = await prisma.question.findFirst({ where: { status: "APPROVED" } });
    if (!question) throw new Error("No approved questions found — run seed first");

    const test = await prisma.test.create({
      data: {
        userId: testUserId,
        testType: "QUICK_PRACTICE",
        title: "Test Day 42",
        durationMin: 10,
        questionCount: 1,
        config: {},
        status: "NOT_STARTED",
        questions: { create: [{ questionId: question.id, position: 1 }] },
      },
    });
    testId = test.id;

    vi.mocked(auth).mockResolvedValue({ userId: "test_clerk_id_day42" } as never);
  });

  afterAll(async () => {
    await prisma.testQuestion.deleteMany({ where: { testId } });
    await prisma.test.delete({ where: { id: testId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("starts a test and returns the first question without the correct answer", async () => {
    const request = new Request(`http://localhost/api/tests/${testId}/start`, { method: "POST" });
    const response = await POST(request, { params: Promise.resolve({ id: testId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.test.status).toBe("IN_PROGRESS");
    expect(data.firstQuestion.question).not.toHaveProperty("correctAnswer");
    expect(data.firstQuestion.question).not.toHaveProperty("explanation");
  });

  it("does not reset startedAt on a second call", async () => {
    const request1 = new Request(`http://localhost/api/tests/${testId}/start`, { method: "POST" });
    const response1 = await POST(request1, { params: Promise.resolve({ id: testId }) });
    const data1 = await response1.json();

    const request2 = new Request(`http://localhost/api/tests/${testId}/start`, { method: "POST" });
    const response2 = await POST(request2, { params: Promise.resolve({ id: testId }) });
    const data2 = await response2.json();

    expect(data1.test.startedAt).toBe(data2.test.startedAt);
  });
});