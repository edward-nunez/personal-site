# LaunchDarkly Error Monitoring & Observability

## Overview

This document explains the LaunchDarkly error monitoring and observability setup in the personal-site backend. The system automatically captures and reports errors, logs, and traces to LaunchDarkly's observability platform.

## Architecture

### Components

1. **Observability Plugin** ([observability.ts](../infrastructure/feature-flags/observability.ts))
   - Initializes the LaunchDarkly observability SDK
   - Configures error monitoring with environment-based settings
   - Handles service versioning and naming

2. **Error Tracking Utilities** ([errorTracking.ts](../shared/utils/errorTracking.ts))
   - Centralized error tracking functions
   - Categorizes errors (validation, database, external service, auth, config)
   - Enriches errors with context and tags

3. **Error Tracking Middleware** ([errorTrackingMiddleware.ts](../presentation/middleware/errorTrackingMiddleware.ts))
   - Automatically captures HTTP errors (4xx, 5xx)
   - Tracks unhandled exceptions
   - Generates unique request IDs for error tracking

4. **LaunchDarkly Client** ([ldClient.ts](../infrastructure/feature-flags/ldClient.ts))
   - Integrates observability plugin with feature flags
   - Manages client lifecycle

## Configuration

### Environment Variables

```bash
# LaunchDarkly Feature Flags & Observability
LD_SDK_KEY=your-server-sdk-key
LD_ENVIRONMENT=development|staging|production

# Service Metadata
SERVICE_NAME=personal-site-backend
SERVICE_VERSION=your-git-sha-or-version-tag
```

### Environment-Based Settings

The observability system adjusts behavior based on `LD_ENVIRONMENT`:

| Setting | Development | Production |
|---------|-------------|-----------|
| Error Tracking | Enabled ✅ | Enabled ✅ |
| Logging | Verbose ✅ | Filtered ⚠️ |
| Tracing | Enabled ✅ | Disabled ❌ |
| Error Sampling | 100% (all errors) | 10% (1 in 10 sampled) |

**Rationale**:
- **Error Tracking**: Always on to catch issues early
- **Logging**: Verbose in dev for debugging, filtered in prod for performance
- **Tracing**: Reduced overhead by disabling in production
- **Error Sampling**: Production samples 10% of errors to reduce quota usage

## Usage

### Automatic Error Tracking

HTTP errors are automatically tracked by middleware:

```typescript
// 404 Error - automatically tracked
app.get('/api/missing', (req, res) => {
  res.status(404).json({ error: 'Not found' });
  // ✅ Automatically tracked with request context
});

// 500 Error - automatically tracked
app.get('/api/error', (req, res) => {
  res.status(500).json({ error: 'Server error' });
  // ✅ Automatically tracked with context
});
```

### Manual Error Tracking

For business logic errors, use the error tracking utilities:

```typescript
import { trackError, trackValidationError, trackDatabaseError } from '../shared/utils/errorTracking';

// Generic error tracking
try {
  await someOperation();
} catch (error) {
  trackError(error, {
    endpoint: '/api/consultation',
    method: 'POST',
    userId: req.user?.id,
  });
}

// Validation error (tagged for filtering)
if (!isValidEmail(email)) {
  trackValidationError('email', 'Invalid email format', {
    endpoint: '/api/contact',
  });
}

// Database error
try {
  await db.query(...);
} catch (error) {
  trackDatabaseError('create_user', error, {
    userId: req.user?.id,
  });
}

// External service error
try {
  await externalApi.call();
} catch (error) {
  trackExternalServiceError('SendGrid', error, {
    endpoint: '/api/send-email',
  });
}

// Auth error
if (!isValidToken(token)) {
  trackAuthError('Invalid JWT token', {
    endpoint: '/api/protected',
  });
}

// Configuration error
if (!process.env.DATABASE_URL) {
  trackConfigError('DATABASE_URL', 'database URL is required');
}
```

### Error Context

All error tracking functions accept optional context:

```typescript
interface ErrorContext {
  userId?: string;          // User ID for segmentation
  requestId?: string;       // Unique request identifier
  endpoint?: string;        // API endpoint path
  method?: string;          // HTTP method (GET, POST, etc.)
  statusCode?: number;      // HTTP status code
  userAgent?: string;       // Client user agent
  tags?: Record<string, string>; // Custom tags for filtering
}
```

### Error Categories

The system provides specialized tracking functions for different error types:

| Category | Function | Use Case |
|----------|----------|----------|
| Validation | `trackValidationError()` | User input validation failures |
| Database | `trackDatabaseError()` | Database operation failures |
| External Service | `trackExternalServiceError()` | Third-party API failures |
| Authentication | `trackAuthError()` | Auth-related failures |
| Configuration | `trackConfigError()` | Missing/invalid config |
| Generic | `trackError()` | Any other error |

## Error Monitoring Features

### Error Grouping

LaunchDarkly automatically groups similar errors by:
- Same error message
- Same top stack frame + 3 of next 4 frames match

Grouped errors help identify error patterns and trends.

### Error Status Management

