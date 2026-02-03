"use client";

import { useEffect, useReducer } from "react";

import type { BasicInfo } from "@/features/basic-info/api";
import type { Features } from "@/features/features/api";
import type { Overview } from "@/features/overview/api";
import type { ProsCons } from "@/features/pros-cons/api";

import { AnalysisProgress } from "./components/analysis-progress";
import { ErrorView } from "./components/error-view";
import { ProductResults } from "./components/product-results";

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

const AGENTS: AgentProgress[] = [
  { id: "basic-info", name: "Basic Information", status: "pending" },
  { id: "overview", name: "Product Overview", status: "pending" },
  { id: "features", name: "Key Features", status: "pending" },
  { id: "pros-cons", name: "Pros & Cons", status: "pending" },
];

type AnalysisStatus =
  | { type: "idle" }
  | { type: "analyzing" }
  | { type: "closing" }
  | { type: "complete" }
  | { type: "error"; message: string };

type State = {
  agentData: AgentData;
  agentProgress: AgentProgress[];
  agentErrors: AgentErrors;
  status: AnalysisStatus;
};

type Action =
  | { type: "SET_ERROR"; message: string }
  | { type: "START_ANALYSIS" }
  | { type: "AGENT_START"; agentId: string }
  | { type: "AGENT_COMPLETE"; agentId: string; data: unknown }
  | { type: "AGENT_ERROR"; agentId: string; error: string }
  | { type: "START_CLOSING" }
  | { type: "FINISH_CLOSING" };

const initialState: State = {
  agentData: {},
  agentProgress: AGENTS,
  agentErrors: {},
  status: { type: "idle" },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ERROR":
      return {
        ...state,
        status: { type: "error", message: action.message },
      };

    case "START_ANALYSIS":
      return {
        ...state,
        agentData: {},
        agentErrors: {},
        status: { type: "analyzing" },
        agentProgress: AGENTS.map((a) => ({ ...a, status: "pending" })),
      };

    case "AGENT_START":
      return {
        ...state,
        agentProgress: state.agentProgress.map((agent) =>
          agent.id === action.agentId
            ? { ...agent, status: "running" as AgentStatus }
            : agent,
        ),
      };

    case "AGENT_COMPLETE":
      return {
        ...state,
        agentData: {
          ...state.agentData,
          [action.agentId]: action.data,
        },
        agentProgress: state.agentProgress.map((agent) =>
          agent.id === action.agentId
            ? { ...agent, status: "complete" as AgentStatus }
            : agent,
        ),
      };

    case "AGENT_ERROR":
      return {
        ...state,
        agentErrors: {
          ...state.agentErrors,
          [action.agentId]: action.error,
        },
        agentProgress: state.agentProgress.map((agent) =>
          agent.id === action.agentId
            ? { ...agent, status: "error" as AgentStatus }
            : agent,
        ),
      };

    case "START_CLOSING":
      return { ...state, status: { type: "closing" } };

    case "FINISH_CLOSING":
      return { ...state, status: { type: "complete" } };

    default:
      return state;
  }
}

type Props = {
  productURL: string;
};

export function ProductAnalysisClient({ productURL }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const abortController = new AbortController();

    dispatch({ type: "START_ANALYSIS" });

    const fetchData = async () => {
      try {
        const response = await fetch("/api/product/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: productURL }],
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to start analysis");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No reader available");
        }

        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");

            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));

                  if (data.type === "agent-start") {
                    dispatch({ type: "AGENT_START", agentId: data.agentId });
                  }

                  if (
                    data.type &&
                    data.type !== "status" &&
                    data.type !== "complete" &&
                    data.type !== "error" &&
                    data.type !== "agent-start"
                  ) {
                    dispatch({
                      type: "AGENT_COMPLETE",
                      agentId: data.type,
                      data: data.data,
                    });
                  }

                  if (data.type === "error") {
                    console.error(`Agent ${data.agentId} failed:`, data.error);
                    dispatch({
                      type: "AGENT_ERROR",
                      agentId: data.agentId,
                      error: data.error || "Unknown error",
                    });
                  }

                  if (data.type === "complete") {
                    dispatch({ type: "START_CLOSING" });
                  }
                } catch (err) {
                  console.warn("Failed to parse SSE message:", line, err);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error("Analysis failed:", err);
        dispatch({
          type: "SET_ERROR",
          message: err instanceof Error ? err.message : "Analysis failed",
        });
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [productURL]);

  if (state.status.type === "error") {
    return <ErrorView message={state.status.message} />;
  }

  const completedCount = state.agentProgress.filter(
    (a) => a.status === "complete",
  ).length;
  const totalCount = state.agentProgress.length;

  return (
    <>
      {(state.status.type === "analyzing" ||
        state.status.type === "closing") && (
        <AnalysisProgress
          agentProgress={state.agentProgress}
          completedCount={completedCount}
          totalCount={totalCount}
          isClosing={state.status.type === "closing"}
          onAnimationEnd={() => {
            if (state.status.type === "closing") {
              dispatch({ type: "FINISH_CLOSING" });
            }
          }}
        />
      )}

      <ProductResults
        agentData={state.agentData}
        agentErrors={state.agentErrors}
        agentProgress={state.agentProgress}
      />
    </>
  );
}
