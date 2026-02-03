import { AgentStatusIcon } from "./agent-status-icon";
import { AgentStatusLabel } from "./agent-status-label";

type AgentStatus = "pending" | "running" | "complete" | "error";

type AgentProgress = {
  id: string;
  name: string;
  status: AgentStatus;
};

export function AgentProgressItem({
  agent,
  index,
}: {
  agent: AgentProgress;
  index: number;
}) {
  return (
    <div
      className="flex items-center gap-3 text-sm transition-all duration-300 animate-in fade-in slide-in-from-left-2"
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <AgentStatusIcon status={agent.status} />
      </div>
      <AgentStatusLabel
        name={agent.name}
        status={agent.status}
        agentId={agent.id}
      />
    </div>
  );
}
