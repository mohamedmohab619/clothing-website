"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { TabKey, Order, SavedCard } from "./types";
import { INITIAL_CARDS } from "./data";
import { ProfileLoading } from "./_components/ProfileLoading";
import { HeroCard } from "./_components/HeroCard";
import { Nav } from "./_components/Nav";
import { OrdersTab } from "./_components/OrdersTab";
import { PersonalTab } from "./_components/PersonalTab";
import { AddressesTab } from "./_components/AddressesTab";
import { PaymentMethodsTab } from "./_components/PaymentMethodsTab";
import { WishlistTab } from "./_components/WishlistTab";
import { SettingsTab } from "./_components/SettingsTab";
import { AddressModal } from "./_components/AddressModal";
import { CardModal } from "./_components/CardModal";
import { OrderTrackingDialog } from "./_components/OrderTrackingDialog";

export default function ProfilePage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("orders");

  // Cards
  const [cards, setCards] = useState<SavedCard[]>(INITIAL_CARDS);

  // Modals
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // session checking
  const { data: sessionData, isPending } = authClient.useSession();

  if (isPending) return <ProfileLoading />

  if (!sessionData) {
    return router.push("/auth");
  }

  return (
    <>
      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Top Bar */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">My Account</span>
          </nav>

          {/* Profile Hero Card */}
          <HeroCard user={sessionData.user} ordersInTransit={0} setActiveTab={setActiveTab} />

          {/* Main Content Layout: Sidebar Tabs + Active Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-5">
            {/* Left Nav Menu */}
            <Nav cards={cards} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Right Tab Content */}
            <div className="md:col-span-8 lg:col-span-9 space-y-6">
              {/* TAB 1: ORDERS */}
              {activeTab === "orders" && <OrdersTab />}

              {/* TAB 2: PERSONAL INFORMATION */}
              {activeTab === "personal" && <PersonalTab user={sessionData.user} />}

              {/* TAB 3: SAVED ADDRESSES */}
              {activeTab === "addresses" && <AddressesTab setIsAddressModalOpen={setIsAddressModalOpen} />}

              {/* TAB 4: PAYMENT METHODS */}
              {activeTab === "payments" && <PaymentMethodsTab cards={cards} setCards={setCards} setIsCardModalOpen={setIsCardModalOpen} />}

              {/* TAB 5: WISHLIST */}
              {activeTab === "wishlist" && <WishlistTab />}

              {/* TAB 6: SETTINGS & PREFERENCES */}
              {activeTab === "settings" && <SettingsTab />}
            </div>
          </div>
        </div>
      </main>

      {/* Add Address Modal Dialog */}
      <AddressModal isAddressModalOpen={isAddressModalOpen} setIsAddressModalOpen={setIsAddressModalOpen} />

      {/* Add Card Modal Dialog */}
      <CardModal isCardModalOpen={isCardModalOpen} setIsCardModalOpen={setIsCardModalOpen} />

      {/* Package Tracking Dialog */}
      <OrderTrackingDialog trackingOrder={trackingOrder} setTrackingOrder={setTrackingOrder} />
    </>
  );
}
