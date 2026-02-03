export type AgentFunction<T = unknown> = (productURL: string) => Promise<T>;

export interface AgentResult<T = unknown> {
  id: string;
  data: T;
  error?: Error;
  duration: number;
}

export type AgentPromises = Map<string, Promise<AgentResult>>;
