import { requireSession } from "@/lib/auth/auth-session";
import { withErrorHandling } from "@/lib/http/utils";
import { getCart } from "@/services/carts";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(async () => {
  const { user } = await requireSession();

  const cart = await getCart(user.id);

  if (!cart) {
    return NextResponse.json({ success: false, data: null }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: cart });
});
