import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
