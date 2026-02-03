import { fetchBasicInfo } from "@/features/basic-info/api";
import { fetchOverview } from "@/features/overview/api";
import { fetchFeatures } from "@/features/features/api";
import { fetchProsCons } from "@/features/pros-cons/api";
import type { AgentFunction } from "./types";

export const agentRegistry: Record<string, AgentFunction> = {
  "basic-info": fetchBasicInfo,
  "overview": fetchOverview,
  "features": fetchFeatures,
  "pros-cons": fetchProsCons,
};

export function getAgentIds(): string[] {
  return Object.keys(agentRegistry);
}

export function getAgent(id: string): AgentFunction | undefined {
  return agentRegistry[id];
}
