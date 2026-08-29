export type MCQInput = {
  questionText: string;
  questionType: "MCQ";
  subjectId: string;
  topicId: string;
  subtopic?: string;
  difficulty: "EASY" | "MEDIUM" | "MEDIUM_HARD" | "HARD" | "VERY_HARD";
  marks: number;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept?: string;
  estimatedTime?: number;
  sourceType: "AI_GENERATED" | "OFFICIAL_PREVIOUS_YEAR" | "MANUAL";
  sourceYear?: number;
  sourceReference?: string;
  tags?: string[];
};

export type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] };

export function validateMCQ(input: MCQInput): ValidationResult {
  const errors: string[] = [];

  if (!input.questionText || input.questionText.trim().length < 10) {
    errors.push("Question text must be at least 10 characters");
  }
  if (!input.subjectId) errors.push("subjectId is required");
  if (!input.topicId) errors.push("topicId is required");
  if (!input.explanation || input.explanation.trim().length < 10) {
    errors.push("Explanation must be at least 10 characters");
  }
  if (![1, 2].includes(input.marks)) {
    errors.push("Marks must be 1 or 2 for MCQ");
  }
  if (!Array.isArray(input.options) || input.options.length !== 4) {
    errors.push("MCQ must have exactly 4 options");
  } else if (input.options.some((opt) => !opt || opt.trim().length === 0)) {
    errors.push("All 4 options must be non-empty");
  }
  if (
    typeof input.correctAnswer !== "number" ||
    input.correctAnswer < 0 ||
    input.correctAnswer > 3
  ) {
    errors.push("correctAnswer must be a valid index (0-3) into options");
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true };
}