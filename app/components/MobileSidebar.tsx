"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Test Generator", href: "/dashboard/ai-test-generator" },
  { label: "Full Mock Tests", href: "/dashboard/mock-tests" },
  { label: "Subjects", href: "/dashboard/subjects" },
  { label: "Previous-Year Papers", href: "/dashboard/previous-papers" },
  { label: "My Tests", href: "/dashboard/my-tests" },
  { label: "Wrong Questions", href: "/dashboard/wrong-questions" },
  { label: "Skipped Questions", href: "/dashboard/skipped-questions" },
  { label: "Bookmarks", href: "/dashboard/bookmarks" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Profile", href: "/dashboard/profile" },
];

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Open menu"
          className="text-text-secondary hover:bg-surface hover:text-text-primary inline-flex h-9 w-9 items-center justify-center rounded-md"
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="bg-surface-muted">
          <SheetTitle className="text-text-primary px-4 pt-4">Menu</SheetTitle>
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-text-secondary hover:bg-surface hover:text-text-primary rounded-md px-3 py-2 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
