"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function YouMayAlsoLike({ currentProductId }: { currentProductId?: number }) {
  const { products: allProducts } = useProducts();

  const products = useMemo(
    () =>
      allProducts
        .filter((p) => p.id !== currentProductId)
        .slice(0, 4),
    [allProducts, currentProductId]
  );
  if (products.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          You May Also Like
        </h2>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
        >
          View All
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} showColors={true} />
        ))}
      </div>
    </section>
  );
}
