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
import type { ProsCons } from "@/features/pros-cons/api";
import { ProsConsComponent } from "@/features/pros-cons/component";
import { ProsConsSkeleton } from "@/features/pros-cons/skeleton";
import { twx } from "@/lib/twx";

type AgentData = {
  "basic-info"?: BasicInfo;
  overview?: Overview;
  features?: Features;
  "pros-cons"?: ProsCons;
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

const AnimatedContainer = twx.div`
  animate-in fade-in slide-in-from-bottom-4 duration-500
`;

const TransitionContainer = twx.div`
  transition-all duration-300
`;

const ErrorContainer = twx.div`
  rounded-xl border border-destructive/50 bg-destructive/5 p-6
`;

function AgentError({ agentName, error }: { agentName: string; error: string }) {
  return (
    <ErrorContainer>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-destructive">
            {agentName} Failed
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{error}</p>
        <p className="text-xs text-muted-foreground">
          Please try again or contact support if the issue persists.
        </p>
      </div>
    </ErrorContainer>
  );
}

function getAgentStatus(
  agentId: string,
  agentProgress: AgentProgress[]
): AgentStatus {
  const agent = agentProgress.find((a) => a.id === agentId);
  return agent?.status || "pending";
}

function getAgentName(agentId: string, agentProgress: AgentProgress[]): string {
  const agent = agentProgress.find((a) => a.id === agentId);
  return agent?.name || agentId;
}

export function ProductResults({
  agentData,
  agentErrors,
  agentProgress,
}: {
  agentData: AgentData;
  agentErrors: AgentErrors;
  agentProgress: AgentProgress[];
}) {
  const basicInfoStatus = getAgentStatus("basic-info", agentProgress);
  const overviewStatus = getAgentStatus("overview", agentProgress);
  const featuresStatus = getAgentStatus("features", agentProgress);
  const prosConsStatus = getAgentStatus("pros-cons", agentProgress);

  return (
    <div className="space-y-8">
      <TransitionContainer>
        {agentData["basic-info"] ? (
          <AnimatedContainer>
            <BasicInfoComponent {...agentData["basic-info"]} />
          </AnimatedContainer>
        ) : basicInfoStatus === "error" ? (
          <AgentError
            agentName={getAgentName("basic-info", agentProgress)}
            error={agentErrors["basic-info"] || "Unknown error"}
          />
        ) : (
          <BasicInfoSkeleton />
        )}
      </TransitionContainer>

      <div className="grid gap-8 md:grid-cols-3 transition-all duration-300">
        <div className="md:col-span-2">
          {agentData.overview ? (
            <AnimatedContainer>
              <OverviewComponent overview={agentData.overview.overview} />
            </AnimatedContainer>
          ) : overviewStatus === "error" ? (
            <AgentError
              agentName={getAgentName("overview", agentProgress)}
              error={agentErrors.overview || "Unknown error"}
            />
          ) : (
            <OverviewSkeleton />
          )}
        </div>
        <div>
          {agentData.features ? (
            <AnimatedContainer>
              <FeaturesComponent {...agentData.features} />
            </AnimatedContainer>
          ) : featuresStatus === "error" ? (
            <AgentError
              agentName={getAgentName("features", agentProgress)}
              error={agentErrors.features || "Unknown error"}
            />
          ) : (
            <FeaturesSkeleton />
          )}
        </div>
      </div>

      {agentData.overview && (
        <AnimatedContainer>
          <SpecificationsComponent
            specifications={agentData.overview.specifications}
          />
        </AnimatedContainer>
      )}

      <hr className="border-t border-border" />

      <TransitionContainer>
        {agentData["pros-cons"] ? (
          <AnimatedContainer>
            <ProsConsComponent {...agentData["pros-cons"]} />
          </AnimatedContainer>
        ) : prosConsStatus === "error" ? (
          <AgentError
            agentName={getAgentName("pros-cons", agentProgress)}
            error={agentErrors["pros-cons"] || "Unknown error"}
          />
        ) : (
          <ProsConsSkeleton />
        )}
      </TransitionContainer>
    </div>
  );
}
