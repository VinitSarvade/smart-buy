import { twx } from "@/lib/twx";

const SkeletonBox = twx.div`
  bg-linear-to-r from-primary/20 via-secondary/30 to-accent/20 rounded-full
`;

const SkeletonImage = twx.div`
  size-40 rounded-3xl border border-border
  bg-linear-to-br from-primary/15 via-secondary/25 to-accent/20
`;

export function BasicInfoSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1 space-y-4">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-12 w-3/4 rounded-2xl" />
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-10 w-32" />
            <SkeletonBox className="h-8 w-28" />
          </div>
        </div>
        <SkeletonImage />
      </div>
      <div className="space-y-2">
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-5/6" />
      </div>
    </div>
  );
}
