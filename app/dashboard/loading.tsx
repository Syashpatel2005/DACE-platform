function CardSkeleton() {
  return (
    <div className="border-border-default bg-surface h-full animate-pulse rounded-lg border p-6">
      <div className="flex items-center gap-3">
        <div className="bg-border-default h-5 w-5 rounded" />
        <div className="bg-border-default h-4 w-32 rounded" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="bg-border-default h-3 w-full rounded" />
        <div className="bg-border-default h-3 w-3/4 rounded" />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-border-default h-8 w-48 animate-pulse rounded" />
      <div className="border-border-default bg-surface h-24 animate-pulse rounded-lg border" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
