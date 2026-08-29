import { describe, it, expect, afterAll } from "vitest";
import { POST, GET } from "./route";
import { prisma } from "@/lib/prisma";

describe("/api/ping", () => {
  afterAll(async () => {
    await prisma.ping.deleteMany({
      where: { message: "Hello from DAce!" },
    });
    await prisma.$disconnect();
  });

  it("POST creates a new ping and returns success", async () => {
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.ping.message).toBe("Hello from DAce!");
    expect(data.ping.id).toBeDefined();
  });

  it("GET returns a list of pings", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.pings)).toBe(true);
  });
});