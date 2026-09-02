"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function InstructionsAcknowledgment() {
  const router = useRouter();
  const [acknowledged, setAcknowledged] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setLaunching(true);
    setError(null);

    try {
      const res = await fetch("/api/tests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType: "FULL_MOCK" }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Failed to generate test");
        setLaunching(false);
        return;
      }

      router.push(`/dashboard/test/${data.testId}`);
    } catch {
      setError("Network error — please try again.");
      setLaunching(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-surface p-6">
      <label className="flex cursor-pointer items-start gap-3">
        <Checkbox
          checked={acknowledged}
          onCheckedChange={(checked) => setAcknowledged(checked === true)}
        />
        <span className="text-sm text-text-secondary">
          I have read and understood the test instructions, duration, marking
          scheme, and submission rules above.
        </span>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        disabled={!acknowledged || launching}
        className="w-fit bg-brand-blue hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleStart}
      >
        {launching ? "Generating your test..." : "Start Test"}
      </Button>
    </div>
  );
}