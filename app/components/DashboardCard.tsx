import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  stat?: string;
};

export default function DashboardCard({
  title,
  description,
  href,
  icon: Icon,
  stat,
}: DashboardCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full transition-colors hover:border-brand-blue dark:border-slate-700 dark:bg-slate-800">
        <CardHeader className="flex flex-row items-center gap-3">
          <Icon className="h-5 w-5 text-brand-blue dark:text-blue-400" />
          <CardTitle className="text-brand-navy dark:text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
          {stat && (
            <p className="mt-3 text-sm font-semibold text-brand-blue dark:text-blue-400">{stat}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}