import * as ld from '@launchdarkly/node-server-sdk';
import { getLDConfigWithObservability, isObservabilityEnabled } from './observability.js';

/**
 * LaunchDarkly client singleton for backend feature flag evaluation.
 * Integrates with Express middleware to provide flag values per request.
 *
 * Includes observability plugin for error monitoring, logging, and tracing.
 * Documentation: https://launchdarkly.com/docs/sdk/observability/node-js
 */

const LD_SDK_KEY = process.env.LD_SDK_KEY || '';
const LD_ENVIRONMENT = process.env.LD_ENVIRONMENT || process.env.NODE_ENV || 'development';

let ldClient: ld.LDClient | null = null;
let initializationPromise: Promise<void> | null = null;

/**
 * Feature flag fallback configuration based on maturity tiers.
 * These defaults are used ONLY when LaunchDarkly is unreachable.
 *
 * TIER 1: STABLE - Production-ready features (always ON)
 * TIER 2: BETA - Incomplete features (ON in dev, OFF in prod)
 * TIER 3: EXPERIMENTAL - A/B tests (always OFF, requires LaunchDarkly)
 */
const getDefaultFlags = (environment: string): Record<string, boolean> => {
  const isDev = environment === 'development';

  return {
    // TIER 1: STABLE
    blogSystem: true,
    consultationPage: true,
    consultationForm: true,
    themeToggle: true,
    projectDetails: true,
    framerMotionAnimations: true,
    imageLazyLoading: true,

    // TIER 2: BETA
    askAi: isDev,
    fitCheck: isDev,
    advancedJobAnalysis: false,

    // TIER 3: EXPERIMENTAL
    modalAnimationsV2: false,
    contactFormExtendedFields: false,
    skillCategoriesDisplayV2: false,
    blogArchivePage: true,
  };
};

/**
 * Initialize LaunchDarkly client.
 * Called once when the server starts.
 *
 * IMPORTANT: Observability SDK must be initialized BEFORE Express is imported.
 * This ensures all middleware and routes are properly instrumented.
 */
export const initializeLDClient = async (): Promise<void> => {
  // Prevent multiple initializations
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    // If no SDK key is provided, skip initialization
    if (!LD_SDK_KEY) {
      console.warn('[LaunchDarkly] No SDK key found. Using fallback defaults.');
      return;
    }

    try {
      // Get configuration with observability plugin
      const ldConfig = getLDConfigWithObservability();

      ldClient = ld.init(LD_SDK_KEY, ldConfig);

      // Wait for client to be ready
      await ldClient.waitForInitialization({ timeout: 5 });
      console.log('[LaunchDarkly] Client initialized successfully');

      if (isObservabilityEnabled()) {
        console.log('[LaunchDarkly] Observability features enabled');
      }
    } catch (error) {
      console.error('[LaunchDarkly] Failed to initialize client:', error);
      ldClient = null;
    }
  })();

  return initializationPromise;
};

/**
 * Evaluate feature flags for a service context.
 * Uses the 'service' context kind to distinguish backend requests from user requests
 * in LaunchDarkly analytics, allowing targeted rules per microservice.
 * Returns flag values or fallback defaults if LaunchDarkly is unavailable.
 *
 * @param context - LaunchDarkly evaluation context (service context with environment, path, etc.)
 * @returns Record of flag keys to boolean values
 */
export const evaluateFlags = async (context: ld.LDContext): Promise<Record<string, boolean>> => {
  const defaultFlags = getDefaultFlags(LD_ENVIRONMENT);

  // If client is not initialized, return defaults
  if (!ldClient) {
    return defaultFlags;
  }

  try {
    const flags: Record<string, boolean> = {};

    // Evaluate each flag
    for (const flagKey of Object.keys(defaultFlags)) {
      try {
        const value = await ldClient.variation(flagKey, context, defaultFlags[flagKey]);
        flags[flagKey] = Boolean(value);
      } catch (error) {
        console.error(`[LaunchDarkly] Error evaluating flag "${flagKey}":`, error);
        flags[flagKey] = defaultFlags[flagKey];
      }
    }

    return flags;
  } catch (error) {
    console.error('[LaunchDarkly] Error during flag evaluation:', error);
    return defaultFlags;
  }
};

/**
 * Gracefully close the LaunchDarkly client.
 * Called when the server shuts down.
 */
export const closeLDClient = async (): Promise<void> => {
  if (ldClient) {
    try {
      await ldClient.close();
      console.log('[LaunchDarkly] Client closed successfully');
    } catch (error) {
      console.error('[LaunchDarkly] Error closing client:', error);
    } finally {
      ldClient = null;
      initializationPromise = null;
    }
  }
};

/**
 * Check if LaunchDarkly client is initialized and ready.
 */
export const isLDClientReady = (): boolean => {
  return ldClient !== null;
};
