import { CheckIcon } from "@phosphor-icons/react/ssr";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { twx } from "@/lib/twx";

import type { Features } from "./api";

const IconContainer = twx.div`
  flex size-5 shrink-0 items-center justify-center rounded-full
  bg-linear-to-br from-emerald-400 to-emerald-500 text-white mt-0.5
`;

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
              <IconContainer>
                <CheckIcon className="size-3" weight="bold" />
              </IconContainer>
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
