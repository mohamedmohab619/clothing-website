// lib/http/api-handler.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { formatZodError } from '../format/utils';

type RouteHandler<T = any> = (
  req: NextRequest,
  ctx: { params: Promise<T> }
) => Promise<NextResponse>;

export function withErrorHandling<T = any>(handler: RouteHandler<T>) {
  return async (req: NextRequest, ctx: { params: Promise<T> }) => {
    try {
      return await handler(req, ctx);
    } catch (error: any) {
      console.error('API Error:', error);

      // Distinguish custom app errors vs unhandled standard errors
      const status = error.statusCode || 500;
      const message = String(error.message) || 'Internal Server Error';

      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation Error",
            errors: formatZodError(error),
          },
          { status }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status }
      );
    }
  };
}
