"use client";

import { useState } from "react";
import {
  Heart,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Undo2,
  Wallet,
} from "lucide-react";

import SizeGuideModal from "@/components/SizeGuideModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { toast } from "sonner";

import type { Product, ColorOption } from "@/data/products";

const sizes = ["S", "M", "L", "XL", "XXL"] as const;

const topTrustItems = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over $99",
  },
  {
    icon: Undo2,
    title: "Easy Returns",
    subtitle: "30-day return policy",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "100% secure checkout",
  },
] as const;

const bottomTrustItems = [
  {
    icon: Wallet,
    title: "Cash on Delivery",
    subtitle: "Pay at your doorstep",
  },
  {
    icon: MapPin,
    title: "Track Your Order",
    subtitle: "Real-time updates",
  },
] as const;

type ProductInfoProps = {
  product: Product;
  selectedColorOption: ColorOption | undefined;
  onColorChange: (option: ColorOption) => void;
};

export default function ProductInfo({ product, selectedColorOption, onColorChange }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<(typeof sizes)[number]>("M");
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const activeColorName = selectedColorOption?.name || "None";
  const favorited =
    checkIsFavorite(product.slug || product.id, activeColorName) ||
    checkIsFavorite(product.id, activeColorName);

  return (
    <div className="flex flex-col">
      <Badge variant="secondary" className="rounded-lg">
        New Arrival
      </Badge>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {product.title}
      </h1>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center" aria-label="5 star rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="size-4 fill-foreground text-foreground"
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">(4.8) </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="text-3xl font-bold text-foreground">{product.price}</p>
        <p className="text-lg text-muted-foreground line-through">{product.originalPrice}</p>
        <Badge className="rounded-lg">SALE</Badge>
      </div>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        {product.description || "Premium heavyweight collection with an oversized fit for ultimate comfort and modern style."}
      </p>

      <div className="mt-8">
        <p className="text-sm font-medium text-foreground">
          Color: <span className="font-normal">{activeColorName}</span>
        </p>
        <div className="mt-3 flex gap-3">
          {product.colorOptions?.map((color) => (
            <button
              key={color.name}
              type="button"
              aria-label={color.name}
              aria-pressed={selectedColorOption?.name === color.name}
              onClick={() => onColorChange(color)}
              className={cn(
                "size-8 rounded-full ring-offset-2 ring-offset-background transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer",
                selectedColorOption?.name === color.name
                  ? "ring-2 ring-foreground scale-105"
                  : "ring-1 ring-border hover:ring-foreground/40"
              )}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            Size: <span className="font-normal">{selectedSize}</span>
          </p>
          <SizeGuideModal />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {((selectedColorOption as any)?.sizes?.length > 0
            ? (selectedColorOption as any).sizes
            : sizes
          ).map((size: string) => (
            <Button
              key={size}
              type="button"
              variant={selectedSize === size ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSize(size as any)}
              className="h-10 min-w-12 rounded-lg"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Button
          type="button"
          size="lg"
          className="h-12 flex-1 rounded-lg text-sm uppercase tracking-wide transition-transform duration-300 hover:scale-[1.02]"
          onClick={() => {
            addToCart({
              id: product.id,
              title: product.title,
              price: parseFloat(product.price.replace(/[^0-9.-]+/g, "")),
              image: selectedColorOption?.images[0] || product.image,
              quantity: 1,
              selectedColor: activeColorName,
              selectedSize,
            });
            toast.success("Added to cart", {
              description: `${product.title} (${activeColorName}, ${selectedSize})`,
            });
          }}
        >
          <ShoppingBag className="size-4" />
          Add to Cart
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={favorited}
          onClick={() => {
            toggleFavorite({
              id: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              originalPrice: product.originalPrice,
              image: selectedColorOption?.images[0] || product.image,
              colorOptions: product.colorOptions,
              selectedColor: activeColorName,
              selectedSize,
            }, selectedColorOption);
          }}
          className={cn(
            "size-12 rounded-lg transition-colors",
            favorited && "border-rose-300 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30"
          )}
        >
          <Heart
            className={cn(
              "size-5 transition-colors",
              favorited ? "fill-rose-500 text-rose-500" : "text-foreground"
            )}
            strokeWidth={1.5}
          />
        </Button>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <div className="mb-4 grid grid-cols-3 gap-4 border-b border-border pb-4 text-center">
          {topTrustItems.map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2">
              <item.icon className="size-5 text-muted-foreground" />
              <p className="text-xs font-medium text-foreground sm:text-sm">
                {item.title}
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 text-center">
          {bottomTrustItems.map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2">
              <item.icon className="size-5 text-muted-foreground" />
              <p className="text-xs font-medium text-foreground sm:text-sm">
                {item.title}
              </p>
              <p className="text-[10px] text-muted-foreground sm:text-xs">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
