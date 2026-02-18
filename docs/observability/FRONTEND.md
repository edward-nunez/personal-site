# Frontend Observability Guide

## 📌 Overview

The React frontend automatically tracks JavaScript errors, performance metrics, network requests, and records user sessions. Session replay captures user interactions with privacy-first text obfuscation by default, making it safe for production.

### What's Tracked

✅ **Automatic**:
- JavaScript errors and exceptions
- React component errors
- Promise rejections
- Console warnings/errors
- Performance metrics (Web Vitals: LCP, FCP, CLS, INP, TTB, FID)
- Network requests/responses
- Page navigation
- User interactions (clicks, typing, scrolling)

✅ **Manual (via utility functions)**:
- Custom errors
- API call failures
- Validation errors
- Authorization errors
- Performance issues

## 🛠️ Setup Steps

### Step 1: Install Dependencies

```bash
# Already included in package.json, but verify:
npm install @launchdarkly/observability -w packages/frontend
npm install @launchdarkly/session-replay -w packages/frontend
```

### Step 2: Get Client-Side ID

1. Log into **LaunchDarkly Dashboard**
2. Navigate to **Project Settings → Environments**
3. Copy the **Client-Side ID** (NOT the server SDK key)
4. **Important**: Use client-side ID, not server-side SDK key

### Step 3: Set Environment Variables

Create or update `packages/frontend/.env`:

```bash
# Required: Client-side ID (found in Project Settings > Environments)
VITE_LD_SDK_KEY=your-launchdarkly-client-side-id

# Required: Environment name
VITE_API_ENV=development
# Options: development, staging, production

# Optional: Session replay privacy level (default: strict)
VITE_SESSION_REPLAY_PRIVACY=strict
# Options:
#   'strict'   - Obscures text fields, passwords, PII (RECOMMENDED)
#   'default'  - Redacts common PII patterns
#   'none'     - No obfuscation (requires user consent)

# Required: Backend API URL (for request correlation)
VITE_API_BASE_URL=http://localhost:3000
```

### Step 4: Verify Initialization

Start the frontend:

```bash
npm run dev:frontend
```

Open browser console and look for:

```
[LaunchDarkly] Observability enabled (error tracking, metrics, session replay)
[LaunchDarkly] Session replay enabled with privacy: strict
```

### Step 5: Optional - Test Error Tracking

Trigger a test error in browser console:

```javascript
throw new Error('Test observability integration');
```

Check **LaunchDarkly Dashboard → Observe → Errors** - error should appear within 30 seconds.

## ⚙️ Configuration

### Environment-Based Settings

| Setting | Development | Staging | Production |
|---------|-------------|---------|-----------|
| Error Tracking | ✅ 100% | ✅ 100% | ✅ 100% |
| Network Recording | Full | Headers | Headers |
| Tracing | Enabled | Enabled | Disabled |
| Session Replay | Enabled | Enabled | Enabled |
| Privacy Mode | strict | strict | strict |
| Logging | Verbose | Normal | Errors only |
| Performance Impact | Low | Very Low | Minimal |

### Privacy Settings

**Session Replay Privacy Levels**:

| Level | Text Fields | Passwords | PII | Use Case |
|-------|-------------|-----------|-----|----------|
| `strict` | ✅ Obscured | ✅ Blocked | ✅ Redacted | Production (RECOMMENDED) |
| `default` | ⚠️ Visible | ✅ Blocked | ⚠️ Pattern-matched | Testing |
| `none` | ❌ Visible | ❌ Visible | ❌ Visible | Dev only, with consent |

**Recommendation**: Use `strict` (default) in all environments, especially production.

## 📚 Environment Variables Reference

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `VITE_LD_SDK_KEY` | ✅ Yes | `abc123def456` | Client-side ID for LaunchDarkly |
| `VITE_API_ENV` | ✅ Yes | `production` | Environment identifier |
| `VITE_SESSION_REPLAY_PRIVACY` | ❌ No | `strict` | Privacy level for session recording |
| `VITE_API_BASE_URL` | ✅ Yes | `http://localhost:3000` | Backend URL for request correlation |
| `VITE_LOG_LEVEL` | ❌ No | `info` | Console log verbosity |

## 💻 Usage Examples

### Automatic Error Tracking

Errors are automatically captured without code changes:

```typescript
// These errors are automatically tracked
function MyComponent() {
  return (
    <button onClick={() => {
      throw new Error('Oops!'); // ✅ Auto-tracked
    }}>
      Click me
    </button>
  );
}
```

