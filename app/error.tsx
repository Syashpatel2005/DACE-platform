"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-text-primary">
        Something went wrong
      </h1>
      <p className="max-w-md text-text-secondary">
        We hit an unexpected error. This has been logged — try again, or head
        back to the dashboard.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()} className="bg-brand-blue hover:bg-brand-navy">
          Try Again
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}