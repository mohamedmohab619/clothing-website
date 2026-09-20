import { Order, Address, SavedCard } from "./types";

export const INITIAL_ORDERS: Order[] = [
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

export const INITIAL_ADDRESSES: Address[] = [
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

export const INITIAL_CARDS: SavedCard[] = [
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
