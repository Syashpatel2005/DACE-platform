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
      <Card className="border-border-default bg-surface hover:border-brand-blue h-full transition-colors">
        <CardHeader className="flex flex-row items-center gap-3">
          <Icon className="text-brand-blue h-5 w-5" />
          <CardTitle className="text-text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary text-sm">{description}</p>
          {stat && <p className="text-brand-blue mt-3 text-sm font-semibold">{stat}</p>}
        </CardContent>
      </Card>
    </Link>
  );
}
