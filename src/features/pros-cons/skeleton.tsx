import { twx } from "@/lib/twx";

const SkeletonBox = twx.div`
  bg-linear-to-r from-violet-200/50 via-violet-300/50 to-violet-200/50
  rounded-full
`;

const ProsHeading = twx.div`
  h-6 bg-linear-to-r from-emerald-200/50 to-emerald-300/50 rounded-full w-24
`;

const ConsHeading = twx.div`
  h-6 bg-linear-to-r from-rose-200/50 to-rose-300/50 rounded-full w-24
`;

export function ProsConsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <SkeletonBox className="h-8 w-40 rounded-2xl" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <ProsHeading />
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          <ConsHeading />
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
