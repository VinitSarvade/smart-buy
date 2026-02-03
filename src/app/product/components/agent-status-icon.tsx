type AgentStatus = "pending" | "running" | "complete" | "error";

export function AgentStatusIcon({ status }: { status: AgentStatus }) {
  switch (status) {
    case "complete":
      return (
        <span className="text-green-600 dark:text-green-400 animate-in zoom-in duration-200">
          ✓
        </span>
      );
    case "running":
      return (
        <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      );
    case "pending":
      return (
        <span className="text-gray-400 dark:text-gray-600 transition-colors duration-200">
          ○
        </span>
      );
    case "error":
      return (
        <span className="text-red-600 dark:text-red-400 animate-in zoom-in duration-200">
          ✗
        </span>
      );
  }
}
