"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  ShieldCheck,
  Truck,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  Edit2,
  ShoppingBag,
  Bell,
  Lock,
  LogOut,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  X,
} from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

type TabKey = "orders" | "personal" | "addresses" | "payments" | "wishlist" | "settings";

type OrderItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
};

type Order = {
  id: string;
  date: string;
  status: "In Transit" | "Delivered" | "Processing";
  total: number;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  items: OrderItem[];
};

const INITIAL_ORDERS: Order[] = [
  {
    id: "AVEN-849204",
    date: "Sep 3, 2026",
    status: "In Transit",
    total: 118.0,
    carrier: "FedEx Express",
    trackingNumber: "FDX-9482019482",
    estimatedDelivery: "Tomorrow by 7:00 PM",
    items: [
      {
        id: "loose-fit-hoodie",
        title: "Loose Fit Hoodie",
        image: "/images/hoodie.jpg",
        price: 89.0,
        color: "Black",
        size: "L",
        quantity: 1,
      },
      {
        id: "rib-knit-hat",
        title: "Rib-Knit Wool Hat",
        image: "/images/dark navy1.jpg",
        price: 29.0,
        color: "Dark Navy",
        size: "One Size",
        quantity: 1,
      },
    ],
  },
  {
    id: "AVEN-612984",
    date: "Aug 24, 2026",
    status: "Delivered",
    total: 48.0,
    carrier: "DHL Express",
    trackingNumber: "DHL-5582910482",
    estimatedDelivery: "Delivered on Aug 26",
    items: [
      {
        id: "men-compression-tshirt",
        title: "Essential Compression T-Shirt",
        image: "/images/men.jpg",
        price: 48.0,
        color: "Navy Blue",
        size: "M",
        quantity: 1,
      },
    ],
  },
  {
    id: "AVEN-503819",
    date: "Jul 15, 2026",
    status: "Delivered",
    total: 144.0,
    carrier: "UPS Ground",
    trackingNumber: "UPS-1192830492",
    estimatedDelivery: "Delivered on Jul 18",
    items: [
      {
        id: "relaxed-cor-jacket",
        title: "Relaxed Fit Cor Jacket",
        image: "/images/jacket.jpg",
        price: 115.0,
        color: "Olive Green",
        size: "XL",
        quantity: 1,
      },
      {
        id: "patterned-scarf",
        title: "Patterned Winter Scarf",
        image: "/images/dark navy1.jpg",
        price: 29.0,
        color: "Dark Navy",
        size: "One Size",
        quantity: 1,
      },
    ],
  },
];

type Address = {
  id: string;
  name: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  type: "shipping" | "billing";
};

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    name: "Alex Morgan",
    street: "742 Evergreen Terrace",
    apt: "Suite 4B",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    country: "United States",
    isDefault: true,
    type: "shipping",
  },
  {
    id: "addr-2",
    name: "Alex Morgan (Work)",
    street: "500 Howard Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "United States",
    isDefault: false,
    type: "billing",
  },
];

type SavedCard = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  holder: string;
  isDefault: boolean;
};

const INITIAL_CARDS: SavedCard[] = [
  {
    id: "card-1",
    brand: "Visa",
    last4: "4242",
    expiry: "08/28",
    holder: "ALEX MORGAN",
    isDefault: true,
  },
  {
    id: "card-2",
    brand: "Mastercard",
    last4: "8891",
    expiry: "11/27",
    holder: "ALEX MORGAN",
    isDefault: false,
  },
];

