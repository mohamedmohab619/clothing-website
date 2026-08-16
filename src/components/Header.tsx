"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";

const navLinks = [
  { href: "#", label: "Men's" },
  { href: "#", label: "Woman's" },
  { href: "#", label: "Kid's" },
  { href: "#", label: "Accessories" },
  { href: "#", label: "Gifts" },
] as const;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-[0.2em] text-black uppercase"
        >
          MILAN
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm text-black/80 transition-colors hover:text-black ${
                index === 0
                  ? "border-b border-black pb-0.5 font-medium text-black"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Search"
            className="hidden text-black transition-opacity hover:opacity-70 sm:inline-flex"
          >
            <Search className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Shopping cart"
            className="text-black transition-opacity hover:opacity-70"
          >
            <ShoppingCart className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="hidden text-black transition-opacity hover:opacity-70 sm:inline-flex"
          >
            <User className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="text-black md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-6" strokeWidth={1.5} />
            ) : (
              <Menu className="size-6" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-black/5 bg-white px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block text-sm font-medium text-black"
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
