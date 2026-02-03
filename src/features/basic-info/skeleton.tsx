import { SkeletonBox, SkeletonContainer } from "@/components/ui/skeleton";

export function BasicInfoSkeleton() {
  return (
    <SkeletonContainer>
      <div className="space-y-6">
        <div className="flex-1 space-y-4">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-12 w-3/4 rounded-2xl" />
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-10 w-32" />
            <SkeletonBox className="h-8 w-28" />
          </div>
        </div>
        <div className="space-y-2">
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-4 w-5/6" />
        </div>
      </div>
    </SkeletonContainer>
  );
}
