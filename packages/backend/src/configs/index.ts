/**
 * Central configuration for the application.
 * Load dotenv once here so all runtime source code gets env from one place.
 */
import 'dotenv/config';

const nodeEnv = process.env.NODE_ENV || 'development';

const trustProxy = (() => {
  const raw = process.env.TRUST_PROXY;

  if (raw === undefined || raw === '') {
    return nodeEnv === 'production' ? 1 : false;
  }

  const normalized = raw.trim().toLowerCase();

  if (normalized === 'true') return 1;
  if (normalized === 'false') return false;

  const asNumber = Number(normalized);
  if (!Number.isNaN(asNumber)) return asNumber;

  return raw;
})();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv,
  /** Only true when NODE_ENV is 'development' or 'test'. Use to gate stack traces and detailed errors. */
  isDevOrTest: nodeEnv === 'development' || nodeEnv === 'test',
  databaseUrl: process.env.DATABASE_URL || '',

  // CORS: comma-separated list of origins, or single origin. Default allows common dev ports.
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:8081',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  rateLimitFormsMax: parseInt(process.env.RATE_LIMIT_FORMS_MAX || '5', 10),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Express proxy trust (required behind ingress/proxy for rate limiting)
  trustProxy,

  // Pagination defaults
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

export default config;
