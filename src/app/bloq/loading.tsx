export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mx-auto h-10 w-32 animate-pulse rounded-lg bg-[var(--section)]" />
        <div className="mx-auto mt-4 h-4 w-64 animate-pulse rounded bg-[var(--section)]" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]"
          >
            <div className="h-48 bg-[var(--section)]" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-32 rounded bg-[var(--section)]" />
              <div className="h-5 w-full rounded bg-[var(--section)]" />
              <div className="h-4 w-3/4 rounded bg-[var(--section)]" />
              <div className="h-4 w-24 rounded bg-[var(--section)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}