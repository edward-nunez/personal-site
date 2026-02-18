# Feature Flags Documentation

## Overview

This project uses **LaunchDarkly** for feature flag management across both frontend (React) and backend (Express) applications. Feature flags enable safe deployment of incomplete features, A/B testing, and gradual rollouts without code redeployment.

## Architecture

### Frontend (React + Zustand)
- **State Management**: Zustand store (`useFeatureFlagsStore`)
- **Hook**: `useFeatureFlag(flagKey)` for component-level checks
- **Component**: `<FeatureGate flag="..." />` for declarative rendering
- **Provider**: `<FeatureFlagsProvider>` integrates LaunchDarkly SDK

### Backend (Express + LaunchDarkly Node SDK)
- **Client**: Singleton LaunchDarkly client
- **Middleware**: `featureFlagsMiddleware` attaches flags to `req.featureFlags`
- **Helper**: `requireFeature(flagKey)` middleware for route protection

## Maturity-Based Fallback Strategy

When LaunchDarkly is unreachable, the system uses **maturity-based defaults** instead of failing closed. This ensures production resilience while maintaining safety for incomplete features.

### Tier 1: STABLE (Production-Ready)
**Fallback Default**: ✅ **ON** (in all environments)

Features that are fully implemented, tested, and safe for production users.

| Flag Key | Description | Fallback (Prod) | Fallback (Dev) |
|----------|-------------|-----------------|----------------|
| `blog-system` | Blog posts & archive functionality | ✅ ON | ✅ ON |
| `consultation-page` | Service inquiry form page | ✅ ON | ✅ ON |
| `consultation-form` | Contact form modal | ✅ ON | ✅ ON |
| `theme-toggle` | Dark/light mode toggle | ✅ ON | ✅ ON |
| `project-details` | Detailed project display pages | ✅ ON | ✅ ON |
| `framer-motion-animations` | Animation rendering | ✅ ON | ✅ ON |
| `image-lazy-loading` | Image optimization | ✅ ON | ✅ ON |

### Tier 2: BETA (Incomplete/In Development)
**Fallback Default**: ❌ **OFF** in prod, ✅ **ON** in dev

Features not ready for production but needed for development/testing.

| Flag Key | Description | Fallback (Prod) | Fallback (Dev) |
|----------|-------------|-----------------|----------------|
| `ask-ai` | Mock AI chatbot (client-side demo) | ❌ OFF | ✅ ON |
| `fit-check` | Job description analysis (client-side demo) | ❌ OFF | ✅ ON |
| `advanced-job-analysis` | Real AI-powered analysis (future) | ❌ OFF | ❌ OFF |

### Tier 3: EXPERIMENTAL (A/B Testing/Controlled Rollout)
**Fallback Default**: ❌ **OFF** (requires LaunchDarkly for control)

Features ready for testing but requiring targeting/segmentation rules.

| Flag Key | Description | Fallback (Prod) | Fallback (Dev) |
|----------|-------------|-----------------|----------------|
| `modal-animations-v2` | A/B test new animation styles | ❌ OFF | ❌ OFF |
| `contact-form-extended-fields` | Test different field combinations | ❌ OFF | ❌ OFF |
| `skill-categories-display-v2` | Alternative display layout | ❌ OFF | ❌ OFF |
| `blog-archive-page` | Historical posts access | ✅ ON | ✅ ON |

## Configuration

### Frontend (.env)

```bash
# LaunchDarkly Client-Side ID (different from server SDK key!)
VITE_LD_SDK_KEY=your-client-side-id-here

# Environment for fallback logic (development | production)
VITE_API_ENV=development
```

### Backend (.env)

```bash
# LaunchDarkly Server SDK Key
LD_SDK_KEY=your-server-sdk-key-here

# Environment for fallback logic
LD_ENVIRONMENT=development
NODE_ENV=development
```

### LaunchDarkly Dashboard

1. **Create Project**: `personal-site-v2`
2. **Environments**: `development`, `production`
3. **Contexts**: 
   - `environment`: dev/staging/prod
   - `user`: (optional) user identifier for targeting
   - `organization`: your org name

## Usage Examples

### Frontend: Component-Level Check

```tsx
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

const MyComponent = () => {
  const isAIEnabled = useFeatureFlag('ask-ai');

  return (
    <>
      {isAIEnabled && <AskAIButton />}
    </>
  );
};
```

### Frontend: Declarative with FeatureGate

```tsx
import { FeatureGate } from '@/components/FeatureGate';

const MyPage = () => (
  <FeatureGate flag="fit-check" fallback={<p>Coming soon!</p>}>
    <JobFitSection />
  </FeatureGate>
);
```

### Backend: Middleware Check

```typescript
import { isFeatureEnabled } from '../presentation/middleware/featureFlagsMiddleware.js';

export const consultationController = {
  submit: async (req, res) => {
    if (!isFeatureEnabled(req, 'consultation-page')) {
      return res.status(403).json({
        success: false,
        error: 'Feature temporarily unavailable',
        code: 'FEATURE_DISABLED'
      });
    }
    
    // Process consultation
  }
};
```

### Backend: Route Protection

```typescript
import { requireFeature } from '../presentation/middleware/featureFlagsMiddleware.js';

router.post('/consultation', requireFeature('consultation-page'), consultationController.submit);
```

## Rollout Strategy

### Phase 1: Internal Testing (Beta Users)
```
Target: user.email ends with "@your-company.com"
Rollout: 100% of internal users
Duration: 1-2 weeks
```

