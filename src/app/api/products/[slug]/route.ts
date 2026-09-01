import { NextRequest, NextResponse } from "next/server";
import { deleteProductBySlug, getProductBySlug, updateProduct } from "@/services/products";
import { productInsertSchema } from "@/validation/products";
import { BadRequestError, NotFoundError } from "@/lib/http/errors";
import { withErrorHandling } from "@/lib/http/utils";

export const GET = withErrorHandling(async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;

  if (!slug) {
    throw new BadRequestError("Bad Request: product slug is required");
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    throw new NotFoundError("Product Not Found");
  }

  return NextResponse.json({ success: true, message: "Product found", data: product });
});

export const PUT = withErrorHandling(async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;

  if (!slug) {
    throw new BadRequestError("Bad Request: product slug is required");
  }

  const body = await req.json();
  const validatedData = productInsertSchema.parse(body);

  const updatedProduct = await updateProduct(slug, validatedData);

  if (!updatedProduct) {
    throw new NotFoundError("Product Not Found");
  }

  return NextResponse.json({ success: true, message: "product updated successfully", data: updatedProduct });
});

export const DELETE = withErrorHandling(async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;

  if (!slug) {
    throw new BadRequestError("Bad Request: product slug is required");
  }

  const wasDeleted = await deleteProductBySlug(slug);

  if (!wasDeleted) {
    throw new NotFoundError("Product Not Found");
  }

  return NextResponse.json({ success: true, message: "Product deleted successfully" });
});
