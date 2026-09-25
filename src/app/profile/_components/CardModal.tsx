"use client";

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
import { handleAddCard } from "../utils.new";
import { Dispatch, SetStateAction, useState } from "react";

interface CardModalProps {
  isCardModalOpen: boolean,
  setIsCardModalOpen: Dispatch<SetStateAction<boolean>>
}

export function CardModal({ isCardModalOpen, setIsCardModalOpen }: CardModalProps) {
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");

  return (
    <Dialog open={isCardModalOpen} onOpenChange={setIsCardModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Enter your credit or debit card information securely.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddCard} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Card Number *</Label>
            <Input
              maxLength={19}
              value={newCardNumber}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                setNewCardNumber(raw.replace(/(\d{4})(?=\d)/g, "$1 "));
              }}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Cardholder Name *</Label>
            <Input
              value={newCardHolder}
              onChange={(e) => setNewCardHolder(e.target.value)}
              placeholder="NAME AS ON CARD"
              className="uppercase"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Expires (MM/YY) *</Label>
              <Input
                maxLength={5}
                value={newCardExpiry}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setNewCardExpiry(raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw);
                }}
                placeholder="08/28"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">CVV *</Label>
              <Input maxLength={4} placeholder="123" required />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCardModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Card</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
