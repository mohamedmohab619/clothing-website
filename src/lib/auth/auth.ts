import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "@/db";
import { nextCookies } from "better-auth/next-js";
import { admin } from 'better-auth/plugins';
import * as schema from "@/db/schema"

const db = getDB();
export const auth = betterAuth({
  trustedOrigins: ['192.168.*.*', '10.*.*.*', '127.0.0.1'],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: schema,
  }),
  user: {
    additionalFields: {
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
      birthDate: { type: "date", required: false },
      phoneNumber: { type: "string", required: false },
      phoneNumberVerified: { type: "boolean", required: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  // socialProviders: {
  //   google: {
  //     prompt: "select_account",
  //     clientId: "",
  //     clientSecret: "",
  //     // important for additional fields
  //     mapProfileToUser: (profile) => ({
  //       firstName: profile.given_name,
  //       lastName: profile.family_name,
  //     }),
  //   }
  // },
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
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            // keep `name` populated for better-auth and anything that reads it
            name: `${user.firstName} ${user.lastName}`.trim()
          }
        })
      }
    }
  },
  plugins: [
    admin(),
    // phoneNumber({
    //   requireVerification: false,
    //   phoneNumberValidator: (value) => isValidPhoneNumber(value),
    //   sendOTP: async ({ phoneNumber, code }) => {
    //     // SMS provider goes here later. Don't await the provider call.
    //     if (process.env.NODE_ENV !== "production") {
    //       console.log(`[OTP] ${phoneNumber}: ${code}`);
    //     }
    //   },
    // }),
    nextCookies(),
  ]
});
