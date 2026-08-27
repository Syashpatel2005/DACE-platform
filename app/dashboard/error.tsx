"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error boundary caught:", error);
  }, [error]);

  return (
    <div className="border-border-default bg-surface flex flex-col items-center justify-center gap-4 rounded-lg border p-12 text-center">
      <h2 className="text-text-primary text-xl font-bold">This section failed to load</h2>
      <p className="text-text-secondary max-w-md">
        Something went wrong loading this page. Try again.
      </p>
      <Button onClick={() => reset()} className="bg-brand-blue hover:bg-brand-navy">
        Try Again
      </Button>
    </div>
  );
}
