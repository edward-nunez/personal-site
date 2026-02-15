/**
 * Base Application Error
 * All custom errors extend this class
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404);
  }
}

/**
 * 400 Bad Request / Validation Error
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly errors?: Record<string, unknown>
  ) {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * 409 Conflict Error (e.g., duplicate resource)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalError extends AppError {
  constructor(message: string = 'Internal server error', isOperational: boolean = false) {
    super(message, 500, isOperational);
  }
}

/**
 * Database Operation Error
 */
export class DatabaseError extends AppError {
  constructor(
    message: string,
    public readonly originalError?: Error
  ) {
    super(message, 500, false);
  }
}
