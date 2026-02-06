import { StarIcon } from "@phosphor-icons/react/ssr";

import { cn } from "@/lib/utils";

export function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const displayStars = hasHalf ? fullStars + 1 : fullStars;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "size-5",
            i < displayStars ? "text-primary" : "text-muted-foreground/20",
          )}
          weight={i < displayStars ? "fill" : "regular"}
        />
      ))}
    </div>
  );
}
