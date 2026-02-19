# Environment Variables Reference

This document maps all environment variables used by each service to their Helm configuration.

## Backend Service

### Non-Secret Environment Variables
Configured in `values.yaml` → `backend.env` → injected via ConfigMap

| Variable | Default | Source Code Reference | Helm Location |
|----------|---------|----------------------|---------------|
| `NODE_ENV` | `production` | `configs/index.ts` | `backend.env.NODE_ENV` |
| `PORT` | `3000` | `configs/index.ts` | `backend.env.PORT` |
| `LOG_LEVEL` | `info` | `configs/index.ts` | `backend.env.LOG_LEVEL` |
| `RATE_LIMIT_WINDOW_MS` | `900000` | `configs/index.ts` | `backend.env.RATE_LIMIT_WINDOW_MS` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | `configs/index.ts` | `backend.env.RATE_LIMIT_MAX_REQUESTS` |
| `RATE_LIMIT_FORMS_MAX` | `5` | `configs/index.ts` | `backend.env.RATE_LIMIT_FORMS_MAX` |
| `LD_ENVIRONMENT` | `production` | `infrastructure/feature-flags/` | `backend.env.LD_ENVIRONMENT` |
| `SERVICE_NAME` | `personal-site-backend` | `infrastructure/feature-flags/observability.ts` | `backend.env.SERVICE_NAME` |
| `SERVICE_VERSION` | `1.0.0` | `infrastructure/feature-flags/observability.ts` | `backend.env.SERVICE_VERSION` |

### Secret Environment Variables
Configured in `values.yaml` → `backend.secrets` → injected via Kubernetes Secret

| Variable | Secret Key | Source Code Reference | Helm Location |
|----------|------------|----------------------|---------------|
| `DATABASE_URL` | `DATABASE_URL` | `configs/index.ts` | Computed from PostgreSQL config |
| `JWT_SECRET` | `JWT_SECRET` | `configs/index.ts` | `backend.secrets.jwtSecret` |
| `JWT_EXPIRES_IN` | `JWT_EXPIRES_IN` | `configs/index.ts` | `backend.secrets.jwtExpiresIn` |
| `CORS_ORIGIN` | `CORS_ORIGIN` | `configs/index.ts` | `backend.secrets.corsOrigin` |
| `LD_SDK_KEY` | `LD_SDK_KEY` | `infrastructure/feature-flags/ldClient.ts` | `backend.secrets.ldSdkKey` |

**Injection Method:** `envFrom.secretRef` (all secrets from `personal-site-app-secrets` and `io-edwardnunez-db-credentials`)

---

## Frontend Service

### Build-Time Environment Variables
Configured in `values.yaml` → `frontend.env` → injected as container env vars

| Variable | Default | Source Code Reference | Helm Location |
|----------|---------|----------------------|---------------|
| `VITE_API_BASE_URL` | `/api` | `lib/api.ts`, `core/ld/observability.ts` | `frontend.env.VITE_API_BASE_URL` |
| `VITE_API_ENV` | `production` | `core/store/useFeatureFlagsStore.ts` | `frontend.env.VITE_API_ENV` |
| `VITE_SESSION_REPLAY_PRIVACY` | `strict` | `core/ld/observability.ts` | `frontend.env.VITE_SESSION_REPLAY_PRIVACY` |

### Secret Environment Variables
Configured in `values.yaml` → `frontend.secrets` → injected via Kubernetes Secret

| Variable | Secret Key | Source Code Reference | Helm Location |
|----------|------------|----------------------|---------------|
| `LD_CLIENT_ID` | `LD_CLIENT_ID` | `core/ld/ldClient.ts` | `frontend.secrets.ldSdkKey` |

**Injection Method:** Individual `env.valueFrom.secretKeyRef` for each secret

**Note:** Frontend secret environment variables must be set at **build time** for Vite to bundle them into the static assets. For runtime configuration changes, rebuild the container.

---

## FitSync Service

### Non-Secret Environment Variables
Configured in `values.yaml` → `fitSync.env` → injected as container env vars

| Variable | Default | Source Code Reference | Helm Location |
|----------|---------|----------------------|---------------|
| `NODE_ENV` | `production` | `index.ts` | `fitSync.env.NODE_ENV` |
| `PORT` | `3001` | `index.ts` | `fitSync.env.PORT` |
| `LOG_LEVEL` | `info` | `shared/utils/logger.ts` | `fitSync.env.LOG_LEVEL` |
| `OLLAMA_MODEL` | `neural-chat` | `infrastructure/services/OllamaService.ts` | `fitSync.env.OLLAMA_MODEL` |
| `OLLAMA_HOST` | `http://localhost:11434` | `infrastructure/services/OllamaService.ts` | Computed from `ollama.serviceName` |
| `BACKEND_API_URL` | `http://localhost:3000` | `infrastructure/services/PortfolioDataService.ts` | `fitSync.env.BACKEND_API_URL` |

