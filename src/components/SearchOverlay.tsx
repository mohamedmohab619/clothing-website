"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Star, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

type CollectionItem = {
  id: string;
  name: string;
  count: number;
  image: string;
  href: string;
  keywords: string[];
};

const ALL_COLLECTIONS: CollectionItem[] = [
  {
    id: "women-tshirts",
    name: "Women's T-shirts & Tops",
    count: 26,
    image: "/images/women.jpg",
    href: "/products?category=women",
    keywords: ["women", "tshirt", "t shirt", "top", "shirt", "baby blue"],
  },
  {
    id: "men-tshirts",
    name: "Men T-Shirts & Tops",
    count: 86,
    image: "/images/men.jpg",
    href: "/products?category=men",
    keywords: ["men", "tshirt", "t shirt", "top", "shirt", "compression"],
  },
  {
    id: "hoodies",
    name: "Hoodies & Sweatshirts",
    count: 42,
    image: "/images/hoodie.jpg",
    href: "/products?category=hoodie",
    keywords: ["hoodie", "loose fit", "sweatshirt", "fleece", "pullover"],
  },
  {
    id: "jackets",
    name: "Jackets & Outerwear",
    count: 34,
    image: "/images/jacket.jpg",
    href: "/products?category=jacket",
    keywords: ["jacket", "cor jacket", "outerwear", "coat", "cor"],
  },
  {
    id: "accessories",
    name: "Scarfs, Hats & Accessories",
    count: 19,
    image: "/images/dark navy1.jpg",
    href: "/products?category=accessories",
    keywords: ["hat", "scarf", "knit", "patterned", "beanie", "accessories"],
  },
];

const POPULAR_SEARCH_TERMS = [
  "t shirt",
  "compression t shirt",
  "essential compression t shirt",
  "loose fit hoodie",
  "relaxed fit jacket",
  "patterned scarf",
  "rib-knit hat",
  "baby blue shirt",
];

function getFitSubtitle(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("hoodie")) return "Oversized Fit";
  if (lower.includes("cor") || lower.includes("jacket")) return "Relaxed Fit";
  if (lower.includes("shirt") || lower.includes("tee")) return "Slim Fit";
  if (lower.includes("scarf") || lower.includes("hat")) return "One Size";
  return "Regular Fit";
}

