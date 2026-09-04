"use client";

import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductFilters from "@/components/ProductFilters";
import OtherCategories from "@/components/OtherCategories";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useEffect } from "react";
import type { Product, ColorOption } from "@/data/products";

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const query = searchParams.toString();
    fetch(`/api/products?${query}`)
      .then((res) => res.json())
      .then((res) => {
        if (isMounted && res.success && Array.isArray(res.data)) {
          setProductsList(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const removeQueryParam = (key: string, valueToRemove?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (valueToRemove && (key === 'size' || key === 'color')) {
      const currentValues = params.get(key)?.split(",") || [];
      const newValues = currentValues.filter(v => v !== valueToRemove);
      if (newValues.length > 0) {
        params.set(key, newValues.join(","));
      } else {
        params.delete(key);
      }
    } else {
      params.delete(key);
    }

    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const activeCategory = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const activeSizes = searchParams.get("size")?.split(",") || [];
  const activeColors = searchParams.get("color")?.split(",") || [];

  type ProductCardItem = {
    product: Product;
    option?: ColorOption;
    key: string;
  };

  const productCards: ProductCardItem[] = productsList.flatMap((product): ProductCardItem[] =>
    product.colorOptions && product.colorOptions.length > 0
      ? product.colorOptions.map((option) => ({
          product,
          option,
          key: `${product.slug || product.id}-${option.name}`,
        }))
      : [{
          product,
          option: undefined,
          key: product.slug || product.id,
        }]
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-bold text-foreground">{productCards.length}</span> results for "{activeCategory ? activeCategory.replace(/-/g, ' ') : 'All Products'}"
        </p>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger render={
              <Button variant="outline" size="sm" className="gap-2" />
            }>
              <SlidersHorizontal className="size-4" />
              Filters
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto pr-0">
              <SheetTitle className="sr-only">Filters</SheetTitle>
              <ProductFilters className="w-full border-none pl-4 pr-6" />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {activeCategory && (
          <Badge variant="secondary" className="px-3 py-1 rounded-full text-xs cursor-pointer flex items-center gap-1 hover:bg-muted-foreground/20" onClick={() => removeQueryParam("category")}>
            {activeCategory.toUpperCase().replace(/-/g, ' ')} <X className="size-3" />
          </Badge>
        )}
        {(minPrice || maxPrice) && (
          <Badge variant="secondary" className="px-3 py-1 rounded-full text-xs cursor-pointer flex items-center gap-1 hover:bg-muted-foreground/20" onClick={() => { removeQueryParam("minPrice"); removeQueryParam("maxPrice"); }}>
            ${minPrice || 0}-${maxPrice || 1000} <X className="size-3" />
          </Badge>
        )}
        {activeSizes.map(size => (
          <Badge key={size} variant="secondary" className="px-3 py-1 rounded-full text-xs cursor-pointer flex items-center gap-1 hover:bg-muted-foreground/20" onClick={() => removeQueryParam("size", size)}>
            SIZE {size.toUpperCase()} <X className="size-3" />
          </Badge>
        ))}
        {activeColors.map(color => (
          <Badge key={color} variant="secondary" className="px-3 py-1 rounded-full text-xs cursor-pointer flex items-center gap-1 hover:bg-muted-foreground/20" onClick={() => removeQueryParam("color", color)}>
            COLOR {color.toUpperCase()} <X className="size-3" />
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-[3/4] bg-muted rounded-lg" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : productCards.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-lg font-medium">No products found matching your filters.</p>
          <p className="text-sm mt-1">Try clearing some of your filters to see more results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mb-12">
          {productCards.map(({ product, option, key }) => (
            <ProductCard
              key={key}
              {...product}
              selectedCOption={option}
              showColors={true}
            />
          ))}
        </div>
      )}

      <Pagination className="mb-12">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" className="border border-border rounded-full" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">4</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" className="border border-border rounded-full" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="text-sm text-muted-foreground mb-8">
          Men Fashion &gt; <span className="text-foreground">All Products</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <Suspense fallback={<div className="hidden md:block w-64 shrink-0" />}>
            <ProductFilters className="hidden md:block w-64 shrink-0 border-r border-border pr-6" />
          </Suspense>

          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductsContent />
            </Suspense>
          </div>
        </div>

        <OtherCategories />
      </main>

      <Footer />
    </div>
  );
}
