import { TestQuery } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const startTime = Date.now();

    const result = await TestQuery();
    const latency = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'success',
        message: 'Successfully connected to Neon PostgreSQL',
        latency: `${latency}ms`,
        data: result.rows[0],
      },
      { status: 200 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to the database',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
