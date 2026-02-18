import React, { useEffect } from 'react';
import { asyncWithLDProvider, useFlags } from 'launchdarkly-react-client-sdk';
import { useFeatureFlagsStore } from '../core/store/useFeatureFlagsStore';
import { getLDConfig, cacheFlagsToLocalStorage } from '../core/ld/ldClient';
import { isObservabilityEnabled } from '../core/ld/observability.js';

/**
 * Internal component that syncs LaunchDarkly flags with Zustand store.
 * This component must be a child of LDProvider to access useFlags hook.
 */
const FlagsSyncComponent = () => {
  const ldFlags = useFlags();
  const { initializeFlags, setFlag } = useFeatureFlagsStore();

  useEffect(() => {
    // Initialize store with all flags from LaunchDarkly
    if (ldFlags && Object.keys(ldFlags).length > 0) {
      initializeFlags(ldFlags);
      cacheFlagsToLocalStorage(ldFlags);
    }
  }, [ldFlags, initializeFlags]);

  // Listen for individual flag changes (real-time updates)
  useEffect(() => {
    if (ldFlags) {
      Object.entries(ldFlags).forEach(([key, value]) => {
        setFlag(key, Boolean(value));
      });
    }
  }, [ldFlags, setFlag]);

  return null; // This component doesn't render anything
};

/**
 * Feature Flags Provider component.
 * Wraps the app with LaunchDarkly provider and syncs flags to Zustand store.
 *
 * If LaunchDarkly fails to initialize or is unavailable, the app will use
 * maturity-based fallback defaults from the Zustand store.
 *
 * Also initializes observability (error tracking, metrics, session replay)
 * if configured via environment variables.
 */
export const FeatureFlagsProvider = ({ children }: { children: React.ReactNode }) => {
  const config = getLDConfig();

  // Log observability status on mount
  useEffect(() => {
    if (isObservabilityEnabled()) {
      console.log('[LaunchDarkly] Observability enabled (error tracking, metrics, session replay)');
    }
  }, []);

  // If no SDK key, render children with fallback defaults
  if (!config.clientSideID) {
    return <>{children}</>;
  }

  return (
    <LaunchDarklyProvider config={config}>
      <FlagsSyncComponent />
      {children}
    </LaunchDarklyProvider>
  );
};

/**
 * Async wrapper component for LaunchDarkly.
 * We use a separate component to handle async initialization.
 */
const LaunchDarklyProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: ReturnType<typeof getLDConfig>;
}) => {
  const [LDProvider, setLDProvider] = React.useState<React.ComponentType<{
    children: React.ReactNode;
  }> | null>(null);

  React.useEffect(() => {
    // Initialize LaunchDarkly provider with a 5 second timeout
    // Using Promise.race to enforce timeout since asyncWithLDProvider doesn't support timeout parameter
    const initializationPromise = asyncWithLDProvider(config);

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => {
        reject(new Error('[LaunchDarkly] Initialization timeout exceeded (5s)'));
      }, 5000)
    );

    Promise.race([initializationPromise, timeoutPromise])
      .then((Provider) => {
        setLDProvider(() => Provider);
      })
      .catch((error) => {
        console.error('[LaunchDarkly] Provider initialization failed:', error);
        // Store will use fallback defaults
        useFeatureFlagsStore.getState().reset();
      });
  }, [config]);

  // While loading, render children with fallback defaults
  if (!LDProvider) {
    return <>{children}</>;
  }

  return <LDProvider>{children}</LDProvider>;
};
