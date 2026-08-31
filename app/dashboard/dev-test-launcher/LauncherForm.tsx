"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Subject = { id: string; name: string };

export default function LauncherForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [durationMin, setDurationMin] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLaunch() {
    if (!subjectId) {
      setError("Pick a subject first");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: "QUICK_PRACTICE",
          subjectIds: [subjectId],
          questionCount: Number(questionCount),
          durationMin: Number(durationMin),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Failed to generate test");
        setLoading(false);
        return;
      }

      router.push(`/dashboard/test/${data.testId}`);
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Select
          items={subjects.map((s) => ({ label: s.name, value: s.id }))}
          value={subjectId}
          onValueChange={(v) => setSubjectId(v ?? "")}
        >
          <SelectTrigger id="subject" className="w-full">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="count">Question Count</Label>
        <Input
          id="count"
          type="number"
          min={1}
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          min={1}
          value={durationMin}
          onChange={(e) => setDurationMin(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleLaunch} disabled={loading} className="bg-brand-blue hover:bg-brand-navy">
        {loading ? "Generating..." : "Generate & Launch Test"}
      </Button>
    </div>
  );
}