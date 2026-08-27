"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PingTester() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePing() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ping", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResult(`Saved! ID: ${data.ping.id}`);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch {
      setResult("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <Button onClick={handlePing} disabled={loading} variant="secondary">
        {loading ? "Saving..." : "Test Database Write"}
      </Button>
      {result && <p className="text-sm text-slate-600">{result}</p>}
    </div>
  );
}
