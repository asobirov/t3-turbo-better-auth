import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { env } from "@acme/auth/env";
import { db } from "@acme/db/client";

export type AuthInstance = ReturnType<typeof betterAuth>;

const getBaseUrl = () => {
  const vercelUrl = env.VERCEL_PROJECT_PRODUCTION_URL ?? env.VERCEL_URL;

  if (vercelUrl) return `https://${vercelUrl}`;
  if (env.BETTER_AUTH_URL) return new URL(env.BETTER_AUTH_URL).origin;

  // eslint-disable-next-line no-restricted-properties
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const auth = betterAuth({
  appName: "myapp",
  baseURL: getBaseUrl(),
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: env.AUTH_SECRET,
  plugins: [nextCookies(), expo()],
  socialProviders: {
    discord: {
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
      redirectURI: `${getBaseUrl()}/api/auth/callback/discord`,
    },
  },
  trustedOrigins: [
    getBaseUrl(),
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
