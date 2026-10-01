"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Order } from '@/db/types';


export function useOrders() {
  const { data, error, isLoading } = useSWR<Order[]>("/api/me/orders", fetcher);

  return {
    orders: data || [],
    orderCount: data?.length || 0,
    isLoading,
    isError: error,
  }
}
