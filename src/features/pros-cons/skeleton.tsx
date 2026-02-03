import { SkeletonBox, SkeletonContainer } from "@/components/ui/skeleton";

export function ProsConsSkeleton() {
  return (
    <SkeletonContainer>
      <SkeletonBox className="h-8 w-40 rounded-2xl" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <SkeletonBox className="h-6 w-24" />
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          <SkeletonBox className="h-6 w-24" />
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </SkeletonContainer>
  );
}
