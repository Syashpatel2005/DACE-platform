import Link from "next/link";

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

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border-default bg-surface-muted p-4 md:block">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}