### Manual Error Tracking - Generic

```typescript
import { trackError } from '@/shared/utils/errorTracking';

try {
  await complexOperation();
} catch (error) {
  trackError(error, {
    component: 'MyComponent',
    action: 'complexOperation',
    userId: currentUser?.id,
  });
}
```

### Manual Error Tracking - API Errors

```typescript
import { trackAPIError } from '@/shared/utils/errorTracking';

async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      trackAPIError(new Error('API failed'), {
        endpoint: '/api/data',
        method: 'GET',
        statusCode: response.status,
        userId: currentUser?.id,
      });
      throw new Error('Failed to fetch');
    }
    return await response.json();
  } catch (error) {
    trackAPIError(error, { endpoint: '/api/data', method: 'GET' });
    throw error;
  }
}
```

### Manual Error Tracking - Component Errors

```typescript
import { trackComponentError } from '@/shared/utils/errorTracking';

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    trackComponentError(error, {
      component: this.constructor.name,
      componentStack: errorInfo.componentStack,
      userId: this.props.userId,
    });
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

### Manual Error Tracking - Form Validation

```typescript
import { trackValidationError } from '@/shared/utils/errorTracking';

function ContactForm() {
  const handleSubmit = (email: string) => {
    if (!email.includes('@')) {
      trackValidationError('email', 'Invalid email format', {
        component: 'ContactForm',
        field: 'email',
      });
      setError('Invalid email');
      return;
    }
    // Submit
  };

  return (
    <form onSubmit={(e) => handleSubmit(email)}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <span className="error">{error}</span>}
    </form>
  );
}
```

### Manual Error Tracking - Authorization Errors

```typescript
import { trackAuthorizationError } from '@/shared/utils/errorTracking';

function AdminPanel() {
  if (!hasPermission('admin')) {
    trackAuthorizationError('admin_access_denied', {
      component: 'AdminPanel',
      userId: currentUser?.id,
      requiredPermission: 'admin',
    });
    return <div>Access denied</div>;
  }

  return <div>Admin content</div>;
}
```

### Manual Error Tracking - Performance Issues

```typescript
import { trackPerformanceIssue } from '@/shared/utils/errorTracking';

async function slowDataProcessing(largeDataset: any[]) {
  const startTime = performance.now();

  // Process large dataset
  const result = await processData(largeDataset);

  const duration = performance.now() - startTime;

  if (duration > 5000) {
    trackPerformanceIssue('Slow data processing detected', duration, {
      component: 'DataProcessor',
      dataSize: largeDataset.length,
      threshold: 5000,
    });
  }

  return result;
}
```

## 📊 Viewing Data in Dashboard

### Access Errors

1. Log into **LaunchDarkly Dashboard**
2. Navigate to **Observe → Errors**
3. Filter by service: `frontend`
4. Click error to see:
   - Stack trace
   - Affected users
   - Timeline
   - Environment breakdown
   - Browser/device info

### View Session Replays

1. Go to **Observe → Session Replays**
2. Search by:
   - User ID
   - Time range
   - Error keywords
3. Click **Play** to watch session video
4. See exactly what user was doing

### View Performance Metrics

1. Go to **Observe → Performance**
2. View Web Vitals by environment:
   - LCP (Largest Contentful Paint)
   - FCP (First Contentful Paint)
   - CLS (Cumulative Layout Shift)
   - INP (Interaction to Next Paint)
   - TTFB (Time to First Byte)
   - FID (First Input Delay)
3. Identify performance regressions by version

### Search & Filter

Available filters:

```
environment: production
service: frontend
statusCode: 5xx
component: MyComponent
userId: user-12345
url: /contact-form
hasSessionReplay: true
```

## 🔍 Error Tracking Reference

All functions accept context as second parameter:

```typescript
interface ErrorContext {
  component?: string;        // React component name
  action?: string;           // Action being performed
  userId?: string;           // User identifier
  endpoint?: string;         // API endpoint (for API errors)
  method?: string;           // HTTP method
  statusCode?: number;       // HTTP status code
  tags?: Record<string, string>; // Custom tags for filtering
}
```

### Function Signatures

| Function | Purpose | Example |
|----------|---------|---------|
| `trackError(error, context)` | Generic error | `trackError(err, { component })` |
| `trackComponentError(error, context)` | React component | `trackComponentError(err, { component })` |
| `trackAPIError(error, context)` | Network/API | `trackAPIError(err, { endpoint })` |
| `trackValidationError(field, message, context)` | Form validation | `trackValidationError('email', 'Invalid')` |
| `trackAuthorizationError(action, context)` | Permissions | `trackAuthorizationError('edit')` |
| `trackPerformanceIssue(message, duration, context)` | Slow operations | `trackPerformanceIssue('Slow', 5000)` |

## ⚠️ Common Issues & Solutions

### Errors Not Appearing?

**Check 1**: Verify client-side ID is set

```bash
echo $VITE_LD_SDK_KEY
# Should output your client-side ID (not your server SDK key)
```

**Check 2**: Open browser DevTools console and look for:

```
[LaunchDarkly] Observability enabled
```

**Check 3**: Check browser Network tab for LaunchDarkly requests

- Should see POST requests to `pub.observability.app.launchdarkly.com`
- Should see successful responses (200 status)

**Check 4**: Verify CSP headers aren't blocking

Browser DevTools → Console → Look for CSP violation:

```
Refused to connect to 'pub.observability.app.launchdarkly.com'...
```

**Solution**: Ensure CSP meta tag in `index.html` permits LaunchDarkly:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="connect-src ... pub.observability.app.launchdarkly.com ..."
/>
```

