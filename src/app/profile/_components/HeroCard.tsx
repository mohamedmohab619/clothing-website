"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserData, Order, Address, TabKey } from "../types";
import { Badge } from "@/components/ui/badge";
import { Heart, LogOut, MapPin, Package, Sparkles } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useAddress } from "@/hooks/useAddress";

interface HeroCardProps {
  user: UserData,
  orderCount: number,
  ordersInTransit: number,
  addresses: Address[],
  setActiveTab: Dispatch<SetStateAction<TabKey>>
};

export function HeroCard({ user, orderCount, ordersInTransit, addresses, setActiveTab }: HeroCardProps) {
  const router = useRouter();
  const { favoritesCount } = useFavorites();


  const { addressCount, defaultAddress } = useAddress();

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* User Avatar & Info */}
        <div className="flex items-center gap-5">
          <div className="relative size-18 sm:size-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl tracking-wider shadow-md shrink-0 ring-4 ring-muted/50">
            {user.name[0]}
            <span className="absolute bottom-0 right-0 size-5 rounded-full bg-emerald-500 border-2 border-background" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {user.name}
              </h1>
              <Badge variant="secondary" className="gap-1 text-[11px] font-semibold tracking-wider uppercase">
                <Sparkles className="size-3 text-amber-500 fill-amber-500" />
                VIP Gold
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Member since {user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/products" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full text-xs uppercase tracking-wider font-semibold">
              Browse Store
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success("Logged out successfully");
                    router.push("/");
                  }
                }
              })
            }}
            variant="ghost"
            className="text-xs text-muted-foreground hover:text-red-600 gap-1.5 cursor-pointer"
          >
            <LogOut className="size-4" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Quick KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border">
        <div
          onClick={() => setActiveTab("orders")}
          className="p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Package className="size-4 text-primary" />
            <span>Total Orders</span>
          </div>
          <p className="text-xl font-bold text-foreground mt-1.5">{orderCount}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            {ordersInTransit ? `${ordersInTransit} in transit` : "All orders delivered"}
          </p>
        </div>

        <div
          onClick={() => setActiveTab("wishlist")}
          className="p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Heart className="size-4 text-rose-500" />
            <span>Wishlist Items</span>
          </div>
          <p className="text-xl font-bold text-foreground mt-1.5">{favoritesCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Saved for later</p>
        </div>

        <div
          onClick={() => setActiveTab("addresses")}
          className="p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <MapPin className="size-4 text-primary" />
            <span>Saved Addresses</span>
          </div>
          <p className="text-xl font-bold text-foreground mt-1.5">{addressCount || 0}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Default: {defaultAddress?.label}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Sparkles className="size-4 text-amber-500" />
            <span>Reward Points</span>
          </div>
          <p className="text-xl font-bold text-foreground mt-1.5">450 pts</p>
          <p className="text-[11px] text-primary font-medium mt-0.5">$45.00 Store credit</p>
        </div>
      </div>
    </div>

  );
}
