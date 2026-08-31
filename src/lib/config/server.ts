import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error(parseResult.error);
  throw new Error("Environment error");
}

export const serverConfig = {
  db: {
    url: parseResult.data.DATABASE_URL,
  },
  isProduction: parseResult.data.NODE_ENV === 'production',
  isDevelopment: parseResult.data.NODE_ENV === 'development',
}
