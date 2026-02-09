"use client";

import { useEffect, type ReactNode } from "react";

import { authClient } from "@/lib/auth-client";

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      authClient.signIn.anonymous();
    }
  }, [session, isPending]);

  return <>{children}</>;
}
