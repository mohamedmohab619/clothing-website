import { NextRequest, NextResponse } from "next/server";
import { deleteProductBySlug, getProductBySlug, updateProduct } from "@/services/products";
import { productInsertSchema } from "@/validation/products";
import { ZodError } from "zod";
import { formatZodError } from "@/lib/format/ulits";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product slug is required" },
        { status: 400 }
      );
    }

    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product found", data: product });
  } catch (e) {

  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product slug is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validatedData = productInsertSchema.parse(body);

    const updatedProduct = await updateProduct(slug, validatedData);

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: "product updated successfully", data: updatedProduct },
    )
  } catch (e) {
    if (e instanceof ZodError) {
      const errors = formatZodError(e);
      console.log("validation errors: ", errors);
      return NextResponse.json(
        { success: false, message: "Validation error", errors },
        { status: 400 }
      );
    }

    console.error("Failed to update product:", e);
    return NextResponse.json(
      { success: false, error: "Failed to update product", details: String(e) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product slug is required" },
        { status: 400 }
      );
    }

    const wasDeleted = await deleteProductBySlug(slug);

    if (!wasDeleted) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Failed to delete product:", e);
    return NextResponse.json(
      { success: false, error: "Failed to delete product", details: String(e) },
      { status: 500 }
    );
  }
}
