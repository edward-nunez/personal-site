# Helm Chart Deployment Quick Reference

## Repository Structure

```
helm/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Baseline configuration
├── values-dev.yaml         # Development overrides
├── values-prod.yaml        # Production overrides
├── .helmignore            # Files to ignore when packaging
├── README.md              # Comprehensive documentation
├── DEPLOYMENT_GUIDE.md    # This file - quick reference
├── SECRETS_MANAGEMENT.md  # Secret management best practices
├── TRAEFIK_SETUP.md       # Traefik installation guide
├── validate-secrets.sh    # Pre-deployment secret validation
└── templates/             # Kubernetes resource templates
    ├── _helpers.tpl       # Reusable template functions
    ├── NOTES.txt          # Post-install instructions
    ├── serviceaccount.yaml
    ├── configmap.yaml
    ├── secrets.yaml       # Split secrets (db-credentials, app-secrets)
    ├── image-pull-secret.yaml  # Container registry authentication
    ├── backend-*.yaml     # Backend resources
    ├── frontend-*.yaml    # Frontend resources
    ├── fit-sync-*.yaml    # FitSync (AI) resources
    ├── ollama-*.yaml      # Ollama LLM resources
    ├── postgresql-*.yaml  # PostgreSQL resources
    ├── traefik-middleware.yaml  # Traefik middleware
    └── ingress.yaml       # Ingress configuration
```

## Generating Production Secrets

**CRITICAL:** Generate a strong, unique JWT secret for production deployments. Never use default or weak secrets.

**For comprehensive secret management documentation, see [SECRETS_MANAGEMENT.md](./SECRETS_MANAGEMENT.md).**

### JWT Secret Generation

#### Method 1: OpenSSL (Recommended)
```bash
openssl rand -base64 64
```

#### Method 2: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

#### Method 3: PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Security Best Practices for Secrets

1. **Never commit secrets to Git** - Store in password managers or secret management systems
2. **Use minimum 32 bytes (256 bits)** - Longer is better for cryptographic security
3. **Rotate periodically** - Implement secret rotation procedures
4. **Store securely** - Consider Kubernetes external secrets operators or sealed secrets for GitOps
5. **Use environment variables** - Pass secrets via `--set` flags, never hardcode

### Example Secret Generation

```bash
# Generate JWT secret
export JWT_SECRET=$(openssl rand -base64 64)

# Generate database password
export DB_PASSWORD=$(openssl rand -base64 32)

# Verify secrets are set
echo "JWT_SECRET length: ${#JWT_SECRET}"
echo "DB_PASSWORD length: ${#DB_PASSWORD}"
```

## Quick Deployment Commands

### Development Environment

```bash
# Create namespace
kubectl create namespace io-edwardnunez-dev

# Install chart
helm install personal-site ./helm \
  -n io-edwardnunez-dev \
  -f helm/values-dev.yaml

# Verify deployment
kubectl get all -n io-edwardnunez-dev
```

### Production Environment

**Important:** Production deployments require additional secret configuration for image pull authentication.

```bash
# Step 1: Generate required secrets
export JWT_SECRET=$(openssl rand -base64 64)
export DB_PASSWORD=$(openssl rand -base64 32)
export CORS_ORIGIN="https://edwardnunez.io"
export GITHUB_TOKEN=ghp_your_github_token_here  # from https://github.com/settings/tokens

# Step 2: Create namespace
kubectl create namespace io-edwardnunez

# Step 3: Validate secrets before deployment
bash helm/validate-secrets.sh prod

# Step 4: Install with all secrets (Option A: Image pull secrets enabled)
helm install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set backend.secrets.jwtSecret="${JWT_SECRET}" \
  --set backend.secrets.corsOrigin="${CORS_ORIGIN}" \
  --set postgresql.auth.password="${DB_PASSWORD}" \
  --set imagePullSecrets.enabled=true \
  --set imagePullSecrets.username=edward-nunez \
  --set imagePullSecrets.password="${GITHUB_TOKEN}" \
  --create-namespace

# Option B: Using pre-existing registry secret
# helm install personal-site ./helm \
#   -n io-edwardnunez \
#   -f helm/values-prod.yaml \
#   --set backend.secrets.jwtSecret="${JWT_SECRET}" \
#   --set backend.secrets.corsOrigin="${CORS_ORIGIN}" \
#   --set postgresql.auth.password="${DB_PASSWORD}" \
#   --set 'imagePullSecrets.secretRef.name=my-registry-secret' \
#   --create-namespace

# Step 5: Verify deployment
kubectl get all -n io-edwardnunez
kubectl get secrets -n io-edwardnunez

# Step 6: Monitor pod startup
kubectl get pods -n io-edwardnunez -w
```

**Secrets Created:**
- `io-edwardnunez-db-credentials`: Database connection credentials
- `personal-site-app-secrets`: JWT and CORS configuration
- `personal-site-image-pull-secret`: Container registry authentication (if enabled)

### Upgrade Deployment

