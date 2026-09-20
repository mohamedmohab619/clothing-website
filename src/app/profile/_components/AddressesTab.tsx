"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { Address } from "../types";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { handleSetDefaultAddress, handleDeleteAddress } from "../utils";

interface AddressesTabProps {
  addresses: Address[],
  setIsAddressModalOpen: Dispatch<SetStateAction<boolean>>
}

export function AddressesTab({ addresses, setIsAddressModalOpen }: AddressesTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Saved Addresses
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your shipping and billing delivery destinations
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddressModalOpen(true)}
          className="gap-1.5 uppercase tracking-wider text-xs font-semibold"
        >
          <Plus className="size-4" /> Add Address
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={cn(
              "rounded-xl border p-5 bg-card flex flex-col justify-between transition-all",
              addr.isDefault
                ? "border-primary ring-1 ring-primary/40 shadow-xs"
                : "border-border hover:border-foreground/30"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-foreground">{addr.name}</span>
                {addr.isDefault && (
                  <Badge variant="secondary" className="text-[10px] font-semibold uppercase">
                    Default Shipping
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>{addr.street}</p>
                {addr.apt && <p>{addr.apt}</p>}
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
                  className="text-primary hover:underline font-medium"
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
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
