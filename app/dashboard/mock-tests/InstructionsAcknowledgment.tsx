"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function InstructionsAcknowledgment() {
  const [acknowledged, setAcknowledged] = useState(false);

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

      <Button
        disabled={!acknowledged}
        className="w-fit bg-brand-blue hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => alert("Test engine coming in Phase 3!")}
      >
        Start Test
      </Button>
    </div>
  );
}