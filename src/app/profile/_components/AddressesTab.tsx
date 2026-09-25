"use client"

import { Button } from "@/components/ui/button";
import { AlertCircleIcon, MapPinHouse, Plus } from "lucide-react";
import { Address } from "../types";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { useAddress } from "@/hooks/useAddress";
import { AddressCard } from "./AddressCard";

interface AddressesTabProps {
  addresses: Address[],
  setIsAddressModalOpen: Dispatch<SetStateAction<boolean>>
}

export function AddressesTab({ setIsAddressModalOpen }: AddressesTabProps) {
  const { addresses, defaultAddress, isLoading, isError } = useAddress();

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

  // I think that doesn't need it's own component, but it needs improvement
  // TODO: improve that!
  if (addresses.length < 1) {
    return (
      <Container addressCount={addresses.length} setIsAddressModalOpen={setIsAddressModalOpen} >
        <div className="py-16 text-center rounded-xl border border-dashed border-border bg-muted/10">
          <MapPinHouse className="size-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-base font-semibold text-foreground">You have no addresses saved</p>
          <p className="text-xs text-muted-foreground mt-1 mb-6">
            save your first address for a quicker checkout process
          </p>
          <Button
            size="sm"
            className="uppercase tracking-wider text-xs font-semibold cursor-pointer"
            onClick={() => setIsAddressModalOpen(true)}
          >
            Add Address
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container addressCount={addresses.length} setIsAddressModalOpen={setIsAddressModalOpen}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {defaultAddress && <AddressCard addr={defaultAddress} />}

        {addresses.map((addr) => (
          <AddressCard key={addr.id} addr={addr} />
        ))}
      </div>
    </Container>
  );
}


interface containerProps {
  children: ReactNode,
  addressCount: number,
  setIsAddressModalOpen: Dispatch<SetStateAction<boolean>>
}
function Container({ children, addressCount, setIsAddressModalOpen }: containerProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Saved Addresses ({addressCount})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your shipping and billing delivery destinations
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddressModalOpen(true)}
          className="gap-1.5 uppercase tracking-wider text-xs font-semibold cursor-pointer"
        >
          <Plus className="size-4" /> Add Address
        </Button>
      </div>

      {children}
    </div>
  );
}
