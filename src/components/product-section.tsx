import { Suspense, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductSectionProps {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
}

export function ProductSection({
  children,
  fallback,
  className,
}: ProductSectionProps) {
  return (
    <Card className={cn("backdrop-blur-xl p-8 md:p-12", className)}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </Card>
  );
}
