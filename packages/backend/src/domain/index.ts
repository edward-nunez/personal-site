/**
 * Backend Domain Layer - Bounded Contexts
 *
 * This domain is organized into explicit bounded contexts following DDD principles:
 *
 * - Portfolio: Work experience and project portfolio data
 * - Auth: Administrative user authentication and authorization
 * - Content: Blog posts and toolkit categories
 * - Engagement: Contact and consultation form submissions
 *
 * Each bounded context is self-contained with its own entities and repository interfaces.
 * Cross-context communication should happen at the application layer, not domain layer.
 */

// Bounded Contexts
export * from './portfolio/index.js';
export * from './auth/index.js';
export * from './content/index.js';
export * from './engagement/index.js';

// Legacy exports for backward compatibility
// TODO: Update all imports to use bounded context paths directly
export * from './entities/index.js';
export * from './interfaces/index.js';
