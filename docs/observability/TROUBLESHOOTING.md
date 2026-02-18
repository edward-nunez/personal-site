# Observability Troubleshooting Guide

## Common Issues & Solutions

### Observability Not Initializing

#### Symptoms
- No messages in logs like `[Observability] Initialized`
- No observability dashboard data appearing
- Browser console shows no LaunchDarkly messages

#### Solutions

**Step 1: Check Environment Variables**

Backend:
```bash
# Verify SDK key is set
echo $LD_SDK_KEY
# Should output: sdk-xxxx... (not empty)

# Verify environment is set
echo $LD_ENVIRONMENT
# Should output: development, staging, or production
```

Frontend:
```bash
# Verify client-side ID is set
echo $VITE_LD_SDK_KEY
# Should output: your-client-id (not sdk-... key)

echo $VITE_API_ENV
# Should output: development, staging, or production
```

**Step 2: Restart Application**

Environment variables are read at startup:

```bash
# Backend
npm run dev:backend

# Frontend
npm run dev:frontend
```

**Step 3: Check Logs for Errors**

Backend - look for initialization messages:
```bash
npm run dev:backend 2>&1 | grep -i "observability\|launchdarkly"
# Should show: [Observability] Initialized for service...
```

Frontend - check browser console:
```javascript
// Open DevTools Console, look for:
[LaunchDarkly] Observability enabled
[LaunchDarkly] Session replay enabled
```

**Step 4: Verify SDK Keys Format**

| SDK Type | Format | Example | Wrong Format |
|----------|--------|---------|--------------|
| **Backend** | Starts with `sdk-` | `sdk-abc123...` | Regular ID without prefix |
| **Frontend** | Regular ID | `abc123def456` | `sdk-...` (server key) |

---

### Errors Not Appearing in LaunchDarkly

#### Symptoms
- Errors triggered locally but don't appear in LaunchDarkly dashboard
- No data in **Observe → Errors** section
- Network requests to LaunchDarkly failing

#### Solutions

**Check 1: Verify Network Connectivity**

Browser DevTools → Network tab:
```
Look for requests to: pub.observability.app.launchdarkly.com
Status should be: 200 OK
```

If requests are failing:
- Check internet connection
- Verify firewall isn't blocking LaunchDarkly domains
- Check if corporate proxy is intercepting requests

**Check 2: Verify Error Sampling Rate**

Production defaults to 10% sampling (1 in 10 errors recorded):

```bash
# Backend .env
LD_ENVIRONMENT=production
# With this setting, only 10% of errors are tracked

# To capture 100% in production (if quota allows):
# Modify observability.ts to set samplingRate to 1.0
```

**Verify sampling isn't filtering your error**:

```bash
# Trigger 10+ identical errors to ensure one gets through:
for i in {1..15}; do
  curl http://localhost:3000/api/test-error
done
```

**Check 3: Ensure Middleware is Applied (Backend)**

Middleware must be added **before** routes:

```typescript
// CORRECT ORDER
app.use(express.json());
app.use(errorTrackingMiddleware);  // ← Must be early
app.use('/api', routes);
app.use(errorHandler);
app.use(expressErrorHandler);      // ← Must be last
```

**Wrong order** = middleware never fires = errors not tracked

**Check 4: Verify Request Completes**

Errors during application startup may not appear:

```typescript
// Error during import (before SDK init)
import express from 'express';
throw new Error('This won\'t be tracked');

// Error after all imports (SDK already initialized)
app.get('/api/test', (req, res) => {
  throw new Error('This will be tracked');
});
```

Ensure LaunchDarkly client initializes first:

```typescript
// Import LD client FIRST
import './infrastructure/feature-flags/ldClient.js';

// Then import everything else
import express from 'express';
```

**Check 5: Verify SDK Key is Correct**

