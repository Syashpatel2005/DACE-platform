import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import ResultView from "./ResultView";

export default async function TestResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: testId } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/sign-in");

  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test || test.userId !== user.id) notFound();

  if (test.status !== "SUBMITTED") {
    redirect(`/dashboard/test/${testId}`);
  }

  return <ResultView testId={testId} />;
}