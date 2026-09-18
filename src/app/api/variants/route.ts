import { withErrorHandling } from "@/lib/http/utils";
import { variantSearchFilters } from "@/lib/variants/types";
import { parseVariantSearchParams } from "@/lib/variants/utils";
import { getVariants } from "@/services/variants";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const filters: variantSearchFilters = parseVariantSearchParams(searchParams);
  const data = await getVariants(filters);

  return NextResponse.json({ success: true, count: data.length, data });
});
