"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MathText from "@/app/components/MathText";

type QuestionData = {
  id: string;
  questionText: string;
  questionType: "MCQ" | "MSQ" | "NAT";
  options: string[] | null;
  marks: number;
};

type TestQuestionData = {
  id: string;
  position: number;
  userAnswer: number | null;
  isMarkedReview: boolean;
  question: QuestionData;
};

export default function TestRunner({
  testId,
  initialStatus,
  questionCount,
}: {
  testId: string;
  initialStatus: string;
  durationMin: number;
  questionCount: number;
}) {
  const [currentPosition, setCurrentPosition] = useState(1);
  const [current, setCurrent] = useState<TestQuestionData | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [started, setStarted] = useState(initialStatus === "IN_PROGRESS");

  const questionStartTime = useRef<number>(0);

  const fetchQuestion = useCallback(
    async (position: number) => {
      setLoading(true);
      const res = await fetch(`/api/tests/${testId}/question/${position}`);
      const data = await res.json();
      if (data.success) {
        setCurrent(data.testQuestion);
        setSelectedOption(data.testQuestion.userAnswer);
      }
      setLoading(false);
      questionStartTime.current = Date.now();
    },
    [testId]
  );

  async function saveCurrentAnswer(answerOverride?: number | null) {
    if (!current) return;

    const timeSpentSec = Math.round((Date.now() - questionStartTime.current) / 1000);
    const answerToSave = answerOverride !== undefined ? answerOverride : selectedOption;

    setSaving(true);
    await fetch(`/api/tests/${testId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        position: current.position,
        answer: answerToSave,
        timeSpentSec,
      }),
    });
    setSaving(false);
  }

  async function goToPosition(position: number) {
    await saveCurrentAnswer();
    setCurrentPosition(position);
  }

  async function startTest() {
    setLoading(true);
    const res = await fetch(`/api/tests/${testId}/start`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setStarted(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (started) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- refetching question data when position/started changes is the correct pattern here
      fetchQuestion(currentPosition);
    }
  }, [started, currentPosition, fetchQuestion]);

  // Save on tab close / browser navigation away, best-effort
  useEffect(() => {
    function handleBeforeUnload() {
      if (current) {
        const timeSpentSec = Math.round((Date.now() - questionStartTime.current) / 1000);
        navigator.sendBeacon(
          `/api/tests/${testId}/answer`,
          new Blob(
            [JSON.stringify({ position: current.position, answer: selectedOption, timeSpentSec })],
            { type: "application/json" }
          )
        );
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [current, selectedOption, testId]);

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-text-secondary">Ready to begin?</p>
        <Button onClick={startTest} className="bg-brand-blue hover:bg-brand-navy">
          Start Test
        </Button>
      </div>
    );
  }

  if (loading || !current) {
    return <div className="p-6 text-text-secondary">Loading question...</div>;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>Question {current.position} of {questionCount}</span>
        <span className="flex items-center gap-3">
          {saving && <span className="text-xs italic">Saving...</span>}
          <span>{current.question.marks} mark{current.question.marks !== 1 ? "s" : ""}</span>
        </span>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="text-text-primary">
            <MathText text={current.question.questionText} />
          </div>

          {current.question.questionType === "MCQ" && current.question.options && (
            <div className="flex flex-col gap-3">
              {current.question.options.map((opt, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border-default p-3 hover:bg-surface-muted has-checked:border-brand-blue has-checked:bg-surface-muted"
                >
                  <input
                    type="radio"
                    name="option"
                    checked={selectedOption === i}
                    onChange={() => setSelectedOption(i)}
                    className="accent-brand-blue"
                  />
                  <span className="text-text-primary">
                    <MathText text={opt} />
                  </span>
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={currentPosition <= 1}
          onClick={() => goToPosition(currentPosition - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={currentPosition >= questionCount}
          onClick={() => goToPosition(currentPosition + 1)}
          className="bg-brand-blue hover:bg-brand-navy"
        >
          Save & Next
        </Button>
      </div>
    </div>
  );
}