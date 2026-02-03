"use client";

import { CaretDownIcon } from "@phosphor-icons/react/ssr";

import { CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  useCollapsible,
} from "@/components/ui/collapsible";
import { twx } from "@/lib/twx";
import { cn } from "@/lib/utils";

import type { Overview } from "./api";

const CollapsibleContainer = twx.div`
  rounded-2xl border border-border
`;

const SpecGrid = twx.div`
  grid divide-y divide-border md:grid-cols-2 md:divide-x
`;

const SpecItem = twx.div`
  flex items-start justify-between gap-4 px-4 py-3
`;

function SpecificationsTrigger() {
  const { isExpanded } = useCollapsible();
  return (
    <CollapsibleTrigger
      className="flex w-full items-center justify-between rounded-2xl border border-border bg-muted/40 p-4 text-left transition-colors duration-300 hover:border-primary/60 hover:bg-muted/60"
    >
      <span className="text-lg font-semibold text-foreground">
        Detailed Specifications
      </span>
      <CaretDownIcon
        className={cn(
          "size-5 text-muted-foreground transition-transform duration-300 ease-out",
          isExpanded && "rotate-180",
        )}
        weight="bold"
      />
    </CollapsibleTrigger>
  );
}

export function SpecificationsComponent({
  specifications,
}: {
  specifications: Overview["specifications"];
}) {
  const uniqueSpecs = specifications.reduce(
    (acc, spec) => {
      if (!acc.some((s) => s.label === spec.label)) {
        acc.push(spec);
      }
      return acc;
    },
    [] as Overview["specifications"],
  );

  if (uniqueSpecs.length === 0) return null;

  return (
    <CardContent>
      <Collapsible>
        <div className="space-y-4">
          <SpecificationsTrigger />

          <CollapsibleContent>
            <CollapsibleContainer>
              <SpecGrid>
                {uniqueSpecs.map((spec) => (
                  <SpecItem key={spec.label}>
                    <span className="whitespace-nowrap text-sm font-medium text-foreground">
                      {spec.label}
                    </span>
                    <span className="text-right font-mono text-sm text-muted-foreground">
                      {spec.value}
                    </span>
                  </SpecItem>
                ))}
              </SpecGrid>
            </CollapsibleContainer>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </CardContent>
  );
}
