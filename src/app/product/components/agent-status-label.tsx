import { cn } from "@/lib/utils";

type AgentStatus = "pending" | "running" | "complete" | "error";

export function AgentStatusLabel({
  name,
  status,
}: {
  name: string;
  status: AgentStatus;
}) {
  return (
    <span
      className={cn(
        "transition-all duration-300",
        status === "complete" && "text-gray-600 dark:text-gray-400",
        status === "running" && "text-gray-900 dark:text-gray-100 font-medium",
        status === "pending" && "text-gray-500 dark:text-gray-500",
        status === "error" && "text-red-600 dark:text-red-400",
      )}
    >
      {name}
      {status === "running" && (
        <span className="ml-2 text-gray-500 animate-pulse">
          analyzing...
        </span>
      )}
    </span>
  );
}
