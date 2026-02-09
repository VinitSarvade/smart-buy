import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { anonymous } from "better-auth/plugins";

import { db } from "@/lib/db";
import { migrateUsage } from "@/lib/db/usage";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await migrateUsage(anonymousUser.user.id, newUser.user.id);
      },
    }),
    nextCookies(),
  ],
  session: {
    cookieCache: { enabled: true, maxAge: 300 },
  },
});
