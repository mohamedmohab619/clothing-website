// lib/errors.ts

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    // Helps distinguish expected operational errors from unknown system bugs
    this.isOperational = true;

    // Restores correct prototype chain for 'instanceof' checks in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Optional helper subclasses for clean syntax:
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found') {
    super(message, 404);
  }
}

// Base 500 Error
export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}
