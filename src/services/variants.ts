import { getDB } from "@/db";
import { variants } from "@/db/schema";
import { variantSearchFilters } from "@/lib/variants/types";
import { and, eq, ilike, SQL } from "drizzle-orm";

export async function getVariants(filters?: variantSearchFilters) {
  const db = getDB();

  return await db.query.variants.findMany({
    ...filters ? { where: and(...buildSearchConditions(db, filters)) } : {},
    with: {
      product: true
    }
  });
}

export async function getVariantBySku(sku: string) {
  const db = getDB();

  return await db.query.variants.findFirst({
    where: eq(variants.sku, sku)
  });
}

function buildSearchConditions(db: ReturnType<typeof getDB>, filters: variantSearchFilters): SQL[] {
  const { pid, color, size } = filters;

  const conditions: SQL[] = []

  if (pid) {
    conditions.push(eq(variants.productId, pid))
  }

  if (color) {
    conditions.push(ilike(variants.colorName, color))
  }

  if (size) {
    conditions.push(ilike(variants.size, size))
  }

  return conditions
}
