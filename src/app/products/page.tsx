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
import { products } from "@/data/products";

// Mock Data
const MOCK_PRODUCTS = [
  { id: "11", title: "LOOSE FIT HOODIE", price: "$120", originalPrice: "$150", isFavorite: false, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800", colors: ["#000", "#ccc", "#87ceeb"] },
  { id: "12", title: "PATTERNED SCARF", price: "$40", originalPrice: "$60", isFavorite: true, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800", colors: ["#808080", "#ccc", "#000"] },
  { id: "13", title: "RELAXED FIT COR JACKET", price: "$150", originalPrice: "$200", isFavorite: false, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800", colors: ["#000", "#008080"] },
  { id: "14", title: "LIGHTWEIGHT PUFFER JK", price: "$120", originalPrice: "$160", isFavorite: false, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800", colors: ["#000", "#ccc"] },
  { id: "15", title: "RIB-KNIT HAT", price: "$75", originalPrice: "$90", isFavorite: true, image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800", colors: ["#000"] },
  { id: "16", title: "PATTERNED SCARF", price: "$40", originalPrice: "$60", isFavorite: false, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=800", colors: ["#d3d3d3"] },
  { id: "17", title: "LOOSE FIT HOODIE", price: "$120", originalPrice: "$150", isFavorite: false, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800", colors: ["#000", "#ccc", "#87ceeb"] },
];

const allData = [...products, ...MOCK_PRODUCTS]

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-bold text-foreground">12</span> results from total <span className="font-bold text-foreground">127</span> for "{activeCategory ? activeCategory.replace(/-/g, ' ') : 'All Products'}"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mb-12">
        {allData.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            showColors={true}
          />
        ))}
      </div>

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
