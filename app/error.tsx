"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-text-primary text-2xl font-bold">Something went wrong</h1>
      <p className="text-text-secondary max-w-md">
        We hit an unexpected error. This has been logged — try again, or head back to the dashboard.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()} className="bg-brand-blue hover:bg-brand-navy">
          Try Again
        </Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
