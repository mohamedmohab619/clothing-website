import { authClient } from "@/lib/auth/auth-client";

export type UserData = typeof authClient.$Infer.Session.user;

export type TabKey = "orders" | "personal" | "addresses" | "payments" | "wishlist" | "settings";

export type OrderItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
};

export type Order = {
  id: string;
  date: string;
  status: "In Transit" | "Delivered" | "Processing";
  total: number;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  items: OrderItem[];
};

export type Address = {
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

export type SavedCard = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  holder: string;
  isDefault: boolean;
};
