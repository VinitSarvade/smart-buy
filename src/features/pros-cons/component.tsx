import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ProsCons } from "./api";

export function ProsConsComponent({ pros, cons }: ProsCons) {
  return (
    <>
      <CardHeader className="animate-[fadeIn_0.45s_ease] gap-2">
        <CardTitle className="text-3xl font-semibold text-foreground">
          Pros & Cons
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-emerald-200/50 bg-emerald-50/30 p-5 dark:border-emerald-500/40 dark:bg-emerald-500/5">
          <h3 className="flex items-center gap-3 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-500/20">
              <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                />
              </svg>
            </span>
            Advantages
          </h3>

          <ul className="space-y-3 text-sm leading-relaxed text-emerald-950/80 dark:text-emerald-50/90">
            {pros.map((pro) => (
              <li
                key={pro}
                className="rounded-lg border-l-4 border-emerald-400/80 bg-emerald-100/30 px-4 py-2 dark:border-emerald-500/70 dark:bg-emerald-500/10"
              >
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 rounded-2xl border border-rose-200/60 bg-rose-50/30 p-5 dark:border-rose-500/40 dark:bg-rose-500/5">
          <h3 className="flex items-center gap-3 text-lg font-semibold text-rose-600 dark:text-rose-400">
            <span className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-rose-500 text-white shadow-rose-500/20">
              <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                />
              </svg>
            </span>
            Drawbacks
          </h3>

          <ul className="space-y-3 text-sm leading-relaxed text-rose-950/80 dark:text-rose-50/90">
            {cons.map((con) => (
              <li
                key={con}
                className="rounded-lg border-l-4 border-rose-400/80 bg-rose-100/30 px-4 py-2 dark:border-rose-500/70 dark:bg-rose-500/10"
              >
                {con}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </>
  );
}
