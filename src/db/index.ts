// db/index.ts
import { serverConfig } from "@/lib/config/server";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import * as schema from "./schema"
import { productsData, variantsData, productImagesData } from "@/data/api";

export type DB = ReturnType<typeof drizzle<typeof schema>>;
let db: DB | null = null;

export function getDB() {
  if (!serverConfig.db.url) {
    return null;
  }
  if (!db) {
    const sql = neon(serverConfig.db.url);
    db = drizzle(sql, {
      schema: schema,
      casing: "snake_case"
    });
  }
  return db;
}

export async function TestQuery() {
  const db = getDB();
  if (!db) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return await db.execute(sql`SELECT NOW() as current_time, 1 as status`);
}

/**
 * Reset Database
 * Clears data and resets identity sequences back to 1
 */
async function reset() {
  const db = getDB();
  if (!db) {
    throw new Error("Database is not configured.");
  }

  // Await truncate execution with RESTART IDENTITY
  await db.execute(
    sql.raw(`TRUNCATE TABLE "products", "variants", "product_images" RESTART IDENTITY CASCADE;`)
  );
}

export async function seed() {
  const db = getDB();
  if (!db) {
    throw new Error("Database is not configured.");
  }

  // 0. reset database
  await reset();

  // 1. Insert Parent Product
  await db.insert(schema.products).values(productsData);

  // 2. Insert Variants (Combinations of Black & Sage Green across M, L, XL)
  await db.insert(schema.variants).values(variantsData);

  // 3. Insert Product Images
  await db.insert(schema.productImages).values(productImagesData);

  return { sucess: true, message: "Database seeded successfully" };
}

