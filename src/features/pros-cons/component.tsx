import { CheckIcon, XIcon } from "@phosphor-icons/react/ssr";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { twx } from "@/lib/twx";

import type { ProsCons } from "./api";

const IconContainer = twx.span`
  flex size-9 items-center justify-center rounded-full text-white
`;

const ProsIconContainer = twx(IconContainer)`
  bg-linear-to-br from-emerald-400 to-emerald-500 shadow-emerald-500/20
`;

const ConsIconContainer = twx(IconContainer)`
  bg-linear-to-br from-rose-400 to-rose-500 shadow-rose-500/20
`;

const Section = twx.div`
  space-y-4 rounded-2xl border p-5
`;

const ProsSection = twx(Section)`
  border-emerald-200/50 bg-emerald-50/30 dark:border-emerald-500/40 dark:bg-emerald-500/5
`;

const ConsSection = twx(Section)`
  border-rose-200/60 bg-rose-50/30 dark:border-rose-500/40 dark:bg-rose-500/5
`;

const Heading = twx.h3`
  flex items-center gap-3 text-lg font-semibold
`;

const ProsHeading = twx(Heading)`
  text-emerald-600 dark:text-emerald-400
`;

const ConsHeading = twx(Heading)`
  text-rose-600 dark:text-rose-400
`;

const List = twx.ul`
  space-y-3 text-sm leading-relaxed
`;

const ProsListItem = twx.li`
  rounded-lg border-l-4 border-emerald-400/80 bg-emerald-100/30 px-4 py-2
  dark:border-emerald-500/70 dark:bg-emerald-500/10
  text-emerald-950/80 dark:text-emerald-50/90
`;

const ConsListItem = twx.li`
  rounded-lg border-l-4 border-rose-400/80 bg-rose-100/30 px-4 py-2
  dark:border-rose-500/70 dark:bg-rose-500/10
  text-rose-950/80 dark:text-rose-50/90
`;

export function ProsConsComponent({ pros, cons }: ProsCons) {
  return (
    <>
      <CardHeader className="animate-[fadeIn_0.45s_ease] gap-2 mb-6">
        <CardTitle className="text-3xl font-semibold text-foreground">
          Pros & Cons
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        <ProsSection>
          <ProsHeading>
            <ProsIconContainer>
              <CheckIcon className="size-5" weight="bold" />
            </ProsIconContainer>
            Advantages
          </ProsHeading>

          <List>
            {pros.map((pro) => (
              <ProsListItem key={pro}>{pro}</ProsListItem>
            ))}
          </List>
        </ProsSection>

        <ConsSection>
          <ConsHeading>
            <ConsIconContainer>
              <XIcon className="size-5" weight="bold" />
            </ConsIconContainer>
            Drawbacks
          </ConsHeading>

          <List>
            {cons.map((con) => (
              <ConsListItem key={con}>{con}</ConsListItem>
            ))}
          </List>
        </ConsSection>
      </CardContent>
    </>
  );
}
