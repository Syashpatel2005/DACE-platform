import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <h1 className="text-3xl font-bold text-brand-navy">Dashboard</h1>
      <p className="text-slate-600">You are signed in.</p>
      <UserButton />
    </div>
  );
}