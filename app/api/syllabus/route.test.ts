import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("/api/syllabus", () => {
  it(
  "returns all 8 subjects with their topics",
  async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.syllabus.length).toBe(8);
    expect(data.syllabus[0]).toHaveProperty("topics");
    expect(Array.isArray(data.syllabus[0].topics)).toBe(true);
  },
  10000 // 10 second timeout for this DB-heavy query
);

  it("subjects are ordered correctly", async () => {
    const response = await GET();
    const data = await response.json();

    const orders = data.syllabus.map((s: { order: number }) => s.order);
    const sortedOrders = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sortedOrders);
  });
});