Errors can be marked as:
- **Open**: New or ongoing errors (default)
- **Resolved**: Fixed errors (won't update count)
- **Ignored**: Known non-critical errors (not tracked)
- **Snoozed**: Temporarily ignored until specified time

### Error Metrics

The observability system provides:
- **Error count**: How many times an error occurred
- **Affected users**: How many users experienced it
- **Timeline**: When first and last occurrence happened
- **Environment breakdown**: Which environments were affected
- **Browser/client info**: Client details for client-side context

### Stack Trace Enrichment

Stack traces are enhanced with:
- Source maps (if uploaded)
- File names and line numbers
- Function names and context
- Variable values (if source maps available)

## LaunchDarkly Dashboard Usage

### Viewing Errors

1. Log in to LaunchDarkly dashboard
2. Navigate to **Observe** → **Errors**
3. View error list with metrics
4. Click error to see details:
   - **Instances tab**: See individual occurrences with stack traces
   - **Metrics tab**: View error trends and environment breakdown

### Searching Errors

Search with available attributes:

```
environment: production
service_name: personal-site-backend
status: OPEN
type: server_error
has_session: true
```

### Filtering Errors

Configure ingestion filters to manage quota:

```
Rule: Ingest 100% of errors in development
Rule: Ingest 10% of errors in production
Rate limit: 100 errors per minute
```

## Troubleshooting

### Errors Not Appearing in Dashboard

**Possible causes**:
1. `LD_SDK_KEY` not set or incorrect
2. Observability plugin not initialized
3. Application crashed before initialization
4. Errors occurring during import phase (before SDK init)

**Solution**:
```typescript
// Ensure SDK is initialized early
import './infrastructure/feature-flags/ldClient.js'; // Import first
import express from 'express'; // Import Express after
```

### High Error Quota Usage

**Problem**: Production errors consuming quota quickly

**Solutions**:
1. Increase error sampling rate in `observability.ts`
2. Configure ingestion filters in LaunchDarkly dashboard
3. Set rate limits for maximum errors per minute
4. Filter out known errors (library errors, third-party, etc.)

### Missing Request Context

**Problem**: Errors lack request context

**Solution**: Ensure middleware is applied:
```typescript
app.use(errorTrackingMiddleware); // Add after parsing middleware
app.use('/api', apiRoutes);
```

### Stack Traces Are Minified

**Problem**: Production stack traces are unreadable

**Solution**: Upload source maps to LaunchDarkly:
```bash
# Using ldcli (LaunchDarkly CLI)
ldcli sourcemaps upload \
  --platform node \
  --path ./dist \
  --version $GIT_SHA
```

## Performance Considerations

### Low Overhead Design

- **Asynchronous logging**: Doesn't block request handling
- **Sampling**: Production only captures 10% of errors
- **Lazy plugin loading**: Only initializes if SDK key exists
- **Filtered logging**: Development verbose, production minimal

### Production Best Practices

1. **Set SERVICE_VERSION** to deployment git SHA
   - Helps correlate errors to specific deployments
   - Enables rollback analysis

2. **Configure error sampling**
   - Balance visibility with quota usage
   - Adjust via LaunchDarkly dashboard filters

3. **Monitor error metrics**
   - Watch for spikes indicating issues
   - Set up alerts for critical errors

4. **Regular review**
   - Mark fixed errors as "Resolved"
   - Ignore known non-critical errors
   - Track root causes of error spikes

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│   Express Application                   │
├─────────────────────────────────────────┤
│ 1. errorTrackingMiddleware              │
│    - Captures HTTP errors (4xx, 5xx)   │
│    - Generates request IDs              │
│                                         │
│ 2. API Routes                           │
│    - Business logic + error tracking    │
│                                         │
│ 3. expressErrorHandler                  │
│    - Catches unhandled exceptions       │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   Error Tracking System                 │
├─────────────────────────────────────────┤
│ trackError()                            │
│ trackValidationError()                  │
│ trackDatabaseError()                    │
│ trackExternalServiceError()             │
│ trackAuthError()                        │
│ trackConfigError()                      │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   Winston Logger                        │
│   (structured JSON logs)                │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   LaunchDarkly Observability SDK        │
│   (auto-instrumentation plugin)         │
├─────────────────────────────────────────┤
│ - Error monitoring                      │
│ - Logging integration                   │
│ - Tracing (if enabled)                  │
│ - OpenTelemetry export                  │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   LaunchDarkly Backend                  │
│   - Error grouping                      │
│   - Metric aggregation                  │
│   - Alert generation                    │
└─────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────┐
│   LaunchDarkly Dashboard                │
│   - Errors view                         │
│   - Metrics visualization               │
│   - Status management                   │
└─────────────────────────────────────────┘
```

## References

- [LaunchDarkly Error Monitoring Docs](https://launchdarkly.com/docs/home/observability/errors)
- [LaunchDarkly Observability SDKs](https://launchdarkly.com/docs/sdk/observability)
- [Node.js Observability Reference](https://launchdarkly.com/docs/sdk/observability/node-js)
- [Configuration for Server-Side Observability](https://launchdarkly.com/docs/sdk/features/observability-config-server-side)
- [OpenTelemetry Auto-Instrumentation](https://opentelemetry.io/docs/instrumentation/js/)

## Support

For issues or questions:
1. Check LaunchDarkly dashboard for error details
2. Review server logs for context
3. Verify `LD_SDK_KEY` and environment variables
4. Contact LaunchDarkly support if errors not appearing

---

**Last Updated**: February 17, 2026
**Maintained by**: Engineering Team
