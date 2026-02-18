import * as LDClient from 'launchdarkly-react-client-sdk';
import { useFeatureFlagsStore } from '../store/useFeatureFlagsStore';
import { getObservabilityPlugins, isObservabilityEnabled } from './observability.js';

/**
 * LaunchDarkly client configuration and initialization.
 * Handles connection, flag updates, fallback behavior, and observability (error tracking, session replay).
 */

const LD_CLIENT_ID = import.meta.env.VITE_LD_SDK_KEY || '';
const ENVIRONMENT = import.meta.env.VITE_API_ENV || import.meta.env.MODE || 'development';

/**
 * Initialize LaunchDarkly client and sync with Zustand store.
 * Provides real-time flag updates and handles connection failures gracefully.
 */
export const initializeLDClient = async (): Promise<void> => {
  // If no SDK key is provided, skip LaunchDarkly initialization
  // The store will use maturity-based fallback defaults
  if (!LD_CLIENT_ID) {
    console.warn('[LaunchDarkly] No SDK key found. Using fallback defaults.');
    useFeatureFlagsStore.getState().reset();
    return;
  }

  try {
    // Create LaunchDarkly context for frontend (user audience)
    // Distinct from backend service context for proper analytics segmentation
    const context: LDClient.LDContext = {
      kind: 'user',
      key: 'anonymous-user',
      anonymous: true,
      environment: ENVIRONMENT,
    };

    // Initialize client (this is handled by LDProvider in React)
    // This function is primarily for documenting the configuration
    console.log('[LaunchDarkly] Initialized with context:', context);
  } catch (error) {
    console.error('[LaunchDarkly] Initialization failed:', error);
    useFeatureFlagsStore.getState().reset();
  }
};

/**
 * Get LaunchDarkly configuration for LDProvider component
 */
export const getLDConfig = (): {
  clientSideID: string;
  context: LDClient.LDContext;
  options?: LDClient.LDOptions;
} => {
  return {
    clientSideID: LD_CLIENT_ID,
    context: {
      kind: 'user',
      key: 'anonymous-user',
      anonymous: true,
      environment: ENVIRONMENT,
    },
    options: {
      // Bootstrap from localStorage for faster initial load
      bootstrap: 'localStorage',
      // Stream updates for real-time flag changes
      streaming: true,
      // Include observability and session replay plugins if enabled
      ...(isObservabilityEnabled() && {
        plugins: getObservabilityPlugins(),
      }),
    },
  };
};

/**
 * Cache flags to localStorage for offline fallback.
 * Called whenever flags are updated from LaunchDarkly.
 */
export const cacheFlagsToLocalStorage = (flags: Record<string, boolean>): void => {
  try {
    localStorage.setItem('ld-flags-cache', JSON.stringify(flags));
  } catch (error) {
    console.error('[LaunchDarkly] Failed to cache flags:', error);
  }
};

/**
 * Retrieve cached flags from localStorage.
 * Used as a fallback when LaunchDarkly is unavailable.
 */
export const getCachedFlags = (): Record<string, boolean> | null => {
  try {
    const cached = localStorage.getItem('ld-flags-cache');
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('[LaunchDarkly] Failed to retrieve cached flags:', error);
    return null;
  }
};

/**
 * Export observability functions for use in components.
 * These allow manual control of error tracking and session replay.
 */
export {
  startObservability,
  startSessionReplay,
  stopSessionReplay,
  reportError,
} from './observability.js';
