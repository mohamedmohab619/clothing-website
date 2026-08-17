"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#", label: "Men's" },
  { href: "#", label: "Woman's" },
  { href: "#", label: "Kid's" },
  { href: "#", label: "Accessories" },
  { href: "#", label: "Gifts" },
] as const;

type Underline = {
  left: number;
  width: number;
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [underline, setUnderline] = useState<Underline>({ left: 0, width: 0 });

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const isHovering = hoverIndex !== null;

  const updateUnderline = useCallback(() => {
    if (hoverIndex === null) return;

    const nav = navRef.current;
    const link = linkRefs.current[hoverIndex];
    if (!nav || !link) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    setUnderline({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
    });
  }, [hoverIndex]);

  useLayoutEffect(() => {
    updateUnderline();
  }, [updateUnderline]);

  useEffect(() => {
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [updateUnderline]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-[0.2em] text-foreground uppercase"
        >
          MILAN
        </Link>

        <nav
          ref={navRef}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
          aria-label="Primary"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              onMouseEnter={() => setHoverIndex(index)}
              onFocus={() => setHoverIndex(index)}
              onBlur={() => setHoverIndex(null)}
              className={cn(
                "relative pb-1 text-sm text-muted-foreground transition-colors",
                hoverIndex === index && "font-medium text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute bottom-0 h-px bg-foreground transition-[left,width,opacity] duration-300 ease-out",
              isHovering ? "opacity-100" : "opacity-0"
            )}
            style={{
              left: underline.left,
              width: underline.width,
            }}
          />
        </nav>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hidden sm:inline-flex"
          >
            <Search className="size-5" strokeWidth={1.5} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="size-5" strokeWidth={1.5} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Account"
            className="hidden sm:inline-flex"
          >
            <User className="size-5" strokeWidth={1.5} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-6" strokeWidth={1.5} />
            ) : (
              <Menu className="size-6" strokeWidth={1.5} />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-border bg-background px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block text-sm font-medium text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
