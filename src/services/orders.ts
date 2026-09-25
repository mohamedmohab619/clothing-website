import { getDB } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { NewOrder, NewOrderItem } from "@/db/types";
import { desc, eq } from "drizzle-orm";

export async function getOrders() {
  const db = getDB()

  return await db.query.orders.findMany({ with: { items: true } }) || [];
}

export async function getOrderById(id: number) {
  const db = getDB();

  const result = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: true }
  });

  return result;
}

export async function getOrdersByUserId(userId: string) {
  const db = getDB();

  return await db.query.orders.findMany({
    where: eq(orders.userId, userId),
    orderBy: desc(orders.createdAt),
    with: { items: true },
  })
}

export async function createOrder(data: NewOrder) {
  const db = getDB();

  return await db.insert(orders).values(data).returning();
}


export async function createOrderWithItems(newOrder: NewOrder, items: NewOrderItem[]) {
  const db = getDB();

  return await db.transaction(async (tx) => {
    const [createdOrder] = await tx.insert(orders).values(newOrder).returning();

    const itemsWithOrderId = items.map((i) => ({ ...i, orderId: createdOrder.id }));

    const createdItems = await tx.insert(orderItems).values(itemsWithOrderId);

    return { createdOrder, createdItems };
  });
}
