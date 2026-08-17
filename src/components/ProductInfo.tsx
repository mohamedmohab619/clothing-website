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
import { toast } from "sonner";

const colors = [
  { name: "Charcoal Gray", className: "bg-neutral-500" },
  { name: "Light Gray", className: "bg-neutral-300" },
  { name: "Beige", className: "bg-[#d6c4a8]" },
  { name: "Black", className: "bg-neutral-950" },
] as const;

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

export default function ProductInfo() {
  const [selectedColor, setSelectedColor] = useState<string>(colors[0].name);
  const [selectedSize, setSelectedSize] = useState<(typeof sizes)[number]>("M");
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col">
      <Badge variant="secondary" className="rounded-lg">
        New Arrival
      </Badge>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Essential Oversized Hoodie
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
        <p className="text-3xl font-bold text-foreground">$59.99</p>
        <p className="text-lg text-muted-foreground line-through">$89.99</p>
        <Badge className="rounded-lg">33% OFF</Badge>
      </div>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Premium heavyweight cotton hoodie with an oversized fit for ultimate
        comfort and modern style.
      </p>

      <div className="mt-8">
        <p className="text-sm font-medium text-foreground">
          Color: <span className="font-normal">{selectedColor}</span>
        </p>
        <div className="mt-3 flex gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              aria-label={color.name}
              aria-pressed={selectedColor === color.name}
              onClick={() => setSelectedColor(color.name)}
              className={cn(
                "size-8 rounded-full ring-offset-2 ring-offset-background transition-shadow",
                color.className,
                selectedColor === color.name
                  ? "ring-2 ring-foreground"
                  : "ring-1 ring-border"
              )}
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
          {sizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant={selectedSize === size ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSize(size)}
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
              id: "essential-oversized-hoodie",
              title: "Essential Oversized Hoodie",
              price: 59.99,
              image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
              quantity: 1,
              selectedColor,
              selectedSize,
            });
            toast.success("Added to cart", {
              description: `Essential Oversized Hoodie (${selectedColor}, ${selectedSize})`,
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
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((open) => !open)}
          className="size-12 rounded-lg"
        >
          <Heart
            className="size-5"
            fill={isFavorite ? "currentColor" : "none"}
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
