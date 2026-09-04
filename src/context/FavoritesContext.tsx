"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import type { ColorOption } from "@/data/products";

export type FavoriteItem = {
  id: string;
  slug?: string;
  title: string;
  price: string;
  rawPrice?: number;
  originalPrice?: string;
  image: string;
  colorOptions?: ColorOption[];
  selectedColor?: string;
  selectedSize?: string;
};

type FavoritesContextType = {
  favorites: FavoriteItem[];
  favoritesCount: number;
  isFavorite: (idOrSlug: string, colorName?: string) => boolean;
  toggleFavorite: (product: Partial<FavoriteItem> & { id: string; title: string; image: string }, selectedOption?: ColorOption) => void;
  removeFromFavorites: (idOrSlug: string, colorName?: string) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load favorites from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Failed to parse favorites from local storage", error);
      }
    }
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, isMounted]);

  const isFavorite = (idOrSlug: string, colorName?: string): boolean => {
    if (!idOrSlug) return false;
    return favorites.some((item) => {
      const idMatch = item.id === idOrSlug || (item.slug && item.slug === idOrSlug);
      if (!idMatch) return false;
      if (colorName && item.selectedColor) {
        return item.selectedColor.toLowerCase() === colorName.toLowerCase();
      }
      return true;
    });
  };

  const toggleFavorite = (
    product: Partial<FavoriteItem> & { id: string; title: string; image: string },
    selectedOption?: ColorOption
  ) => {
    const activeColor = selectedOption?.name || product.selectedColor || product.colorOptions?.[0]?.name;

    // Check if this specific item + color is already favorited
    const existingIndex = favorites.findIndex((item) => {
      const idMatch = item.id === product.id || (product.slug && item.slug === product.slug);
      if (!idMatch) return false;
      if (activeColor && item.selectedColor) {
        return item.selectedColor.toLowerCase() === activeColor.toLowerCase();
      }
      return !activeColor && !item.selectedColor;
    });

    if (existingIndex !== -1) {
      // Remove only this specific color variant
      setFavorites((prev) => prev.filter((_, idx) => idx !== existingIndex));
      toast.info("Removed from wishlist", {
        description: `${product.title}${activeColor ? ` (${activeColor})` : ""}`,
      });
    } else {
      const displayImg = selectedOption?.images?.[0] || product.image;

      const newItem: FavoriteItem = {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price || "$39.99",
        rawPrice: product.rawPrice ?? (product.price ? parseFloat(product.price.replace(/[^0-9.-]+/g, "")) : 39.99),
        originalPrice: product.originalPrice || "$79.99",
        image: displayImg,
        colorOptions: product.colorOptions,
        selectedColor: activeColor,
        selectedSize: product.selectedSize || "M",
      };

      setFavorites((prev) => [newItem, ...prev]);
      toast.success("Added to wishlist", {
        description: `${product.title}${activeColor ? ` (${activeColor})` : ""}`,
      });
    }
  };

  const removeFromFavorites = (idOrSlug: string, colorName?: string) => {
    setFavorites((prev) => {
      const itemToRemove = prev.find((item) => {
        const idMatch = item.id === idOrSlug || (item.slug && item.slug === idOrSlug);
        if (!idMatch) return false;
        if (colorName && item.selectedColor) {
          return item.selectedColor.toLowerCase() === colorName.toLowerCase();
        }
        return true;
      });

      if (itemToRemove) {
        toast.info("Removed from wishlist", {
          description: `${itemToRemove.title}${itemToRemove.selectedColor ? ` (${itemToRemove.selectedColor})` : ""}`,
        });
      }

      return prev.filter((item) => {
        const idMatch = item.id === idOrSlug || (item.slug && item.slug === idOrSlug);
        if (!idMatch) return true;
        if (colorName && item.selectedColor) {
          return item.selectedColor.toLowerCase() !== colorName.toLowerCase();
        }
        return false;
      });
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.info("Wishlist cleared");
  };

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount,
        isFavorite,
        toggleFavorite,
        removeFromFavorites,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
