"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, ShieldCheck, Truck, RefreshCcw } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to Cart
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4" />
            Secure Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
          {/* Left Column: Forms */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-8">
                Checkout
              </h1>
              
              {/* Progress Tracker */}
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 text-primary">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    1
                  </span>
                  <span>Shipping</span>
                </div>
                <div className="h-px w-12 bg-border"></div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex size-6 items-center justify-center rounded-full border border-border bg-transparent text-xs">
                    2
                  </span>
                  <span>Payment</span>
                </div>
                <div className="h-px w-12 bg-border"></div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex size-6 items-center justify-center rounded-full border border-border bg-transparent text-xs">
                    3
                  </span>
                  <span>Review</span>
                </div>
              </div>
            </div>

            {/* Contact Information Form */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Contact Information
              </h2>
              <div className="space-y-2">
                <Label htmlFor="email" className="sr-only">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                />
                <p className="text-xs text-muted-foreground pl-1 pt-1">
                  youremail@example.com
                </p>
              </div>
            </section>

            {/* Shipping Address Form */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="sr-only">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Full Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address1" className="sr-only">Address Line 1</Label>
                  <Input
                    id="address1"
                    type="text"
                    placeholder="Address Line 1"
                  />
                  <p className="text-xs text-muted-foreground pl-1 pt-1">
                    House number and street name
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address2" className="sr-only">Address Line 2 (Optional)</Label>
                  <Input
                    id="address2"
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                  />
                  <p className="text-xs text-muted-foreground pl-1 pt-1">
                    Apartment, suite, etc.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="sr-only">City</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="sr-only">State / Province</Label>
                    <Select>
                      <SelectTrigger id="state" className="text-muted-foreground">
                        <SelectValue placeholder="State / Province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="sr-only">ZIP / Postal Code</Label>
                    <Input
                      id="zip"
                      type="text"
                      placeholder="ZIP / Postal Code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="sr-only">Country</Label>
                    <Select defaultValue="us">
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex items-center space-x-2">
              <Checkbox id="save-info" />
              <Label
                htmlFor="save-info"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Save this information for next time
              </Label>
            </div>

            <Button size="lg" className="w-full sm:w-auto uppercase tracking-wide">
              Continue to Payment &rarr;
            </Button>
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="rounded-xl border border-border bg-muted/10 p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex items-center gap-4 border-b border-border pb-6 last:border-0 last:pb-0">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h3 className="font-medium text-foreground text-sm line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground space-x-2">
                        {item.selectedColor && <span>{item.selectedColor}</span>}
                        {item.selectedColor && item.selectedSize && <span>/</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </p>
                    </div>
                    <p className="font-semibold text-sm text-foreground shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                {cartItems.length === 0 && (
                  <p className="text-sm text-muted-foreground pb-6 border-b border-border">
                    Your cart is empty.
                  </p>
                )}

                <div className="space-y-3 border-t border-border pt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-foreground">$0.00</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-6">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 grid grid-cols-3 gap-2 border-t border-border pt-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="size-6 text-primary" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-foreground leading-tight">
                      Secure<br />Checkout
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Truck className="size-6 text-primary" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-foreground leading-tight">
                      Free<br />Shipping
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCcw className="size-6 text-primary" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-foreground leading-tight">
                      Easy<br />Returns
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
