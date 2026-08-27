import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1>
      <p className="text-slate-600">You are signed in.</p>
      <UserButton />
    </div>
  );
}