export default function ProfilePage() {
  const { favorites, favoritesCount, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<TabKey>("orders");

  // Profile Information State
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Morgan");
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [birthDate, setBirthDate] = useState("1996-05-14");
  const [gender, setGender] = useState("unspecified");

  // Addresses & Cards
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [cards, setCards] = useState<SavedCard[]>(INITIAL_CARDS);
  const [orders] = useState<Order[]>(INITIAL_ORDERS);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddrName, setNewAddrName] = useState("");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("");
  const [newAddrState, setNewAddrState] = useState("");
  const [newAddrZip, setNewAddrZip] = useState("");
  const [newAddrCountry, setNewAddrCountry] = useState("United States");

  // Card Modal State
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");

  // Tracking Modal State
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem("aven_user_profile");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.birthDate) setBirthDate(parsed.birthDate);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
  }, []);

  // Save personal info
  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { firstName, lastName, email, phone, birthDate, gender };
    localStorage.setItem("aven_user_profile", JSON.stringify(data));
    toast.success("Profile details updated successfully!");
  };

  // Add new address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName.trim() || !newAddrStreet.trim() || !newAddrCity.trim() || !newAddrZip.trim()) {
      toast.error("Please fill in all required address fields");
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      name: newAddrName,
      street: newAddrStreet,
      city: newAddrCity,
      state: newAddrState || "CA",
      zip: newAddrZip,
      country: newAddrCountry,
      isDefault: addresses.length === 0,
      type: "shipping",
    };

    setAddresses((prev) => [...prev, newAddr]);
    setIsAddressModalOpen(false);
    setNewAddrName("");
    setNewAddrStreet("");
    setNewAddrCity("");
    setNewAddrZip("");
    toast.success("New address saved successfully!");
  };

  // Delete address
  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed");
  };

  // Set default address
  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    toast.success("Default address updated");
  };

  // Add new card
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardNumber.replace(/\s/g, "").length < 15 || !newCardHolder || !newCardExpiry) {
      toast.error("Please enter valid card details");
      return;
    }

    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      brand: newCardNumber.startsWith("4") ? "Visa" : "Mastercard",
      last4: newCardNumber.slice(-4),
      expiry: newCardExpiry,
      holder: newCardHolder.toUpperCase(),
      isDefault: cards.length === 0,
    };

    setCards((prev) => [...prev, newCard]);
    setIsCardModalOpen(false);
    setNewCardNumber("");
    setNewCardHolder("");
    setNewCardExpiry("");
    toast.success("New payment method saved!");
  };

  // Delete card
  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    toast.success("Card removed");
  };

  // Buy item again from order history
  const handleBuyAgain = (item: OrderItem) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1,
      selectedColor: item.color,
      selectedSize: item.size,
    });
    toast.success(`Added "${item.title}" back to cart!`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

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
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* User Avatar & Info */}
              <div className="flex items-center gap-5">
                <div className="relative size-18 sm:size-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl tracking-wider shadow-md shrink-0 ring-4 ring-muted/50">
                  {firstName[0]}
                  {lastName[0]}
                  <span className="absolute bottom-0 right-0 size-5 rounded-full bg-emerald-500 border-2 border-background" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      {firstName} {lastName}
                    </h1>
                    <Badge variant="secondary" className="gap-1 text-[11px] font-semibold tracking-wider uppercase">
                      <Sparkles className="size-3 text-amber-500 fill-amber-500" />
                      VIP Gold
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Member since January 2024 &bull; 450 Reward Points
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
                  onClick={() => {
                    localStorage.removeItem("aven_user_profile");
                    toast.success("Logged out successfully");
                  }}
                  variant="ghost"
                  className="text-xs text-muted-foreground hover:text-red-600 gap-1.5"
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
                <p className="text-xl font-bold text-foreground mt-1.5">{orders.length}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  1 in transit
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
                <p className="text-xl font-bold text-foreground mt-1.5">{addresses.length}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Default: Los Angeles</p>
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

          {/* Main Content Layout: Sidebar Tabs + Active Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Nav Menu */}
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

            {/* Right Tab Content */}
            <div className="md:col-span-8 lg:col-span-9 space-y-6">
              {/* ========================================================= */}
              {/* TAB 1: ORDERS                                            */}
              {/* ========================================================= */}
              {activeTab === "orders" && (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Order History
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Track, view receipts, and buy your favorite styles again
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-xl border border-border bg-card overflow-hidden shadow-xs"
                      >
                        {/* Order Header */}
                        <div className="p-4 sm:p-5 bg-muted/20 border-b border-border flex flex-wrap items-center justify-between gap-4 text-xs">
                          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            <div>
                              <p className="text-muted-foreground uppercase font-semibold">
                                Order Placed
                              </p>
                              <p className="font-semibold text-foreground mt-0.5">{order.date}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase font-semibold">Total</p>
                              <p className="font-semibold text-foreground mt-0.5">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground uppercase font-semibold">
                                Order Number
                              </p>
                              <p className="font-semibold text-primary mt-0.5">{order.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              className={cn(
                                "text-[11px] font-semibold capitalize",
                                order.status === "In Transit"
                                  ? "bg-blue-500 text-white"
                                  : "bg-emerald-600 text-white"
                              )}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Tracking Banner if In Transit */}
                        {order.status === "In Transit" && (
                          <div className="p-4 bg-blue-500/5 border-b border-blue-500/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                              <Truck className="size-4 shrink-0" />
                              <span>
                                {order.carrier} &bull; Estimated delivery:{" "}
                                <strong>{order.estimatedDelivery}</strong>
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTrackingOrder(order)}
                              className="text-xs h-7 px-3 text-blue-600 border-blue-500/30 hover:bg-blue-500/10"
                            >
                              Track Package
                            </Button>
                          </div>
                        )}

                        {/* Order Items */}
                        <div className="divide-y divide-border p-4 sm:p-5">
                          {order.items.map((item) => (
                            <div
                              key={`${order.id}-${item.id}`}
                              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-4">
                                <div className="relative size-16 sm:size-20 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                </div>
                                <div>
                                  <Link
                                    href={`/products/${item.id}`}
                                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                                  >
                                    {item.title}
                                  </Link>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Color: <span className="text-foreground">{item.color}</span> &bull; Size:{" "}
                                    <span className="text-foreground">{item.size}</span>
                                  </p>
                                  <p className="text-xs font-semibold text-foreground mt-1">
                                    ${item.price.toFixed(2)} &times; {item.quantity}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 sm:self-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleBuyAgain(item)}
                                  className="text-xs h-8 uppercase tracking-wider font-semibold gap-1.5"
                                >
                                  <ShoppingBag className="size-3.5" />
                                  Buy Again
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: PERSONAL INFORMATION                              */}
              {/* ========================================================= */}
              {activeTab === "personal" && (
                <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs animate-in fade-in-50 duration-300">
                  <div className="border-b border-border pb-4 mb-6">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Personal Information
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Update your account details and profile information
                    </p>
                  </div>

                  <form onSubmit={handleSavePersonalInfo} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-xs font-semibold">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-xs font-semibold">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthDate" className="text-xs font-semibold">
                          Date of Birth
                        </Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end">
                      <Button type="submit" size="lg" className="uppercase tracking-wider font-semibold text-xs px-8">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: SAVED ADDRESSES                                   */}
              {/* ========================================================= */}
              {activeTab === "addresses" && (
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
              )}

              {/* ========================================================= */}
              {/* TAB 4: PAYMENT METHODS                                   */}
              {/* ========================================================= */}
              {activeTab === "payments" && (
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
              )}

              {/* ========================================================= */}
              {/* TAB 5: WISHLIST                                          */}
              {/* ========================================================= */}
              {activeTab === "wishlist" && (
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-foreground">
                        My Wishlist ({favoritesCount})
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Items you&apos;ve bookmarked for your collection
                      </p>
                    </div>
                    <Link href="/favorites">
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        View Full Wishlist <ArrowRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>

                  {favorites.length === 0 ? (
                    <div className="py-16 text-center rounded-xl border border-dashed border-border bg-muted/10">
                      <Heart className="size-8 mx-auto text-muted-foreground mb-3" />
                      <p className="text-base font-semibold text-foreground">Your wishlist is empty</p>
                      <p className="text-xs text-muted-foreground mt-1 mb-6">
                        Explore our new arrivals and save items with the heart icon
                      </p>
                      <Link href="/products">
                        <Button size="sm" className="uppercase tracking-wider text-xs font-semibold">
                          Explore Products
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favorites.slice(0, 6).map((item) => (
                        <div
                          key={`${item.id}-${item.selectedColor}`}
                          className="group rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between"
                        >
                          <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="200px"
                            />
                            <button
                              type="button"
                              onClick={() => removeFromFavorites(item.slug || item.id, item.selectedColor)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors"
                              aria-label="Remove from wishlist"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>

                          <div className="p-4 flex flex-col gap-2">
                            <Link
                              href={`/products/${item.slug || item.id}?coption=${item.selectedColor}`}
                              className="text-xs font-bold uppercase tracking-wide text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.title}
                            </Link>
                            <p className="text-xs text-muted-foreground">Color: {item.selectedColor || "Standard"}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm font-bold text-foreground">{item.price}</span>
                              <Button
                                size="sm"
                                onClick={() => {
                                  addToCart({
                                    id: item.id,
                                    title: item.title,
                                    price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
                                    image: item.image,
                                    quantity: 1,
                                    selectedColor: item.selectedColor,
                                    selectedSize: "M",
                                  });
                                  toast.success(`Added "${item.title}" to bag!`);
                                }}
                                className="h-8 text-xs font-semibold uppercase tracking-wider"
                              >
                                Add to Bag
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 6: SETTINGS & PREFERENCES                            */}
              {/* ========================================================= */}
              {activeTab === "settings" && (
                <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in-50 duration-300">
                  {/* Notifications */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      Notification Preferences
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Control how AVEN contacts you regarding orders and offers
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start space-x-3">
                        <Checkbox id="notif-orders" defaultChecked />
                        <div className="space-y-0.5 leading-none">
                          <Label htmlFor="notif-orders" className="text-sm font-semibold cursor-pointer">
                            Order & Shipping Updates
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Receive real-time tracking alerts and delivery notifications
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox id="notif-sales" defaultChecked />
                        <div className="space-y-0.5 leading-none">
                          <Label htmlFor="notif-sales" className="text-sm font-semibold cursor-pointer">
                            Flash Sales & VIP Discounts
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Be the first to hear about seasonal drops and up to 40% promotions
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox id="notif-restock" defaultChecked />
                        <div className="space-y-0.5 leading-none">
                          <Label htmlFor="notif-restock" className="text-sm font-semibold cursor-pointer">
                            Restock & Back In Stock Alerts
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Notifications when sold out sizes or favorited styles return
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Change */}
                  <div className="pt-6 border-t border-border space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Security & Password</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Current Password</Label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">New Password</Label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success("Password changed successfully")}
                      className="text-xs uppercase tracking-wider font-semibold"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Address Modal Dialog */}
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

      {/* Add Card Modal Dialog */}
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

      {/* Package Tracking Dialog */}
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

      <Footer />
    </div>
  );
}
