export type ScorableQuestion = {
  marks: number;
  questionType: "MCQ" | "MSQ" | "NAT";
  result: "CORRECT" | "INCORRECT" | "SKIPPED" | "NOT_VISITED" | null;
};

export type ExamRulesForScoring = {
  mcq1MarkWrongPenalty: number;
  mcq2MarkWrongPenalty: number;
  msqNegativeMarking: boolean;
  natNegativeMarking: boolean;
};

export type ScoreSummary = {
  score: number;
  maxMarks: number;
  correct: number;
  incorrect: number;
  skipped: number;
  attempted: number;
  accuracy: number;
};

export function calculateScore(
  questions: ScorableQuestion[],
  rules: ExamRulesForScoring
): ScoreSummary {
  let score = 0;
  let maxMarks = 0;
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;

  for (const q of questions) {
    maxMarks += q.marks;

    if (q.result === "CORRECT") {
      score += q.marks;
      correct++;
    } else if (q.result === "INCORRECT") {
      incorrect++;

      if (q.questionType === "MCQ") {
        const penalty = q.marks === 2 ? rules.mcq2MarkWrongPenalty : rules.mcq1MarkWrongPenalty;
        score -= penalty;
      } else if (q.questionType === "MSQ" && rules.msqNegativeMarking) {
        score -= q.marks;
      } else if (q.questionType === "NAT" && rules.natNegativeMarking) {
        score -= q.marks;
      }
      // MSQ/NAT with no negative marking: 0 penalty, already correctly not subtracted
    } else {
      skipped++;
    }
  }

  const attempted = correct + incorrect;
  const accuracy = attempted > 0 ? correct / attempted : 0;

  return {
    score: Math.round(score * 100) / 100, // round to 2 decimal places, avoiding float artifacts
    maxMarks,
    correct,
    incorrect,
    skipped,
    attempted,
    accuracy: Math.round(accuracy * 10000) / 10000, // 4 decimal places for precision
  };
}