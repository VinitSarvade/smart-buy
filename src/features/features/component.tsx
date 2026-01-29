import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Features } from "./api";

export function FeaturesComponent({ features }: Features) {
  return (
    <>
      <CardHeader className="animate-[fadeIn_0.4s_ease] gap-2 pb-2">
        <CardTitle className="text-3xl font-semibold text-foreground">
          Key Features
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-500 text-white">
                <svg
                  className="size-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-base leading-relaxed text-foreground">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </>
  );
}
