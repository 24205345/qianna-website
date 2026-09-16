export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-700 md:px-10">
      <div className="mx-auto max-w-5xl animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-5">
          <div className="h-8 w-44 rounded-lg bg-stone-200/80" />
          <div className="h-9 w-28 rounded-lg bg-stone-200/80" />
        </div>

        {/* Filters / Sub-nav Skeleton */}
        <div className="mt-8 flex gap-2">
          <div className="h-7 w-20 rounded-md bg-stone-200/60" />
          <div className="h-7 w-24 rounded-md bg-stone-200/60" />
          <div className="h-7 w-20 rounded-md bg-stone-200/60" />
        </div>

        {/* Table / Card Container Skeleton */}
        <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-white">
          <div className="border-b border-stone-100 bg-stone-50/70 px-4 py-3">
            <div className="flex gap-4">
              <div className="h-4 w-1/4 rounded bg-stone-200/70" />
              <div className="h-4 w-1/4 rounded bg-stone-200/70" />
              <div className="h-4 w-1/4 rounded bg-stone-200/70" />
              <div className="h-4 w-1/4 rounded bg-stone-200/70" />
            </div>
          </div>
          <div className="divide-y divide-stone-100 px-4 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3 w-1/3">
                  <div className="h-4 w-full rounded bg-stone-200/50" />
                </div>
                <div className="h-4 w-24 rounded bg-stone-200/40" />
                <div className="h-4 w-16 rounded bg-stone-200/40" />
                <div className="h-4 w-20 rounded bg-stone-200/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
