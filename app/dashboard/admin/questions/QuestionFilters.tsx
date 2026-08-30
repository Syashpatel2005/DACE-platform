"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Subject = { id: string; name: string };
type Topic = { id: string; name: string; subjectId: string };

const DIFFICULTIES = ["EASY", "MEDIUM", "MEDIUM_HARD", "HARD", "VERY_HARD"];

export default function QuestionFilters({
  subjects,
  topics,
}: {
  subjects: Subject[];
  topics: Topic[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectId = searchParams.get("subjectId") ?? "";
  const topicId = searchParams.get("topicId") ?? "";
  const difficulty = searchParams.get("difficulty") ?? "";

  const filteredTopics = topics.filter((t) => t.subjectId === subjectId);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key === "subjectId") params.delete("topicId");
    router.push(`/dashboard/admin/questions?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-default bg-surface p-4">
      <Select
        items={[{ label: "All Subjects", value: "" }, ...subjects.map((s) => ({ label: s.name, value: s.id }))]}
        value={subjectId}
        onValueChange={(v) => updateParam("subjectId", v || null)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Subjects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Subjects</SelectItem>
          {subjects.map((s) => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={[{ label: "All Topics", value: "" }, ...filteredTopics.map((t) => ({ label: t.name, value: t.id }))]}
        value={topicId}
        onValueChange={(v) => updateParam("topicId", v || null)}
        disabled={!subjectId}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Topics" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Topics</SelectItem>
          {filteredTopics.map((t) => (
            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={[{ label: "All Difficulties", value: "" }, ...DIFFICULTIES.map((d) => ({ label: d.replace("_", "-"), value: d }))]}
        value={difficulty}
        onValueChange={(v) => updateParam("difficulty", v || null)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Difficulties" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Difficulties</SelectItem>
          {DIFFICULTIES.map((d) => (
            <SelectItem key={d} value={d}>{d.replace("_", "-")}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(subjectId || topicId || difficulty) && (
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/admin/questions")}>
          Clear filters
        </Button>
      )}
    </div>
  );
}