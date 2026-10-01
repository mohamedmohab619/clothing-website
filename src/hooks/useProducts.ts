"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { UIProduct } from "@/lib/products/types";

type ProductsResponse = { success: boolean; data?: UIProduct[] };

export function useProducts(query?: string) {
  const { data, error, isLoading } = useSWR<ProductsResponse>(
    query ? `/api/products?${query}` : "/api/products",
    fetcher,
    { keepPreviousData: true }
  );

  return {
    products: data?.success && data.data ? data.data : [],
    productCount: data?.data?.length ?? 0,
    isLoading,
    isError: !!error || (!!data && !data.success),
  };
}
