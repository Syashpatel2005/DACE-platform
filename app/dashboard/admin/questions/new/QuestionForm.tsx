"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Subject = { id: string; name: string };
type Topic = { id: string; name: string; subjectId: string };

const DIFFICULTIES = ["EASY", "MEDIUM", "MEDIUM_HARD", "HARD", "VERY_HARD"];

export default function QuestionForm({
  subjects,
  topics,
}: {
  subjects: Subject[];
  topics: Topic[];
}) {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [difficulty, setDifficulty] = useState("");
  const [marks, setMarks] = useState<string>("1");
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const filteredTopics = topics.filter((t) => t.subjectId === subjectId);

  function updateOption(index: number, value: string) {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  }

  function resetForm() {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setExplanation("");
    // Deliberately keep subjectId, topicId, difficulty, marks — you'll likely
    // enter several questions in a row for the same subject/topic/difficulty
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText,
          questionType: "MCQ",
          subjectId,
          topicId,
          difficulty,
          marks: Number(marks),
          options,
          correctAnswer: Number(correctAnswer),
          explanation,
          sourceType: "MANUAL",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback({
          type: "error",
          message: data.errors ? data.errors.join(", ") : data.error,
        });
        return;
      }

      setFeedback({ type: "success", message: "Question saved successfully." });
      resetForm();
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "Network error — please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="subject">Subject</Label>
            <Select
            items={subjects.map((s) => ({ label: s.name, value: s.id }))}
            value={subjectId}
            onValueChange={(v) => { setSubjectId(v ?? ""); setTopicId(""); }}
            >
            <SelectTrigger id="subject">
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
          <Label htmlFor="topic">Topic</Label>
            <Select
            items={filteredTopics.map((t) => ({ label: t.name, value: t.id }))}
            value={topicId}
            onValueChange={(v) => setTopicId(v ?? "")}
            disabled={!subjectId}
            >
            <SelectTrigger id="topic">
                <SelectValue placeholder={subjectId ? "Select topic" : "Select subject first"} />
            </SelectTrigger>
            <SelectContent>
                {filteredTopics.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
            <Select
            items={DIFFICULTIES.map((d) => ({ label: d.replace("_", "-"), value: d }))}
            value={difficulty}
            onValueChange={(v) => setDifficulty(v ?? "")}
            >
            <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
                {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>{d.replace("_", "-")}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        <div>
          <Label htmlFor="marks">Marks</Label>
            <Select
            items={[{ label: "1 mark", value: "1" }, { label: "2 marks", value: "2" }]}
            value={marks}
            onValueChange={(v) => setMarks(v ?? "1")}
            >
            <SelectTrigger id="marks">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="1">1 mark</SelectItem>
                <SelectItem value="2">2 marks</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="questionText">Question Text</Label>
        <Textarea
          id="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={3}
          placeholder="Enter the question text..."
        />
      </div>

      <div>
        <Label>Options (select the correct one)</Label>
        <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer} className="mt-2 flex flex-col gap-3">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <RadioGroupItem value={String(i)} id={`option-${i}`} />
              <Input
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-1"
              />
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="explanation">Explanation</Label>
        <Textarea
          id="explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={3}
          placeholder="Explain why the correct answer is correct..."
        />
      </div>

      {feedback && (
        <p className={feedback.type === "success" ? "text-sm text-green-600" : "text-sm text-red-600"}>
          {feedback.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-fit bg-brand-blue hover:bg-brand-navy"
      >
        {submitting ? "Saving..." : "Save Question"}
      </Button>
    </form>
  );
}