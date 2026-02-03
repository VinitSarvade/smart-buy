import { CurrencyDollarIcon } from "@phosphor-icons/react/ssr";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { twx } from "@/lib/twx";

const Container = twx.div`
  space-y-4 rounded-2xl border border-dashed border-gray-300/50 bg-gray-50/30 p-6
  dark:border-gray-600/50 dark:bg-gray-800/30
`;

const Title = twx.h3`
  flex items-center gap-3 text-lg font-semibold text-gray-700 dark:text-gray-300
`;

const Icon = twx.span`
  flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-500/20
`;

const Content = twx.div`
  space-y-3 text-sm text-gray-600 dark:text-gray-400
`;

const Badge = twx.span`
  inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800
  dark:bg-blue-900/50 dark:text-blue-200
`;

export function PricingComparisonComponent() {
  return (
    <Container>
      <Title>
        <Icon>
          <CurrencyDollarIcon className="size-5" weight="bold" />
        </Icon>
        Pricing Comparison
        <Badge>Coming Soon</Badge>
      </Title>

      <Content>
        <p>
          Compare prices across multiple online retailers to find the best deals
          available.
        </p>
      </Content>
    </Container>
  );
}
