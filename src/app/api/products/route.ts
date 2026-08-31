import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/services/products";
import { productInsertSchema } from "@/validation/products";
import { ZodError } from "zod";
import { formatZodError } from "@/lib/format/ulits";

export async function GET() {
  try {
    const data = await getProducts();

    return NextResponse.json({ success: true, data });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: e }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = productInsertSchema.parse(body);

    const createdProduct = await createProduct(validatedData);
    if (!createdProduct) {
      console.error("product creation failed");

      return NextResponse.json(
        { success: false, message: "product creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "product created successfully", data: createdProduct });
  } catch (e) {
    if (e instanceof ZodError) {
      const errors = formatZodError(e);
      console.log("validation errors: ", errors);
      return NextResponse.json(
        { success: false, message: "Validation error", errors },
        { status: 400 }
      );
    }

    console.error("Failed to create product:", e);
    return NextResponse.json(
      { success: false, error: "Failed to create product", details: String(e) },
      { status: 500 }
    );
  }
}
