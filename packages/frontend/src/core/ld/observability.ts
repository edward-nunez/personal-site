import Observability, { LDObserve } from '@launchdarkly/observability';
import SessionReplay, { LDRecord } from '@launchdarkly/session-replay';
import {
  getApiBaseUrl,
  getApiEnvironment,
  getLdClientId,
  getSessionReplayPrivacy,
} from '@/core/config/runtimeConfig';

/**
 * Frontend observability and session replay configuration for LaunchDarkly.
 * Enables error tracking, logging, metrics, tracing, and session recording.
 */

const LD_CLIENT_ID = getLdClientId();
const ENVIRONMENT = getApiEnvironment();
const API_BASE_URL = getApiBaseUrl();

/**
 * Session replay privacy settings:
 * - 'strict' (default): Obscures text inputs, password fields, and PII
 * - 'default': Redacts text matching common PII regex patterns
 * - 'none': No obfuscation (use only with explicit user consent for privacy compliance)
 */
const SESSION_REPLAY_PRIVACY = getSessionReplayPrivacy();

/**
 * Determine if observability should be enabled based on environment.
 * Observability requires a valid LaunchDarkly client-side ID.
 */
export const isObservabilityEnabled = (): boolean => {
  return !!LD_CLIENT_ID;
};

/**
 * Create and return observability plugin with environment-specific configuration.
 * Enables automatic error tracking, logging, metrics, and tracing.
 */
export const createObservabilityPlugin = (): Observability => {
  const isDevelopment = ENVIRONMENT === 'development';

  return new Observability({
    // Enable automatic tracing to correlate frontend requests with backend
    tracingOrigins: [API_BASE_URL],

    // Network recording captures HTTP requests, responses, and headers
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: isDevelopment, // Only record body in dev to reduce payload in prod
    },

    // Automatically capture and report errors
    errorTracking: {
      enabled: true,
    },

    // Automatically capture console logs (warn, error)
    logging: {
      enabled: true,
      logLevel: isDevelopment ? 'debug' : 'warn',
    },

    // Automatically capture performance metrics (CLS, FCP, LCP, etc.)
    metrics: {
      enabled: true,
    },

    // Enable distributed tracing for request correlation
    tracing: {
      enabled: isDevelopment, // Reduce noise in production
    },
  });
};

/**
 * Create and return session replay plugin with environment-specific configuration.
 * Records user sessions for debugging and support purposes.
 */
export const createSessionReplayPlugin = (): SessionReplay => {
  return new SessionReplay({
    // Privacy setting for obfuscating sensitive data in recordings
    privacySetting: SESSION_REPLAY_PRIVACY,

    // Additional settings
    enabled: true,
  });
};

/**
 * Get plugins array for LaunchDarkly SDK initialization.
 * Returns both observability and session replay plugins configured for the environment.
 */
export const getObservabilityPlugins = (): Array<Observability | SessionReplay> => {
  if (!isObservabilityEnabled()) {
    return [];
  }

  return [createObservabilityPlugin(), createSessionReplayPlugin()];
};

/**
 * Manually start observability recording.
 * Useful when observability is initialized with manualStart: true,
 * allowing feature-flagged rollouts or waiting for user consent.
 */
export const startObservability = (): void => {
  try {
    if (isObservabilityEnabled()) {
      LDObserve.start();
      console.log('[Observability] Started error tracking and metrics collection');
    }
  } catch (error) {
    console.error('[Observability] Failed to start error tracking:', error);
  }
};

/**
 * Manually start session replay recording.
 * Useful when session replay is initialized with manualStart: true,
 * allowing feature-flagged rollouts or waiting for user consent.
 */
export const startSessionReplay = (): void => {
  try {
    if (isObservabilityEnabled()) {
      LDRecord.start({ silent: false });
      console.log('[SessionReplay] Started recording user session');
    }
  } catch (error) {
    console.error('[SessionReplay] Failed to start session replay:', error);
  }
};

/**
 * Stop session replay recording.
 * Useful for stopping recording when user logs out or disables session recording.
 */
export const stopSessionReplay = (): void => {
  try {
    LDRecord.stop();
    console.log('[SessionReplay] Stopped recording user session');
  } catch (error) {
    console.error('[SessionReplay] Failed to stop session replay:', error);
  }
};

/**
 * Report a custom error to LaunchDarkly observability.
 * Use this for tracking application-specific errors that may not be automatically caught.
 */
export const reportError = (error: unknown, context?: Record<string, unknown>): void => {
  try {
    if (!isObservabilityEnabled()) {
      console.warn('[Observability] Not enabled, skipping error report');
      return;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    // LaunchDarkly automatically captures errors, but we can enhance them with context
    const enrichedError = new Error(errorMessage);
    enrichedError.stack = errorStack;

    // Log with context for manual tracking
    console.error('[Observability] Tracking error:', {
      message: errorMessage,
      stack: errorStack,
      context,
      timestamp: new Date().toISOString(),
    });

    // Rethrow to let LaunchDarkly auto-capture it
    throw enrichedError;
  } catch (e) {
    // LaunchDarkly will capture this
    if (e !== error) throw e; // Re-throw only if it's our enriched error
  }
};
