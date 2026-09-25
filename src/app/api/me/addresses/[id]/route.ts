import { requireSession } from "@/lib/auth/auth-session";
import { withErrorHandling } from "@/lib/http/utils";
import { deleteAddress } from "@/services/addresses";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = withErrorHandling(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const { user } = await requireSession();

  const res = await deleteAddress(parseInt(id), user.id);
  if (!res.rowCount || res.rowCount == 0) {
    return NextResponse.json(
      { success: false, message: "Address deletion unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, message: "Address deleted successfully" });
});