### Secret Environment Variables
Configured in `values.yaml` → `fitSync.secrets` → injected via Kubernetes Secret

| Variable | Secret Key | Source Code Reference | Helm Location |
|----------|------------|----------------------|---------------|
| `JWT_SECRET` | `JWT_SECRET` | `shared/utils/auth.ts` | Shared from `backend.secrets.jwtSecret` |
| `CORS_ORIGIN` | `FITSYNC_CORS_ORIGIN` | `app.ts` | `fitSync.secrets.corsOrigin` |

**Injection Method:** Individual `env.valueFrom.secretKeyRef` for each secret

---

## PostgreSQL Service

### Secret Environment Variables
Configured in `values.yaml` → `postgresql.auth` → injected via Kubernetes Secret

| Variable | Secret Key | Helm Location |
|----------|------------|---------------|
| `POSTGRES_USER` | `POSTGRES_USER` | `postgresql.auth.username` |
| `POSTGRES_PASSWORD` | `POSTGRES_PASSWORD` | `postgresql.auth.password` |
| `POSTGRES_DB` | `POSTGRES_DB` | `postgresql.auth.database` |
| `PGDATA` | N/A | Hardcoded to `/var/lib/postgresql/data/pgdata` |

**Injection Method:** Individual `env.valueFrom.secretKeyRef` for each secret

---

## Kubernetes Secret Objects

### `io-edwardnunez-db-credentials`
**Type:** Opaque  
**Keys:**
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DATABASE_URL` (computed connection string)

**Consumed by:** Backend, PostgreSQL

---

### Individual Secrets (One per Variable)
Each secret contains a single variable for maximum flexibility and reusability across services.

#### `io-edwardnunez-jwt-secret`
**Type:** Opaque  
**Keys:** `JWT_SECRET`  
**Consumed by:** Backend, FitSync

#### `io-edwardnunez-jwt-expires-in`
**Type:** Opaque  
**Keys:** `JWT_EXPIRES_IN`  
**Consumed by:** Backend

#### `io-edwardnunez-cors-origin`
**Type:** Opaque  
**Keys:** `CORS_ORIGIN`  
**Consumed by:** Backend, FitSync

#### `io-edwardnunez-ld-sdk-key`
**Type:** Opaque  
**Keys:** `LD_SDK_KEY`  
**Consumed by:** Backend

#### `io-edwardnunez-ld-client-id`
**Type:** Opaque  
**Keys:** `LD_CLIENT_ID`  
**Consumed by:** Frontend

---

## Configuration Files

### Development (`values-dev.yaml`)
- `backend.secrets.ldSdkKey`: Empty (LaunchDarkly disabled in dev)
- `backend.secrets.corsOrigin`: `http://localhost:5173`
- `frontend.secrets.ldSdkKey`: Empty
- `fitSync.secrets.corsOrigin`: `http://localhost:5173,http://localhost:3000`

### Production (`values-prod.yaml`)
- `backend.secrets.ldSdkKey`: **MUST be set via --set flag**
- `backend.secrets.corsOrigin`: **MUST be set to production domain**
- `frontend.secrets.ldSdkKey`: **MUST be set via --set flag**
- `fitSync.secrets.corsOrigin`: **MUST be set to production domain**

---

## Deployment Example

### Development
```bash
helm install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-dev.yaml
```

### Production
```bash
helm install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set backend.secrets.jwtSecret='<secure-random-key>' \
  --set backend.secrets.corsOrigin='https://edwardnunez.io' \
  --set backend.secrets.ldSdkKey='sdk-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' \
  --set frontend.secrets.ldSdkKey='<frontend-sdk-key>' \
  --set fitSync.secrets.corsOrigin='https://edwardnunez.io' \
  --set postgresql.auth.password='<secure-database-password>'
```

---

## Missing Variables Audit

All environment variables used in source code are now accounted for in Helm configuration ✅

**Previously Missing (Now Added):**
- Backend: `RATE_LIMIT_*`, `LD_SDK_KEY`, `LD_ENVIRONMENT`, `SERVICE_NAME`, `SERVICE_VERSION`
- Frontend: `VITE_API_ENV`, `VITE_SESSION_REPLAY_PRIVACY`, `LD_CLIENT_ID`
- FitSync: `LOG_LEVEL`, `BACKEND_API_URL`, `JWT_SECRET` (shared with backend)
