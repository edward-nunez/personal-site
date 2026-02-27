import { create } from 'zustand';
import { getApiEnvironment } from '@/core/config/runtimeConfig';

/**
 * Feature flag maturity tiers define fallback behavior when LaunchDarkly is unavailable
 */
type Environment = 'development' | 'production';

interface FeatureFlagsState {
  flags: Record<string, boolean>;
  isReady: boolean;
  error: string | null;
  initializeFlags: (ldFlags: Record<string, boolean>) => void;
  setFlag: (key: string, value: boolean) => void;
  reset: () => void;
}

/**
 * Feature flag fallback configuration based on maturity tiers.
 * These defaults are used ONLY when LaunchDarkly is unreachable.
 *
 * TIER 1: STABLE - Production-ready features (always ON)
 * TIER 2: BETA - Incomplete features (ON in dev, OFF in prod)
 * TIER 3: EXPERIMENTAL - A/B tests (always OFF, requires LaunchDarkly)
 */
const getDefaultFlags = (environment: Environment): Record<string, boolean> => {
  const isDev = environment === 'development';

  return {
    // ============================================================
    // TIER 1: STABLE - Production-ready features (always ON)
    // ============================================================
    blogSystem: true,
    consultationPage: true,
    consultationForm: true,
    themeToggle: true,
    projectDetails: true,
    framerMotionAnimations: true,
    imageLazyLoading: true,

    // ============================================================
    // TIER 2: BETA - Incomplete features (dev only)
    // ============================================================
    askAi: isDev, // Mock AI - not ready for prod
    fitCheck: isDev, // Mock analysis - not ready for prod
    advancedJobAnalysis: false, // Future feature - not implemented

    // ============================================================
    // TIER 3: EXPERIMENTAL - A/B tests (controlled rollout only)
    // ============================================================
    modalAnimationsV2: false, // Requires LaunchDarkly targeting
    contactFormExtendedFields: false,
    skillCategoriesDisplayV2: false,
    blogArchivePage: true, // Ready but gated for analytics
  };
};

/**
 * Determine environment from Vite environment variables
 */
const getEnvironment = (): Environment => {
  const env = getApiEnvironment();
  return env === 'production' ? 'production' : 'development';
};

/**
 * Zustand store for feature flags state management.
 * Integrates with LaunchDarkly but provides maturity-based fallbacks.
 */
export const useFeatureFlagsStore = create<FeatureFlagsState>((set) => {
  const environment = getEnvironment();
  const defaultFlags = getDefaultFlags(environment);

  return {
    flags: defaultFlags, // Initialize with maturity-based defaults
    isReady: false,
    error: null,

    /**
     * Initialize flags from LaunchDarkly.
     * This overrides the default fallback values.
     */
    initializeFlags: (ldFlags: Record<string, boolean>) => {
      set({ flags: ldFlags, isReady: true, error: null });
    },

    /**
     * Update a single flag value.
     * Used for real-time flag updates from LaunchDarkly.
     */
    setFlag: (key: string, value: boolean) => {
      set((state) => ({
        flags: { ...state.flags, [key]: value },
      }));
    },

    /**
     * Reset to fallback defaults.
     * Called when LaunchDarkly connection fails.
     */
    reset: () => {
      const environment = getEnvironment();
      const defaultFlags = getDefaultFlags(environment);
      set({
        flags: defaultFlags,
        isReady: false,
        error: 'LaunchDarkly unavailable - using maturity-based defaults',
      });
    },
  };
});
