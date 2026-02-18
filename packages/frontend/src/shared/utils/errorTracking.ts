/**
 * Frontend error tracking utility for LaunchDarkly observability.
 * Provides helper functions to track various types of errors from React components.
 */

export interface ErrorContext {
  component?: string;
  userId?: string;
  location?: string;
  action?: string;
  details?: Record<string, unknown>;
  tags?: string[];
}

/**
 * Track a generic error with optional context.
 * The error will be automatically reported to LaunchDarkly observability.
 */
export const trackError = (
  error: unknown,
  context?: ErrorContext,
  severity: 'error' | 'warn' = 'error'
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  const logPayload = {
    message: errorMessage,
    stack: errorStack,
    component: context?.component,
    userId: context?.userId,
    location: context?.location,
    action: context?.action,
    details: context?.details,
    tags: context?.tags || ['general_error'],
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };

  if (severity === 'warn') {
    console.warn('[Error Tracking] Tracked warning:', logPayload);
  } else {
    console.error('[Error Tracking] Tracked error:', logPayload);
  }
};

/**
 * Track a component rendering error.
 * Useful for catching and logging errors in error boundaries.
 */
export const trackComponentError = (
  error: unknown,
  componentName: string,
  context?: Omit<ErrorContext, 'component'>
): void => {
  trackError(error, {
    component: componentName,
    ...context,
    tags: ['component_error', ...(context?.tags || [])],
  });
};

/**
 * Track an API/network error.
 * Captures information about failed HTTP requests.
 */
export const trackAPIError = (
  error: unknown,
  options?: {
    endpoint?: string;
    method?: string;
    statusCode?: number;
    userId?: string;
  }
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  trackError(error, {
    userId: options?.userId,
    location: options?.endpoint,
    action: options?.method,
    details: {
      endpoint: options?.endpoint,
      method: options?.method,
      statusCode: options?.statusCode,
    },
    tags: ['api_error', `status_${options?.statusCode}`],
  });
};

/**
 * Track a form validation error.
 * Captures information about user input validation failures.
 */
export const trackValidationError = (
  fieldName: string,
  validationMessage: string,
  context?: Omit<ErrorContext, 'action'>
): void => {
  const error = new Error(`Validation error: ${validationMessage}`);

  trackError(error, {
    action: fieldName,
    ...context,
    details: {
      fieldName,
      validationMessage,
    },
    tags: ['validation_error'],
  });
};

/**
 * Track a permission/authorization error.
 * Captures when user lacks required permissions.
 */
export const trackAuthorizationError = (
  requiredPermission: string,
  context?: ErrorContext
): void => {
  const error = new Error(`Authorization error: User lacks permission: ${requiredPermission}`);

  trackError(error, {
    ...context,
    details: {
      requiredPermission,
      userHasAccess: false,
    },
    tags: ['authorization_error'],
  });
};

/**
 * Track a performance-related error or warning.
 * Useful for tracking slow operations, memory issues, or performance degradation.
 */
export const trackPerformanceIssue = (
  issue: string,
  duration?: number,
  context?: ErrorContext
): void => {
  const message = duration ? `${issue} (${duration}ms)` : issue;

  console.warn('[Performance] Tracked performance issue:', {
    issue,
    duration,
    ...context,
    timestamp: new Date().toISOString(),
  });

  trackError(
    new Error(message),
    {
      ...context,
      details: {
        issue,
        duration,
      },
      tags: ['performance_issue'],
    },
    'warn'
  );
};

/**
 * Track a feature flag related error.
 * Captures errors when evaluating or applying feature flags.
 */
export const trackFeatureFlagError = (
  flagName: string,
  error: unknown,
  context?: Omit<ErrorContext, 'action'>
): void => {
  trackError(error, {
    action: flagName,
    ...context,
    details: {
      flagName,
    },
    tags: ['feature_flag_error'],
  });
};

/**
 * Create an error boundary helper for React components.
 * Usage: `<ErrorBoundary component="MyComponent">{children}</ErrorBoundary>`
 */
export class ErrorBoundaryHelper {
  static handleError = (error: unknown, componentName: string, componentStack?: string): void => {
    trackComponentError(error, componentName, {
      details: componentStack ? { componentStack } : undefined,
    });
  };

  static handleErrorWithContext = (
    error: unknown,
    componentName: string,
    context?: ErrorContext
  ): void => {
    trackComponentError(error, componentName, context);
  };
}
