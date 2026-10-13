import z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
});

const parseResult = envSchema.safeParse({
  NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL
});

console.log("parsing client env vars...");
if (!parseResult.success) {
  console.warn("client env vars validation error");
  console.error(parseResult.error);
}

export const clientConfig = {
  betterAuth: {
    url: parseResult.data?.NEXT_PUBLIC_BETTER_AUTH_URL
  }
}
