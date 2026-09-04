import { NextRequest, NextResponse } from "next/server";
import { createProduct, getFormattedProducts, getProducts } from "@/services/products";
import { productInsertSchema } from "@/validation/products";
import { withErrorHandling } from "@/lib/http/utils";
import { InternalServerError } from "@/lib/http/errors";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const isRaw = searchParams.get("format") === "raw";

  if (isRaw) {
    const rawData = await getProducts();
    return NextResponse.json({ success: true, data: rawData });
  }

  let data = await getFormattedProducts();

  // Apply optional filtering if query params are present
  const q = searchParams.get("q") || searchParams.get("query");
  const category = searchParams.get("category");
  const color = searchParams.get("color");
  const size = searchParams.get("size");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  if (q) {
    const queryTerm = q.toLowerCase().trim();
    data = data.filter((p) =>
      p.title.toLowerCase().includes(queryTerm) ||
      p.slug.toLowerCase().includes(queryTerm) ||
      (p.description && p.description.toLowerCase().includes(queryTerm)) ||
      p.colorOptions.some((co) => co.name.toLowerCase().includes(queryTerm))
    );
  }

  if (category) {
    const cat = category.toLowerCase();
    data = data.filter((p) => p.slug.includes(cat) || p.title.toLowerCase().includes(cat));
  }

  if (color) {
    const requestedColors = color.toLowerCase().split(",");
    data = data.filter((p) =>
      p.colorOptions.some((co) => requestedColors.includes(co.name.toLowerCase()))
    );
  }

  if (size) {
    const requestedSizes = size.toLowerCase().split(",");
    data = data.filter((p) =>
      p.availableSizes.some((s) => requestedSizes.includes(s.toLowerCase()))
    );
  }

  if (minPrice) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
      data = data.filter((p) => p.rawPrice >= min);
    }
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
      data = data.filter((p) => p.rawPrice <= max);
    }
  }

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
