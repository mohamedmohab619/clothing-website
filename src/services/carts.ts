import { getDB } from "@/db";
import { cartItems, carts } from "@/db/schema";
import { NewCart, NewCartItem } from "@/db/types";
import { asc, eq } from "drizzle-orm";

export async function getCart(userId: string) {
  const db = getDB();

  const result = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
    orderBy: asc(carts.id),
    with: {
      items: true
    }
  }) || null;

  return result;
}

export async function createCartWithItems(newCart: NewCart, item: NewCartItem[]) {
  const db = getDB();

  return await db.transaction(async (tx) => {
    const [createdCart] = await tx.insert(carts).values(newCart).returning();

    const itemsWithCartId = item.map((i) => ({ ...i, cartId: createdCart.id }));
    // const itemWithCartId = { ...item, cartId: createdCart.id }

    const createdItems = await tx.insert(cartItems).values(itemsWithCartId).returning();

    return { createdCart, createdItems };
  });
}
