"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { Order } from "../types";

interface OrderTrackingDialogProps {
  trackingOrder: Order | null,
  setTrackingOrder: Dispatch<SetStateAction<Order | null>>
}

export function OrderTrackingDialog({ trackingOrder, setTrackingOrder }: OrderTrackingDialogProps) {
  return (
    <Dialog open={!!trackingOrder} onOpenChange={(open) => !open && setTrackingOrder(null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Track Package</DialogTitle>
          <DialogDescription>
            Real-time shipping status for Order #{trackingOrder?.id}
          </DialogDescription>
        </DialogHeader>

        {trackingOrder && (
          <div className="space-y-6 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
              <div>
                <p className="text-muted-foreground uppercase font-semibold text-[10px]">Carrier</p>
                <p className="font-semibold text-sm text-foreground mt-0.5">{trackingOrder.carrier}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground uppercase font-semibold text-[10px]">Tracking Number</p>
                <p className="font-mono text-xs text-primary font-semibold mt-0.5">{trackingOrder.trackingNumber}</p>
              </div>
            </div>

            {/* Step Progress Tracker */}
            <div className="space-y-4">
              <p className="font-bold text-foreground text-sm">Delivery Milestones</p>
              <div className="space-y-4 pl-2 border-l-2 border-primary/30 ml-2">
                <div className="relative pl-5">
                  <div className="absolute -left-[19px] top-0 size-3.5 rounded-full bg-primary ring-4 ring-background" />
                  <p className="font-semibold text-foreground text-xs">Out for Delivery</p>
                  <p className="text-muted-foreground text-[11px]">Today, 9:20 AM &bull; On courier vehicle</p>
                </div>
                <div className="relative pl-5">
                  <div className="absolute -left-[19px] top-0 size-3.5 rounded-full bg-primary ring-4 ring-background" />
                  <p className="font-semibold text-foreground text-xs">Arrived at Local Hub</p>
                  <p className="text-muted-foreground text-[11px]">Sep 4, 3:45 AM &bull; Los Angeles Distribution Center</p>
                </div>
                <div className="relative pl-5">
                  <div className="absolute -left-[19px] top-0 size-3.5 rounded-full bg-primary ring-4 ring-background" />
                  <p className="font-semibold text-foreground text-xs">Package Shipped</p>
                  <p className="text-muted-foreground text-[11px]">Sep 3, 4:10 PM &bull; AVEN Warehouse Facility</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setTrackingOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
