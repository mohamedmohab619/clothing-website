"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ColorOption } from "@/data/products";

type ProductCardProps = {
  id: string;
  title: string;
  price: string;
  originalPrice: string;
  isFavorite: boolean;
  image: string;
  colors?: string[];
  colorOptions?: ColorOption[];
  showColors?: boolean;
};

export default function ProductCard({
  id,
  title,
  price,
  originalPrice,
  isFavorite,
  image,
  colors,
  colorOptions,
  showColors,
}: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(colors?.[0]);
  const [selectedColorOption, setSelectedColorOption] = useState<ColorOption | undefined>(colorOptions?.[0]);

  const displayImage = selectedColorOption?.images?.[0] || image;

  return (
    // TODO: use dynamic id instead of a fixed id
    <article className="group flex flex-col gap-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <Link href={`/products/${id}`} className="absolute inset-0 z-0">
          <span className="sr-only">View {title}</span>
        </Link>
        <Image
          src={displayImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div
          className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/10 pointer-events-none"
          aria-hidden="true"
        />
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Toggle favorite
          }}
          variant="secondary"
          size="icon-sm"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className="absolute top-3 right-3 z-10 rounded-lg bg-background shadow-sm transition-transform duration-300 group-hover:scale-110"
        >
          <Heart
            className="size-4 text-foreground"
            strokeWidth={1.5}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </Button>
      </div>

      <div className="flex flex-col gap-1 transition-transform duration-300 group-hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/products/${id}`} className="text-sm font-bold tracking-wide text-foreground uppercase transition-colors group-hover:text-foreground/80 hover:underline">
            {title}
          </Link>
          <p className="shrink-0 text-sm font-medium text-foreground">{price}</p>
        </div>
        {showColors && (
          <div className="flex gap-1.5 mt-0.5 pl-1">
            {colorOptions && colorOptions.length > 0 ? (
              colorOptions.map((option, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColorOption(option);
                  }}
                  className={cn(
                    "size-4 rounded-full border shadow-sm transition-all",
                    selectedColorOption?.name === option.name ? "ring-2 ring-offset-2 ring-primary border-transparent" : "border-border hover:scale-110"
                  )}
                  style={{ backgroundColor: option.value }}
                  title={option.name}
                />
              ))
            ) : colors && colors.length > 0 ? (
              colors.map((color, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                  className={cn(
                    "size-4 rounded-full border shadow-sm transition-all",
                    selectedColor === color ? "ring-2 ring-offset-2 ring-primary border-transparent" : "border-border hover:scale-110"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))
            ) : null}
          </div>
        )}
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
            MRP inclusive of all taxes
          </p>
          <p className="shrink-0 text-sm text-muted-foreground line-through">
            {originalPrice}
          </p>
        </div>
      </div>
    </article>
  );
}
