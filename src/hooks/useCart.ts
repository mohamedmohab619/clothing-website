"use client";

import { authClient } from "@/lib/auth/auth-client";
import { TCartItemUISchema } from "@/validation/cartItem";
import useSWR from "swr";

type LineRef = Pick<TCartItemUISchema, "variantId" | "selectedColor" | "selectedSize">;

const LOCAL_KEY = "cart"; // same localStorage key the old context used
export const LOCAL_SWR_KEY = "local:cart";
export const REMOTE_SWR_KEY = "/api/me/carts/items";

/* -------------------------------------------------------------------------- */
/*  Pure helpers (the old context logic, extracted so both backends share it)  */
/* -------------------------------------------------------------------------- */

const sameLine = (a: LineRef, b: LineRef) =>
  a.variantId === b.variantId &&
  (a.selectedColor ?? null) === (b.selectedColor ?? null) &&
  (a.selectedSize ?? null) === (b.selectedSize ?? null);

const addLine = (items: TCartItemUISchema[], item: TCartItemUISchema): TCartItemUISchema[] =>
  items.some((i) => sameLine(i, item))
    ? items.map((i) =>
      sameLine(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i
    )
    : [...items, item];

const removeLine = (items: TCartItemUISchema[], ref: LineRef): TCartItemUISchema[] =>
  items.filter((i) => !sameLine(i, ref));

const setQuantity = (items: TCartItemUISchema[], ref: LineRef, quantity: number): TCartItemUISchema[] =>
  quantity <= 0
    ? removeLine(items, ref)
    : items.map((i) => (sameLine(i, ref) ? { ...i, quantity } : i));

/* -------------------------------------------------------------------------- */
/*  Backend 1: localStorage (guests)                                           */
/* -------------------------------------------------------------------------- */

export const readLocalCart = (): TCartItemUISchema[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
  } catch {
    console.error("Failed to parse cart from local storage");
    return [];
  }
};

const writeLocalCart = (items: TCartItemUISchema[]) =>
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));

export const clearLocalCart = () => localStorage.removeItem(LOCAL_KEY);

/* -------------------------------------------------------------------------- */
/*  Backend 2: API (logged-in users)                                           */
/*  Every endpoint returns the full, updated cart as CartItem[]                */
/* -------------------------------------------------------------------------- */

async function request(method: string, body?: unknown): Promise<TCartItemUISchema[]> {
  const res = await fetch(REMOTE_SWR_KEY, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Cart request failed (${res.status})`);

  const json = await res.json();
  if (!Array.isArray(json?.data)) {
    throw new Error("Unexpected cart response shape");
  }
  return json.data;
}

const fetchRemoteCart = () => request("GET");

/* -------------------------------------------------------------------------- */
/*  The hook                                                                   */
/* -------------------------------------------------------------------------- */

export function useCartFetcher() {
  const { data: sessionData, isPending } = authClient.useSession(); // "loading" | "authenticated" | "unauthenticated"
  const isAuthed = sessionData != null;

  // null key while auth is resolving, so we never fetch/render the wrong source
  const key = isPending ? null : isAuthed ? REMOTE_SWR_KEY : LOCAL_SWR_KEY;

  const { data, isLoading, mutate } = useSWR<TCartItemUISchema[]>(
    key,
    isAuthed ? fetchRemoteCart : async () => readLocalCart()
  );

  console.log("Carts data:");
  console.log(data);
  const cartItems = data ?? [];

  /**
   * Single place that knows about the two backends.
   * - guest: compute next state from localStorage, persist, push into SWR cache
   * - authed: optimistic update, send request, replace cache with server response
   */
  const apply = async (
    updater: (items: TCartItemUISchema[]) => TCartItemUISchema[],
    remote: () => Promise<TCartItemUISchema[]>
  ) => {
    if (!isAuthed) {
      const next = updater(readLocalCart());
      writeLocalCart(next);
      await mutate(next, { revalidate: false });
      return;
    }

    try {
      await mutate(remote, {
        optimisticData: (current?: TCartItemUISchema[]) => updater(current ?? []),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });
    } catch (error) {
      console.error("Cart update failed", error);
      // TODO: show a toast here; SWR has already rolled the UI back
    }
  };

  // Same signatures as the old CartContext, so components only change their import
  const addToCart = (item: TCartItemUISchema) =>
    apply(
      (items) => addLine(items, item),
      // send references only; the server must look up title/price/image itself
      () =>
        request("POST", {
          productId: item.productId,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          image: item.image,
        })
    );

  const removeFromCart = (id: number, color: string, size: string) => {
    const ref: LineRef = { variantId: id, selectedColor: color, selectedSize: size };
    return apply(
      (items) => removeLine(items, ref),
      () => request("DELETE", ref)
    );
  };

  const updateQuantity = (id: number, quantity: number, color: string, size: string) => {
    const ref: LineRef = { variantId: id, selectedColor: color, selectedSize: size };
    return apply(
      (items) => setQuantity(items, ref, quantity),
      () => request("PATCH", { ...ref, quantity })
    );
  };

  const clearCart = () =>
    apply(
      () => [],
      () => request("DELETE", { all: true })
    );

  const cartCount = cartItems?.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems?.reduce((total, item) => total + item.price * item.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isLoading: isLoading,
  };
}
