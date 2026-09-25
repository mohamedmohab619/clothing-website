"use client";

import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge, ShoppingBag, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { handleBuyAgain } from "../utils.new";
import { Order } from "@/db/types";
import { toast } from "sonner";

// TODO: reactivate setTrackingOrder
interface OrderDetailsCardProps {
  order: Order,
  // setTrackingOrder: Dispatch<SetStateAction<Order | null>>,
}

export function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const creationDate = new Date(order.createdAt);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs" >
      {/* Order Header */}
      <div className="p-4 sm:p-5 bg-muted/20 border-b border-border flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div>
            <p className="text-muted-foreground uppercase font-semibold">
              Order Placed
            </p>
            <p className="font-semibold text-foreground mt-0.5">
              {(new Date(order.createdAt)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground uppercase font-semibold">Total</p>
            <p className="font-semibold text-foreground mt-0.5">
              ${(order.total / 100)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground uppercase font-semibold">
              Order Number
            </p>
            <p className="font-semibold text-primary mt-0.5">{order.orderNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "text-[11px] font-semibold capitalize",
              order.orderStatus === "shipped"
                ? "bg-blue-500 text-white"
                : "bg-emerald-600 text-white"
            )}
          >
            {order.orderStatus}
          </Badge>
        </div>
      </div>

      {/* Tracking Banner if In Transit */}
      {order.orderStatus === "shipped" && (
        <div className="p-4 bg-blue-500/5 border-b border-blue-500/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
            <Truck className="size-4 shrink-0" />
            <span>
              {/* TODO: carrier and estimated delivery date needed */}
              Fedex Express &bull; Estimated delivery:{" "}
              <strong>Tomorrow by 7:00 PM</strong>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.error("Non Functional")}
            className="text-xs h-7 px-3 text-blue-600 border-blue-500/30 hover:bg-blue-500/10"
          >
            Track Package
          </Button>
        </div>
      )}

      {/* Order Items */}
      <div className="divide-y divide-border p-4 sm:p-5">
        {order.items?.map((item) => (
          <div
            key={`${order.id}-${item.id}`}
            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative size-16 sm:size-20 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                {/* TODO: maybe use a generic image in case item's image is null for better UX */}
                <Image
                  src={item.image ?? ""}
                  alt={`${item.color} ${item.productName}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div>
                <Link
                  href={`/products/${item.id}`}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {item.productName}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Color: <span className="text-foreground">{item.color}</span> &bull; Size:{" "}
                  <span className="text-foreground">{item.size}</span>
                </p>
                <p className="text-xs font-semibold text-foreground mt-1">
                  ${(item.unitPrice / 100)} &times; {item.quantity}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBuyAgain(item)}
                className="text-xs h-8 uppercase tracking-wider font-semibold gap-1.5"
              >
                <ShoppingBag className="size-3.5" />
                Buy Again
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