```bash
# Development
helm upgrade personal-site ./helm \
  -n io-edwardnunez-dev \
  -f helm/values-dev.yaml

# Production (with secrets)
helm upgrade personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set backend.secrets.jwtSecret="${JWT_SECRET}" \
  --set backend.secrets.corsOrigin="${CORS_ORIGIN}" \
  --set postgresql.auth.password="${DB_PASSWORD}" \
  --set imagePullSecrets.enabled=true \
  --set imagePullSecrets.username=edward-nunez \
  --set imagePullSecrets.password="${GITHUB_TOKEN}"

# Production (with pre-existing secret)
# helm upgrade personal-site ./helm \
#   -n io-edwardnunez \
#   -f helm/values-prod.yaml \
#   --set backend.secrets.jwtSecret="${JWT_SECRET}" \
#   --set 'imagePullSecrets.secretRef.name=existing-registry-secret'
```

### Uninstall

```bash
# Development
helm uninstall personal-site -n io-edwardnunez-dev
kubectl delete namespace io-edwardnunez-dev

# Production
helm uninstall personal-site -n io-edwardnunez
kubectl delete namespace io-edwardnunez
```

## Validation Commands

```bash
# Lint chart
helm lint ./helm

# Dry-run with development values
helm install personal-site ./helm \
  -n io-edwardnunez-dev \
  -f helm/values-dev.yaml \
  --dry-run --debug

# Template rendering test
helm template test ./helm -f helm/values-dev.yaml > rendered.yaml

# Validate rendered manifests
kubectl apply --dry-run=client -f rendered.yaml
```

## Environment-Specific Configuration

### Development (values-dev.yaml)

- Local images (`imagePullPolicy: Never`)
- Single replicas
- Lower resource limits
- Persistence disabled (optional)
- LoadBalancer service for easy access

### Production (values-prod.yaml)

- Versioned images from registry
- Multiple replicas with anti-affinity
- Higher resource limits
- Persistence enabled with production storage class
- Ingress with TLS
- External database recommended

## Key Configuration Parameters

### Common Secrets (MUST override in production)

```bash
--set backend.secrets.jwtSecret="<secure-random-string>"
--set postgresql.auth.password="<secure-password>"
--set backend.secrets.corsOrigin="https://yourdomain.com"
```

### Image Configuration

```bash
--set global.imageRegistry="your-registry.io"
--set backend.image.tag="v1.2.3"
--set frontend.image.tag="v1.2.3"
--set fitSync.image.tag="v1.2.3"
```

### Scaling

```bash
--set backend.replicaCount=3
--set frontend.replicaCount=3
--set fitSync.replicaCount=2
```

### External Database

```bash
--set postgresql.enabled=false
--set postgresql.externalDatabaseUrl="postgresql://user:pass@rds.example.com:5432/db"
```

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods -n io-edwardnunez
kubectl describe pod -n io-edwardnunez <pod-name>
kubectl logs -n io-edwardnunez <pod-name>
```

### Check Services

```bash
kubectl get services -n io-edwardnunez
kubectl describe service -n io-edwardnunez <service-name>
```

## Secret Architecture (Split Secrets)

The Helm chart implements **split secrets** following the DRY principle:

### 1. Database Credentials Secret
**Name:** `{release}-db-credentials`

Contains database connection information used by:
- PostgreSQL initialization
- Backend service
- FitSync service (if needed)

### 2. Application Secrets
**Name:** `{release}-app-secrets`

Contains application-specific configuration:
- JWT signing secret and expiration
- CORS origins for backend and fit-sync

### 3. Image Pull Secret  
**Name:** `{release}-image-pull-secret`

Container registry authentication for pulling images from:
- GitHub Container Registry (ghcr.io)
- Other private registries (if configured)

**Benefit:** Secrets are organized by concern, enabling better security policies and reducing duplication.

## Pre-Deployment Validation

Always validate secrets before deployment:

```bash
# For production
bash helm/validate-secrets.sh prod

# For development
bash helm/validate-secrets.sh dev

# Expected output on success:
# ✅ All required secrets are properly configured!
```

**This script validates:**
- JWT secret is configured and not using default values
- Database credentials are set
- CORS origins are specified
- Image pull secrets configured when using private registries

### Check Secrets and ConfigMaps

```bash
kubectl get secrets -n io-edwardnunez
kubectl get configmaps -n io-edwardnunez
kubectl describe secret -n io-edwardnunez personal-site-secrets
```

### Port Forwarding for Local Access

```bash
# Frontend
kubectl port-forward -n io-edwardnunez svc/personal-site-frontend 8080:80

# Backend
kubectl port-forward -n io-edwardnunez svc/personal-site-backend 3000:3000

# FitSync
kubectl port-forward -n io-edwardnunez svc/personal-site-fit-sync 3001:3001
```

## Best Practices

1. **Never commit secrets to Git** - Use `--set` flags or external secret management
2. **Use specific image tags** - Avoid `latest` tag in production
3. **Enable ingress with TLS** - Use cert-manager for automatic certificates
4. **Use managed databases** - AWS RDS, Google Cloud SQL, Azure Database
5. **Configure resource limits** - Prevent resource exhaustion
6. **Enable persistence** - Use production-grade storage classes
7. **Implement monitoring** - Prometheus annotations are included
8. **Use multiple replicas** - Enable high availability
9. **Configure pod disruption budgets** - Prevent simultaneous pod failures
10. **Regular backups** - Especially for database

## Next Steps

1. Review [README.md](README.md) for comprehensive documentation
2. Customize values files for your environment
3. Set up CI/CD pipeline for automated deployments
4. Configure monitoring and alerting
5. Implement backup and disaster recovery procedures
