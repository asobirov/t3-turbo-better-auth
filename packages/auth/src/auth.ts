import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { env } from "@acme/auth/env";
import { db } from "@acme/db/client";

export type AuthInstance = ReturnType<typeof betterAuth>;

export const auth = betterAuth({
  appName: "myapp",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: env.AUTH_SECRET,
  plugins: [nextCookies(), expo()],
  socialProviders: {
    discord: {
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
      redirectURI: `${new URL(env.BETTER_AUTH_URL).origin}/api/auth/callback/discord`,
    },
  },
  trustedOrigins: [
    ...[env.BETTER_AUTH_URL].map((url) => new URL(url).origin),
    "myapp://",
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
});
export type Session = typeof auth.$Infer.Session;
