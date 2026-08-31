import { getDB } from "@/db";
import { products } from "@/db/schema";
import { NewProduct } from "@/db/types";
import { eq, sql } from "drizzle-orm";

const db = getDB();

export async function getProducts() {
  return await db?.select().from(products);
}

export async function getProductBySlug(slug: string) {
  return await db?.select().from(products).where(eq(products.slug, slug)).limit(1);
}

export async function createProduct(data: NewProduct) {
  return await db?.insert(products).values(data).returning();
}

// TODO: update product status function

// update product status has it's own function
// update any thing else in the product will use the general update function
export async function updateProduct(slug: string, data: NewProduct) {
  const updatedRows = await db?.update(products).set({ ...data, updatedAt: sql`NOW()` }).where(eq(products.slug, slug)).returning();

  return updatedRows[0] ?? null;
}

export async function deleteProductBySlug(slug: string) {
  // .returning() yields the deleted row(s) to verify if a record was actually deleted
  const deletedRows = await db?.delete(products).where(eq(products.slug, slug)).returning({ id: products.id });

  return deletedRows.length > 0
}
