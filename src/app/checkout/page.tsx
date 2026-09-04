"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  Truck,
  RefreshCcw,
  Check,
  CreditCard,
  Wallet,
  Smartphone,
  Banknote,
  Edit2,
  Loader2,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

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
import { cn } from "@/lib/utils";

type Step = "shipping" | "payment" | "review" | "success";

type ShippingMethod = "free" | "express" | "priority";

const SHIPPING_OPTIONS: Record<
  ShippingMethod,
  { name: string; estimate: string; cost: number; description: string }
> = {
  free: {
    name: "Standard Delivery",
    estimate: "3-5 business days",
    cost: 0,
    description: "Standard ground shipping via reliable courier",
  },
  express: {
    name: "Express Courier",
    estimate: "1-2 business days",
    cost: 9.99,
    description: "Expedited air delivery with live tracking",
  },
  priority: {
    name: "Next-Day Priority",
    estimate: "Overnight delivery",
    cost: 19.99,
    description: "Guaranteed next-morning priority handling",
  },
};

type PaymentMethod = "card" | "paypal" | "apple_pay" | "cash_on_delivery";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Shipping Form State
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateProv, setStateProv] = useState("ca");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("us");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("free");
  const [saveInfo, setSaveInfo] = useState(true);

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Separate Billing Address
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingZip, setBillingZip] = useState("");

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent: number;
  } | null>(null);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pricing calculations
  const shippingCost = SHIPPING_OPTIONS[shippingMethod].cost;
  const discountAmount = appliedPromo
    ? (cartTotal * appliedPromo.discountPercent) / 100
    : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingCost);

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  // Apply promo code handler
  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === "FLASH40") {
      setAppliedPromo({ code: "FLASH40", discountPercent: 40 });
      toast.success("Promo code FLASH40 applied! 40% discount added.");
      setPromoCodeInput("");
    } else if (code === "WELCOME10") {
      setAppliedPromo({ code: "WELCOME10", discountPercent: 10 });
      toast.success("Promo code WELCOME10 applied! 10% discount added.");
      setPromoCodeInput("");
    } else {
      toast.error("Invalid promo code. Try FLASH40 or WELCOME10.");
    }
  };

  // Validation: Step 1 Shipping
  const validateShipping = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim() || !email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!address1.trim()) {
      newErrors.address1 = "Street address is required";
    }
    if (!city.trim()) {
      newErrors.city = "City is required";
    }
    if (!zip.trim()) {
      newErrors.zip = "ZIP / Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation: Step 2 Payment
  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length < 15) {
        newErrors.cardNumber = "Enter a valid 16-digit card number";
      }
      if (!cardHolder.trim()) {
        newErrors.cardHolder = "Cardholder name is required";
      }
      if (expiry.length < 5) {
        newErrors.expiry = "Valid expiry (MM/YY) required";
      }
      if (cvv.length < 3) {
        newErrors.cvv = "Valid CVV required";
      }
    }

    if (!sameAsShipping) {
      if (!billingName.trim()) newErrors.billingName = "Billing name required";
      if (!billingAddress.trim()) newErrors.billingAddress = "Billing address required";
      if (!billingCity.trim()) newErrors.billingCity = "Billing city required";
      if (!billingZip.trim()) newErrors.billingZip = "Billing ZIP required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setErrors({});
      setCurrentStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fill in the required shipping details");
    }
  };

  const handleContinueToReview = () => {
    if (validatePayment()) {
      setErrors({});
      setCurrentStep("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please complete the required payment details");
    }
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    // Simulate secure order authorization
    setTimeout(() => {
      const generatedOrder = `AVEN-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setIsSubmitting(false);
      setCurrentStep("success");
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success(`Order placed successfully! Order #${generatedOrder}`);
    }, 1200);
  };

  // Step 4: Success View
  if (currentStep === "success") {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 shadow-sm text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6">
              <CheckCircle2 className="size-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Order Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
              Thank you for your order!
            </h1>
            <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-lg mx-auto">
              We have received your purchase and sent a confirmation email with tracking
              details to <strong className="text-foreground">{email || "your email"}</strong>.
            </p>

            <div className="mt-8 rounded-xl border border-border bg-muted/20 p-6 text-left space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">
                    Order Number
                  </p>
                  <p className="text-lg font-bold text-foreground">{orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">
                    Estimated Delivery
                  </p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {SHIPPING_OPTIONS[shippingMethod].estimate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-foreground uppercase tracking-wider mb-1">
                    Shipping Address
                  </p>
                  <p className="text-muted-foreground">{fullName}</p>
                  <p className="text-muted-foreground">{address1}</p>
                  {address2 && <p className="text-muted-foreground">{address2}</p>}
                  <p className="text-muted-foreground">
                    {city}, {stateProv.toUpperCase()} {zip}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground uppercase tracking-wider mb-1">
                    Payment Method
                  </p>
                  <p className="text-muted-foreground capitalize">
                    {paymentMethod === "card"
                      ? `Card ending in ${cardNumber.slice(-4) || "4242"}`
                      : paymentMethod === "paypal"
                      ? "PayPal Express"
                      : paymentMethod === "apple_pay"
                      ? "Apple Pay"
                      : "Cash on Delivery"}
                  </p>
                  <p className="font-semibold text-foreground mt-2">
                    Total Paid: ${finalTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full uppercase tracking-wide">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  Return Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Secure 256-Bit Encrypted Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px]">
          {/* Left Column: Form Steps */}
          <div className="space-y-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-8">
                Checkout
              </h1>

              {/* Interactive Progress Tracker */}
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
                {/* Step 1: Shipping */}
                <button
                  type="button"
                  onClick={() => setCurrentStep("shipping")}
                  className={cn(
                    "flex items-center gap-2 transition-colors cursor-pointer",
                    currentStep === "shipping"
                      ? "text-primary font-semibold"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                      currentStep === "shipping"
                        ? "bg-primary text-primary-foreground"
                        : currentStep === "payment" || currentStep === "review"
                        ? "bg-primary/20 text-primary"
                        : "border border-border text-muted-foreground"
                    )}
                  >
                    {currentStep === "payment" || currentStep === "review" ? (
                      <Check className="size-3.5 stroke-[3]" />
                    ) : (
                      "1"
                    )}
                  </span>
                  <span>Shipping</span>
                </button>

                <div className="h-px flex-1 max-w-12 bg-border" />

                {/* Step 2: Payment */}
                <button
                  type="button"
                  onClick={() => {
                    if (validateShipping()) {
                      setCurrentStep("payment");
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    currentStep === "payment"
                      ? "text-primary font-semibold"
                      : currentStep === "review"
                      ? "text-foreground hover:text-primary cursor-pointer"
                      : "text-muted-foreground cursor-default"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                      currentStep === "payment"
                        ? "bg-primary text-primary-foreground"
                        : currentStep === "review"
                        ? "bg-primary/20 text-primary"
                        : "border border-border text-muted-foreground"
                    )}
                  >
                    {currentStep === "review" ? (
                      <Check className="size-3.5 stroke-[3]" />
                    ) : (
                      "2"
                    )}
                  </span>
                  <span>Payment</span>
                </button>

                <div className="h-px flex-1 max-w-12 bg-border" />

                {/* Step 3: Review */}
                <div
                  className={cn(
                    "flex items-center gap-2",
                    currentStep === "review"
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                      currentStep === "review"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground"
                    )}
                  >
                    3
                  </span>
                  <span>Review</span>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* STEP 1: SHIPPING SECTION                                 */}
            {/* ========================================================= */}
            {currentStep === "shipping" && (
              <div className="space-y-10 animate-in fade-in-50 duration-300">
                {/* Contact Information */}
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        placeholder="you@example.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-medium">
                        Phone Number (Optional)
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
                </section>

                {/* Shipping Address */}
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName)
                            setErrors((prev) => ({ ...prev, fullName: "" }));
                        }}
                        placeholder="e.g. Jane Doe"
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-500">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address1" className="text-xs font-medium">
                        Address Line 1 *
                      </Label>
                      <Input
                        id="address1"
                        type="text"
                        value={address1}
                        onChange={(e) => {
                          setAddress1(e.target.value);
                          if (errors.address1)
                            setErrors((prev) => ({ ...prev, address1: "" }));
                        }}
                        placeholder="House number and street name"
                        className={errors.address1 ? "border-red-500" : ""}
                      />
                      {errors.address1 && (
                        <p className="text-xs text-red-500">{errors.address1}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address2" className="text-xs font-medium">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="address2"
                        type="text"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        placeholder="Apartment, suite, unit, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="city" className="text-xs font-medium">
                          City *
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            if (errors.city)
                              setErrors((prev) => ({ ...prev, city: "" }));
                          }}
                          placeholder="City"
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-xs text-red-500">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="state" className="text-xs font-medium">
                          State / Province *
                        </Label>
                        <Select value={stateProv} onValueChange={(val) => setStateProv(val || "ca")}>
                          <SelectTrigger id="state">
                            <SelectValue placeholder="State / Province" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ca">California (CA)</SelectItem>
                            <SelectItem value="ny">New York (NY)</SelectItem>
                            <SelectItem value="tx">Texas (TX)</SelectItem>
                            <SelectItem value="fl">Florida (FL)</SelectItem>
                            <SelectItem value="il">Illinois (IL)</SelectItem>
                            <SelectItem value="wa">Washington (WA)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="zip" className="text-xs font-medium">
                          ZIP / Postal Code *
                        </Label>
                        <Input
                          id="zip"
                          type="text"
                          value={zip}
                          onChange={(e) => {
                            setZip(e.target.value);
                            if (errors.zip) setErrors((prev) => ({ ...prev, zip: "" }));
                          }}
                          placeholder="10001"
                          className={errors.zip ? "border-red-500" : ""}
                        />
                        {errors.zip && (
                          <p className="text-xs text-red-500">{errors.zip}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="country" className="text-xs font-medium">
                          Country *
                        </Label>
                        <Select value={country} onValueChange={(val) => setCountry(val || "us")}>
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Shipping Method Selection */}
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Delivery Speed
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {(Object.keys(SHIPPING_OPTIONS) as ShippingMethod[]).map((key) => {
                      const opt = SHIPPING_OPTIONS[key];
                      const isSelected = shippingMethod === key;
                      return (
                        <div
                          key={key}
                          onClick={() => setShippingMethod(key)}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200",
                            isSelected
                              ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                              : "border-border hover:border-foreground/30 bg-card"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "size-4 rounded-full border flex items-center justify-center transition-colors",
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              )}
                            >
                              {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <span>{opt.name}</span>
                                <span className="text-xs font-normal text-muted-foreground">
                                  ({opt.estimate})
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {opt.description}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-foreground">
                            {opt.cost === 0 ? "FREE" : `$${opt.cost.toFixed(2)}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-info"
                    checked={saveInfo}
                    onCheckedChange={(c) => setSaveInfo(!!c)}
                  />
                  <Label
                    htmlFor="save-info"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Save this shipping information for next time
                  </Label>
                </div>

                <Button
                  size="lg"
                  onClick={handleContinueToPayment}
                  className="w-full sm:w-auto uppercase tracking-wide font-semibold text-sm h-12 px-8"
                >
                  Continue to Payment &rarr;
                </Button>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 2: PAYMENT SECTION                                  */}
            {/* ========================================================= */}
            {currentStep === "payment" && (
              <div className="space-y-10 animate-in fade-in-50 duration-300">
                {/* Shipping Review Banner */}
                <div className="rounded-xl border border-border bg-muted/20 p-4.5 flex items-start justify-between gap-4">
                  <div className="space-y-1 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Shipping to
                    </p>
                    <p className="font-semibold text-foreground">{fullName}</p>
                    <p className="text-muted-foreground text-xs">
                      {address1} {address2 && `, ${address2}`}, {city},{" "}
                      {stateProv.toUpperCase()} {zip}, {country.toUpperCase()}
                    </p>
                    <p className="text-xs font-medium text-primary pt-0.5">
                      Method: {SHIPPING_OPTIONS[shippingMethod].name} (
                      {SHIPPING_OPTIONS[shippingMethod].cost === 0
                        ? "FREE"
                        : `$${SHIPPING_OPTIONS[shippingMethod].cost.toFixed(2)}`}
                      )
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep("shipping")}
                    className="text-xs gap-1.5 text-primary hover:text-primary/80"
                  >
                    <Edit2 className="size-3.5" /> Edit
                  </Button>
                </div>

                {/* Payment Methods */}
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Select Payment Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Credit Card Option */}
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between",
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                          : "border-border hover:border-foreground/30 bg-card"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          Credit / Debit Card
                        </span>
                        <CreditCard className="size-5 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Visa, Mastercard, Amex, Discover
                      </p>
                    </div>

                    {/* PayPal Option */}
                    <div
                      onClick={() => setPaymentMethod("paypal")}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between",
                        paymentMethod === "paypal"
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                          : "border-border hover:border-foreground/30 bg-card"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">PayPal</span>
                        <Wallet className="size-5 text-blue-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Pay securely with your PayPal account
                      </p>
                    </div>

                    {/* Apple Pay / Digital Wallet Option */}
                    <div
                      onClick={() => setPaymentMethod("apple_pay")}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between",
                        paymentMethod === "apple_pay"
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                          : "border-border hover:border-foreground/30 bg-card"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          Apple Pay / Google Pay
                        </span>
                        <Smartphone className="size-5 text-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Fast one-touch digital checkout
                      </p>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      onClick={() => setPaymentMethod("cash_on_delivery")}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between",
                        paymentMethod === "cash_on_delivery"
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                          : "border-border hover:border-foreground/30 bg-card"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          Cash on Delivery
                        </span>
                        <Banknote className="size-5 text-emerald-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Pay in cash when package arrives
                      </p>
                    </div>
                  </div>
                </section>

                {/* Card Fields (Only when card selected) */}
                {paymentMethod === "card" && (
                  <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs animate-in fade-in-50">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="text-sm font-semibold text-foreground">
                        Card Details
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Lock className="size-3" /> Secure 256-Bit
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="cardNumber" className="text-xs font-medium">
                        Card Number *
                      </Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className={cn("pr-10", errors.cardNumber && "border-red-500")}
                        />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                      </div>
                      {errors.cardNumber && (
                        <p className="text-xs text-red-500">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="cardHolder" className="text-xs font-medium">
                        Cardholder Name *
                      </Label>
                      <Input
                        id="cardHolder"
                        type="text"
                        value={cardHolder}
                        onChange={(e) => {
                          setCardHolder(e.target.value);
                          if (errors.cardHolder)
                            setErrors((prev) => ({ ...prev, cardHolder: "" }));
                        }}
                        placeholder="NAME AS PRINTED ON CARD"
                        className={errors.cardHolder ? "border-red-500 uppercase" : "uppercase"}
                      />
                      {errors.cardHolder && (
                        <p className="text-xs text-red-500">{errors.cardHolder}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="expiry" className="text-xs font-medium">
                          Expires (MM/YY) *
                        </Label>
                        <Input
                          id="expiry"
                          type="text"
                          maxLength={5}
                          value={expiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          placeholder="MM/YY"
                          className={errors.expiry ? "border-red-500" : ""}
                        />
                        {errors.expiry && (
                          <p className="text-xs text-red-500">{errors.expiry}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="cvv" className="text-xs font-medium">
                          Security Code (CVV) *
                        </Label>
                        <Input
                          id="cvv"
                          type="password"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                          placeholder="CVC"
                          className={errors.cvv ? "border-red-500" : ""}
                        />
                        {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Note */}
                {paymentMethod === "paypal" && (
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 text-sm text-foreground flex items-center gap-3">
                    <Wallet className="size-6 text-blue-500 shrink-0" />
                    <div>
                      <p className="font-semibold">PayPal Express Checkout</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        You will be authorized via PayPal securely after confirming your order in
                        the review step.
                      </p>
                    </div>
                  </div>
                )}

                {/* Apple Pay Note */}
                {paymentMethod === "apple_pay" && (
                  <div className="rounded-xl border border-border bg-muted/20 p-5 text-sm text-foreground flex items-center gap-3">
                    <Smartphone className="size-6 text-foreground shrink-0" />
                    <div>
                      <p className="font-semibold">Apple Pay / Digital Wallet</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Clicking place order will prompt Touch ID / Face ID authentication.
                      </p>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Note */}
                {paymentMethod === "cash_on_delivery" && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-sm text-foreground flex items-center gap-3">
                    <Banknote className="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Please prepare exact cash when your package is delivered to your address.
                      </p>
                    </div>
                  </div>
                )}

                {/* Billing Address Toggle */}
                <section className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="same-address"
                      checked={sameAsShipping}
                      onCheckedChange={(c) => setSameAsShipping(!!c)}
                    />
                    <Label
                      htmlFor="same-address"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Billing address is the same as my shipping address
                    </Label>
                  </div>

                  {!sameAsShipping && (
                    <div className="rounded-xl border border-border bg-card p-5 space-y-4 animate-in fade-in-50">
                      <h3 className="text-sm font-semibold text-foreground">
                        Billing Address
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs font-medium">Billing Name *</Label>
                          <Input
                            value={billingName}
                            onChange={(e) => setBillingName(e.target.value)}
                            placeholder="Full Name"
                            className={errors.billingName ? "border-red-500 mt-1" : "mt-1"}
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Address *</Label>
                          <Input
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            placeholder="Street Address"
                            className={errors.billingAddress ? "border-red-500 mt-1" : "mt-1"}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium">City *</Label>
                            <Input
                              value={billingCity}
                              onChange={(e) => setBillingCity(e.target.value)}
                              placeholder="City"
                              className={errors.billingCity ? "border-red-500 mt-1" : "mt-1"}
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium">ZIP Code *</Label>
                            <Input
                              value={billingZip}
                              onChange={(e) => setBillingZip(e.target.value)}
                              placeholder="ZIP"
                              className={errors.billingZip ? "border-red-500 mt-1" : "mt-1"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <div className="flex items-center gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep("shipping")}
                    className="h-12 px-6"
                  >
                    &larr; Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleContinueToReview}
                    className="flex-1 sm:flex-none uppercase tracking-wide font-semibold text-sm h-12 px-8"
                  >
                    Continue to Review Order &rarr;
                  </Button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 3: REVIEW SECTION                                   */}
            {/* ========================================================= */}
            {currentStep === "review" && (
              <div className="space-y-8 animate-in fade-in-50 duration-300">
                {/* Summary Blocks */}
                <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden shadow-xs">
                  {/* Shipping Info Block */}
                  <div className="p-5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Truck className="size-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Shipping Details
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground pt-1">{fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {address1} {address2 && `, ${address2}`}, {city},{" "}
                        {stateProv.toUpperCase()} {zip}, {country.toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">Email: {email}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                        {SHIPPING_OPTIONS[shippingMethod].name} &bull;{" "}
                        {SHIPPING_OPTIONS[shippingMethod].estimate}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep("shipping")}
                      className="text-xs text-primary"
                    >
                      Change
                    </Button>
                  </div>

                  {/* Payment Info Block */}
                  <div className="p-5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="size-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Payment Method
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground pt-1 capitalize">
                        {paymentMethod === "card"
                          ? `Credit Card (ending in ${cardNumber.slice(-4) || "4242"})`
                          : paymentMethod === "paypal"
                          ? "PayPal Express Checkout"
                          : paymentMethod === "apple_pay"
                          ? "Apple Pay / Digital Wallet"
                          : "Cash on Delivery"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Billing address:{" "}
                        {sameAsShipping ? "Same as shipping address" : `${billingAddress}, ${billingCity}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep("payment")}
                      className="text-xs text-primary"
                    >
                      Change
                    </Button>
                  </div>
                </div>

                {/* Items in this Order */}
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Items in Your Order ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </h2>

                  <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                        className="p-4 flex items-center gap-4"
                      >
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                            {item.selectedColor && item.selectedSize && <span>&bull;</span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-foreground shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Terms and Conditions Notice */}
                <div className="rounded-xl bg-muted/30 border border-border p-4 text-xs text-muted-foreground leading-relaxed">
                  By clicking &ldquo;Place Order&rdquo;, you authorize AVEN to charge your
                  selected payment method for the total amount of{" "}
                  <strong className="text-foreground">${finalTotal.toFixed(2)}</strong>, and agree
                  to our Terms of Sale, Privacy Policy, and 30-Day Return Guarantee.
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentStep("payment")}
                    className="h-12 px-6"
                    disabled={isSubmitting}
                  >
                    &larr; Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none uppercase tracking-wide font-semibold text-sm h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Processing Order...
                      </>
                    ) : (
                      `Place Order • $${finalTotal.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Order Summary */}
          <div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              {/* Items List Thumbnail Accordion / Preview */}
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                    className="flex items-center gap-3.5 border-b border-border/60 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted border border-border">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute top-0 right-0 bg-foreground text-background text-[10px] font-bold px-1 rounded-bl-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center min-w-0">
                      <h3 className="font-medium text-foreground text-xs line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {item.selectedColor}
                        {item.selectedColor && item.selectedSize && " / "}
                        {item.selectedSize}
                      </p>
                    </div>
                    <p className="font-semibold text-xs text-foreground shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                {cartItems.length === 0 && (
                  <p className="text-xs text-muted-foreground pb-4 border-b border-border">
                    Your shopping bag is empty.
                  </p>
                )}
              </div>

              {/* Promo Code Input */}
              <div className="border-t border-border pt-5 mt-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Promo code (e.g. FLASH40)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      className="text-xs uppercase h-9 pr-7"
                    />
                    <Tag className="size-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyPromo}
                    className="h-9 px-3 text-xs uppercase tracking-wider font-semibold"
                  >
                    Apply
                  </Button>
                </div>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-500/10 px-2.5 py-1.5 rounded-md">
                    <span className="font-medium">
                      Code {appliedPromo.code} applied ({appliedPromo.discountPercent}% OFF)
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedPromo(null)}
                      className="text-muted-foreground hover:text-foreground text-xs font-bold"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-3 border-t border-border pt-5 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${cartTotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-foreground">
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400">
                    <span>Discount ({appliedPromo.discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                <div>
                  <span className="text-base font-bold text-foreground">Total</span>
                  <p className="text-[11px] text-muted-foreground">Including taxes & delivery</p>
                </div>
                <span className="text-2xl font-bold text-primary">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-6 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <ShieldCheck className="size-5 text-primary" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium text-foreground leading-tight">
                    Secure<br />Payment
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Truck className="size-5 text-primary" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium text-foreground leading-tight">
                    Fast<br />Dispatch
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <RefreshCcw className="size-5 text-primary" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium text-foreground leading-tight">
                    30-Day<br />Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
