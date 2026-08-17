"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart from local storage", error);
      }
    }
  }, []);

  // Save to local storage whenever cart changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize
      );

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prevItems, item];
    });
  };

  const removeFromCart = (id: string, color?: string, size?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((i) => !(i.id === id && i.selectedColor === color && i.selectedSize === size))
    );
  };

  const updateQuantity = (id: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, color, size);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === id && i.selectedColor === color && i.selectedSize === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
