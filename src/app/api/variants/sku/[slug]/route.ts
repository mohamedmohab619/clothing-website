import { BadRequestError } from "@/lib/http/errors";
import { withErrorHandling } from "@/lib/http/utils";
import { getVariantBySku } from "@/services/variants";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;

  if (!slug) {
    throw new BadRequestError("Bad Request: product slug is required");
  }

  const variant = await getVariantBySku(slug);

  return NextResponse.json({ success: true, message: "Product found", data: variant });
});
