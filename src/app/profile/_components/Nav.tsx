"use client";
import { User, Package, Heart, MapPin, CreditCard, Settings } from "lucide-react";
import { Address, Order, SavedCard, TabKey } from "../types";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/context/FavoritesContext";

interface NavProps {
  orders: Order[],
  addresses: Address[],
  cards: SavedCard[],
  activeTab: TabKey,
  setActiveTab: Dispatch<SetStateAction<TabKey>>
}

export function Nav({ orders, addresses, cards, activeTab, setActiveTab }: NavProps) {
  const { favoritesCount } = useFavorites();

  return (
    <div className="md:col-span-4 lg:col-span-3 rounded-xl border border-border bg-card p-2 shadow-xs space-y-1">
      {[
        { id: "orders", label: "My Orders", icon: Package, badge: orders.length },
        { id: "personal", label: "Personal Information", icon: User },
        { id: "addresses", label: "Saved Addresses", icon: MapPin, badge: addresses.length },
        { id: "payments", label: "Payment Methods", icon: CreditCard, badge: cards.length },
        { id: "wishlist", label: "Wishlist", icon: Heart, badge: favoritesCount },
        { id: "settings", label: "Preferences & Security", icon: Settings },
      ].map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id as TabKey)}
            className={cn(
              "w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-150 text-left",
              isActive
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="size-4" strokeWidth={isActive ? 2 : 1.75} />
              {item.label}
            </span>
            {typeof item.badge === "number" && item.badge > 0 && (
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
