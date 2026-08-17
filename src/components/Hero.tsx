import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-muted">
      <Image
        src="/images/hero.jpg"
        alt="Hero Banner"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-foreground/25" aria-hidden="true" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-8 px-6 text-center">
        <h1 className="text-3xl font-bold tracking-wide text-primary-foreground uppercase sm:text-4xl md:text-5xl md:leading-tight lg:text-6xl">
          In the right outfit anything is possible
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="#collections"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "rounded-lg px-8 uppercase tracking-wide"
            )}
          >
            Collections
          </Link>
          <Link
            href="#shop"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "rounded-lg px-8 uppercase tracking-wide"
            )}
          >
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
}
