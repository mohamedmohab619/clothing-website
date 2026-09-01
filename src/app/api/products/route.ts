import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/services/products";
import { productInsertSchema } from "@/validation/products";
import { withErrorHandling } from "@/lib/http/utils";
import { InternalServerError } from "@/lib/http/errors";

export const GET = withErrorHandling(async () => {
  const data = await getProducts();

  return NextResponse.json({ success: true, data });
});

export const POST = withErrorHandling(async (
  req: NextRequest
) => {
  const body = await req.json();

  // throws ZodError
  const validatedData = productInsertSchema.parse(body);

  const createdProduct = await createProduct(validatedData);
  if (!createdProduct) {
    throw new InternalServerError("Product creation failed");
  }

  return NextResponse.json({ success: true, message: "product created successfully", data: createdProduct });
})