function getDiscountBadge(product: Product): { text: string; isSoldOut?: boolean } | null {
  const numPrice = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
  const numOriginal = parseFloat(product.originalPrice.replace(/[^0-9.-]+/g, ""));

  if (numOriginal > numPrice && numPrice > 0) {
    const percent = Math.round(((numOriginal - numPrice) / numOriginal) * 100);
    if (percent > 0) return { text: `${percent}% OFF` };
  }

  return { text: "14% OFF" };
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasLoadedInitialRef = useRef(false);

  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  // Whether user is currently typing (debouncing) or network fetch is in flight
  const isDebouncing = inputValue.trim() !== debouncedQuery.trim();
  const isSearching = isDebouncing || isLoading;

  // Handle open / close animations, focus, and body scroll lock
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        setIsAnimated(true);
        inputRef.current?.focus();
      }, 20);
      return () => clearTimeout(timer);
    } else {
      setIsAnimated(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setInputValue("");
        setDebouncedQuery("");
        document.body.style.overflow = "";
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Debounce the input by 380ms so typing is natural and doesn't rapidly thrash
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 380);

    return () => clearTimeout(timer);
  }, [inputValue, isOpen]);

  // Fetch products based on debounced query with AbortController to prevent race conditions
  const fetchProducts = useCallback((searchTerm: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    const url = searchTerm.trim()
      ? `/api/products?q=${encodeURIComponent(searchTerm.trim())}`
      : `/api/products`;

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
          hasLoadedInitialRef.current = true;
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Search fetch error:", err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Fetch whenever debouncedQuery updates or when overlay opens
  useEffect(() => {
    if (isOpen) {
      fetchProducts(debouncedQuery);
    }
  }, [debouncedQuery, isOpen, fetchProducts]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Keyboard navigation: Escape to close, Enter to search all
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && inputValue.trim()) {
        onClose();
        router.push(`/products?q=${encodeURIComponent(inputValue.trim())}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, inputValue, onClose, router]);

  // Filtered collections - fallback to popular collections if no specific collection matches
  const activeSearchText = debouncedQuery.trim() || inputValue.trim();
  const matchedCollections = activeSearchText
    ? ALL_COLLECTIONS.filter(
        (c) =>
          c.name.toLowerCase().includes(activeSearchText.toLowerCase()) ||
          c.keywords.some((k) => k.includes(activeSearchText.toLowerCase()))
      )
    : ALL_COLLECTIONS.slice(0, 3);

  const displayedCollections =
    matchedCollections.length > 0 ? matchedCollections : ALL_COLLECTIONS.slice(0, 3);

  // Filtered popular searches - always provide relevant or popular suggestions
  const matchedSearches = activeSearchText
    ? POPULAR_SEARCH_TERMS.filter(
        (term) =>
          term.toLowerCase().includes(activeSearchText.toLowerCase()) &&
          term.toLowerCase() !== activeSearchText.toLowerCase()
      )
    : [];

  const displayedSearches = activeSearchText
    ? [
        activeSearchText,
        ...(matchedSearches.length > 0
          ? matchedSearches
          : POPULAR_SEARCH_TERMS.slice(0, 3)),
      ]
    : POPULAR_SEARCH_TERMS.slice(0, 4);

  const handleSelectSearchTerm = (term: string) => {
    setInputValue(term);
    setDebouncedQuery(term);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setInputValue("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  };

  const handleProductClick = (slugOrId: string) => {
    onClose();
    router.push(`/products/${slugOrId}`);
  };

  const handleCollectionClick = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isRendered) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col justify-start transition-opacity duration-300",
        isAnimated ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Search site"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-down Search Panel */}
      <div
        className={cn(
          "relative z-10 w-full bg-background border-b border-border shadow-2xl transition-transform duration-300 ease-out min-h-[540px] max-h-[88vh] flex flex-col",
          isAnimated ? "translate-y-0" : "-translate-y-8"
        )}
      >
        {/* Top Search Input Bar */}
        <div className="relative w-full border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
            <Search className="size-5 sm:size-6 text-foreground shrink-0" strokeWidth={2} />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products, styles, collections..."
              className="w-full bg-transparent text-lg sm:text-2xl font-normal text-foreground placeholder:text-muted-foreground outline-none border-none ring-0"
              aria-label="Search query input"
            />

            {/* Loading Indicator Spinner */}
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              {isSearching && (
                <Loader2 className="size-4.5 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Clear Button */}
            {inputValue.trim().length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors shrink-0"
              >
                Clear
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="size-9 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors shrink-0"
              aria-label="Close search"
            >
              <X className="size-5 sm:size-6" strokeWidth={1.75} />
            </button>
          </div>

          {/* Smooth animated progress line underneath search bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden pointer-events-none">
            {isSearching && (
              <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-pulse" />
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 mx-auto w-full max-w-7xl flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 flex-1">
            {/* Left Column: Popular Searches & Collections */}
            <div
              className={cn(
                "md:col-span-4 lg:col-span-3 flex flex-col space-y-8 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6 min-h-[380px] transition-opacity duration-300",
                isSearching ? "opacity-70" : "opacity-100"
              )}
            >
              {/* Popular Searches */}
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-4">
                  Popular Searches
                </h3>
                <ul className="space-y-2.5">
                  {displayedSearches.map((term, index) => (
                    <li key={`${term}-${index}`}>
                      <button
                        type="button"
                        onClick={() => handleSelectSearchTerm(term)}
                        className="text-sm text-foreground/90 hover:text-primary transition-colors text-left hover:translate-x-1 duration-150 flex items-center gap-1.5 capitalize"
                      >
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Collections */}
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-4">
                  {matchedCollections.length > 0 ? "Collections" : "Popular Collections"}
                </h3>
                <div className="space-y-3">
                  {displayedCollections.map((col) => (
                    <div
                      key={col.id}
                      onClick={() => handleCollectionClick(col.href)}
                      className="group flex items-center gap-3 p-1.5 -mx-1.5 rounded-lg hover:bg-muted/60 cursor-pointer transition-colors"
                    >
                      <div className="relative size-12 rounded-md overflow-hidden bg-muted shrink-0">
                        <Image
                          src={col.image}
                          alt={col.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex items-baseline gap-1">
                          <span>{col.name}</span>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {col.count}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Products Grid */}
            <div className="md:col-span-8 lg:col-span-9 flex flex-col min-h-[380px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Products {products.length > 0 && `(${products.length})`}
                </h3>

                {(debouncedQuery || inputValue).trim().length > 0 && (
                  <Link
                    href={`/products?q=${encodeURIComponent((debouncedQuery || inputValue).trim())}`}
                    onClick={onClose}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    View all results <ArrowRight className="size-3" />
                  </Link>
                )}
              </div>

              {/* Initial Load Only: Skeletons */}
              {!hasLoadedInitialRef.current && isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2.5 animate-pulse">
                      <div className="aspect-[3/4] bg-muted rounded-lg" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                  {isSearching ? (
                    <div className="flex flex-col items-center gap-2.5">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Searching for &ldquo;{inputValue}&rdquo;...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 max-w-sm">
                      <p className="text-base font-semibold text-foreground">
                        No products found for &ldquo;{debouncedQuery || inputValue}&rdquo;
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Try searching for &ldquo;hoodie&rdquo;, &ldquo;shirt&rdquo;, &ldquo;jacket&rdquo;, or &ldquo;scarf&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-300 ease-out",
                    isSearching ? "opacity-50" : "opacity-100"
                  )}
                >
                  {products.slice(0, 3).map((product) => {
                    const discount = getDiscountBadge(product);
                    const fitSubtitle = getFitSubtitle(product.title);
                    const productIdentifier = product.slug || product.id;

                    return (
                      <article
                        key={product.id}
                        onClick={() => handleProductClick(productIdentifier)}
                        className="group cursor-pointer flex flex-col"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
                            {discount && (
                              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs shadow-xs">
                                {discount.text}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="mt-3 flex flex-col gap-1">
                          <h4 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {product.title}
                          </h4>

                          <p className="text-xs text-muted-foreground font-normal">
                            {fitSubtitle}
                          </p>

                          <div className="flex items-baseline gap-2 mt-0.5">
                            {product.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {product.originalPrice}
                              </span>
                            )}
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">
                              {product.price}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-semibold text-foreground">4.6</span>
                            <span className="text-[10px] text-muted-foreground">(76)</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
