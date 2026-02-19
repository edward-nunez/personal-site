import { useFeatureFlagsStore } from '../core/store/useFeatureFlagsStore';

/**
 * Hook to check if a feature flag is enabled.
 *
 * @param flagKey - The feature flag key to check
 * @returns boolean - true if the feature is enabled, false otherwise
 *
 * @example
 * ```tsx
 * const isAIEnabled = useFeatureFlag('askAi');
 *
 * return (
 *   <>
 *     {isAIEnabled && <AskAIButton />}
 *   </>
 * );
 * ```
 */
export const useFeatureFlag = (flagKey: string): boolean => {
  const flags = useFeatureFlagsStore((state) => state.flags);

  // Use Zustand store to access flags synced from LaunchDarkly. Defaults to false for unknown flags.
  // Store provides offline fallback values when LaunchDarkly unavailable, enabling UX resilience.
  return flags[flagKey] ?? false;
};
