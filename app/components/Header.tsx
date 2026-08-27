import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand-navy dark:text-white">DAce</span>
          <span className="hidden text-sm text-slate-500 sm:inline">
            GATE DA AI Test Series
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/dashboard" className="hover:text-brand-blue">
            Dashboard
          </Link>
          <a href="#" className="hover:text-brand-blue">
            Previous Papers
          </a>
          <Show when="signed-out">
            <Link href="/sign-in" className="hover:text-brand-blue">
              Sign In
            </Link>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}