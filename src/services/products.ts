import { getDB } from "@/db";
import { products } from "@/db/schema";
import { NewProduct, Product, Variant, ProductImage } from "@/db/types";
import { eq, or, sql } from "drizzle-orm";
import { productsData, variantsData, productImagesData } from "@/data/api";

export type ProductWithRelations = Product & {
  variants: Variant[];
  images: ProductImage[];
};

export type UIColorOption = {
  name: string;
  value: string;
  images: string[];
  sizes: string[];
};

export type UIProduct = {
  id: string;
  slug: string;
  title: string;
  name: string;
  description: string;
  price: string;
  rawPrice: number;
  originalPrice: string;
  rawComparePrice: number | null;
  image: string;
  isFavorite: boolean;
  colorOptions: UIColorOption[];
  availableSizes: string[];
  variants: Variant[];
  images: ProductImage[];
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatProductForUI(product: ProductWithRelations): UIProduct {
  const variants = product.variants || [];
  const images = product.images || [];

  // Group by unique color names
  const colorMap = new Map<string, { value: string; images: string[]; sizes: Set<string> }>();

  for (const v of variants) {
    if (!colorMap.has(v.colorName)) {
      colorMap.set(v.colorName, {
        value: v.colorValue || "#000000",
        images: [],
        sizes: new Set(),
      });
    }
    if (v.size) {
      colorMap.get(v.colorName)!.sizes.add(v.size);
    }
  }

  // Attach images by color
  for (const img of images) {
    if (colorMap.has(img.colorName)) {
      colorMap.get(img.colorName)!.images.push(img.imageUrl);
    } else {
      colorMap.set(img.colorName, {
        value: "#808080",
        images: [img.imageUrl],
        sizes: new Set(),
      });
    }
  }

  const colorOptions: UIColorOption[] = Array.from(colorMap.entries()).map(([name, data]) => ({
    name,
    value: data.value,
    images: data.images.length > 0 ? data.images : (images.length > 0 ? [images[0].imageUrl] : ["/images/hoodie.jpg"]),
    sizes: Array.from(data.sizes),
  }));

  const minPriceCents = variants.length > 0
    ? Math.min(...variants.map((v) => v.price))
    : 3999;
  const minComparePriceCents = variants.length > 0
    ? Math.min(...variants.filter((v) => v.comparePrice != null).map((v) => v.comparePrice!))
    : 7999;

  const primaryImage = images.find((img) => img.isPrimary)?.imageUrl
    || images[0]?.imageUrl
    || colorOptions[0]?.images[0]
    || "/images/hoodie.jpg";

  const allSizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)));

  return {
    id: String(product.id),
    slug: product.slug,
    title: product.name,
    name: product.name,
    description: product.description || "Premium heavyweight collection with modern style and ultimate comfort.",
    price: formatCents(minPriceCents),
    rawPrice: minPriceCents / 100,
    originalPrice: formatCents(minComparePriceCents || minPriceCents * 2),
    rawComparePrice: minComparePriceCents ? minComparePriceCents / 100 : null,
    image: primaryImage,
    isFavorite: false,
    colorOptions,
    availableSizes: allSizes.length > 0 ? allSizes : ["S", "M", "L", "XL", "2XL"],
    variants,
    images,
  };
}

function getSeedRelationalProducts(): ProductWithRelations[] {
  return productsData.map((p, idx) => {
    const id = idx + 1;
    const pVariants = variantsData
      .filter((v) => v.productId === id)
      .map((v, vIdx) => ({
        id: vIdx + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...v,
      })) as Variant[];

    const pImages = productImagesData
      .filter((img) => img.productId === id)
      .map((img, imgIdx) => ({
        id: imgIdx + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...img,
      })) as ProductImage[];

    return {
      id,
      name: p.name,
      slug: p.slug,
      description: p.description ?? null,
      status: (p.status || "active") as "draft" | "active" | "archived",
      createdAt: new Date(),
      updatedAt: new Date(),
      variants: pVariants,
      images: pImages,
    };
  });
}

export async function getProducts(): Promise<ProductWithRelations[]> {
  const db = getDB();
  if (!db) {
    return getSeedRelationalProducts();
  }

  try {
    const rows = await db.query.products.findMany({
      where: eq(products.status, "active"),
      with: {
        variants: true,
        images: true,
      },
    });

    if (!rows || rows.length === 0) {
      return getSeedRelationalProducts();
    }

    return rows as ProductWithRelations[];
  } catch (error) {
    console.warn("Falling back to seed products due to DB error:", error);
    return getSeedRelationalProducts();
  }
}

export async function getFormattedProducts(): Promise<UIProduct[]> {
  const productsList = await getProducts();
  return productsList.map(formatProductForUI);
}

export async function getProductBySlug(slugOrId: string): Promise<ProductWithRelations | null> {
  const db = getDB();
  if (!db) {
    const seed = getSeedRelationalProducts();
    return seed.find((p) => p.slug === slugOrId || String(p.id) === String(slugOrId)) ?? null;
  }

  try {
    const isNumeric = !isNaN(Number(slugOrId));
    const result = await db.query.products.findFirst({
      where: isNumeric
        ? or(eq(products.slug, slugOrId), eq(products.id, Number(slugOrId)))
        : eq(products.slug, slugOrId),
      with: {
        variants: true,
        images: true,
      },
    });

    if (result) {
      return result as ProductWithRelations;
    }

    // fallback to seed if not in database
    const seed = getSeedRelationalProducts();
    return seed.find((p) => p.slug === slugOrId || String(p.id) === String(slugOrId)) ?? null;
  } catch (error) {
    console.warn("Falling back to seed product due to DB error:", error);
    const seed = getSeedRelationalProducts();
    return seed.find((p) => p.slug === slugOrId || String(p.id) === String(slugOrId)) ?? null;
  }
}

export async function getFormattedProductBySlug(slugOrId: string): Promise<UIProduct | null> {
  const product = await getProductBySlug(slugOrId);
  return product ? formatProductForUI(product) : null;
}

export async function createProduct(data: NewProduct) {
  const db = getDB();
  if (!db) return null;
  return await db.insert(products).values(data).returning();
}

export async function updateProduct(slug: string, data: NewProduct) {
  const db = getDB();
  if (!db) return null;
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

