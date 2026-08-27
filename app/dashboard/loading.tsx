function CardSkeleton() {
  return (
    <div className="h-full animate-pulse rounded-lg border border-border-default bg-surface p-6">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded bg-border-default" />
        <div className="h-4 w-32 rounded bg-border-default" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-border-default" />
        <div className="h-3 w-3/4 rounded bg-border-default" />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-8 w-48 animate-pulse rounded bg-border-default" />
      <div className="h-24 animate-pulse rounded-lg border border-border-default bg-surface" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}