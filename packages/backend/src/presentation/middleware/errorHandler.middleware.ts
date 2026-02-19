import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../../shared/errors/index.js';
import { ZodError } from 'zod';
import config from '../../configs/index.js';
import logger from '../../shared/utils/logger.js';

/**
 * Log an error without leaking stack traces in production.
 * Stack traces and detailed messages are only logged when NODE_ENV is 'development' or 'test'.
 */
function logError(err: Error): void {
  const meta: Record<string, unknown> = {
    name: err.name,
    message: err.message,
  };
  if (config.isDevOrTest && err.stack) {
    meta.stack = err.stack;
  }
  logger.error('Error occurred:', meta);
}

/**
 * Global error handler middleware
 * Catches all errors and returns consistent JSON responses.
 * Stack traces and internal details are only exposed when NODE_ENV is 'development' or 'test'.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logError(err);

  // Zod validation errors are client-facing; field-level details help developers fix request payloads.
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.issues.map((issue) => ({
        path: issue.path.map(String).join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  // Application errors have explicit status codes and messages designed for API clients.
  // No stack traces; message is controlled API surface for security.
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err instanceof ValidationError && err.errors ? { details: err.errors } : {}),
    });
    return;
  }

  // Unknown errors are security risk if exposed; only dev/test environments get details for debugging.
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(config.isDevOrTest ? { details: err.message, stack: err.stack } : {}),
  });
};
