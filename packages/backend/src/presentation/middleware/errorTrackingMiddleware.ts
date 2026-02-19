import { Request, Response, NextFunction } from 'express';
import { trackError } from '../../shared/utils/errorTracking.js';

/**
 * Error Tracking Middleware
 *
 * Automatically captures and reports HTTP errors to LaunchDarkly's observability system.
 * Attaches request context (ID, path, method) to help identify error sources.
 *
 * Should be applied near the end of middleware stack, after main routes but before
 * the generic error handler.
 */

/**
 * Generate or retrieve a unique request ID for tracking
 */
const getRequestId = (req: Request): string => {
  // Request IDs enable tracing across distributed logs; reuse upstream ID if present (e.g., from load balancer).
  if (typeof req.headers['x-request-id'] === 'string') {
    return req.headers['x-request-id'];
  }

  // Generate unique ID for this request if not provided. Format: timestamp + random suffix for uniqueness.
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Track HTTP errors (4xx and 5xx responses)
 *
 * Logs errors with request context for better debugging and monitoring.
 * Particularly useful for tracking:
 * - 4xx errors: Client errors, validation failures, not found, etc.
 * - 5xx errors: Server errors, unhandled exceptions, database failures
 *
 * Usage in routes:
 * @example
 * ```typescript
 * app.use(errorTrackingMiddleware);
 *
 * app.get('/api/example', (req, res) => {
 *   if (error) {
 *     res.status(500).json({ error: 'Server error' });
 *     // Error will be automatically tracked with context
 *   }
 * });
 * ```
 */
export const errorTrackingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = getRequestId(req);

  // Intercept all JSON responses to capture error context (request ID, status, endpoint) for monitoring.
  // This approach works with any error handler downstream without code changes needed in routes.
  const originalJson = res.json.bind(res);

  res.json = function (data: unknown) {
    // Only track 4xx/5xx responses; successful requests (2xx/3xx) don't need error tracking.
    const statusCode = res.statusCode;
    const isErrorResponse = statusCode >= 400;

    if (isErrorResponse) {
      // Extract error message from standardized API response format for clearer observability.
      let errorMessage = `HTTP ${statusCode}`;

      if (typeof data === 'object' && data !== null) {
        const errorData = data as Record<string, unknown>;
        if (typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        } else if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        }
      }

      // Track the error with full context
      trackError(
        new Error(errorMessage),
        {
          requestId,
          endpoint: req.path,
          method: req.method,
          statusCode,
          userAgent: req.get('user-agent'),
          tags: {
            errorType: statusCode < 500 ? 'client_error' : 'server_error',
            statusCode: statusCode.toString(),
          },
        },
        statusCode >= 500 ? 'error' : 'warn'
      );
    }

    // Call original json method
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Express Error Handler for tracking caught errors
 *
 * This middleware should be the last middleware in the Express app.
 * Catches any errors thrown or passed to next() with error parameter.
 *
 * Usage:
 * @example
 * ```typescript
 * app.use(errorTrackingMiddleware);
 * app.use(errorHandler); // Your routes
 * app.use(expressErrorHandler); // Should be last
 * ```
 */
export const expressErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = getRequestId(req);
  const statusCode = res.statusCode || 500;

  // Track the error
  trackError(
    err,
    {
      requestId,
      endpoint: req.path,
      method: req.method,
      statusCode,
      userAgent: req.get('user-agent'),
      tags: {
        errorType: 'unhandled_exception',
        statusCode: statusCode.toString(),
      },
    },
    'error'
  );

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal server error' : err.message,
    message: 'An error occurred processing your request',
    requestId, // Include request ID for tracking
  });
};
