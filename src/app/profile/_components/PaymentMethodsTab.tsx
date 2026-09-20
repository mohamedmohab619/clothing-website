"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreditCard, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { SavedCard } from "../types";
import { Dispatch, SetStateAction } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { handleDeleteCard } from "../utils";

interface PaymentMethodsTabProps {
  cards: SavedCard[],
  setCards: Dispatch<SetStateAction<SavedCard[]>>,
  setIsCardModalOpen: Dispatch<SetStateAction<boolean>>,
}

export function PaymentMethodsTab({ cards, setCards, setIsCardModalOpen }: PaymentMethodsTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Payment Methods
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Securely manage your saved credit cards and payment options
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsCardModalOpen(true)}
          className="gap-1.5 uppercase tracking-wider text-xs font-semibold"
        >
          <Plus className="size-4" /> Add Card
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={cn(
              "rounded-xl border p-5 bg-card flex flex-col justify-between transition-all",
              card.isDefault
                ? "border-primary ring-1 ring-primary/40 shadow-xs"
                : "border-border hover:border-foreground/30"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                  <CreditCard className="size-4 text-primary" />
                  {card.brand}
                </span>
                {card.isDefault && (
                  <Badge variant="secondary" className="text-[10px] font-semibold uppercase">
                    Default
                  </Badge>
                )}
              </div>

              <p className="text-lg font-mono tracking-widest text-foreground font-semibold">
                •••• •••• •••• {card.last4}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  <p className="uppercase text-[10px] font-semibold">Cardholder</p>
                  <p className="text-foreground font-medium">{card.holder}</p>
                </div>
                <div className="text-right">
                  <p className="uppercase text-[10px] font-semibold">Expires</p>
                  <p className="text-foreground font-medium">{card.expiry}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
              {!card.isDefault && (
                <button
                  type="button"
                  onClick={() => {
                    setCards((prev) =>
                      prev.map((c) => ({
                        ...c,
                        isDefault: c.id === card.id,
                      }))
                    );
                    toast.success("Default payment method updated");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Set as Default
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDeleteCard(card.id)}
                className="text-muted-foreground hover:text-red-500 transition-colors ml-auto"
                aria-label="Remove card"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center gap-3 text-xs text-muted-foreground">
        <ShieldCheck className="size-5 text-primary shrink-0" />
        <p>
          Your card details are tokenized and protected by bank-grade 256-bit encryption.
          AVEN never stores your full card number or security codes.
        </p>
      </div>
    </div>
  );
}