### Session Replay Shows No Data?

**Check 1**: Verify session replay is enabled

```bash
echo $VITE_SESSION_REPLAY_PRIVACY
# Should output: strict, default, or none
```

**Check 2**: Privacy setting might be excluding recording

If set to `none`, user consent is required.

**Check 3**: Ensure user interacted with page

Session replay only records sessions with user activity.

**Check 4**: Check quota usage

LaunchDarkly dashboard → Observe → Session Replays → Billing

### Bundle Size Too Large?

LaunchDarkly libraries add ~80KB gzipped:
- Observability SDK: ~45KB
- Session Replay SDK: ~35KB

This is necessary for observability. To reduce impact:
- Enable brotli compression
- Use code splitting for routes
- Lazy-load non-critical features

### Performance Impact?

Observability plugins are designed for minimal overhead:
- ~2-5MB memory usage
- 1-2 async POST requests per page load
- Non-blocking data collection

## 🔒 Privacy & Compliance

### Data Collection

Observability collects:
- ✅ JavaScript errors and stack traces
- ✅ Performance metrics
- ✅ Session recordings (with privacy obfuscation)
- ✅ HTTP metadata (headers, status codes)

Observability does NOT collect:
- ❌ Request/response bodies
- ❌ Passwords or auth tokens
- ❌ Credit card numbers
- ❌ PII (with strict mode enabled)

### Compliance Modes

| Regulation | Setting | Notes |
|-----------|---------|-------|
| **GDPR** | `VITE_SESSION_REPLAY_PRIVACY=strict` | Requires user consent |
| **CCPA** | `VITE_SESSION_REPLAY_PRIVACY=strict` | Configure data collection opt-out |
| **HIPAA** | `VITE_SESSION_REPLAY_PRIVACY=strict` | Redacts patient data |

**Default recommendation**: Use `strict` privacy mode for all environments.

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/core/ld/observability.ts` | Observability plugin initialization |
| `src/shared/utils/errorTracking.ts` | Error tracking utility functions |
| `src/core/ld/ldClient.ts` | LaunchDarkly client setup |
| `src/components/FeatureFlagsProvider.tsx` | Provider initialization |
| `index.html` | CSP headers configuration |

## 🚀 Production Deployment Checklist

- [ ] `VITE_LD_SDK_KEY` set to production client-side ID
- [ ] `VITE_API_ENV` set to `production`
- [ ] `VITE_SESSION_REPLAY_PRIVACY` set to `strict`
- [ ] CSP headers configured in `index.html`
- [ ] Error quota limits configured in LaunchDarkly
- [ ] Session replay retention set appropriately
- [ ] Performance baseline established for Web Vitals
- [ ] Alerts configured for error spikes
- [ ] Team trained on dashboard usage

## 🔗 Related Documentation

- [Feature Flags](../FEATURE_FLAGS.md)
- [Testing](../TESTING.md)
- [API Reference](../API_REFERENCE.md)
- [TROUBLESHOOTING →](TROUBLESHOOTING.md)

## 📖 External Resources

- [LaunchDarkly React SDK](https://launchdarkly.com/docs/sdk/client-side/react/react-web)
- [Web Vitals at web.dev](https://web.dev/vitals/)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

**Status**: ✅ Frontend observability fully integrated  
**Last Updated**: February 18, 2026
