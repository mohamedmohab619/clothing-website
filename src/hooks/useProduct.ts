"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { UIProduct } from "@/lib/products/types";

type ProductResponse = { success: boolean; data?: UIProduct };

export function useProduct(slug?: string) {
  const { data, error, isLoading } = useSWR<ProductResponse>(
    slug ? `/api/products/${slug}` : null, // null = don't fetch
    fetcher
  );

  return {
    product: data?.success && data.data ? data.data : null,
    isLoading,
    isError: !!error || (!!data && !data.success),
  };
}
