import { eq, and, count } from "drizzle-orm";

import { db } from "@/lib/db";
import { analysisUsage } from "@/lib/db/schema";

const ANONYMOUS_LIMIT = 3;

type UsageCheckResult =
  | { allowed: true }
  | { allowed: false; reason: "usage_limit_exceeded"; used: number; limit: number };

export async function checkUsageAllowed(
  userId: string,
  isAnonymous: boolean,
  productUrl: string,
): Promise<UsageCheckResult> {
  if (!isAnonymous) {
    return { allowed: true };
  }

  const existing = await db
    .select()
    .from(analysisUsage)
    .where(eq(analysisUsage.productUrl, productUrl))
    .limit(1);

  if (existing[0]) {
    return { allowed: true };
  }

  const used = await getUserAnalysisCount(userId);

  if (used >= ANONYMOUS_LIMIT) {
    return {
      allowed: false,
      reason: "usage_limit_exceeded",
      used,
      limit: ANONYMOUS_LIMIT,
    };
  }

  return { allowed: true };
}

export async function recordAnalysis(userId: string, productUrl: string): Promise<void> {
  const existing = await db
    .select()
    .from(analysisUsage)
    .where(
      and(
        eq(analysisUsage.userId, userId),
        eq(analysisUsage.productUrl, productUrl),
      ),
    )
    .limit(1);

  if (existing[0]) return;

  await db.insert(analysisUsage).values({
    id: crypto.randomUUID(),
    userId,
    productUrl,
    analyzedAt: new Date(),
  });
}

export async function getUserAnalysisCount(userId: string): Promise<number> {
  const result = await db
    .select({ value: count() })
    .from(analysisUsage)
    .where(eq(analysisUsage.userId, userId))
    .limit(1);

  return result[0]?.value ?? 0;
}

export async function migrateUsage(
  fromUserId: string,
  toUserId: string,
): Promise<void> {
  await db
    .update(analysisUsage)
    .set({ userId: toUserId })
    .where(eq(analysisUsage.userId, fromUserId));
}
