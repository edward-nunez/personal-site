import { Request, Response, NextFunction } from 'express';
import * as ld from '@launchdarkly/node-server-sdk';
import { evaluateFlags } from '../../infrastructure/feature-flags/ldClient.js';

/**
 * Extend Express Request type to include feature flags
 */
declare module 'express' {
  interface Request {
    featureFlags?: Record<string, boolean>;
  }
}

const LD_ENVIRONMENT = process.env.LD_ENVIRONMENT || process.env.NODE_ENV || 'development';

/**
 * Feature Flags Middleware
 *
 * Evaluates LaunchDarkly feature flags for each request and attaches them to req.featureFlags.
 * Controllers can then check flags before processing requests.
 *
 * Context includes:
 * - Environment (development/production)
 * - Optional user ID from JWT (if auth is implemented)
 * - Request metadata (IP, user agent, etc.)
 *
 * @example
 * ```typescript
 * // In a controller
 * if (!req.featureFlags?.consultationPage) {
 *   return res.status(403).json({
 *     success: false,
 *     error: 'Feature temporarily unavailable',
 *     code: 'FEATURE_DISABLED'
 *   });
 * }
 * ```
 */
export const featureFlagsMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Build LaunchDarkly context for backend service
    // Using 'service' kind allows LaunchDarkly to distinguish backend requests
    // from user requests in analytics and targeting rules.
    const context: ld.LDContext = {
      kind: 'service',
      key: 'personal-site-backend', // Service identifier for analytics
      environment: LD_ENVIRONMENT,
      // Optional: Add request metadata for targeting
      custom: {
        userAgent: req.get('user-agent') || 'unknown',
        path: req.path,
        ip: req.ip,
      },
    };

    // Evaluate all flags for this context
    req.featureFlags = await evaluateFlags(context);

    // Log flag evaluation in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[FeatureFlags] Evaluated flags for request:', req.path, req.featureFlags);
    }

    next();
  } catch (error) {
    console.error('[FeatureFlags] Middleware error:', error);
    // Continue with empty flags object (fail open, not closed)
    req.featureFlags = {};
    next();
  }
};

/**
 * Helper to check if a feature is enabled for the current request.
 * Use in controllers for cleaner code.
 *
 * @example
 * ```typescript
 * if (!isFeatureEnabled(req, 'consultationPage')) {
 *   return res.status(403).json({ success: false, error: 'Feature unavailable' });
 * }
 * ```
 */
export const isFeatureEnabled = (req: Request, flagKey: string): boolean => {
  return req.featureFlags?.[flagKey] ?? false;
};

/**
 * Middleware to protect routes behind feature flags.
 * Returns 403 if the feature is disabled.
 *
 * @example
 * ```typescript
 * router.post('/consultation', requireFeature('consultationPage'), consultationController.submit);
 * ```
 */
export const requireFeature = (flagKey: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!isFeatureEnabled(req, flagKey)) {
      res.status(403).json({
        success: false,
        error: 'Feature temporarily unavailable',
        code: 'FEATURE_DISABLED',
        feature: flagKey,
      });
      return;
    }
    next();
  };
};
