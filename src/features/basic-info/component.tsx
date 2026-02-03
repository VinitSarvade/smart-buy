import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { BasicInfo } from "./api";

export function BasicInfoComponent({
  name,
  price,
  category,
  summary,
  brand,
}: BasicInfo) {
  return (
    <>
      <CardHeader className="animate-[fadeIn_0.5s_ease-in] gap-6 pb-0">
        <div className="flex flex-1 flex-col gap-4">
          {brand && (
            <Badge variant="secondary" className="tracking-[0.3em]">
              {brand}
            </Badge>
          )}
          <CardTitle className="text-balance text-4xl font-semibold leading-tight text-foreground md:text-5xl capitalize">
            {name}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-4xl font-semibold text-primary md:text-5xl">
              {price}
            </span>
            {category && (
              <Badge
                variant="outline"
                className="rounded-full border-border bg-background/70 px-4 py-1.5 tracking-normal"
              >
                {category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="animate-[fadeIn_0.5s_ease-in] space-y-4 pt-6">
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          {summary}
        </p>
      </CardContent>
    </>
  );
}