### Phase 2: Gradual Public Rollout
```
Week 1: 10% of production users
Week 2: 25% of production users
Week 3: 50% of production users
Week 4: 100% of production users
```

### Phase 3: Stabilization & Cleanup
```
Monitor metrics for 2 weeks at 100%
If stable: Promote to Tier 1, update fallback defaults
Remove flag from code once universally enabled
```

## Fallback Behavior Scenarios

### Scenario 1: LaunchDarkly Down in Production
```
User visits site → LaunchDarkly fails to connect
→ Fallback to maturity-based defaults
→ Result:
  ✅ Blog, Consultation, Theme Toggle: Still work (Tier 1)
  ❌ Ask AI, Fit Check: Hidden (Tier 2 beta)
  ❌ A/B Tests: Hidden (Tier 3)
→ Site remains functional with core features
```

### Scenario 2: LaunchDarkly Working in Production
```
User visits site → LaunchDarkly connects successfully
→ Dashboard controls all flags (overrides defaults)
→ You enable "ask-ai" for 10% of users via targeting
→ Those 10% see Ask AI, others don't
→ Full granular control maintained
```

### Scenario 3: Development Environment (Fallback)
```
Developer runs npm run dev → LaunchDarkly unreachable locally
→ Fallback to maturity-based defaults
→ Result:
  ✅ All Tier 1 (stable) features: ON
  ✅ All Tier 2 (beta) features: ON (ask-ai, fit-check available)
  ❌ Tier 3 (experimental) features: OFF
→ Developer can work on all implemented features
```

## Benefits of This Approach

1. **Production Resilience**: Site core functionality survives LaunchDarkly outages
2. **Safety First**: Incomplete features automatically hidden in prod fallback
3. **Developer Productivity**: All implemented features available in dev for testing
4. **Controlled Experimentation**: A/B tests require LaunchDarkly, preventing unintended exposure
5. **Zero Impact Deployment**: Ship gated features to prod, enable via dashboard—no redeploy
6. **Clear Governance**: Explicit tier assignment forces conversation about feature maturity

## Monitoring & Observability

### LaunchDarkly Dashboard
- **Flag Usage**: Track which flags are evaluated most frequently
- **User Targeting**: See which users/segments are impacted
- **Audit Log**: Review flag changes and rollout timeline

### Backend Logging
```typescript
// Development environment logs flag evaluations
if (process.env.NODE_ENV === 'development') {
  console.log('[FeatureFlags] Evaluated flags for request:', req.path, req.featureFlags);
}
```

### Frontend Debugging
```typescript
// Check store state in browser console
import { useFeatureFlagsStore } from '@/core/store/useFeatureFlagsStore';

// In console:
const store = useFeatureFlagsStore.getState();
console.log('Flags:', store.flags);
console.log('Is Ready:', store.isReady);
console.log('Error:', store.error);
```

## Troubleshooting

### Frontend: Flags Not Loading

**Symptoms**: Features always use fallback defaults, never LaunchDarkly values

**Check**:
1. Is `VITE_LD_SDK_KEY` set in `.env`?
2. Is the SDK key correct (client-side ID, not server SDK key)?
3. Check browser console for LaunchDarkly errors
4. Verify `FeatureFlagsProvider` is in `App.tsx` provider stack

**Debug**:
```tsx
import { useFeatureFlagsStore } from '@/core/store/useFeatureFlagsStore';

const { isReady, error } = useFeatureFlagsStore();
console.log('LD Ready:', isReady, 'Error:', error);
```

### Backend: Middleware Not Attaching Flags

**Symptoms**: `req.featureFlags` is undefined or empty

**Check**:
1. Is `LD_SDK_KEY` set in backend `.env`?
2. Is `featureFlagsMiddleware` registered in `routes/index.ts`?
3. Check server logs for LaunchDarkly initialization errors
4. Verify middleware is applied before route handlers

**Debug**:
```typescript
// In controller
console.log('Feature Flags:', req.featureFlags);
```

### LaunchDarkly Connection Timeout

**Symptoms**: Server startup hangs on LaunchDarkly initialization

**Solution**: The client has a 5-second timeout. If initialization fails, it logs a warning and uses fallbacks. Check network connectivity and SDK key validity.

```typescript
// In ldClient.ts
await ldClient.waitForInitialization({ timeout: 5 });
```

## Deprecation Process

When a feature is stable and universally enabled:

1. **Promote to Tier 1**: Update `getDefaultFlags()` to return `true` in all environments
2. **Monitor for 2 weeks**: Ensure no issues at 100% rollout
3. **Remove conditional logic**: Replace `useFeatureFlag('flag')` checks with unconditional rendering
4. **Archive flag in LaunchDarkly**: Mark as deprecated, then delete after 30 days
5. **Update documentation**: Remove flag from this document

## References

- [LaunchDarkly React SDK Documentation](https://docs.launchdarkly.com/sdk/client-side/react)
- [LaunchDarkly Node.js SDK Documentation](https://docs.launchdarkly.com/sdk/server-side/node-js)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Feature Flag Best Practices](https://docs.launchdarkly.com/guides/best-practices)

## Support

For questions or issues with feature flags:
1. Check this documentation first
2. Review LaunchDarkly dashboard for flag configuration
3. Check server/browser logs for errors
4. Consult team lead or DevOps for SDK key access

---

**Last Updated**: February 17, 2026
**Maintained by**: Engineering Team
