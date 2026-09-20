import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "@/db";
import { nextCookies } from "better-auth/next-js";
import { admin } from 'better-auth/plugins';

const db = getDB();
export const auth = betterAuth({
  trustedOrigins: ['192.168.*.*', '10.*.*.*', '127.0.0.1'],
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // Full Day
    },
  },
  advanced: {
    database: {
      joins: true,
    },
  },
  plugins: [
    nextCookies(),
    admin(),
  ]
});
