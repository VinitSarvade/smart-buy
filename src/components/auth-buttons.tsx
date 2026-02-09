"use client";

import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function AuthButtons() {
  const { data: session, isPending } = authClient.useSession();

  const isAuthenticated = session?.user && !session.user.isAnonymous;

  if (isPending) return null;

  return (
    <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-end backdrop-blur-sm bg-background/60">
      <div className="flex w-full max-w-6xl mx-auto items-center justify-end gap-3 px-4 py-3 md:px-6">
      {isAuthenticated ? (
        <>
          <span className="text-sm text-muted-foreground">
            {session.user.name}
          </span>
          <button
            onClick={() => authClient.signOut()}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium",
              "text-muted-foreground hover:text-foreground",
              "transition-colors",
            )}
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <Link
            href="/sign-in"
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium",
              "text-muted-foreground hover:text-foreground",
              "transition-colors",
            )}
          >
            Sign in
          </Link>
          <Link
            href="/sign-in"
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors",
            )}
          >
            Sign up
          </Link>
        </>
      )}
      </div>
    </div>
  );
}
