import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { BasicInfo } from "./api";

export function BasicInfoComponent({
  name,
  price,
  category,
  summary,
  brand,
  imageUrl,
}: BasicInfo) {
  return (
    <>
      <CardHeader className="animate-[fadeIn_0.5s_ease-in] gap-6 pb-0">
        <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row">
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
          {imageUrl && (
            <div className="flex size-40 items-center justify-center rounded-3xl border border-border bg-linear-to-br from-primary/15 via-secondary/40 to-accent/10">
              <svg
                className="size-16 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
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
