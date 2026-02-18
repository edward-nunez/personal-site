# Observability Overview

## 🔍 What is Observability?

Observability means being able to understand what's happening inside your application by examining its external outputs. In this project, we track **errors**, **performance metrics**, and **user sessions** to catch bugs before users report them and understand the real impact.

### What We Track

📊 **With LaunchDarkly, we monitor**:

- **JavaScript Errors** (Frontend) - Uncaught exceptions, promise rejections, component errors
- **HTTP Errors** (Backend) - 4xx and 5xx responses automatically captured
- **Performance Metrics** - Web Vitals (LCP, FCP, CLS, INP), request duration
- **Session Replay** (Frontend) - Video-like recording of user interactions with privacy protection
- **Network Requests** - API calls and external service responses
- **Distributed Tracing** - End-to-end visibility from frontend → backend requests

### Why It Matters

✅ **Catch bugs before users report them** - Errors appear in LaunchDarkly before support tickets arrive  
✅ **Understand user impact** - See affected users and environments at a glance  
✅ **Debug faster** - Session replays show exactly what users were doing  
✅ **Performance insights** - Identify slow operations and bottlenecks  
✅ **Production confidence** - Monitor deployments with real-time metrics  

## 🏗️ Architecture

```
┌─────────────────────────────┐         ┌─────────────────────────────┐
│    React Frontend           │         │    Express Backend          │
│                             │         │                             │
│  • JS Errors               │         │  • HTTP Errors              │
│  • Performance Metrics      │         │  • Business Logic Errors    │
│  • Network Monitoring       │         │  • Database Errors          │
│  • Session Replay           │         │  • Auth Errors              │
│  • User Interactions        │         │  • Config Errors            │
│                             │         │                             │
│  ↓ (via SDK)               │         │  ↓ (via SDK)                │
└─────────────────────────────┘         └─────────────────────────────┘
          │                                      │
          │ pub.observability.app.launchdarkly.com
          │ otel.observability.app.launchdarkly.com
          └──────────────────┬───────────────────┘
                             ↓
                  ┌──────────────────────┐
                  │  LaunchDarkly Cloud  │
                  │  • Error Grouping    │
                  │  • Metric Analytics  │
                  │  • Session Replays   │
                  │  • Alerts & Dashboards
                  └──────────────────────┘
```

## 🚀 Choose Your Setup

Select your platform to get started:

- **[Backend Setup →](BACKEND.md)** Express.js / Node.js error tracking and monitoring
- **[Frontend Setup →](FRONTEND.md)** React observability, session replay, and performance metrics
- **[Troubleshooting →](TROUBLESHOOTING.md)** Common issues and solutions

## 📋 Quick Checklist

### Frontend
- [ ] Get client-side ID from LaunchDarkly
- [ ] Set `VITE_LD_SDK_KEY` environment variable
- [ ] Run `npm run dev:frontend`
- [ ] Verify console shows: `[LaunchDarkly] Observability enabled`

### Backend
- [ ] Get server SDK key from LaunchDarkly
- [ ] Set `LD_SDK_KEY` environment variable
- [ ] Set `LD_ENVIRONMENT` (development/staging/production)
- [ ] Run `npm run dev:backend`
- [ ] Check logs for observability initialization

## 💡 Key Concepts

| Term | Meaning |
|------|---------|
| **SDK Key** | Credentials to authenticate with LaunchDarkly (server: `sdk-...`, client-side: public ID) |
| **Error Grouping** | LaunchDarkly groups identical errors to show patterns and trends |
| **Sampling** | Production records 10% of errors to manage quota; dev records 100% |
| **Session Replay** | Video-like recording of user interactions with text obscured for privacy |
| **Distributed Tracing** | Correlation ID links frontend requests to backend handlers |
| **Web Vitals** | Performance metrics (LCP, FCP, CLS, INP, TTFB, FID) that google uses for SEO |

## 🔗 Related Documentation

- [Feature Flags](../FEATURE_FLAGS.md) - Using LaunchDarkly for feature management
- [Error Handling](../ERROR_HANDLING.md) - Application error handling patterns
- [Testing](../TESTING.md) - Testing observability integration
- [API Reference](../API_REFERENCE.md) - Endpoint documentation

---

**Status**: ✅ Observability fully integrated  
**Last Updated**: February 18, 2026
