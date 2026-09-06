import { NextRequest, NextResponse } from "next/server";
import { createProduct, getFormattedProducts, getProducts } from "@/services/products";
import { productInsertSchema } from "@/validation/products";
import { withErrorHandling } from "@/lib/http/utils";
import { InternalServerError } from "@/lib/http/errors";
import { ProductSearchFilters } from "@/lib/products/types";
import { parseProductSearchParams } from "@/lib/products/utils";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const isRaw = searchParams.get("format") === "raw";

  if (isRaw) {
    const rawData = await getProducts();
    return NextResponse.json({ success: true, data: rawData });
  }

  const filters: ProductSearchFilters = parseProductSearchParams(searchParams);
  const data = await getFormattedProducts(filters);

  return NextResponse.json({ success: true, count: data.length, data });
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
