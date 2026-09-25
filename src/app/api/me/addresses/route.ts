import { requireSession } from "@/lib/auth/auth-session";
import { InternalServerError } from "@/lib/http/errors";
import { withErrorHandling } from "@/lib/http/utils"
import { createAddress, getAddressesByUserId } from "@/services/addresses";
import { addressServerSchema } from "@/validation/address.server";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(async () => {
  const { user } = await requireSession();

  const orders = await getAddressesByUserId(user.id);

  return NextResponse.json(orders);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  // Data Processing
  const body = await req.json();
  const validatedAddress = addressServerSchema.parse(body);

  const { user } = await requireSession();

  const userAddresses = await getAddressesByUserId(user.id);

  const newAddress = { ...validatedAddress, userId: user.id }

  if (userAddresses.length < 1) {
    newAddress.isDefault = true;
  }

  const createdAddress = await createAddress(newAddress);
  if (!createdAddress) {
    throw new InternalServerError("Address creation failed");
  }

  return NextResponse.json({
    success: true,
    message: "Address created successfully",
    data: createdAddress
  });
});

