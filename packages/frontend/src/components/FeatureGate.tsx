import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface FeatureGateProps {
  /**
   * The feature flag key to check
   */
  flag: string;
  /**
   * Content to render when the feature is enabled
   */
  children: React.ReactNode;
  /**
   * Optional fallback content to render when the feature is disabled
   */
  fallback?: React.ReactNode;
}

/**
 * FeatureGate component provides a declarative way to conditionally render
 * components based on feature flags.
 *
 * @example
 * ```tsx
 * <FeatureGate flag="askAi">
 *   <AskAIButton />
 * </FeatureGate>
 * ```
 *
 * @example With fallback
 * ```tsx
 * <FeatureGate
 *   flag="askAi"
 *   fallback={<p>AI features coming soon!</p>}
 * >
 *   <AskAIModal />
 * </FeatureGate>
 * ```
 */
export const FeatureGate = ({ flag, children, fallback = null }: FeatureGateProps) => {
  const enabled = useFeatureFlag(flag);

  return <>{enabled ? children : fallback}</>;
};
