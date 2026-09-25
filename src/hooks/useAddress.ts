"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Address } from '@/db/types';


export function useAddress() {
  const { data, error, isLoading } = useSWR<Address[]>("/api/me/addresses", fetcher);

  return {
    addresses: data || [],
    addressCount: data?.length || 0,
    defaultAddress: data?.filter((addr) => addr.isDefault == true)[0] || null,
    isLoading,
    isError: error,
  }
}
