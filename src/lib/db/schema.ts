import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export { user, session, account, verification } from "./auth-schema";

export const analysisUsage = pgTable("analysis_usage", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productUrl: text("product_url").notNull(),
  analyzedAt: timestamp("analyzed_at").notNull(),
});
