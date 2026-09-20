"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useFavorites } from "@/context/FavoritesContext";

export function WishlistTab() {
  const { addToCart } = useCart();
  const { favorites, favoritesCount, removeFromFavorites } = useFavorites();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            My Wishlist ({favoritesCount})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Items you&apos;ve bookmarked for your collection
          </p>
        </div>
        <Link href="/favorites">
          <Button variant="outline" size="sm" className="text-xs gap-1">
            View Full Wishlist <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed border-border bg-muted/10">
          <Heart className="size-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-base font-semibold text-foreground">Your wishlist is empty</p>
          <p className="text-xs text-muted-foreground mt-1 mb-6">
            Explore our new arrivals and save items with the heart icon
          </p>
          <Link href="/products">
            <Button size="sm" className="uppercase tracking-wider text-xs font-semibold">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.slice(0, 6).map((item) => (
            <div
              key={`${item.id}-${item.selectedColor}`}
              className="group rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="200px"
                />
                <button
                  type="button"
                  onClick={() => removeFromFavorites(item.slug || item.id, item.selectedColor)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <Link
                  href={`/products/${item.slug || item.id}?coption=${item.selectedColor}`}
                  className="text-xs font-bold uppercase tracking-wide text-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {item.title}
                </Link>
                <p className="text-xs text-muted-foreground">Color: {item.selectedColor || "Standard"}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-foreground">{item.price}</span>
                  <Button
                    size="sm"
                    onClick={() => {
                      addToCart({
                        id: item.id,
                        title: item.title,
                        price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
                        image: item.image,
                        quantity: 1,
                        selectedColor: item.selectedColor,
                        selectedSize: "M",
                      });
                      toast.success(`Added "${item.title}" to bag!`);
                    }}
                    className="h-8 text-xs font-semibold uppercase tracking-wider"
                  >
                    Add to Bag
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
