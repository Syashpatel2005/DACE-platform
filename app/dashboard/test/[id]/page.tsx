import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import TestRunner from "./TestRunner";

export default async function TestPage({
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

  return <TestRunner testId={testId} initialStatus={test.status} durationMin={test.durationMin} questionCount={test.questionCount} />;
}