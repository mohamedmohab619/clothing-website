import { requireSession } from "@/lib/auth/auth-session";
import { withErrorHandling } from "@/lib/http/utils";
import { getOrdersByUserId } from "@/services/orders";
import { NextResponse } from "next/server";

// src/app/api/me/orders/route.ts
export const GET = withErrorHandling(async () => {
  const { user } = await requireSession();

  const orders = await getOrdersByUserId(user.id);

  return NextResponse.json(orders);
});
