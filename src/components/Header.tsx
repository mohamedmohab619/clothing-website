"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import CartSidebar from "@/components/CartSidebar";
import SearchOverlay from "@/components/SearchOverlay";

const navLinks = [
  { href: "/products?category=men", label: "Men" },
  { href: "/products?category=women", label: "Woman" },
  { href: "/products?category=kids", label: "Kids" },
  { href: "/products", label: "All products" },
  { href: "/products", label: "Gifts" },
] as const;

type Underline = {
  left: number;
  width: number;
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { cartCount } = useCart();
  const { favoritesCount } = useFavorites();
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
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="bg-primary px-4 py-2 text-center">
        <p className="text-[11px] tracking-wide text-primary-foreground/80 uppercase sm:text-xs">
          Free shipping on orders over $99 | Flash sale up to 40% off
        </p>
      </div>
      <div className="relative border-b border-border">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="shrink-0 text-xl font-bold tracking-[0.2em] text-foreground uppercase"
          >
            AVEN
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
              className="inline-flex"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="size-5" strokeWidth={1.5} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              className="relative"
              render={<Link href="/favorites" />}
            >
              <Heart className="size-5" strokeWidth={1.5} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
            </Button>
            <Sheet>
              <SheetTrigger render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Shopping cart"
                  className="relative"
                />
              }>
                <ShoppingCart className="size-5" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </SheetTrigger>
              <CartSidebar />
            </Sheet>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Account"
              className="hidden sm:inline-flex"
              render={<Link href="/profile" />}
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
      </div>

      {
        mobileOpen && (
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
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground w-full text-left"
                >
                  <Search className="size-4" />
                  Search
                </button>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="flex items-center justify-between text-sm font-medium text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Heart className="size-4 text-rose-500" />
                    Favorites
                  </span>
                  {favoritesCount > 0 && (
                    <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="flex items-center justify-between text-sm font-medium text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <User className="size-4 text-primary" />
                    My Profile
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    VIP
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        )
      }
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
