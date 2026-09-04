"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites, type FavoriteItem } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function FavoritesPage() {
  const { favorites, favoritesCount, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (item: FavoriteItem) => {
    const numericPrice = item.rawPrice ?? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) ?? 39.99;

    addToCart({
      id: item.id,
      title: item.title,
      price: numericPrice,
      image: item.image,
      quantity: 1,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize || "M",
    });

    toast.success("Added to cart", {
      description: `${item.title}${item.selectedColor ? ` (${item.selectedColor})` : ""}`,
    });
  };

  const handleAddAllToCart = () => {
    if (favorites.length === 0) return;

    favorites.forEach((item) => {
      const numericPrice = item.rawPrice ?? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) ?? 39.99;
      addToCart({
        id: item.id,
        title: item.title,
        price: numericPrice,
        image: item.image,
        quantity: 1,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize || "M",
      });
    });

    toast.success("Added all items to cart!", {
      description: `${favorites.length} ${favorites.length === 1 ? "item" : "items"} added to your cart.`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>{" "}
          &gt; <span className="text-foreground font-medium">Favorites</span>
        </div>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase sm:text-4xl">
                My Favorites
              </h1>
              <Badge variant="secondary" className="text-xs px-2.5 py-0.5 rounded-full">
                {favoritesCount} {favoritesCount === 1 ? "item" : "items"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Save your favorite items here and add them to your cart whenever you're ready.
            </p>
          </div>

          {favoritesCount > 0 && (
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFavorites}
                className="gap-1.5 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
                Clear Wishlist
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleAddAllToCart}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ShoppingBag className="size-4" />
                Add All to Cart
              </Button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {favoritesCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6 text-rose-500 shadow-inner">
              <Heart className="size-10 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Your wishlist is empty
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
              Explore our collections and tap the heart icon on pieces you love to save them here for later.
            </p>
            <div className="mt-8 flex gap-4">
              <Button
                render={<Link href="/products" />}
                className="gap-2 h-11 px-6 rounded-lg text-sm font-medium uppercase tracking-wide"
              >
                <Sparkles className="size-4" />
                Explore Collections
              </Button>
            </div>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-16">
            {favorites.map((item) => {
              const productIdentifier = item.slug || item.id;
              const productHref = `/products/${productIdentifier}${
                item.selectedColor ? `?coption=${encodeURIComponent(item.selectedColor)}` : ""
              }`;

              return (
                <article
                  key={`${item.id}-${item.selectedColor || "default"}`}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-card p-3 shadow-xs transition-all duration-300 hover:shadow-md"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                      <Link href={productHref} className="absolute inset-0 z-0">
                        <span className="sr-only">View {item.title}</span>
                      </Link>

                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Remove Button */}
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-xs"
                        aria-label="Remove from wishlist"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromFavorites(productIdentifier, item.selectedColor);
                        }}
                        className="absolute top-2.5 right-2.5 z-10 size-8 rounded-full bg-background/90 backdrop-blur-xs text-muted-foreground shadow-sm transition-transform hover:scale-110 hover:text-destructive hover:bg-background"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>

                      {/* Color Tag if available */}
                      {item.selectedColor && (
                        <div className="absolute bottom-2 left-2 z-10">
                          <Badge
                            variant="secondary"
                            className="bg-background/90 backdrop-blur-xs text-[10px] font-medium px-2 py-0.5 rounded-md"
                          >
                            {item.selectedColor}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="mt-3 flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={productHref}
                          className="text-sm font-bold tracking-wide text-foreground uppercase transition-colors hover:text-foreground/80 hover:underline line-clamp-1"
                        >
                          {item.title}
                        </Link>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-foreground">{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button underneath */}
                  <div className="mt-4 pt-3 border-t border-border">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="w-full gap-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-transform hover:scale-[1.02]"
                    >
                      <ShoppingBag className="size-3.5" />
                      Add to Cart
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
