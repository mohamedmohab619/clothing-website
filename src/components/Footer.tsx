import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerColumns = [
  {
    title: "Product",
    links: ["T-shirt", "Hoodie", "Jacket", "Jeans", "Bags", "Sneakers"],
  },
  {
    title: "Categories",
    links: ["Men", "Women", "Kids", "Gift", "Collection", "New arrivals"],
  },
  {
    title: "Help",
    links: [
      "Customer service",
      "Site map",
      "Find a store",
      "Legal & privacy",
      "Contact",
      "Cookie notice",
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:px-8">
        <div>
          <p className="text-xl font-bold tracking-[0.2em] text-foreground uppercase">
            AVEN
          </p>
          <p className="mt-4 max-w-sm text-xs leading-relaxed tracking-wide text-muted-foreground uppercase">
            Get newsletters for upcoming products and best offers and discount
            for all items
          </p>
          <form className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="Email address"
              className="min-w-0 flex-1 rounded-lg"
            />
            <Button
              type="submit"
              size="default"
              className="rounded-lg uppercase tracking-wide"
            >
              Submit
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-xs tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-primary px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] tracking-wide text-primary-foreground uppercase">
          © 2026 AVEN. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
