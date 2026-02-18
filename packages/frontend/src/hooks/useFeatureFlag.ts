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

  // Return the flag value, defaulting to false if not found
  return flags[flagKey] ?? false;
};
