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
      <Card className="h-full border-border-default bg-surface transition-colors hover:border-brand-blue">
        <CardHeader className="flex flex-row items-center gap-3">
          <Icon className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary">{description}</p>
          {stat && (
            <p className="mt-3 text-sm font-semibold text-brand-blue">{stat}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}