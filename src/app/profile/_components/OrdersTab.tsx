"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Order } from "../types";
import { toast } from "sonner";
import { OldOrderDetailsCard } from "./OldOrderDetailsCard";
import { OrderDetailsCard } from "./OrderDetailsCard";

interface OrdersTabProps {
  orders: Order[],
  setTrackingOrder: Dispatch<SetStateAction<Order | null>>,
}

export function OrdersTab({ orders, setTrackingOrder }: OrdersTabProps) {
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    fetch(`/api/me/orders`)
      .then(res => res.json())
      .then(res => {
        console.log("fetching orders response.......................................");
        console.log(res);
        setOrdersData(res);
      }).catch((error) => {
        toast.error("Error to fetch orders");
        console.error("Failed to fetch orders", error);
      })
  }, []);

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
        {ordersData.map((order, idx) => (
          <OrderDetailsCard
            key={idx}
            order={order}
          />))}
      </div>

      <div className="space-y-5">
        {orders.map((order, idx) => (
          <OldOrderDetailsCard
            key={idx}
            order={order}
            setTrackingOrder={setTrackingOrder}
          />))}
      </div>
    </div>
  );
}
