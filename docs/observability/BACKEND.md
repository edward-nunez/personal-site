# Backend Observability Guide

## 📌 Overview

The Express.js backend automatically tracks HTTP errors, validates input, and reports database/external service failures to LaunchDarkly. Error tracking is environment-aware: development captures 100% of errors for debugging, production samples 10% to manage quota usage.

### What's Tracked

✅ **Automatic**:
- HTTP 4xx/5xx responses
- Unhandled exceptions
- Request/response details with unique request IDs

✅ **Manual (via utility functions)**:
- Validation errors
- Database operation errors
- External service failures
- Authentication errors
- Configuration errors

## 🛠️ Setup Steps

### Step 1: Install Dependencies

```bash
# Already included in package.json, but verify:
npm install @launchdarkly/observability-node -w packages/backend
```

### Step 2: Get Server SDK Key

1. Log into **LaunchDarkly Dashboard**
2. Navigate to **Project Settings → Environments**
3. Copy the **Server-Side SDK Key** (starts with `sdk-`)
4. **DO NOT** use the client-side ID

### Step 3: Set Environment Variables

Create or update `packages/backend/.env`:

```bash
# Required: LaunchDarkly server SDK key
LD_SDK_KEY=sdk-your-actual-sdk-key-here

# Required: Environment name (controls sampling and logging)
LD_ENVIRONMENT=development
# Options: development, staging, production

# Optional: Service metadata (for filtering in dashboard)
SERVICE_NAME=personal-site-backend
SERVICE_VERSION=v1.0.0
# Tip: Use git SHA in production: $(git rev-parse --short HEAD)
```

### Step 4: Verify Initialization

Start the backend:

```bash
npm run dev:backend
```

Check logs for initialization message:

```
[Observability] Initialized for service: personal-site-backend
[Observability] Environment: development
[Observability] Error sampling: 100%
```

### Step 5: Optional - Test Error Tracking

Use curl to trigger a 500 error:

```bash
curl http://localhost:3000/api/nonexistent
# 404 error should appear in LaunchDarkly within 30 seconds
```

## ⚙️ Configuration

### Environment-Based Settings

| Setting | Development | Staging | Production |
|---------|-------------|---------|-----------|
| Error Tracking | ✅ Enabled | ✅ Enabled | ✅ Enabled |
| Error Sampling | 100% | 50-100% | 10% |
| Logging Level | Verbose | Normal | Filtered |
| Tracing | Enabled | Enabled | Disabled |
| Request Context | Full | Full | Limited |
| Performance Impact | Low | Very Low | Minimal |

**Rationale**: 
- **Development**: 100% errors for bug hunting, verbose logs for debugging
- **Staging**: Higher sampling to catch integration issues before prod
- **Production**: 10% sampling keeps quota usage reasonable while maintaining visibility

### Error Sampling Configuration

Sampling rates are controlled in `observability.ts`. To change:

```typescript
// In packages/backend/src/infrastructure/feature-flags/observability.ts
const samplingRate = env === 'production' ? 0.1 : 1.0; // Adjust 0.1 for 10%, 1.0 for 100%
```

Alternatively, configure in LaunchDarkly dashboard under **Observe → Error Ingestion Filters**.

### Custom Tags

Add custom tags to help filter errors in the dashboard:

```typescript
trackError(error, {
  userId: req.user?.id,
  endpoint: '/api/consultation',
  method: req.method,
  tags: {
    service: 'consultation-engine',
    critical: 'true',
  }
});
```

## 📚 Environment Variables Reference

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `LD_SDK_KEY` | ✅ Yes | `sdk-xxxx...` | Authenticate with LaunchDarkly |
| `LD_ENVIRONMENT` | ✅ Yes | `production` | Determines sampling, logging level |
| `SERVICE_NAME` | ❌ No | `personal-site-backend` | Identifies service in dashboard |
| `SERVICE_VERSION` | ❌ No | `v1.2.3` | Track errors by deployment version |
| `LOG_LEVEL` | ❌ No | `info` | Winston logger level (error, warn, info, debug) |

## 💻 Usage Examples

### Automatic HTTP Error Tracking

Errors on 4xx/5xx responses are tracked automatically:

```typescript
// No code changes needed - middleware handles this
app.get('/api/data', (req, res) => {
  doSomething().catch(() => {
    res.status(500).json({ error: 'Failed to process' }); 
    // ✅ Automatically tracked with request context
  });
});
```

### Manual Error Tracking - Generic

```typescript
import { trackError } from '../shared/utils/errorTracking.js';

try {
  const result = await someAsyncOperation();
  res.json({ success: true, data: result });
} catch (error) {
  trackError(error, {
    endpoint: '/api/contact',
    method: 'POST',
    userId: req.user?.id,
  });
  res.status(500).json({ error: 'Operation failed' });
}
```

### Manual Error Tracking - Validation Errors

```typescript
import { trackValidationError } from '../shared/utils/errorTracking.js';

const validateEmail = (email: string) => {
  if (!email.includes('@')) {
    trackValidationError('email', 'Missing @ symbol', {
      endpoint: '/api/contact',
    });
    return false;
  }
  return true;
};
```

### Manual Error Tracking - Database Errors

```typescript
import { trackDatabaseError } from '../shared/utils/errorTracking.js';

try {
  await db.experience.create({
    data: { title: 'New Role', company: 'Acme' }
  });
} catch (error) {
  trackDatabaseError('create_experience', error, {
    userId: req.user?.id,
    table: 'experience',
  });
  // Send response and continue gracefully
}
```

### Manual Error Tracking - External Service Errors

