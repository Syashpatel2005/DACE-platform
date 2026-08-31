import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export type TestAuthResult =
  | { authorized: true; userId: string; testId: string }
  | { authorized: false; status: 401 | 403 | 404; error: string };

export async function authorizeTestAccess(testId: string): Promise<TestAuthResult> {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return { authorized: false, status: 401, error: "Not authenticated" };
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    return { authorized: false, status: 404, error: "User record not found" };
  }

  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test) {
    return { authorized: false, status: 404, error: "Test not found" };
  }

  if (test.userId !== user.id) {
    return { authorized: false, status: 403, error: "You do not have access to this test" };
  }

  return { authorized: true, userId: user.id, testId };
}