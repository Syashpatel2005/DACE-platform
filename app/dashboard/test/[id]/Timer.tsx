"use client";

import { useEffect, useState } from "react";

function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

export default function Timer({
  startedAt,
  durationMin,
  onExpire,
  onTick,
}: {
  startedAt: string;
  durationMin: number;
  onExpire: () => void;
  onTick?: (remainingSec: number) => void;
}) {
  const endTime = new Date(startedAt).getTime() + durationMin * 60 * 1000;
  const [remainingSec, setRemainingSec] = useState(() =>
    Math.max(0, Math.floor((endTime - Date.now()) / 1000))
  );
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setRemainingSec(remaining);
      onTick?.(remaining);

      if (remaining <= 0 && !hasExpired) {
        setHasExpired(true);
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, hasExpired, onExpire, onTick]);

  const isCritical = remainingSec <= 60;
  const isWarning = remainingSec <= 300 && remainingSec > 60;
  const isLowWarning = remainingSec <= 600 && remainingSec > 300;

  return (
    <div
      className={`rounded-md border px-4 py-2 text-center font-mono text-lg font-semibold transition-colors ${
        isCritical
          ? "animate-pulse border-destructive bg-destructive/10 text-destructive"
          : isWarning
            ? "border-orange-400 bg-orange-50 text-orange-600 dark:bg-orange-950"
            : isLowWarning
              ? "border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950"
              : "border-border-default bg-surface text-text-primary"
      }`}
    >
      {formatTime(remainingSec)}
    </div>
  );
}