"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  {
    id: "jeans",
    title: "Jeans",
    src: "/images/jeans.jpg",
    href: "#jeans",
    className: "min-h-[180px] md:col-start-1 md:row-start-1 md:min-h-[220px]",
  },
  {
    id: "hoodie",
    title: "Hoodie",
    src: "/images/hoodie.jpg",
    href: "#hoodie",
    className:
      "col-span-2 row-span-2 min-h-[380px] md:col-span-2 md:col-start-2 md:row-span-2 md:row-start-1 md:min-h-0",
    showDiscover: true,
  },
  {
    id: "bags",
    title: "Bags",
    src: "/images/bags.jpg",
    href: "#bags",
    className: "min-h-[180px] md:col-start-4 md:row-start-1 md:min-h-[220px]",
  },
  {
    id: "tshirts",
    title: "T-shirts",
    src: "/images/tshirts.jpg",
    href: "#t-shirts",
    className:
      "row-span-2 min-h-[380px] md:col-start-1 md:row-span-2 md:row-start-2 md:min-h-0",
  },
  {
    id: "sneakers",
    title: "Sneakers",
    src: "/images/sneakers.jpg",
    href: "#sneakers",
    className:
      "col-span-2 min-h-[180px] md:col-span-2 md:col-start-2 md:row-start-3 md:min-h-[220px]",
  },
  {
    id: "jacket",
    title: "Jacket",
    src: "/images/jacket.jpg",
    href: "#jacket",
    className:
      "row-span-2 min-h-[380px] md:col-start-4 md:row-span-2 md:row-start-2 md:min-h-0",
  },
] as const;

export default function FeaturedCollections() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll("[data-bento-item]");
    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power1.out",
        stagger: 0.05,
        clearProps: "transform",
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section className="w-full bg-background text-foreground">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-wide text-foreground uppercase sm:text-4xl">
          Featured collections
        </h2>
        <p className="mt-4 text-xs tracking-[0.2em] text-muted-foreground uppercase sm:text-sm">
          Top new collections with harfa brand explore now
        </p>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-3 md:auto-rows-[minmax(220px,1fr)]"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            data-bento-item
            className={cn(
              "group relative overflow-hidden rounded-lg bg-muted",
              item.className
            )}
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-3 p-4 sm:p-5">
              <h3 className="text-lg font-bold tracking-wide text-primary-foreground uppercase sm:text-xl md:text-2xl">
                {item.title}
              </h3>
              {"showDiscover" in item && item.showDiscover && (
                <span
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "rounded-lg uppercase tracking-wide"
                  )}
                >
                  Discover
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
