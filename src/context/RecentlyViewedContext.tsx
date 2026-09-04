"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Product } from "@/data/products";

type RecentlyViewedContextType = {
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const STORAGE_KEY = "aven_recently_viewed";
const MAX_ITEMS = 8;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed);
        }
      } catch (error) {
        console.error("Failed to parse recently viewed from local storage:", error);
      }
    }
  }, []);

  const addRecentlyViewed = useCallback((product: Product) => {
    if (!product || (!product.id && !product.slug)) return;

    setRecentlyViewed((prev) => {
      // Remove any existing duplicate of this product
      const filtered = prev.filter(
        (p) =>
          p.id !== product.id &&
          (!product.slug || !p.slug || p.slug !== product.slug)
      );
      // Prepend the new product to the front, limited to MAX_ITEMS
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <RecentlyViewedContext.Provider
      value={{ recentlyViewed, addRecentlyViewed, clearRecentlyViewed }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}
