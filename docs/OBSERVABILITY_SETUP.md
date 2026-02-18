# LaunchDarkly Error Monitoring - Quick Setup Guide

## Overview

LaunchDarkly error monitoring has been integrated into the backend to automatically capture, track, and report errors with full context and environment-based sampling.

## What Was Implemented

### 1. **Observability Plugin** ✅
- Location: `packages/backend/src/infrastructure/feature-flags/observability.ts`
- Initializes LaunchDarkly observability SDK for error monitoring
- Configures environment-specific settings (dev vs. prod)
- Supports error sampling (10% in production, 100% in development)

### 2. **Error Tracking Utilities** ✅
- Location: `packages/backend/src/shared/utils/errorTracking.ts`
- Provides specialized error tracking functions:
  - `trackError()` - Generic error tracking
  - `trackValidationError()` - User input validation errors
  - `trackDatabaseError()` - Database operation failures
  - `trackExternalServiceError()` - Third-party API failures
  - `trackAuthError()` - Authentication failures
  - `trackConfigError()` - Configuration errors
- All errors enriched with context and tags

### 3. **Error Tracking Middleware** ✅
- Location: `packages/backend/src/presentation/middleware/errorTrackingMiddleware.ts`
- Automatically captures HTTP errors (4xx, 5xx)
- Tracks unhandled exceptions
- Generates unique request IDs for tracing
- Integrated into Express app automatically

### 4. **LaunchDarkly Client Integration** ✅
- Updated: `packages/backend/src/infrastructure/feature-flags/ldClient.ts`
- Integrated observability plugin with feature flag client
- Ensures proper initialization order

### 5. **Express App Configuration** ✅
- Updated: `packages/backend/src/app.ts`
- Added error tracking middleware
- Added express error handler
- Proper middleware order for error capture

### 6. **Environment Variables** ✅
- Updated: `packages/backend/.env.example`
- Added observability configuration options

## Configuration

### Step 1: Set Environment Variables

In your `.env` file (backend):

```bash
# LaunchDarkly SDK Key (same as feature flags)
LD_SDK_KEY=your-server-sdk-key

# Environment (development, staging, production)
LD_ENVIRONMENT=development

# Service Metadata
SERVICE_NAME=personal-site-backend
SERVICE_VERSION=your-git-sha-or-version-tag
```

### Step 2: Deploy Your Application

Once configured, errors will automatically be captured and sent to LaunchDarkly.

## How It Works

### Automatic Error Capture

1. **HTTP Errors** - Any 4xx or 5xx response is automatically tracked with:
   - Request path and method
   - Status code
   - Error message
   - Unique request ID
   - Client user agent
   - Timestamp

2. **Unhandled Exceptions** - Any error passed to Express error handler is tracked with:
   - Full stack trace
   - Request context
   - Severity level
   - Exception type

### Error Enrichment

All errors are enriched with:

```typescript
{
  requestId: "unique-id-for-tracing",
  endpoint: "/api/consultation",
  method: "POST",
  statusCode: 500,
  userAgent: "Mozilla/5.0...",
  timestamp: "2026-02-17T...",
  tags: {
    errorType: "server_error",
    statusCode: "500"
  }
}
```

### Environment-Specific Behavior

| Aspect | Development | Production |
|--------|-------------|-----------|
| Error Tracking | 100% of errors | 10% sampling |
| Logging | Verbose | Filtered |
| Tracing | Enabled | Disabled |
| Service Version | Tracked | Tracked (for rollback analysis) |

## LaunchDarkly Dashboard

### Viewing Captured Errors

1. Log into LaunchDarkly dashboard
2. Navigate to **Observe** → **Errors**
3. You'll see:
   - Error count and affected users
   - Service and environment breakdown
   - Error timeline and trends
   - Stack traces with line numbers
   - Request context

### Example Error Entry

```
┌─ Error Details ─────────────────────────────┐
│ Message: HTTP 500                           │
│ Service: personal-site-backend              │
│ Environment: production                     │
│ Occurrences: 42                             │
│ Affected Users: 15                          │
│ Status: Open                                │
│ Last Occurred: 2 minutes ago                │
│                                             │
│ Request Context:                            │
│ - Endpoint: /api/consultation               │
│ - Method: POST                              │
│ - User Agent: Mozilla/5.0...                │
│ - Request ID: 1739...                       │
└─────────────────────────────────────────────┘
```

### Searching & Filtering

Search errors with attributes:

```
environment: production
service_name: personal-site-backend
status: OPEN
statusCode: 500
```

Filter errors to manage quota:

```
Rule 1: Ingest 100% of production errors with statusCode 5xx
Rule 2: Ingest 10% of development errors
Rate limit: 100 errors per minute
```

