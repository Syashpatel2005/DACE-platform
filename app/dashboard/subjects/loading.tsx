export default function SubjectsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-8 w-40 animate-pulse rounded bg-border-default" />
      <div className="rounded-lg border border-border-default bg-surface p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="mb-2 h-12 animate-pulse rounded bg-border-default"
          />
        ))}
      </div>
    </div>
  );
}