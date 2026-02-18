import logger from '../../shared/utils/logger.js';

/**
 * LaunchDarkly Error Tracking Utility
 *
 * Provides centralized error tracking and monitoring through LaunchDarkly's
 * observability features. Automatically captures error context including:
 * - Error message and stack trace
 * - Environment and service version
 * - Request context (path, method, user agent)
 * - Timestamp
 *
 * Errors are automatically reported to LaunchDarkly's Errors view when
 * the observability plugin is enabled.
 *
 * Documentation: https://launchdarkly.com/docs/home/observability/errors
 */

interface ErrorContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  userAgent?: string;
  tags?: Record<string, string>;
}

/**
 * Track and log an error with LaunchDarkly context
 *
 * The error is logged via Winston logger, which integrates with LaunchDarkly's
 * observability plugin to automatically report errors.
 *
 * @param error - The error to track
 * @param context - Optional context about the error occurrence
 * @param severity - Error severity level ('error' | 'warn' | 'critical')
 *
 * @example
 * ```typescript
 * try {
 *   await someOperation();
 * } catch (error) {
 *   trackError(error, {
 *     endpoint: '/api/consultation',
 *     method: 'POST',
 *     userId: req.user?.id,
 *   }, 'error');
 * }
 * ```
 */
export const trackError = (
  error: unknown,
  context?: ErrorContext,
  severity: 'error' | 'warn' | 'critical' = 'error'
): void => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unknown error occurred';

  const errorStack = error instanceof Error ? error.stack : undefined;

  // Build structured log with enriched context
  const logPayload = {
    message: errorMessage,
    stack: errorStack,
    endpoint: context?.endpoint,
    method: context?.method,
    statusCode: context?.statusCode,
    userId: context?.userId,
    requestId: context?.requestId,
    userAgent: context?.userAgent,
    tags: context?.tags,
    timestamp: new Date().toISOString(),
  };

  // Log based on severity level
  switch (severity) {
    case 'critical':
      logger.error('[CRITICAL] ' + errorMessage, logPayload);
      break;
    case 'warn':
      logger.warn(errorMessage, logPayload);
      break;
    case 'error':
    default:
      logger.error(errorMessage, logPayload);
  }
};

/**
 * Track a validation error
 * Used for user input validation failures
 */
export const trackValidationError = (
  fieldName: string,
  reason: string,
  context?: ErrorContext
): void => {
  trackError(
    new Error(`Validation failed for field "${fieldName}": ${reason}`),
    {
      ...context,
      tags: {
        errorType: 'validation',
        field: fieldName,
      },
    },
    'warn'
  );
};

/**
 * Track a database error
 * Used for database operation failures
 */
export const trackDatabaseError = (
  operation: string,
  error: unknown,
  context?: ErrorContext
): void => {
  trackError(
    error instanceof Error ? error : new Error(`Database operation failed: ${operation}`),
    {
      ...context,
      tags: {
        errorType: 'database',
        operation,
      },
    },
    'error'
  );
};

/**
 * Track an external service error
 * Used for failures in calls to external APIs or services
 */
export const trackExternalServiceError = (
  serviceName: string,
  error: unknown,
  context?: ErrorContext
): void => {
  trackError(
    error instanceof Error ? error : new Error(`External service error: ${serviceName}`),
    {
      ...context,
      tags: {
        errorType: 'external_service',
        service: serviceName,
      },
    },
    'error'
  );
};

/**
 * Track an authentication error
 * Used for auth-related failures (invalid token, expired session, etc.)
 */
export const trackAuthError = (reason: string, context?: ErrorContext): void => {
  trackError(
    new Error(`Authentication error: ${reason}`),
    {
      ...context,
      tags: {
        errorType: 'authentication',
        reason,
      },
    },
    'warn'
  );
};

/**
 * Track a configuration error
 * Used for missing or invalid configuration
 */
export const trackConfigError = (configKey: string, error?: string): void => {
  trackError(
    new Error(`Configuration error: Missing or invalid "${configKey}"${error ? `: ${error}` : ''}`),
    {
      tags: {
        errorType: 'configuration',
        configKey,
      },
    },
    'critical'
  );
};
