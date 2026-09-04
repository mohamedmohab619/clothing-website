import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.warn("Environment variable validation warning:", parseResult.error.format());
}

const envData = parseResult.success ? parseResult.data : {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: 'development' as const,
};

export const serverConfig = {
  db: {
    url: envData.DATABASE_URL || "",
  },
  isDbConfigured: Boolean(envData.DATABASE_URL),
  isProduction: envData.NODE_ENV === 'production',
  isDevelopment: envData.NODE_ENV === 'development',
};

