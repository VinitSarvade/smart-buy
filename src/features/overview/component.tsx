import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OverviewComponent({ overview }: { overview: string }) {
  return (
    <>
      <CardHeader className="animate-[fadeIn_0.45s_ease] gap-4 pb-2">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
          Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <p className="text-lg leading-relaxed text-muted-foreground">
          {overview}
        </p>
      </CardContent>
    </>
  );
}

export { SpecificationsComponent } from "./overview-client";
