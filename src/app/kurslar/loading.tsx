export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-[var(--section)]" />
        <div className="mx-auto mt-4 h-4 w-48 animate-pulse rounded bg-[var(--section)]" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-2xl border border-[var(--card-border)] bg-[var(--card)]"
          />
        ))}
      </div>
    </div>
  );
}