## Using Error Tracking in Code

### Automatic (No Code Changes Needed)

HTTP errors are automatically tracked:

```typescript
// This will be automatically tracked
app.get('/api/example', (req, res) => {
  res.status(500).json({ error: 'Internal server error' });
});
```

### Manual Tracking

For business logic errors:

```typescript
import { trackError, trackValidationError, trackDatabaseError } from '../shared/utils/errorTracking';

// Track a business logic error
try {
  const result = await someAsyncOperation();
} catch (error) {
  trackError(error, {
    endpoint: '/api/consultation',
    method: 'POST',
    userId: req.user?.id,
  });
  res.status(500).json({ error: 'Operation failed' });
}

// Track validation errors
if (!email.includes('@')) {
  trackValidationError('email', 'Invalid format', {
    endpoint: '/api/contact',
  });
  res.status(400).json({ error: 'Invalid email' });
}

// Track database errors
try {
  await db.query(...);
} catch (error) {
  trackDatabaseError('create_user', error, {
    userId: req.user?.id,
  });
}
```

## Monitoring Best Practices

### In Development

- ✅ All errors tracked (100% sampling)
- ✅ Verbose logging enabled
- ✅ Check LaunchDarkly dashboard for real-time errors
- ✅ Tag errors for easy filtering: `{ environment: 'development' }`

### In Production

- ⚠️ 10% error sampling (configurable via dashboard)
- ⚠️ Filtered logging for performance
- 🔍 Monitor error spike alerts
- 📊 Set up dashboards for critical services
- 🏷️ Tag key errors for quick identification

### Setting Alerts

Configure alerts in LaunchDarkly:

```
Alert: When error count > 10 in 5 minutes
Alert: When new error type first appears
Alert: When service version changes with errors
```

## Troubleshooting

### Errors Not Appearing?

1. **Check SDK Key**
   ```bash
   echo $LD_SDK_KEY  # Should show your key
   ```

2. **Check Initialization**
   ```
   Server logs should show: "[Observability] Initialized for service..."
   ```

3. **Check Environment**
   ```bash
   echo $LD_ENVIRONMENT  # Should be development|staging|production
   ```

4. **Verify Middleware**
   - `errorTrackingMiddleware` should be applied after parsing middleware
   - `expressErrorHandler` should be the last middleware

### High Error Volume?

If quota usage is high:
1. Increase error sampling in dashboard (e.g., 5% instead of 10%)
2. Configure ingestion filters to exclude certain errors
3. Set rate limits (e.g., max 100 errors/minute)

### Missing Request Context?

Ensure middleware order is correct:
```typescript
app.use(express.json());
app.use(errorTrackingMiddleware);  // Must be here
app.use('/api', apiRoutes);
app.use(errorHandler);
app.use(expressErrorHandler);      // Must be last
```

## Files Created/Modified

### New Files
- `packages/backend/src/infrastructure/feature-flags/observability.ts` - Observability plugin config
- `packages/backend/src/shared/utils/errorTracking.ts` - Error tracking utilities
- `packages/backend/src/presentation/middleware/errorTrackingMiddleware.ts` - Error tracking middleware
- `docs/OBSERVABILITY.md` - Comprehensive observability documentation

### Modified Files
- `packages/backend/src/infrastructure/feature-flags/ldClient.ts` - Integrated observability plugin
- `packages/backend/src/app.ts` - Added error tracking middleware
- `packages/backend/.env.example` - Added observability env vars

## Next Steps

1. **Configure SDK Key**
   - Get your LaunchDarkly server SDK key
   - Set `LD_SDK_KEY` in `.env`

2. **Set Service Metadata**
   - Set `SERVICE_VERSION` to your deployment git SHA
   - Configure `LD_ENVIRONMENT` per deployment

3. **Deploy & Monitor**
   - Deploy application
   - Monitor LaunchDarkly dashboard
   - Set up alerts for critical errors

4. **Optimize Error Sampling**
   - Monitor quota usage
   - Adjust sampling rates if needed
   - Configure ingestion filters

## Documentation

- **Full Guide**: [docs/OBSERVABILITY.md](../docs/OBSERVABILITY.md)
- **Feature Flags**: [docs/FEATURE_FLAGS.md](../docs/FEATURE_FLAGS.md)
- **LaunchDarkly Docs**: [launchdarkly.com/docs/home/observability](https://launchdarkly.com/docs/home/observability)

## Support

Need help? Check:
1. LaunchDarkly dashboard error details
2. Server logs in `packages/backend/logs/`
3. Documentation files
4. LaunchDarkly support portal

---

**Status**: ✅ Implementation Complete
**Date**: February 17, 2026
**Next Review**: When first errors appear in dashboard
