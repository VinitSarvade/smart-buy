"use client";

import { useState } from "react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { Overview } from "./api";

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

export function SpecificationsComponent({
  specifications,
}: {
  specifications: Overview["specifications"];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (specifications.length === 0) return null;

  return (
    <CardContent>
      <div className="space-y-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-muted/40 p-4 text-left transition-colors duration-300 hover:border-primary/60 hover:bg-muted/60"
        >
          <span className="text-lg font-semibold text-foreground">
            Detailed Specifications
          </span>
          <svg
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-300 ease-out",
              isExpanded && "rotate-180",
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          className={cn(
            "grid overflow-hidden rounded-2xl border border-border transition-all duration-300 ease-out",
            isExpanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x">
              {specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-start justify-between gap-4 px-4 py-3"
                >
                  <span className="whitespace-nowrap text-sm font-medium text-foreground">
                    {spec.label}
                  </span>
                  <span className="text-right font-mono text-sm text-muted-foreground">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
