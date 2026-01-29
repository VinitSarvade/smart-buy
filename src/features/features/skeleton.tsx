export function FeaturesSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50 rounded-2xl w-44" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="size-6 bg-linear-to-br from-emerald-200/50 to-emerald-300/50 rounded-full shrink-0" />
            <div className="h-4 bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50 rounded-full flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
