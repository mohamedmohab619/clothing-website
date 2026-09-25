import { getDB } from "@/db";
import { addresses } from "@/db/schema";
import { NewAddress } from "@/db/types";
import { and, desc, eq } from "drizzle-orm";

export async function getAddressesByUserId(userId: string) {
  const db = getDB();

  return await db.query.addresses.findMany({
    where: eq(addresses.userId, userId),
    orderBy: desc(addresses.createdAt),
  });
}

export async function createAddress(address: NewAddress) {
  const db = getDB();

  return await db.insert(addresses).values(address);
}

export async function deleteAddress(id: number, userId: string) {
  const db = getDB();

  return (await db.delete(addresses)
    .where(
      and(
        eq(addresses.userId, userId),
        eq(addresses.id, id)
      )
    )
  );
}
