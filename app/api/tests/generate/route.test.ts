import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { prisma } from "@/lib/prisma";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { POST } from "./route";

describe("/api/tests/generate", () => {
  let testUserId: string;
  let linearAlgebraSubjectId: string;

  beforeAll(async () => {
    const user = await prisma.user.upsert({
      where: { clerkId: "test_clerk_id_day41" },
      update: {},
      create: {
        clerkId: "test_clerk_id_day41",
        email: "test-day41@example.com",
      },
    });
    testUserId = user.id;

    const subject = await prisma.subject.findFirst({
      where: { slug: "linear-algebra" },
    });
    if (!subject) throw new Error("Linear Algebra subject not found — run seed first");
    linearAlgebraSubjectId = subject.id;

    vi.mocked(auth).mockResolvedValue({ userId: "test_clerk_id_day41" } as never);
  });

  afterAll(async () => {
    await prisma.testQuestion.deleteMany({ where: { test: { userId: testUserId } } });
    await prisma.test.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("generates a test with the requested number of questions", async () => {
    const request = new Request("http://localhost/api/tests/generate", {
      method: "POST",
      body: JSON.stringify({
        testType: "SUBJECT_TEST",
        subjectIds: [linearAlgebraSubjectId],
        questionCount: 3,
        durationMin: 30,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.actualQuestionCount).toBeLessThanOrEqual(3);
    expect(data.testId).toBeDefined();

    const test = await prisma.test.findUnique({
      where: { id: data.testId },
      include: { questions: true },
    });
    expect(test?.questions.length).toBe(data.actualQuestionCount);
  });

  it("rejects a request with no subjects", async () => {
    const request = new Request("http://localhost/api/tests/generate", {
      method: "POST",
      body: JSON.stringify({
        testType: "CUSTOM",
        subjectIds: [],
        questionCount: 5,
        durationMin: 30,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});