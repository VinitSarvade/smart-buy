"use client";

import { createContext, useContext, useState } from "react";

import { cn } from "@/lib/utils";

type CollapsibleContextValue = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("Collapsible compound components must be used within Collapsible");
  }
  return context;
}

export function Collapsible({
  children,
  defaultExpanded = false,
}: {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  return (
    <CollapsibleContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isExpanded, setIsExpanded } = useCollapsibleContext();
  return (
    <button
      type="button"
      onClick={() => setIsExpanded(!isExpanded)}
      className={className}
      aria-expanded={isExpanded}
    >
      {children}
    </button>
  );
}

export function CollapsibleContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isExpanded } = useCollapsibleContext();
  return (
    <div
      className={cn(
        "grid overflow-hidden transition-all duration-300 ease-out",
        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

export function useCollapsible() {
  return useCollapsibleContext();
}
