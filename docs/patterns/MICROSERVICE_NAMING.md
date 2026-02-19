# Microservice Naming Convention

This document defines the standardized naming pattern for all microservices in the Personal Site v2 monorepo. Consistent naming across directories, URLs, documentation, and code ensures clarity and maintainability.

## Pattern Overview

For any microservice (e.g., "FitSync"), use:

| Context | Format | Example | Usage |
|---------|--------|---------|-------|
| **Directory/Package** | kebab-case | `fit-sync` | Directory names, URLs, API paths |
| **Documentation** | PascalCase | `FitSync` | Markdown docs, user-facing text |
| **Code Variables** | camelCase | `fitSync` | TypeScript/JavaScript identifiers |
| **Constants/Types** | PascalCase | `FitSyncConfig` | TypeScript types, interfaces, classes |

## Application Examples

### 1. Directory Structure

```
packages/
  ├── backend/
  ├── frontend/
  └── fit-sync/          # kebab-case for directory
```

### 2. Package.json

```json
{
  "name": "@personal-site/fit-sync",  // kebab-case
  "description": "FitSync microservice for AI job assessment"  // PascalCase in prose
}
```

### 3. API URLs and Routes

```typescript
// kebab-case in URLs
app.use('/api/fit-sync', fitSyncRouter);

// GET http://localhost:3000/api/fit-sync/health
// GET http://api.edwardnunez.io/v1/fit-sync/assess
```

### 4. Docker Compose

```yaml
services:
  fit-sync:  # kebab-case for service name
    build:
      context: .
      dockerfile: ./packages/fit-sync/Dockerfile
    container_name: personal-site-fit-sync  # kebab-case
```

### 5. Helm Values and Templates

```yaml
# values.yaml - Use camelCase for YAML keys
fitSync:
  enabled: true
  image:
    repository: personal-site-fit-sync  # kebab-case
```

```yaml
# Template files - Use kebab-case for filenames
# fit-sync-deployment.yaml
# fit-sync-service.yaml
# fit-sync-ingress.yaml
```

### 6. Code Examples

#### TypeScript/JavaScript Variables
```typescript
// camelCase for variables, parameters
const fitSyncConfig = {
  port: 3001,
  ollamaHost: 'http://localhost:11434'
};

// camelCase for functions
async function startFitSyncService() {
  // ...
}

// PascalCase for types, interfaces, classes
interface FitSyncResponse {
  score: number;
  analysis: string;
}

class FitSyncController {
  // ...
}
```

#### Helm Templates
```yaml
# _helpers.tpl - camelCase in references
{{- define "personal-site.fitSync.serviceName" -}}
{{- printf "%s-fit-sync" (include "personal-site.fullname" .) }}
{{- end }}

# Use kebab-case in output
metadata:
  name: {{ include "personal-site.fitSync.serviceName" . }}
  # Outputs: personal-site-fit-sync
```

### 7. Documentation References

Use **PascalCase** when referring to services in prose:

```markdown
# Architecture Documentation

## Services

- **Backend** - Express.js REST API
- **Frontend** - React 19 SPA
- **FitSync** - AI-powered job assessment microservice

The FitSync service uses Ollama to evaluate job postings...
```

## Complete Naming Matrix

| Item | Naming Convention | Example |
|------|-------------------|---------|
| Directory name | kebab-case | `packages/fit-sync/` |
| Package name | kebab-case with scope | `@personal-site/fit-sync` |
| npm scripts | kebab-case suffix | `dev:fit-sync` |
| Docker service | kebab-case | `fit-sync:` |
| Docker image | kebab-case | `personal-site-fit-sync` |
| Helm values key | camelCase | `fitSync:` |
| Helm template files | kebab-case | `fit-sync-deployment.yaml` |
| Helm service name | kebab-case | `personal-site-fit-sync` |
| K8s labels | kebab-case | `app.kubernetes.io/component: fit-sync` |
| API routes | kebab-case | `/api/fit-sync/*` |
| Environment variables | SCREAMING_SNAKE_CASE | `FIT_SYNC_PORT` |
| Code variables | camelCase | `fitSyncService` |
| Code types/classes | PascalCase | `FitSyncController` |
| Documentation prose | PascalCase | "The FitSync service..." |

## Rationale

### Why Three Formats?

1. **kebab-case for files/URLs**
   - Universal compatibility (case-insensitive filesystems, URLs)
   - Web standard for slugs and paths
   - Clear word separation

2. **PascalCase for documentation**
   - Treats service as a proper noun
   - Clear distinction from common words
   - Consistent with brand/product naming

3. **camelCase for code**
   - JavaScript/TypeScript convention
   - Matches existing codebase style (ESLint rules)
   - Natural for object keys and variables

## Common Pitfalls to Avoid

❌ **Inconsistent casing in same context**
```yaml
# BAD - mixing camelCase and kebab-case in Helm
agent:
  enabled: true
fit-sync:
  enabled: true
```

✅ **Consistent camelCase for Helm values**
```yaml
# GOOD
agent:
  enabled: true
fitSync:
  enabled: true
```

❌ **Using snake_case**
```typescript
// BAD - not JavaScript convention
const fit_sync_config = { ... };
```

✅ **Use camelCase in code**
```typescript
// GOOD
const fitSyncConfig = { ... };
```

❌ **PascalCase in URLs**
```
GET /api/FitSync/assess  # BAD
```

✅ **kebab-case in URLs**
```
GET /api/fit-sync/assess  # GOOD
```

## Migration Checklist

When renaming a microservice, update:

- [ ] Directory name (`packages/<service-name>`)
- [ ] `package.json` name field
- [ ] npm scripts in root `package.json`
- [ ] Docker Compose service name
- [ ] Dockerfiles and build contexts
- [ ] Helm values keys (use camelCase)
- [ ] Helm template files (kebab-case filenames)
- [ ] Helm helper functions (`_helpers.tpl`)
- [ ] Kubernetes labels and selectors
- [ ] API route paths
- [ ] Environment variable names
- [ ] Code imports and references
- [ ] Documentation (use PascalCase in prose)
- [ ] README files
- [ ] CHANGELOG entries

## Examples from Existing Services

### Backend Service
- Directory: `packages/backend`
- Package: `@personal-site/backend`
- Doc refs: "**Backend**"
- Code: `backendConfig`, `BackendController`

### Frontend Service
- Directory: `packages/frontend`
- Package: `@personal-site/frontend`
- Doc refs: "**Frontend**"
- Code: `frontendConfig`, `FrontendApp`

### FitSync Service (formerly Agent)
- Directory: `packages/fit-sync`
- Package: `@personal-site/fit-sync`
- API path: `/api/fit-sync/*`
- Helm key: `fitSync:`
- Helm templates: `fit-sync-deployment.yaml`
- Doc refs: "**FitSync**"
- Code: `fitSyncService`, `FitSyncController`

## Related Documentation

- [Feature Development Guide](../guides/FEATURE_DEVELOPMENT.md)
- [Architecture Overview](../architecture/ARCHITECTURE.md)
- [Service Contracts](../reference/SERVICE_CONTRACTS.md)

## Version History

- **v1.0** (2026-02-18) - Initial naming convention established with FitSync migration
