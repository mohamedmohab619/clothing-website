import { Variant, ProductImage } from "@/db/types";

export type UIColorOption = {
  name: string;
  value: string;
  images: string[];
  sizes: string[];
};

export type UIProduct = {
  id: string;
  slug: string;
  title: string;
  name: string;
  description: string;
  price: string;
  rawPrice: number;
  originalPrice: string;
  rawComparePrice: number | null;
  image: string;
  isFavorite: boolean;
  colorOptions: UIColorOption[];
  availableSizes: string[];
  variants: Variant[];
  images: ProductImage[];
  collections?: string[] | number[];
};

export type ProductSearchFilters = {
  q?: string;
  category?: string;
  collection?: string;
  color?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
};
