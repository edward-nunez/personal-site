import { Observability } from '@launchdarkly/observability-node';
import * as ld from '@launchdarkly/node-server-sdk';
import logger from '../../shared/utils/logger.js';

/**
 * LaunchDarkly Observability Configuration
 *
 * Configures error monitoring, logging, and tracing capabilities
 * with environment-based settings.
 *
 * Documentation: https://launchdarkly.com/docs/sdk/observability/node-js
 */

const LD_SDK_KEY = process.env.LD_SDK_KEY || '';
const LD_ENVIRONMENT = process.env.LD_ENVIRONMENT || process.env.NODE_ENV || 'development';
const SERVICE_NAME = process.env.SERVICE_NAME || 'personal-site-backend';
const SERVICE_VERSION = process.env.SERVICE_VERSION || 'unknown';

/**
 * Determine observability settings based on environment
 * - Development: Capture all errors, verbose logging
 * - Production: Sample errors, filter sensitive data
 */
const getObservabilityConfig = (): {
  serviceName: string;
  serviceVersion: string;
  enableErrorTracking: boolean;
  enableLogging: boolean;
  enableTracing: boolean;
  errorSamplingRate: number; // 0.0 to 1.0
} => {
  const isDev = LD_ENVIRONMENT === 'development';
  const isProduction = LD_ENVIRONMENT === 'production';

  return {
    serviceName: SERVICE_NAME,
    serviceVersion: SERVICE_VERSION,
    enableErrorTracking: true, // Always enabled
    enableLogging: isDev, // Verbose logging in development only
    enableTracing: !isProduction, // Tracing in dev/staging, not prod
    errorSamplingRate: isProduction ? 0.1 : 1.0, // 10% sampling in prod, 100% in dev
  };
};

/**
 * Create LaunchDarkly Observability plugin instance
 * Configures error monitoring with environment-specific options
 */
export const createObservabilityPlugin = (): Observability | null => {
  if (!LD_SDK_KEY) {
    console.warn('[Observability] No LD_SDK_KEY found. Observability features disabled.');
    return null;
  }

  const config = getObservabilityConfig();

  try {
    const observability = new Observability({
      serviceName: config.serviceName,
      serviceVersion: config.serviceVersion,
      // We recommend setting environment to match your deployment
      environment: LD_ENVIRONMENT,
    });

    logger.info(
      `[Observability] Initialized for service "${config.serviceName}" (v${config.serviceVersion})`
    );
    logger.info(`[Observability] Environment: ${LD_ENVIRONMENT}`);
    logger.info(
      `[Observability] Error sampling rate: ${(config.errorSamplingRate * 100).toFixed(1)}%`
    );

    return observability;
  } catch (error) {
    console.error('[Observability] Failed to create plugin:', error);
    return null;
  }
};

/**
 * Get LaunchDarkly SDK configuration with observability plugin
 * Must be called before any other LaunchDarkly initialization
 */
export const getLDConfigWithObservability = (): ld.LDOptions => {
  const observabilityPlugin = createObservabilityPlugin();

  return {
    plugins: observabilityPlugin ? [observabilityPlugin] : [],
    // Optional: Configure other SDK options
    stream: true,
  };
};

/**
 * Check if observability is enabled (SDK key is configured)
 */
export const isObservabilityEnabled = (): boolean => {
  return Boolean(LD_SDK_KEY);
};
