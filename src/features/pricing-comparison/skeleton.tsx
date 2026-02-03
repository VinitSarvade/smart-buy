import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { twx } from "@/lib/twx";

const Container = twx.div`
  space-y-4 rounded-2xl border border-dashed border-gray-300/50 bg-gray-50/30 p-6
  dark:border-gray-600/50 dark:bg-gray-800/30
`;

const TitleSkeleton = twx.div`
  flex items-center gap-3
`;

const IconSkeleton = twx.div`
  size-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse
`;

const TextSkeleton = twx.div`
  h-6 w-32 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse
`;

const ContentSkeleton = twx.div`
  space-y-3
`;

const LineSkeleton = twx.div`
  h-4 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse
`;

const ShortLineSkeleton = twx.div`
  h-4 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse
`;

export function PricingComparisonSkeleton() {
  return (
    <Container>
      <TitleSkeleton>
        <IconSkeleton />
        <TextSkeleton />
      </TitleSkeleton>
      
      <ContentSkeleton>
        <LineSkeleton />
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <LineSkeleton />
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <ShortLineSkeleton />
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <LineSkeleton />
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <ShortLineSkeleton />
          </div>
        </div>
      </ContentSkeleton>
    </Container>
  );
}
