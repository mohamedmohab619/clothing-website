"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, ZoomIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
};

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset to first view when color/images change
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const activeImage = images[activeIndex] || images[0];

  if (!images || images.length === 0) return null;

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={cn(
                "relative size-16 overflow-hidden rounded-lg bg-muted sm:size-20 transition-all duration-200",
                activeIndex === index
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105"
                  : "ring-1 ring-border hover:ring-foreground/50 opacity-80 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt={`Product view ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
        <ChevronDown
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <div className="relative min-h-[420px] flex-1 overflow-hidden rounded-lg bg-muted sm:min-h-[560px] lg:min-h-[640px]">
        <Image
          key={activeImage}
          src={activeImage}
          alt="Active product view"
          fill
          priority
          className="object-cover transition-opacity duration-300 ease-in-out animate-in fade-in-30"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Zoom image"
          className="absolute right-4 bottom-4 rounded-full bg-background/90 backdrop-blur-xs shadow-md hover:scale-105 transition-transform"
        >
          <ZoomIn className="size-4" />
        </Button>
      </div>
    </div>
  );
}
