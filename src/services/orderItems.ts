import { getDB } from "@/db";
import { orderItems } from "@/db/schema";
import { NewOrderItem } from "@/db/types";
import { eq } from "drizzle-orm";

export async function getOrderItems() {
  const db = getDB()

  return await db.query.orderItems.findMany() || [];
}

export async function getOrderItemById(id: number) {
  const db = getDB();

  const result = await db.query.orderItems.findFirst({
    where: eq(orderItems.id, id),
  });

  return result;
}

export async function createOrderItem(data: NewOrderItem[]) {
  const db = getDB();

  return await db.insert(orderItems).values(data).returning();
}
