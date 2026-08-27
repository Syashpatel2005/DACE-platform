"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false;
  const stored = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];
  return (
    stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only theme preference (cookie/matchMedia) after hydration is unavoidable here
    setIsDark(initial);
    document.documentElement.classList.toggle("dark", initial);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.cookie = `theme=${next ? "dark" : "light"}; path=/; max-age=31536000`;
  }

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
