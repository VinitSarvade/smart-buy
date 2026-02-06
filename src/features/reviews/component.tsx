import { CheckIcon, WarningIcon } from "@phosphor-icons/react/ssr";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { twx } from "@/lib/twx";

import type { Reviews } from "./api";
import { SentimentBar } from "./sentiment-bar";
import { StarRating } from "./star-rating";

const IconContainer = twx.span`
  flex size-9 items-center justify-center rounded-full text-white
`;

const HighlightsIconContainer = twx(IconContainer)`
  bg-linear-to-br from-emerald-400 to-emerald-500 shadow-emerald-500/20
`;

const ConcernsIconContainer = twx(IconContainer)`
  bg-linear-to-br from-rose-400 to-rose-500 shadow-rose-500/20
`;

const Section = twx.div`
  space-y-4 rounded-2xl border p-5
`;

const HighlightsSection = twx(Section)`
  border-emerald-200/50 bg-emerald-50/30 dark:border-emerald-500/40 dark:bg-emerald-500/5
`;

const ConcernsSection = twx(Section)`
  border-rose-200/60 bg-rose-50/30 dark:border-rose-500/40 dark:bg-rose-500/5
`;

const Heading = twx.h3`
  flex items-center gap-3 text-lg font-semibold
`;

const HighlightsHeading = twx(Heading)`
  text-emerald-600 dark:text-emerald-400
`;

const ConcernsHeading = twx(Heading)`
  text-rose-600 dark:text-rose-400
`;

const List = twx.ul`
  space-y-3 text-sm leading-relaxed
`;

const HighlightsListItem = twx.li`
  rounded-lg border-l-4 border-emerald-400/80 bg-emerald-100/30 px-4 py-2
  dark:border-emerald-500/70 dark:bg-emerald-500/10
  text-emerald-950/80 dark:text-emerald-50/90
`;

const ConcernsListItem = twx.li`
  rounded-lg border-l-4 border-rose-400/80 bg-rose-100/30 px-4 py-2
  dark:border-rose-500/70 dark:bg-rose-500/10
  text-rose-950/80 dark:text-rose-50/90
`;

export function ReviewsComponent({
  sentiment,
  rating,
  totalReviews,
  verdict,
  highlights,
  concerns,
}: Reviews) {
  return (
    <>
      <CardHeader className="animate-[fadeIn_0.45s_ease] gap-2 mb-6">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
          Reviews Analysis
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <StarRating rating={rating} />
          <span className="text-2xl font-semibold text-foreground">
            {rating.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">
            {totalReviews} reviews
          </span>
        </div>

        <p className="text-base leading-relaxed text-muted-foreground">
          {verdict}
        </p>

        <SentimentBar {...sentiment} />

        {(highlights.length > 0 || concerns.length > 0) && (
          <div className="grid gap-6 md:grid-cols-2">
            {highlights.length > 0 && (
              <HighlightsSection>
                <HighlightsHeading>
                  <HighlightsIconContainer>
                    <CheckIcon className="size-5" weight="bold" />
                  </HighlightsIconContainer>
                  What People Love
                </HighlightsHeading>

                <List>
                  {highlights.map((highlight) => (
                    <HighlightsListItem key={highlight}>
                      {highlight}
                    </HighlightsListItem>
                  ))}
                </List>
              </HighlightsSection>
            )}

            {concerns.length > 0 && (
              <ConcernsSection>
                <ConcernsHeading>
                  <ConcernsIconContainer>
                    <WarningIcon className="size-5" weight="fill" />
                  </ConcernsIconContainer>
                  Common Concerns
                </ConcernsHeading>

                <List>
                  {concerns.map((concern) => (
                    <ConcernsListItem key={concern}>{concern}</ConcernsListItem>
                  ))}
                </List>
              </ConcernsSection>
            )}
          </div>
        )}
      </CardContent>
    </>
  );
}
