import type { BasicInfo } from "@/features/basic-info/api";
import { BasicInfoComponent } from "@/features/basic-info/component";
import { BasicInfoSkeleton } from "@/features/basic-info/skeleton";
import type { Features } from "@/features/features/api";
import { FeaturesComponent } from "@/features/features/component";
import { FeaturesSkeleton } from "@/features/features/skeleton";
import type { Overview } from "@/features/overview/api";
import {
  OverviewComponent,
  SpecificationsComponent,
} from "@/features/overview/component";
import { OverviewSkeleton } from "@/features/overview/skeleton";
import { PricingComparisonComponent } from "@/features/pricing-comparison/component";
import type { ProsCons } from "@/features/pros-cons/api";
import { ProsConsComponent } from "@/features/pros-cons/component";
import { ProsConsSkeleton } from "@/features/pros-cons/skeleton";
import type { Reviews } from "@/features/reviews/api";
import { ReviewsComponent } from "@/features/reviews/component";
import { ReviewsSkeleton } from "@/features/reviews/skeleton";

import { AgentContent } from "./agent-content";
import {
  MainGridColumn,
  ProductDivider,
  ProductGrid,
  ProductSection,
  SideGridColumn,
} from "./layout-section";

type AgentData = {
  "basic-info"?: BasicInfo;
  overview?: Overview;
  features?: Features;
  "pros-cons"?: ProsCons;
  reviews?: Reviews;
};

type AgentStatus = "pending" | "running" | "complete" | "error";

type AgentProgress = {
  id: string;
  name: string;
  status: AgentStatus;
};

type AgentErrors = {
  [agentId: string]: string;
};

export function ProductResults({
  agentData,
  agentErrors,
  agentProgress,
  onRetryAgent,
}: {
  agentData: AgentData;
  agentErrors: AgentErrors;
  agentProgress: AgentProgress[];
  onRetryAgent: (agentId: string) => void;
}) {
  const getAgentStatus = (agentId: string) => {
    const agent = agentProgress.find((a) => a.id === agentId);
    return agent?.status || "pending";
  };

  const getAgentName = (agentId: string) => {
    const agent = agentProgress.find((a) => a.id === agentId);
    return agent?.name || agentId;
  };

  const basicInfoStatus = getAgentStatus("basic-info");
  const overviewStatus = getAgentStatus("overview");
  const featuresStatus = getAgentStatus("features");
  const prosConsStatus = getAgentStatus("pros-cons");
  const reviewsStatus = getAgentStatus("reviews");

  return (
    <ProductSection>
      <AgentContent
        data={agentData["basic-info"]}
        error={agentErrors["basic-info"]}
        status={basicInfoStatus}
        agentName={getAgentName("basic-info")}
        agentId="basic-info"
        skeleton={BasicInfoSkeleton}
        component={BasicInfoComponent}
        onRetry={onRetryAgent}
      />

      <ProductGrid>
        <MainGridColumn>
          {agentData.overview ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <OverviewComponent overview={agentData.overview.overview} />
            </div>
          ) : overviewStatus === "error" ? (
            <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-destructive">
                    {getAgentName("overview")} Failed
                  </span>
                  <button
                    onClick={() => onRetryAgent("overview")}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    Retry
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Failed to load overview information.
                </p>
                <p className="text-xs text-muted-foreground">
                  Please try again or contact support if the issue persists.
                </p>
              </div>
            </div>
          ) : (
            <OverviewSkeleton />
          )}
        </MainGridColumn>

        <SideGridColumn>
          <AgentContent
            data={agentData.features}
            error={agentErrors.features}
            status={featuresStatus}
            agentName={getAgentName("features")}
            agentId="features"
            skeleton={FeaturesSkeleton}
            component={FeaturesComponent}
            onRetry={onRetryAgent}
          />
        </SideGridColumn>
      </ProductGrid>

      {agentData.overview && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SpecificationsComponent
            specifications={agentData.overview.specifications}
          />
        </div>
      )}

      <ProductDivider />

      <AgentContent
        data={agentData["pros-cons"]}
        error={agentErrors["pros-cons"]}
        status={prosConsStatus}
        agentName={getAgentName("pros-cons")}
        agentId="pros-cons"
        skeleton={ProsConsSkeleton}
        component={ProsConsComponent}
        onRetry={onRetryAgent}
      />

      <ProductDivider />

      <AgentContent
        data={agentData.reviews}
        error={agentErrors.reviews}
        status={reviewsStatus}
        agentName={getAgentName("reviews")}
        agentId="reviews"
        skeleton={ReviewsSkeleton}
        component={ReviewsComponent}
        onRetry={onRetryAgent}
      />

      {basicInfoStatus === "complete" &&
        overviewStatus === "complete" &&
        featuresStatus === "complete" &&
        prosConsStatus === "complete" &&
        reviewsStatus === "complete" && (
          <>
            <ProductDivider />
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PricingComparisonComponent />
            </div>
          </>
        )}
    </ProductSection>
  );
}