```typescript
import { trackExternalServiceError } from '../shared/utils/errorTracking.js';

const sendEmail = async (to: string, subject: string) => {
  try {
    await emailService.send({ to, subject });
  } catch (error) {
    trackExternalServiceError('SendGrid', error, {
      endpoint: '/api/send-email',
      recipientDomain: new URL(`mailto:${to}`).hostname,
    });
    throw error; // Propagate or handle
  }
};
```

### Manual Error Tracking - Auth Errors

```typescript
import { trackAuthError } from '../shared/utils/errorTracking.js';

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    trackAuthError('Invalid JWT', {
      endpoint: '/api/protected-route',
      reason: error.message,
    });
    return null;
  }
};
```

### Manual Error Tracking - Config Errors

```typescript
import { trackConfigError } from '../shared/utils/errorTracking.js';

const requiredEnvVars = ['DATABASE_URL', 'LD_SDK_KEY', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    trackConfigError(envVar, `${envVar} is required but not set`);
    console.error(`❌ Missing ${envVar}`);
    process.exit(1);
  }
}
```

## 🔍 Error Tracking Functions Reference

All functions accept error context as second parameter:

```typescript
interface ErrorContext {
  userId?: string;           // User identifier
  requestId?: string;        // Unique request ID
  endpoint?: string;         // API endpoint path
  method?: string;           // HTTP method
  statusCode?: number;       // HTTP status code
  userAgent?: string;        // Client user agent
  tags?: Record<string, string>; // Custom tags for filtering
}
```

### Function Signatures

| Function | Purpose | Example |
|----------|---------|---------|
| `trackError(error, context)` | Generic error tracking | `trackError(err, { endpoint })` |
| `trackValidationError(field, message, context)` | User input validation | `trackValidationError('email', 'Invalid format')` |
| `trackDatabaseError(operation, error, context)` | Database failures | `trackDatabaseError('create', err)` |
| `trackExternalServiceError(service, error, context)` | API failures | `trackExternalServiceError('Stripe', err)` |
| `trackAuthError(reason, context)` | Auth failures | `trackAuthError('Invalid token')` |
| `trackConfigError(variable, reason)` | Config issues | `trackConfigError('API_KEY', 'required')` |

## 📊 Viewing Errors in Dashboard

### Access Errors

1. Log into **LaunchDarkly Dashboard**
2. Navigate to **Observe → Errors**
3. Filter by service: `personal-site-backend`
4. Click error to see details:
   - Stack trace with source maps
   - Affected users
   - Environment breakdown
   - Timeline and trend

### Search & Filter

```
environment: production
service_name: personal-site-backend
statusCode: 500
endpoint: /api/consultation
```

### Common Queries

Find all 5xx errors:
```
statusCode: 5xx
environment: production
```

Find validation errors:
```
tags: validation_error
```

Find errors by user:
```
userId: user-12345
```

## ⚠️ Common Issues & Solutions

### Errors Not Appearing?

**Check 1**: Verify `LD_SDK_KEY` is set

```bash
echo $LD_SDK_KEY
# Should output: sdk-xxxx... (not empty)
```

**Check 2**: Verify middleware is applied in correct order

```typescript
// ✅ Correct order
app.use(express.json());
app.use(errorTrackingMiddleware);  // Add early
app.use('/api', apiRoutes);
app.use(errorHandler);
app.use(expressErrorHandler);      // Must be last
```

**Check 3**: Check logs for initialization errors

```bash
npm run dev:backend 2>&1 | grep -i observability
# Should show: "[Observability] Initialized..."
```

**Check 4**: Verify network request succeeds

Browser DevTools → Network tab → Search for `launchdarkly.com` - should see successful POST requests.

### High Error Volume / Quota Exceeded

**Option 1**: Increase sampling rate in dashboard
- Navigate to **Observe → Error Ingestion Filters**
- Adjust sampling percentage (e.g., 5% instead of 10%)

**Option 2**: Exclude certain errors
```
Rule: DO NOT ingest errors where endpoint matches /health
```

**Option 3**: Set rate limit
```
Max 100 errors per minute
```

### Stack Traces Are Minified

**Solution**: Upload source maps to LaunchDarkly CLI:

```bash
# Requires LaunchDarkly CLI: https://github.com/launchdarkly/ld-cli
ldcli sourcemaps upload \
  --platform node \
  --path ./dist \
  --version $(git rev-parse --short HEAD)
```

### Missing Request Context

Ensure middleware is added **before** routes:

```typescript
// ✅ Correct
app.use(errorTrackingMiddleware);
app.use('/api', routes);

// ❌ Wrong
app.use('/api', routes);
app.use(errorTrackingMiddleware); // Too late!
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/infrastructure/feature-flags/observability.ts` | SDK initialization and config |
| `src/shared/utils/errorTracking.ts` | Error tracking utility functions |
| `src/presentation/middleware/errorTrackingMiddleware.ts` | HTTP error capture middleware |
| `src/infrastructure/feature-flags/ldClient.ts` | LaunchDarkly client setup |
| `.env` / `.env.example` | Environment variables |

## 🚀 Production Deployment Checklist

- [ ] `LD_SDK_KEY` set to production SDK key
- [ ] `LD_ENVIRONMENT` set to `production`
- [ ] `SERVICE_VERSION` set to git SHA or release version
- [ ] Error sampling configured appropriately (typically 10%)
- [ ] Log level set to `warn` or `error` (not `debug`)
- [ ] Monitoring alerts configured for error spikes
- [ ] Team has access to LaunchDarkly dashboard

## 🔗 Related Documentation

- [Error Handling Patterns](../ERROR_HANDLING.md)
- [API Reference](../API_REFERENCE.md)
- [Testing](../TESTING.md)
- [TROUBLESHOOTING →](TROUBLESHOOTING.md)

---

**Status**: ✅ Backend observability fully integrated  
**Last Updated**: February 18, 2026
