import type { AgentFunction, AgentResult, AgentPromises } from "./types";

async function executeAgent<T>(
  id: string,
  agentFn: AgentFunction<T>,
  productURL: string
): Promise<AgentResult<T>> {
  const startTime = performance.now();

  try {
    const data = await agentFn(productURL);
    const duration = performance.now() - startTime;

    return {
      id,
      data,
      duration,
    };
  } catch (error) {
    const duration = performance.now() - startTime;

    return {
      id,
      data: undefined as T,
      error: error instanceof Error ? error : new Error(String(error)),
      duration,
    };
  }
}

export function executeAgentsParallel(
  agents: Record<string, AgentFunction>,
  productURL: string
): AgentPromises {
  const promises = new Map<string, Promise<AgentResult>>();

  for (const [id, agentFn] of Object.entries(agents)) {
    const promise = executeAgent(id, agentFn, productURL);
    promises.set(id, promise);
  }

  return promises;
}
