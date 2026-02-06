import type { Reviews } from "./api";

export function SentimentBar({
  positive,
  neutral,
  negative,
}: Reviews["sentiment"]) {
  return (
    <div className="space-y-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
        {positive > 0 && (
          <div
            className="bg-emerald-400 dark:bg-emerald-500 transition-all"
            style={{ width: `${positive}%` }}
          />
        )}
        {neutral > 0 && (
          <div
            className="bg-muted-foreground/25 transition-all"
            style={{ width: `${neutral}%` }}
          />
        )}
        {negative > 0 && (
          <div
            className="bg-rose-400 dark:bg-rose-500 transition-all"
            style={{ width: `${negative}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-emerald-600 dark:text-emerald-400">
          {positive}% Positive
        </span>
        <span className="text-muted-foreground">{neutral}% Neutral</span>
        <span className="text-rose-500 dark:text-rose-400">
          {negative}% Negative
        </span>
      </div>
    </div>
  );
}
