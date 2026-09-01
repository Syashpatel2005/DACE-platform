"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ResultData = {
  score: number;
  maxMarks: number;
  percentage: number;
  accuracy: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  totalQuestions: number;
  durationUsedSec: number;
  avgTimePerQuestionSec: number;
};

function formatDuration(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes}m ${seconds}s`;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border-default bg-surface p-4 text-center">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="mt-1 text-xl font-bold text-text-primary">{value}</p>
    </div>
  );
}

export default function ResultView({ testId }: { testId: string }) {
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/tests/${testId}/result`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResult(data.result);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [testId]);

  if (loading) {
    return <div className="p-6 text-text-secondary">Loading result...</div>;
  }

  if (error || !result) {
    return <div className="p-6 text-destructive">Failed to load result.</div>;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="text-center">
        <p className="text-sm text-text-secondary">Your Score</p>
        <p className="text-5xl font-bold text-brand-blue">
          {result.score} <span className="text-2xl text-text-secondary">/ {result.maxMarks}</span>
        </p>
        <p className="mt-2 text-lg text-text-primary">{result.percentage}%</p>
      </div>

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-4">
          <StatCard label="Accuracy" value={`${Math.round(result.accuracy * 100)}%`} />
          <StatCard label="Attempted" value={result.attempted} />
          <StatCard label="Correct" value={result.correct} />
          <StatCard label="Incorrect" value={result.incorrect} />
          <StatCard label="Skipped" value={result.skipped} />
          <StatCard label="Total Questions" value={result.totalQuestions} />
          <StatCard label="Time Used" value={formatDuration(result.durationUsedSec)} />
          <StatCard label="Avg Time/Question" value={formatDuration(result.avgTimePerQuestionSec)} />
        </CardContent>
      </Card>

      <div className="flex justify-center gap-3">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        <Button className="bg-brand-blue hover:bg-brand-navy" disabled>
          Analyze Performance (Day 91+)
        </Button>
      </div>
    </div>
  );
}