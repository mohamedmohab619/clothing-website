import { deleteTables } from "@/db";
import { NextResponse } from "next/server";
import { serverConfig } from "@/lib/config/server";

export async function POST() {
  if (!serverConfig.isDevelopment) {
    return NextResponse.json(
      { error: "reset is disabled in production" },
      { status: 403 }
    );
  }

  try {
    const result = await deleteTables();

    return NextResponse.json({ result });
  } catch (error) {
    console.error("seeding error", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
