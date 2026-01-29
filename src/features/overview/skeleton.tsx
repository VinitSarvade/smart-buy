import { twx } from "@/lib/twx";

const SkeletonBox = twx.div`
  bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50
  rounded-full
`;

export function OverviewSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <SkeletonBox className="h-8 w-48 rounded-2xl" />
      <div className="space-y-3">
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-11/12" />
        <SkeletonBox className="h-4 w-10/12" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-9/12" />
      </div>
    </div>
  );
}
