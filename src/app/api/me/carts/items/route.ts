import { getDB } from "@/db";
import { cartItems, variants } from "@/db/schema";
import { NewCartItem } from "@/db/types";
import { requireSession } from "@/lib/auth/auth-session";
import { withErrorHandling } from "@/lib/http/utils"
import { getCartItems, getCartItemsWithUserId } from "@/services/cartItems";
import { createCartWithItems, getCart } from "@/services/carts";
import { cartItemServerSchema } from "@/validation/cartItem.server";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(async () => {
  const { user } = await requireSession();

  const items = await getCartItemsWithUserId(user.id);

  if (!items) {
    return NextResponse.json({ success: false, data: null }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: items });
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  // dependencies
  const { user } = await requireSession();
  const body = await req.json();
  const db = getDB();

  // validation
  const { productId, quantity, selectedColor, selectedSize, image } = cartItemServerSchema.parse(body)

  // variantId handling
  // using product ID, color, size, get the variant ID
  const foundVariant = await db.query.variants.findFirst({
    where: and(
      eq(variants.productId, productId),
      eq(variants.colorName, selectedColor),
      eq(variants.size, selectedSize),
    ),
  });

  if (!foundVariant) {
    console.error("variant not found");
    return NextResponse.json({ success: false, message: "variant not found" }, { status: 400 });
  }

  console.log(foundVariant);
  const newCartItem: NewCartItem = {
    quantity,
    image,
    cartId: 0,
    variantId: foundVariant.id,
  };

  // cart
  const cart = await getCart(user.id);
  console.log("found cart data:");
  console.log(cart);
  if (!cart) {
    console.log("no cart found... creating one!");
    const result = await createCartWithItems({ userId: user.id }, [newCartItem]);
    return NextResponse.json({ success: true, data: result });
  }

  console.log("cart found... just adding the item to it!")
  const itemWithCartId = { ...newCartItem, cartId: cart.id }

  const result = await db
    .insert(cartItems)
    .values(itemWithCartId)
    .onConflictDoUpdate({
      target: [cartItems.cartId, cartItems.variantId],
      set: {
        quantity: sql`${cartItems.quantity} + excluded.quantity`,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!result) {
    return NextResponse.json({ success: false }, { status: 500 })
  }

  const allItems = await getCartItems(cart.id);
  return NextResponse.json({ success: true, data: allItems });
});

// export const POST = withErrorHandling(async (req: NextRequest) => {
//   // Data Processing
//   const body = await req.json();
//   const validatedAddress = addressServerSchema.parse(body);
//
//   const { user } = await requireSession();
//
//   const userAddresses = await getAddressesByUserId(user.id);
//
//   const newAddress = { ...validatedAddress, userId: user.id }
//
//   if (userAddresses.length < 1) {
//     newAddress.isDefault = true;
//   }
//
//   const createdAddress = await createAddress(newAddress);
//   if (!createdAddress) {
//     throw new InternalServerError("Address creation failed");
//   }
//
//   return NextResponse.json({
//     success: true,
//     message: "Address created successfully",
//     data: createdAddress
//   });
// });
//
