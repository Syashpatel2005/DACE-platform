import { prisma } from "@/lib/prisma";
import LauncherForm from "./LauncherForm";

export default async function DevTestLauncherPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dev Test Launcher</h1>
        <p className="mt-1 text-text-secondary">
          Internal tool for testing the test engine during development. Not part of the real product UI.
        </p>
      </div>
      <div className="max-w-md rounded-lg border border-border-default bg-surface p-6">
        <LauncherForm subjects={subjects} />
      </div>
    </div>
  );
}