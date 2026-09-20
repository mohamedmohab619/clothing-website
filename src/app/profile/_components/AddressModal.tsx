"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { handleAddAddress } from "../utils";

interface AddressModalProps {
  isAddressModalOpen: boolean,
  setIsAddressModalOpen: Dispatch<SetStateAction<boolean>>
}

export function AddressModal({ isAddressModalOpen, setIsAddressModalOpen }: AddressModalProps) {
  const [newAddrName, setNewAddrName] = useState("");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("");
  const [newAddrState, setNewAddrState] = useState("");
  const [newAddrZip, setNewAddrZip] = useState("");
  const [newAddrCountry, setNewAddrCountry] = useState("United States");

  return (
    <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Enter your shipping destination details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddAddress} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Full Name *</Label>
            <Input
              value={newAddrName}
              onChange={(e) => setNewAddrName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Street Address *</Label>
            <Input
              value={newAddrStreet}
              onChange={(e) => setNewAddrStreet(e.target.value)}
              placeholder="123 Fashion Blvd"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">City *</Label>
              <Input
                value={newAddrCity}
                onChange={(e) => setNewAddrCity(e.target.value)}
                placeholder="Los Angeles"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">State *</Label>
              <Input
                value={newAddrState}
                onChange={(e) => setNewAddrState(e.target.value)}
                placeholder="CA"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">ZIP Code *</Label>
              <Input
                value={newAddrZip}
                onChange={(e) => setNewAddrZip(e.target.value)}
                placeholder="90001"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Country</Label>
              <Input
                value={newAddrCountry}
                onChange={(e) => setNewAddrCountry(e.target.value)}
                placeholder="United States"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
