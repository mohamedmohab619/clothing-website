import { ProductWithRelations, Variant, ProductImage } from "@/db/types";
import { UIProduct, UIColorOption, ProductSearchFilters } from "./types"
import { productsData, variantsData, productImagesData } from "@/data/api";

export function formatCents(cents: number): string {
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

export function getSeedRelationalProducts(): ProductWithRelations[] {
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

export function parseProductSearchParams(searchParams: URLSearchParams): ProductSearchFilters {
  return {
    q: searchParams.get("q") || searchParams.get("query") || undefined,
    category: searchParams.get("category") || undefined,
    color: searchParams.get("color") || undefined,
    size: searchParams.get("size") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
  };
}
