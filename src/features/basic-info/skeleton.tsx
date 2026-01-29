export function BasicInfoSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="h-4 w-24 rounded-full bg-linear-to-r from-primary/20 via-secondary/30 to-accent/20" />
          <div className="h-12 w-3/4 rounded-2xl bg-linear-to-r from-primary/20 via-secondary/30 to-accent/20" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 rounded-full bg-linear-to-r from-primary/20 via-secondary/30 to-accent/20" />
            <div className="h-8 w-28 rounded-full bg-linear-to-r from-primary/20 via-secondary/30 to-accent/20" />
          </div>
        </div>
        <div className="size-40 rounded-3xl border border-border bg-linear-to-br from-primary/15 via-secondary/25 to-accent/20" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded-full bg-linear-to-r from-primary/20 via-secondary/30 to-accent/20" />
        <div className="h-4 w-5/6 rounded-full bg-linear-to-r from-primary/20 via-secondary/30 to-accent/20" />
      </div>
    </div>
  );
}
