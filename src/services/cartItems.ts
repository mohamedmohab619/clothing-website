import { getDB } from "@/db";
import { cartItems, carts } from "@/db/schema";
import { NewCartItem } from "@/db/types";
import { asc, eq } from "drizzle-orm";

export async function getCartItems(cartId: number) {
  const db = getDB();

  const result = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
    with: {
      variant: {
        with: {
          product: true
        }
      }
    }
  });

  return (result) ? result : null;
}

export async function getCartItemsWithUserId(userId: string) {
  const db = getDB();

  const result = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
    orderBy: asc(carts.id),
    with: {
      items: {
        with: {
          variant: {
            with: {
              product: true
            }
          }
        }
      }
    }
  });

  return (result) ? result.items : null;
}

export async function createCartItem(data: NewCartItem[]) {
  const db = getDB();

  return await db.insert(cartItems).values(data).returning();
}
