import { cn } from "@/lib/utils";

import { AgentProgressItem } from "./agent-progress-item";

type AgentStatus = "pending" | "running" | "complete" | "error";

type AgentProgress = {
  id: string;
  name: string;
  status: AgentStatus;
};

export function AnalysisProgress({
  agentProgress,
  completedCount,
  totalCount,
  isClosing,
  onAnimationEnd,
}: {
  agentProgress: AgentProgress[];
  completedCount: number;
  totalCount: number;
  isClosing: boolean;
  onAnimationEnd: () => void;
}) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4 transition-all duration-400",
        isClosing
          ? "animate-out fade-out slide-out-to-top-4 duration-400"
          : "animate-in fade-in slide-in-from-top-4 duration-300",
      )}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Analyzing product...
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">
          {completedCount}/{totalCount} complete
        </span>
      </div>

      <div className="space-y-2">
        {agentProgress.map((agent, index) => (
          <AgentProgressItem key={agent.id} agent={agent} index={index} />
        ))}
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-linear-to-r from-violet-600 to-fuchsia-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>
    </div>
  );
}
