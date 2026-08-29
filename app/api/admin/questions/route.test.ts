import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/prisma";

describe("/api/admin/questions", () => {
  let subjectId: string;
  let topicId: string;

  beforeAll(async () => {
    const subject = await prisma.subject.findFirst({
      where: { slug: "linear-algebra" },
    });
    if (!subject) throw new Error("Linear Algebra subject not found — run seed first");
    subjectId = subject.id;

    const topic = await prisma.topic.findFirst({
      where: { subjectId, slug: "eigenvalues" },
    });
    if (!topic) throw new Error("Eigenvalues topic not found — run seed first");
    topicId = topic.id;
  });

  afterAll(async () => {
    await prisma.question.deleteMany({
      where: { questionText: { contains: "TEST_QUESTION_DAY31" } },
    });
    await prisma.$disconnect();
  });

  it("creates a valid MCQ question", async () => {
    const request = new Request("http://localhost/api/admin/questions", {
      method: "POST",
      body: JSON.stringify({
        questionText: "TEST_QUESTION_DAY31: What is the rank of a 3x3 identity matrix?",
        questionType: "MCQ",
        subjectId,
        topicId,
        difficulty: "EASY",
        marks: 1,
        options: ["1", "2", "3", "4"],
        correctAnswer: 2,
        explanation: "The identity matrix has full rank equal to its size, so a 3x3 identity matrix has rank 3.",
        sourceType: "MANUAL",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.question.status).toBe("APPROVED");
  });

  it("rejects a question with wrong option count", async () => {
    const request = new Request("http://localhost/api/admin/questions", {
      method: "POST",
      body: JSON.stringify({
        questionText: "TEST_QUESTION_DAY31: Invalid question with 3 options",
        questionType: "MCQ",
        subjectId,
        topicId,
        difficulty: "EASY",
        marks: 1,
        options: ["1", "2", "3"],
        correctAnswer: 0,
        explanation: "This should fail validation before reaching the database.",
        sourceType: "MANUAL",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});