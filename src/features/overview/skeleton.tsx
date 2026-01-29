export function OverviewSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50 rounded-2xl w-48" />
      <div className="space-y-3">
        <div className="h-4 bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50 rounded-full w-full" />
        <div className="h-4 bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50 rounded-full w-11/12" />
        <div className="h-4 bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50 rounded-full w-10/12" />
        <div className="h-4 bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50 rounded-full w-full" />
        <div className="h-4 bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50 rounded-full w-9/12" />
      </div>
    </div>
  );
}
