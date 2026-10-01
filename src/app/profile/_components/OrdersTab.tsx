"use client";

import { OrderDetailsCard } from "./OrderDetailsCard";
import { useOrders } from "@/hooks/useOrders";
import { AlertCircleIcon } from "lucide-react";

export function OrdersTab() {
  const { orders, isLoading, isError } = useOrders();

  // TODO: use dedicated "LoadingTab" componet
  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center align-center">
        loading...
      </div>
    );
  };

  // TODO: use dedicated "ErrorTab" component
  if (isError) {
    return (
      <div className="h-full w-full flex justify-center align-center">
        <span className="text-destructive">
          <AlertCircleIcon />
          Error Loading Addresses
        </span>
      </div>
    );
  };

  // TODO: impelement "no orders yet, make your first order" view
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Order History
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track, view receipts, and buy your favorite styles again
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {orders.map((order, idx) => (
          <OrderDetailsCard
            key={idx}
            order={order}
          />))}
      </div>
    </div>
  );
}
