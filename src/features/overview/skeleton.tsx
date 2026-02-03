import { SkeletonBox, SkeletonContainer } from "@/components/ui/skeleton";

export function OverviewSkeleton() {
  return (
    <SkeletonContainer>
      <SkeletonBox className="h-8 w-48 rounded-2xl" />
      <div className="space-y-3">
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-11/12" />
        <SkeletonBox className="h-4 w-10/12" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-9/12" />
      </div>
    </SkeletonContainer>
  );
}
