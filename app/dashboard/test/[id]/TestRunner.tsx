"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MathText from "@/app/components/MathText";
import Timer from "./Timer";
import QuestionPalette from "./QuestionPalette";
import SubmitConfirmDialog from "./SubmitConfirmDialog";

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

type PaletteItem = {
  position: number;
  isAnswered: boolean;
  isVisited: boolean;
  isMarkedReview: boolean;
};

function formatRemaining(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TestRunner({
  testId,
  initialStatus,
  questionCount,
  durationMin,
  startedAt: initialStartedAt,
}: {
  testId: string;
  initialStatus: string;
  durationMin: number;
  questionCount: number;
  startedAt: string | null;
}) {
  const router = useRouter();

  const [currentPosition, setCurrentPosition] = useState(1);
  const [current, setCurrent] = useState<TestQuestionData | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [started, setStarted] = useState(
    initialStatus === "IN_PROGRESS" && initialStartedAt !== null
  );
  const [startedAt, setStartedAt] = useState<string | null>(initialStartedAt);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [palette, setPalette] = useState<PaletteItem[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [timeRemainingSec, setTimeRemainingSec] = useState(0);

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

  const fetchPalette = useCallback(async () => {
    const res = await fetch(`/api/tests/${testId}/palette`);
    const data = await res.json();
    if (data.success) {
      setPalette(data.palette);
    }
  }, [testId]);

  async function saveCurrentAnswer(
    answerOverride?: number | null,
    markedOverride?: boolean
  ) {
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
        ...(markedOverride !== undefined ? { isMarkedReview: markedOverride } : {}),
      }),
    });
    setSaving(false);
    fetchPalette();
  }

  async function goToPosition(position: number) {
    await saveCurrentAnswer();
    setCurrentPosition(position);
  }

  async function clearResponse() {
    setSelectedOption(null);
    await saveCurrentAnswer(null);
  }

  async function toggleMarkForReview() {
    const newMarked = !current?.isMarkedReview;
    if (current) {
      setCurrent({ ...current, isMarkedReview: newMarked });
    }
    await saveCurrentAnswer(undefined, newMarked);
  }

  async function markAndNext() {
    await saveCurrentAnswer(undefined, true);
    if (current) setCurrent({ ...current, isMarkedReview: true });
    if (currentPosition < questionCount) {
      setCurrentPosition(currentPosition + 1);
    }
  }

  function goToNextMarked() {
    const marked = palette.filter((p) => p.isMarkedReview);
    const next = marked.find((p) => p.position > currentPosition);
    const target = next ?? marked[0];
    if (target) {
      goToPosition(target.position);
    }
  }

  async function startTest() {
    setLoading(true);
    const res = await fetch(`/api/tests/${testId}/start`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setStarted(true);
      setStartedAt(data.test.startedAt);
    }
    setLoading(false);
  }

  async function submitTest() {
    if (submitting) return;

    await saveCurrentAnswer();

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/tests/${testId}/submit`, { method: "POST" });
      const data = await res.json();

      if (data.success) {
        router.push(`/dashboard/test/${testId}/result`);
      } else {
        setSubmitting(false);
        setSubmitError(data.error ?? "Failed to submit. Your answers are saved — please try again.");
      }
    } catch {
      setSubmitting(false);
      setSubmitError("Network error while submitting. Your answers are saved — please try again.");
    }
  }

  function handleExpire() {
    submitTest();
  }

  useEffect(() => {
    if (started) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- refetching question data when position/started changes is the correct pattern here
      fetchQuestion(currentPosition).then(() => fetchPalette());
    }
  }, [started, currentPosition, fetchQuestion, fetchPalette]);

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

  return (
    <div className="flex flex-col gap-6 p-6 lg:flex-row">
      <aside className="w-full shrink-0 rounded-lg border border-border-default bg-surface p-4 lg:w-64">
        {startedAt && (
          <div className="mb-4">
            <Timer
              startedAt={startedAt}
              durationMin={durationMin}
              onExpire={handleExpire}
              onTick={setTimeRemainingSec}
            />
          </div>
        )}
        <QuestionPalette
          palette={palette}
          currentPosition={currentPosition}
          onNavigate={(pos) => goToPosition(pos)}
        />
        {palette.some((p) => p.isMarkedReview) && (
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMarked}
            className="mt-4 w-full"
          >
            Next Marked Question
          </Button>
        )}
      </aside>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        {submitError && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-medium">{submitError}</p>
            <Button
              size="sm"
              onClick={submitTest}
              className="mt-2 bg-destructive text-white hover:bg-destructive/90"
            >
              Retry Submit
            </Button>
          </div>
        )}

        {loading || !current ? (
          <div className="flex min-h-[300px] items-center justify-center text-text-secondary">
            Loading question...
          </div>
        ) : (
          <>
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

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                variant="outline"
                disabled={currentPosition <= 1}
                onClick={() => goToPosition(currentPosition - 1)}
              >
                Previous
              </Button>

              <Button
                variant="ghost"
                disabled={selectedOption === null}
                onClick={clearResponse}
                className="text-text-secondary hover:text-destructive"
              >
                Clear Response
              </Button>

              <Button variant="outline" onClick={toggleMarkForReview}>
                {current.isMarkedReview ? "Unmark Review" : "Mark for Review"}
              </Button>

              <Button
                variant="outline"
                onClick={markAndNext}
                disabled={currentPosition >= questionCount}
              >
                Mark & Next
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(true)}
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                Submit Test
              </Button>

              {currentPosition < questionCount && (
                <Button
                  onClick={() => goToPosition(currentPosition + 1)}
                  className="bg-brand-blue hover:bg-brand-navy"
                >
                  Save & Next
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <SubmitConfirmDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        palette={palette}
        timeRemainingLabel={formatRemaining(timeRemainingSec)}
        onConfirm={submitTest}
        submitting={submitting}
      />
    </div>
  );
}