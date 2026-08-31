import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations", // where migrations are generated
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  verbose: true, // provide more information when running drizzle-kit commands
  strict: true, // helps catch forgotten migrations, accidental manual DB edits, prevent schema drift, etc...
  migrations: {
    prefix: "timestamp", // Easy chronological ordering
    table: "__drizzle_migrations__", // Default is fine
    schema: "public", // Default Postgres schema
  },
});
