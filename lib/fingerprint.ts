import { createHash } from "crypto";

export function generateFingerprint(questionText: string): string {
  const normalized = questionText
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "");
  return createHash("sha256").update(normalized).digest("hex");
}
