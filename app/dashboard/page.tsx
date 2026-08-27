import { UserButton } from "@clerk/nextjs";
import {
  Sparkles,
  FileText,
  Archive,
  BarChart3,
  Target,
  XCircle,
  SkipForward,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardCard from "../components/DashboardCard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
        <p className="text-text-secondary">Here&apos;s where you left off.</p>
        </div>
        <UserButton />
      </div>

    <div className="flex flex-col gap-3 rounded-lg border border-border-default bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
    <div>
        <h2 className="text-lg font-semibold text-text-primary">
        Ready for today&apos;s practice?
        </h2>
        <p className="text-sm text-text-secondary">
        Jump into a full mock test or generate a custom one.
        </p>
    </div>
        <div className="flex gap-3">
          <Button className="bg-brand-blue hover:bg-brand-navy">
            Start GATE DA Test
          </Button>
          <Button variant="outline">Generate Custom Test</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Today's Practice"
          description="A quick 15-question practice session picked for you."
          href="/dashboard/ai-test-generator"
          icon={Target}
          stat="Not started today"
        />
        <DashboardCard
          title="Full Mock Test"
          description="Simulate the complete 180-minute GATE DA exam."
          href="/dashboard/mock-tests"
          icon={FileText}
        />
        <DashboardCard
          title="AI Test Generator"
          description="Build a custom test by subject, difficulty, and type."
          href="/dashboard/ai-test-generator"
          icon={Sparkles}
        />
        <DashboardCard
          title="Previous-Year Papers"
          description="Official GATE DA papers organized by year."
          href="/dashboard/previous-papers"
          icon={Archive}
        />
        <DashboardCard
          title="My Performance"
          description="Track your scores, accuracy, and trends over time."
          href="/dashboard/analytics"
          icon={BarChart3}
          stat="No tests yet"
        />
        <DashboardCard
          title="Weak Topics"
          description="Topics where your accuracy needs the most work."
          href="/dashboard/analytics"
          icon={Target}
        />
        <DashboardCard
          title="Wrong Questions"
          description="Review and retry questions you got wrong."
          href="/dashboard/wrong-questions"
          icon={XCircle}
          stat="0 to review"
        />
        <DashboardCard
          title="Skipped Questions"
          description="Practice the questions you skipped last time."
          href="/dashboard/skipped-questions"
          icon={SkipForward}
          stat="0 to review"
        />
        <DashboardCard
          title="Test History"
          description="See every test you've taken, and reopen any result."
          href="/dashboard/my-tests"
          icon={History}
        />
      </div>
    </div>
  );
}