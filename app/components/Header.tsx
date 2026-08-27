import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";
import MobileSidebar from "./MobileSidebar";

export default function Header() {
  return (
    <header className="border-b border-border-default bg-surface-muted">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <MobileSidebar />
          </div>
          <span className="text-xl font-bold text-text-primary">DAce</span>
          <span className="hidden text-sm text-text-secondary lg:inline">
            GATE DA AI Test Series
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium text-text-secondary sm:gap-6">
          <Link href="/dashboard" className="hidden hover:text-brand-blue sm:inline">
            Dashboard
          </Link>
          <a href="#" className="hidden hover:text-brand-blue sm:inline">
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