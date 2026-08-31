import { describe, it, expect } from "vitest";
import { calculateScore, type ExamRulesForScoring } from "./scoring";

const rules: ExamRulesForScoring = {
  mcq1MarkWrongPenalty: 1 / 3,
  mcq2MarkWrongPenalty: 2 / 3,
  msqNegativeMarking: false,
  natNegativeMarking: false,
};

describe("calculateScore", () => {
  it("scores all-correct MCQs at full marks", () => {
    const result = calculateScore(
      [
        { marks: 1, questionType: "MCQ", result: "CORRECT" },
        { marks: 2, questionType: "MCQ", result: "CORRECT" },
      ],
      rules
    );
    expect(result.score).toBe(3);
    expect(result.maxMarks).toBe(3);
    expect(result.correct).toBe(2);
    expect(result.accuracy).toBe(1);
  });

  it("applies -1/3 penalty for wrong 1-mark MCQ", () => {
    const result = calculateScore(
      [{ marks: 1, questionType: "MCQ", result: "INCORRECT" }],
      rules
    );
    expect(result.score).toBeCloseTo(-0.33, 2);
  });

  it("applies -2/3 penalty for wrong 2-mark MCQ", () => {
    const result = calculateScore(
      [{ marks: 2, questionType: "MCQ", result: "INCORRECT" }],
      rules
    );
    expect(result.score).toBeCloseTo(-0.67, 2);
  });

  it("does not penalize skipped questions", () => {
    const result = calculateScore(
      [{ marks: 2, questionType: "MCQ", result: "SKIPPED" }],
      rules
    );
    expect(result.score).toBe(0);
    expect(result.skipped).toBe(1);
  });

  it("does not penalize wrong MSQ when msqNegativeMarking is false", () => {
    const result = calculateScore(
      [{ marks: 2, questionType: "MSQ", result: "INCORRECT" }],
      rules
    );
    expect(result.score).toBe(0);
  });

  it("does not penalize wrong NAT when natNegativeMarking is false", () => {
    const result = calculateScore(
      [{ marks: 1, questionType: "NAT", result: "INCORRECT" }],
      rules
    );
    expect(result.score).toBe(0);
  });

  it("calculates accuracy based on attempted, not total", () => {
    const result = calculateScore(
      [
        { marks: 1, questionType: "MCQ", result: "CORRECT" },
        { marks: 1, questionType: "MCQ", result: "INCORRECT" },
        { marks: 1, questionType: "MCQ", result: "SKIPPED" },
      ],
      rules
    );
    // 1 correct out of 2 attempted (skipped excluded from attempted)
    expect(result.accuracy).toBe(0.5);
    expect(result.attempted).toBe(2);
  });

  it("handles a realistic mixed GATE-style scenario", () => {
    const result = calculateScore(
      [
        { marks: 1, questionType: "MCQ", result: "CORRECT" },
        { marks: 1, questionType: "MCQ", result: "CORRECT" },
        { marks: 2, questionType: "MCQ", result: "CORRECT" },
        { marks: 1, questionType: "MCQ", result: "INCORRECT" },
        { marks: 2, questionType: "MCQ", result: "INCORRECT" },
        { marks: 1, questionType: "MCQ", result: "SKIPPED" },
      ],
      rules
    );
    // Correct: 1+1+2 = 4. Incorrect: -0.333 - 0.667 = -1. Net: 3
    expect(result.score).toBeCloseTo(3, 1);
    expect(result.maxMarks).toBe(8);
  });
});