Copy SDK key directly from dashboard (don't type manually):

1. LaunchDarkly Dashboard → Project Settings → Environments
2. Copy **Server SDK Key** for backend (starts with `sdk-`)
3. Copy **Client-Side ID** for frontend (no prefix)
4. Verify no extra spaces: check `.env` file with `cat -A .env`

---

### Performance Issues / High Latency

#### Symptoms
- Application runs slowly after adding observability
- Heroku/AWS logs show high memory usage
- Response times increased significantly

#### Solutions

**Check 1: Verify Tracing is Disabled in Production**

Tracing can be expensive. In production, it should be off:

```typescript
// packages/backend/src/infrastructure/feature-flags/observability.ts
// Look for this setting:
const tracingEnabled = env !== 'production'; // Should disable for prod
```

If tracing is enabled in production, disable it.

**Check 2: Check Error Sampling Rate**

High error rates + 100% sampling = many requests to LaunchDarkly.

```typescript
// Should be different for environments:
const samplingRate = env === 'production' ? 0.1 : 1.0;
// 0.1 = 10% sampling in production
// 1.0 = 100% sampling (only for development)
```

**Check 3: Monitor Network Usage**

LaunchDarkly uses asynchronous POST requests. Typical usage:

- **Backend**: 1-5 POST requests per minute (errors + metadata)
- **Frontend**: 1-2 POST requests per page load (errors + metrics)

If significantly higher, configure ingestion filters:

LaunchDarkly Dashboard → Observe → Error Ingestion Filters:
```
Rule: DO NOT ingest errors where statusCode < 500
(This filters out 4xx errors to reduce volume)
```

**Check 4: Check Session Replay Recording**

Session replay adds memory during user sessions. If High memory usage:

```bash
# Reduce privacy level (less obfuscation = less processing)
VITE_SESSION_REPLAY_PRIVACY=default
# Or disable: VITE_SESSION_REPLAY_PRIVACY=none (requires user consent)
```

---

### 🔒 Missing Context in Errors

#### Symptoms
- Errors appear in LaunchDarkly but lack context
- No userId, no endpoint information, no tags
- Errors look "bare" without enrichment

#### Solutions

**Step 1: Use Error Tracking Utilities**

Don't just `throw new Error()`. Use the provided tracking functions:

```typescript
// Wrong - no context
throw new Error('Something failed');

// Correct - includes context
import { trackError } from '../shared/utils/errorTracking.js';

trackError(error, {
  userId: req.user?.id,
  endpoint: '/api/consultation',
  method: 'POST',
  tags: { critical: 'true' }
});
```

**Step 2: Add Context Parameters**

Error context object should include:

```typescript
const context = {
  userId: req.user?.id,           // Required for understanding user impact
  requestId: req.id,              // For tracing
  endpoint: req.path,             // Which API endpoint
  method: req.method,             // GET, POST, etc.
  statusCode: res.statusCode,     // HTTP status
  tags: {                         // Custom filters
    service: 'consultation',
    critical: 'true',
    environment: process.env.NODE_ENV,
  }
};

trackError(error, context);
```

**Step 3: Ensure Request Headers Include TraceID**

Distributed tracing requires request ID headers:

```typescript
// Middleware should add request ID
import { v4 as uuid } from 'uuid';

app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuid();
  res.setHeader('x-request-id', req.id);
  next();
});

// Then use in error tracking
trackError(error, { requestId: req.id });
```

---

### CORS / CSP Headers Blocking Observability

#### Symptoms
- Browser console shows CSP violations
- LaunchDarkly network requests blocked
- Error: "Refused to connect to 'pub.observability.app.launchdarkly.com'"

#### Solutions

**Check 1: Verify CSP Meta Tag**

File: `packages/frontend/index.html`

```html
<!-- CORRECT - allows LaunchDarkly observability -->
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    connect-src 'self' 
               pub.observability.app.launchdarkly.com
               otel.observability.app.launchdarkly.com
               http://localhost:3000
               your-api.com;
    script-src 'self' 'wasm-unsafe-eval';
    worker-src 'self' blob:;
  "
/>
```

**Check 2: Check Server CSP Headers**

If backend serves frontend, ensure response headers include LaunchDarkly domains:

```bash
# Check what CSP header server sends
curl -i http://localhost:5173/ | grep Content-Security-Policy
```

**Check 3: Browser DevTools CSP Errors**

Browser Console → Look for violations:

```
Refused to connect to 'pub.observability.app.launchdarkly.com' 
because it violates the following Content Security Policy directive...
```

If found, add domain to CSP meta tag.

---

### 🏃 Session Replay Not Recording

#### Symptoms
- Session Replay not appearing in LaunchDarkly dashboard
- **Observe → Session Replays** is empty
- Errors have no associated sessions

#### Solutions

**Check 1: Verify Session Replay is Enabled**

```bash
# Frontend .env
VITE_SESSION_REPLAY_PRIVACY=strict
# If this is empty or unset, session replay is disabled
```

**Check 2: Ensure User Interacted with Page**

Session replay only records if user performs actions:

```javascript
// No interactions = no recording
// Interactions needed: click, type, scroll, navigation

// Force interaction for testing:
document.addEventListener('click', () => console.log('recorded'));
document.click();
```

**Check 3: Check Session Replay Quota**

LaunchDarkly dashboard → Observe → Session Replays → Billing:
- Check if you've hit monthly recording limit
- Upload quota managed per environment

**Check 4: Verify Privacy Setting Isn't Preventing Recording**

```bash
# strict = recording obfuscated
# none = requires explicit user consent
VITE_SESSION_REPLAY_PRIVACY=strict
```

If set to `none`, consent must be obtained before recording starts.

---

### 🔴 High Error Volume / Quota Warnings

#### Symptoms
- LaunchDarkly dashboard shows quota nearly exceeded
- Email alerts about approaching limits
- Dashboard shows red warnings

#### Solutions

**Option 1: Increase Sampling Rate (Recommended)**

Reduce what you track without losing visibility:

```bash
# Backend: in observability.ts
const samplingRate = env === 'production' ? 0.05 : 1.0;
// 0.05 = 5% sampling (half of current 10%)
```

Or configure in LaunchDarkly dashboard:

LaunchDarkly → Observe → Error Ingestion Filters → Create rule:
```
Action: SAMPLE
Rate: 5%  (or custom percentage)
Applies to: production errors
```

**Option 2: Filter Out Non-Critical Errors**

Exclude/ignore known non-critical errors:

```
Rule: DO NOT ingest errors where:
  - statusCode = 404 (not found)
  - statusCode = 401 (expected auth failures)
  - endpoint = "/health" (health check failures)
  - message contains "bot" (crawler/bot errors)
```

**Option 3: Set Rate Limits**

LaunchDarkly → Observe → Error Ingestion Filters:
```
Max 100 errors per minute, per environment
Excess errors: SAMPLE (capture 10% of overflow)
```

**Option 4: Exclude Certain Error Types**

```typescript
// Only track critical errors
if (isCritical(error)) {
  trackError(error, context);
} else {
  // Don't track non-critical errors
  console.warn(error);
}
```

---

## 🔍 Debugging Steps

### Check SDK Initialization

**Backend**:
```bash
npm run dev:backend 2>&1 | head -50
# Look for: [Observability] Initialized
```

**Frontend** - Browser console:
```javascript
// Should see when app loads
[LaunchDarkly] Observability enabled
[LaunchDarkly] Session replay enabled with privacy: strict
```

### Verify Network Requests

Browser DevTools → Network tab:

1. Filter: `launchdarkly`
2. Should see POST to `pub.observability.app.launchdarkly.com`
3. Response status: `200 OK`
4. Response body: Contains error details in JSON

If requests failing:
- Red status code = network/server issue
- No requests = SDK not initialized

### Check LaunchDarkly Dashboard

1. Navigate to **Observe → Errors**
2. Look for recent errors (last 5 minutes)
3. If no recent errors, SDK isn't sending data
4. Click error → see full context, stack trace, affected users

### Verify Error Tracking Functions

Test manually in code:

```typescript
// Backend test
import { trackError } from '../shared/utils/errorTracking.js';

trackError(new Error('Test error'), {
  endpoint: '/test',
  userId: 'test-user',
});

// Frontend test
import { trackError } from '@/shared/utils/errorTracking';

trackError(new Error('Frontend test'), {
  component: 'TestComponent',
});
```

Then check LaunchDarkly dashboard within 30 seconds.

---

## 📞 When to Escalate

If you've followed all steps above and still have issues:

1. **Check LaunchDarkly Status Page**
   - https://status.launchdarkly.com
   - Look for service outages

2. **Verify With LaunchDarkly Support**
   - Dashboard → Help → Contact Support
   - Provide:
     - SDK key (first 10 chars + ...)
     - Environment
     - Last 24hrs logs
     - Browser console errors

3. **Check Application Logs**

   Backend:
   ```bash
   tail -100 packages/backend/logs/combined.log | grep -i "observability\|launchdarkly\|error"
   ```

   Frontend - Browser DevTools:
   ```
   Console → Search for "LaunchDarkly" "error" "failed" messages
   ```

---

## Quick Reference: Problem → Solution Map

| Problem | First Check | Solution |
|---------|------------|----------|
| No observability messages | Is `LD_SDK_KEY` set? | Set env vars, restart |
| Errors not appearing | Is SDK key correct? | Copy from dashboard |
| High latency | Is tracing enabled? | Disable tracing in prod |
| Missing context | Using tracking functions? | Use `trackError()`, not `throw` |
| CSP errors | CSP meta tag present? | Add LaunchDarkly domains |
| No session replay | Is privacy setting set? | Set `VITE_SESSION_REPLAY_PRIVACY` |
| High quota usage | Error sampling rate? | Reduce to 5-10% in prod |

---

## Related Documentation

- [Backend Setup](BACKEND.md) - Detailed backend configuration
- [Frontend Setup](FRONTEND.md) - Detailed frontend configuration
- [Overview](OVERVIEW.md) - High-level architecture
- [FEATURE_FLAGS.md](../FEATURE_FLAGS.md) - LaunchDarkly feature flag docs

---

**Status**: Troubleshooting guide complete  
**Last Updated**: February 18, 2026
