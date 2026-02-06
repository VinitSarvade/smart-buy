import { SkeletonBox, SkeletonContainer } from "@/components/ui/skeleton";

export function ReviewsSkeleton() {
  return (
    <SkeletonContainer>
      <SkeletonBox className="h-8 w-48 rounded-2xl" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBox className="h-5 w-28" />
          <SkeletonBox className="h-7 w-10" />
        </div>
        <SkeletonBox className="h-5 w-24" />
      </div>
      <SkeletonBox className="h-4 w-full" />
      <SkeletonBox className="h-3 w-full rounded-full" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <SkeletonBox className="h-6 w-36" />
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          <SkeletonBox className="h-6 w-36" />
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}
