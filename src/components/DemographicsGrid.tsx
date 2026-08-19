import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const demographics = [
  {
    id: "men",
    label: "Men",
    href: "/products?category=men",
    image: "/images/men.jpg",
  },
  {
    id: "women",
    label: "Women",
    href: "/products?category=women",
    image: "/images/women.jpg",
  },
  {
    id: "kids",
    label: "Kids",
    href: "/products?category=kids",
    image: "/images/kids.jpg",
  },
] as const;

export default function DemographicsGrid() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {demographics.map((item) => (
          <article
            key={item.id}
            className="relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-lg bg-muted p-6 sm:p-8"
          >
            <Image
              src={item.image}
              alt={item.label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-foreground/10"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h3 className="text-3xl font-bold tracking-wide text-primary-foreground uppercase sm:text-4xl">
                {item.label}
              </h3>
              <Link
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "mt-4 rounded-lg bg-background text-foreground uppercase tracking-wide hover:bg-background/90"
                )}
              >
                Shop now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
