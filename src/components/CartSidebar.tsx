"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

export default function CartSidebar() {
  const { cartItems, updateQuantity, removeFromCart, cartCount, cartTotal } = useCart();

  return (
    <SheetContent side="right" showCloseButton={false} className="w-full sm:max-w-md flex flex-col h-full pl-6">
      {/* Inline header with close button */}
      <div className="flex items-center justify-between border-b border-border pb-4 pt-2 pr-2">
        <SheetTitle className="text-xl font-bold text-foreground">
          My Cart
        </SheetTitle>
        <div className="flex items-center gap-3">
          <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </span>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-label="Close cart">
              <X className="size-4" />
            </Button>
          </SheetClose>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="size-20 bg-muted rounded-full flex items-center justify-center">
              <span className="text-3xl">🛒</span>
            </div>
            <p className="text-lg font-medium text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Looks like you haven't added anything to your cart yet.
            </p>
          </div>
        ) : (
          <ul className="space-y-6 pr-4">
            {cartItems.map((item) => (
              <li key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4 border-b border-border pb-4">
                <div className="relative h-24 w-20 overflow-hidden rounded-md bg-muted shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground text-sm line-clamp-1">{item.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground space-x-2">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </p>
                    </div>
                    <p className="font-semibold text-sm text-foreground shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                      >
                        <Minus className="size-3 text-muted-foreground" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                      >
                        <Plus className="size-3 text-muted-foreground" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {cartItems.length > 0 && (
        <SheetFooter className="border-t border-border pt-4 flex-col sm:flex-col gap-4 pr-4">
          <div className="space-y-1.5 w-full">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Taxes & Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-bold text-foreground pt-2">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <SheetClose asChild>
            <Link href="/checkout" className="w-full">
              <Button className="w-full mt-2" size="lg">
                Checkout
              </Button>
            </Link>
          </SheetClose>
        </SheetFooter>
      )}
    </SheetContent>
  );
}
