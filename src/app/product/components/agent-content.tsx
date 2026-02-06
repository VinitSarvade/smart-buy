import { twx } from "@/lib/twx";

const AnimatedContainer = twx.div`
  animate-in fade-in slide-in-from-bottom-4 duration-500
`;

interface AgentContentProps<T> {
  data?: T;
  error?: string;
  status: "pending" | "running" | "complete" | "error";
  agentName: string;
  agentId: string;
  skeleton: React.ComponentType;
  component: React.ComponentType<T>;
  onRetry: (agentId: string) => void;
}

function sanitizeErrorMessage(agentId: string, error?: string): string {
  const genericMessages: Record<string, string> = {
    "basic-info": "Failed to load basic product information.",
    overview: "Failed to load overview information.",
    features: "Failed to load product features.",
    "pros-cons": "Failed to load pros and cons analysis.",
    reviews: "Failed to load reviews analysis.",
  };

  return genericMessages[agentId] || "Failed to load information.";
}

export function AgentContent<T>({
  data,
  error,
  status,
  agentName,
  agentId,
  skeleton: Skeleton,
  component: Component,
  onRetry,
}: AgentContentProps<T>) {
  if (data) {
    return (
      <AnimatedContainer>
        <Component {...data} />
      </AnimatedContainer>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-destructive">
              {agentName} Failed
            </span>
            <button
              onClick={() => onRetry(agentId)}
              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              Retry
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            {sanitizeErrorMessage(agentId, error)}
          </p>
          <p className="text-xs text-muted-foreground">
            Please try again or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  return <Skeleton />;
}
