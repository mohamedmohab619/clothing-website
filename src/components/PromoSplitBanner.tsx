import Image from "next/image";
import { Caveat } from "next/font/google";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export default function PromoSplitBanner() {
  return (
    <section className="grid w-full grid-cols-1 overflow-hidden rounded-lg md:grid-cols-2">
      <div className="relative aspect-[4/3] bg-muted md:aspect-auto md:min-h-[420px]">
        <Image
          src="/images/sale.jpg"
          alt="Sale Promotion"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <p
          className={`${caveat.className} absolute top-6 left-6 z-10 max-w-[12rem] text-3xl leading-tight text-destructive sm:text-4xl`}
        >
          Just for collections
        </p>
      </div>

      <div className="flex flex-col justify-center bg-background px-8 py-12 sm:px-12 lg:px-16">
        <h2 className="max-w-md text-lg font-bold tracking-wide text-foreground uppercase sm:text-xl">
          Find your perfect look at harfa sty new on paris
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation.
        </p>

        <div className="mt-8">
          <p className="text-sm font-bold tracking-wide text-foreground uppercase">
            Sales and discount!
          </p>
          <p className="text-6xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            87%
          </p>
        </div>

        <Link
          href="#store"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "mt-8 w-fit rounded-lg uppercase tracking-wide"
          )}
        >
          Find the store
        </Link>
      </div>
    </section>
  );
}
