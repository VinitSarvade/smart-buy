import { cn } from "@/lib/utils";

type AgentStatus = "pending" | "running" | "complete" | "error";

export function AgentStatusLabel({
  name,
  status,
  agentId,
}: {
  name: string;
  status: AgentStatus;
  agentId?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "transition-all duration-300",
          status === "complete" && "text-gray-600 dark:text-gray-400",
          status === "running" &&
            "text-gray-900 dark:text-gray-100 font-medium",
          status === "pending" && "text-gray-500 dark:text-gray-500",
          status === "error" && "text-red-600 dark:text-red-400",
        )}
      >
        {name}
        {status === "running" && (
          <span className="ml-2 text-gray-500 animate-pulse">analyzing...</span>
        )}
      </span>
      {agentId === "pricing-comparison" && (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
          Coming Soon
        </span>
      )}
    </div>
  );
}
