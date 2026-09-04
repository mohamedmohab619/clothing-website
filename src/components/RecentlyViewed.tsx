"use client";

import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";

type RecentlyViewedProps = {
  currentProductId?: string;
  limit?: number;
};

export default function RecentlyViewed({
  currentProductId,
  limit = 4,
}: RecentlyViewedProps) {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  // Filter out the currently active product if on a product detail page
  const displayedProducts = recentlyViewed
    .filter((p) => {
      if (!currentProductId) return true;
      return p.id !== currentProductId && p.slug !== currentProductId;
    })
    .slice(0, limit);

  // If no items have been viewed yet, don't render an empty section
  if (displayedProducts.length === 0) {
    return null;
  }

  return (
    <section
      id="recently-viewed"
      className="bg-background px-4 py-20 text-foreground sm:px-6 lg:px-8 border-t border-border/40 animate-in fade-in-50 duration-500"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center relative">
          <div className="inline-flex items-center justify-center gap-2 mb-3 text-muted-foreground text-xs uppercase tracking-widest font-semibold">
            <Clock className="size-3.5" />
            <span>Your Browsing History</span>
          </div>

          <h2 className="text-3xl font-bold tracking-wide text-foreground uppercase sm:text-4xl">
            Recently Viewed
          </h2>

          <p className="mt-4 text-xs tracking-[0.25em] text-muted-foreground uppercase sm:text-sm">
            Pick up where you left off with your recently explored styles
          </p>

          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearRecentlyViewed}
              className="text-[11px] text-muted-foreground hover:text-red-500 transition-colors gap-1 h-7 px-2.5 font-normal uppercase tracking-wider"
            >
              <Trash2 className="size-3" /> Clear History
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              colors={product.colorOptions?.map((c) => c.name)}
              colorOptions={product.colorOptions}
              showColors={true}
              isFavorite={product.isFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
