import { getDB } from "@/db";
import { products, variants } from "@/db/schema";
import { NewProduct, ProductWithRelations } from "@/db/types";
import { UIProduct, ProductSearchFilters } from "@/lib/products/types";
import { eq, or, and, ilike, exists, sql, SQL } from "drizzle-orm";
import { formatProductForUI } from "@/lib/products/utils";

export async function getProducts(filters?: ProductSearchFilters): Promise<ProductWithRelations[]> {
  const db = getDB();

  const whereClause = filters ? and(...buildSearchConditions(db, filters)) : eq(products.status, "active");

  const rows = await db.query.products.findMany({
    where: whereClause,
    with: {
      variants: true,
      images: true,
    },
  });

  // if (!rows || rows.length === 0) {
  //   return getSeedRelationalProducts();
  // }

  return rows as ProductWithRelations[];
}

export async function getFormattedProducts(filters?: ProductSearchFilters): Promise<UIProduct[]> {
  const productsList = await getProducts(filters);
  return productsList.map(formatProductForUI);
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const db = getDB();

  const result = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      variants: true,
      images: true,
    },
  });

  return result as ProductWithRelations;

}

export async function getFormattedProductBySlug(slug: string): Promise<UIProduct | null> {
  const product = await getProductBySlug(slug);
  return product ? formatProductForUI(product) : null;
}

export async function createProduct(data: NewProduct) {
  const db = getDB();

  return await db.insert(products).values(data).returning();
}

export async function updateProduct(slug: string, data: NewProduct) {
  const db = getDB();

  const updatedRows = await db
    .update(products)
    .set({ ...data, updatedAt: sql`NOW()` })
    .where(eq(products.slug, slug))
    .returning();

  return updatedRows[0] ?? null;
}

export async function deleteProductBySlug(slug: string) {
  const db = getDB();
  if (!db) return false;

  const deletedRows = await db
    .delete(products)
    .where(eq(products.slug, slug))
    .returning({ id: products.id });

  return deletedRows.length > 0;
}

function buildSearchConditions(db: ReturnType<typeof getDB>, filters: ProductSearchFilters): SQL[] {
  const conditions: SQL[] = [eq(products.status, "active")];

  const { q, category, color, size, minPrice, maxPrice } = filters;

  if (q) {
    const term = `%${q.trim()}%`;
    conditions.push(
      or(
        ilike(products.name, term),
        ilike(products.slug, term),
        ilike(products.description, term),
        exists(
          db!
            .select({ id: variants.id })
            .from(variants)
            .where(and(eq(variants.productId, products.id), ilike(variants.colorName, term)))
        )
      )!
    );
  }

  if (category) {
    const term = `%${category.trim()}%`;
    conditions.push(or(ilike(products.slug, term), ilike(products.name, term))!);
  }

  if (color) {
    const colors = color.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
    if (colors.length > 0) {
      conditions.push(
        exists(
          db!
            .select({ id: variants.id })
            .from(variants)
            .where(
              and(
                eq(variants.productId, products.id),
                sql`lower(${variants.colorName}) = ANY(${colors})`
              )
            )
        )
      );
    }
  }

  if (size) {
    const sizes = size.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (sizes.length > 0) {
      conditions.push(
        exists(
          db!
            .select({ id: variants.id })
            .from(variants)
            .where(
              and(
                eq(variants.productId, products.id),
                sql`lower(${variants.size}) = ANY(${sizes})`
              )
            )
        )
      );
    }
  }

  if (minPrice) {
    const minCents = Math.round(parseFloat(minPrice) * 100);
    if (!isNaN(minCents)) {
      conditions.push(
        sql`(SELECT MIN(${variants.price}) FROM ${variants} WHERE ${variants.productId} = ${products.id}) >= ${minCents}`
      );
    }
  }

  if (maxPrice) {
    const maxCents = Math.round(parseFloat(maxPrice) * 100);
    if (!isNaN(maxCents)) {
      conditions.push(
        sql`(SELECT MIN(${variants.price}) FROM ${variants} WHERE ${variants.productId} = ${products.id}) <= ${maxCents}`
      );
    }
  }

  return conditions;
}
