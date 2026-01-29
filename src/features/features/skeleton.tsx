import { twx } from "@/lib/twx";

const SkeletonBox = twx.div`
  bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50
`;

const SkeletonIcon = twx.div`
  size-6 bg-linear-to-br from-emerald-200/50 to-emerald-300/50
  rounded-full shrink-0
`;

export function FeaturesSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <SkeletonBox className="h-8 w-44 rounded-2xl" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <SkeletonIcon />
            <SkeletonBox className="h-4 flex-1 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
