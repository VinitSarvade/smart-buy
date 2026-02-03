import { SkeletonBox, SkeletonContainer } from "@/components/ui/skeleton";
import { twx } from "@/lib/twx";

const SkeletonIcon = twx.div`
  size-6 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0
`;

export function FeaturesSkeleton() {
  return (
    <SkeletonContainer>
      <SkeletonBox className="h-8 w-44 rounded-2xl" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <SkeletonIcon />
            <SkeletonBox className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
}
