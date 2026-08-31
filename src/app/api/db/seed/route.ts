import { seed } from "@/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await seed();

    return NextResponse.json({ result });
  } catch (error) {
    console.error("seeding error", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
