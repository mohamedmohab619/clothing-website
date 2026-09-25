"use client";

import { Badge } from "@/components/ui/badge";
import { Address } from "@/db/types";
import { handleDeleteAddress, handleSetDefaultAddress } from "@/lib/addresses/api/utils";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface AddressCardProps {
  addr: Address
}

export function AddressCard({ addr }: AddressCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 bg-card flex flex-col justify-between transition-all",
        addr.isDefault
          ? "border-primary ring-1 ring-primary/40 shadow-xs"
          : "border-border hover:border-foreground/30"
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-sm text-foreground">{addr.label}</span>
          {addr.isDefault && (
            <Badge variant="secondary" className="text-[10px] font-semibold uppercase">
              Default Shipping
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>{addr.street}</p>
          {addr.unit && <p>{addr.unit}</p>}
          <p>
            {addr.city}, {addr.state} {addr.zip}
          </p>
          <p>{addr.country}</p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
        {!addr.isDefault && (
          <button
            type="button"
            onClick={() => handleSetDefaultAddress(addr.id)}
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            Set as Default
          </button>
        )}
        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={() => handleDeleteAddress(addr.id)}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            aria-label="Delete address"
          >
            <Trash2 className="size-4 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
}
