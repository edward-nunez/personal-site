# Personal Site v2 Helm Chart

Enterprise-grade Helm chart for deploying Personal Site v2 - a full-stack application with React 19 frontend, Express.js backend, PostgreSQL database, FitSync AI microservice, and Ollama LLM engine.

## Architecture

The chart deploys the following components:

- **Frontend**: React 19 SPA served by HAProxy 3.3-alpine
- **Backend**: Express.js API with Clean Architecture
- **PostgreSQL**: Database (or external managed DB)
- **FitSync**: AI job assessment microservice
- **Ollama**: Local LLM inference engine (optional)

## Prerequisites

- Kubernetes cluster (v1.19+)
- Helm 3.x
- kubectl configured with cluster access
- Storage provisioner for PersistentVolumes (if using persistence)

## Quick Start

### Development Deployment

```bash
# Create namespace
kubectl create namespace io-edwardnunez-dev

# Install with development values
helm install personal-site ./helm \
  -n io-edwardnunez-dev \
  -f helm/values-dev.yaml

# Check deployment status
kubectl get pods -n io-edwardnunez-dev
kubectl get services -n io-edwardnunez-dev
```

### Production Deployment

```bash
# Create namespace
kubectl create namespace io-edwardnunez

# Install with production values (override secrets!)
helm install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set backend.secrets.jwtSecret="your-secure-jwt-secret" \
  --set postgresql.auth.password="your-secure-db-password"

# Or use external secrets (recommended)
# Set postgresql.enabled=false and provide externalDatabaseUrl
helm install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set postgresql.enabled=false \
  --set postgresql.externalDatabaseUrl="postgresql://user:pass@host:5432/db?schema=public"
```

## Configuration

The chart supports three values files:

1. **values.yaml** - Baseline configuration (defaults)
2. **values-dev.yaml** - Development environment overrides
3. **values-prod.yaml** - Production environment overrides

### Key Configuration Options

#### Global Settings

```yaml
global:
  imageRegistry: ""              # Container registry (e.g., "gcr.io/my-project")
  imagePullPolicy: IfNotPresent  # Image pull policy
  imagePullSecrets: []            # Secrets for private registries
```

#### PostgreSQL

```yaml
postgresql:
  enabled: true                   # Deploy PostgreSQL (set false for managed DB)
  auth:
    username: admin
    password: "changeme"          # MUST be set securely in production
    database: personal_site
  persistence:
    enabled: true
    size: 10Gi
    storageClass: ""              # Use "" for default storage class
  externalDatabaseUrl: ""         # Required when enabled=false
```

**Production Recommendation**: Use a managed database service (AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL) by setting `postgresql.enabled=false` and providing `postgresql.externalDatabaseUrl`.

#### Backend

```yaml
backend:
  image:
    repository: personal-site-backend
    tag: "latest"                 # Use specific version tags in production
  replicaCount: 1                 # Increase for high availability
  secrets:
    jwtSecret: "changeme"         # CRITICAL: Set via --set or external secret
    corsOrigin: ""                # Your frontend domain
```

#### Frontend

```yaml
frontend:
  image:
    repository: personal-site-frontend
    tag: "latest"
  replicaCount: 1
  env:
    VITE_API_BASE_URL: "/api"    # API path via ingress
```

#### FitSync Service

```yaml
fitSync:
  enabled: true                   # Enable FitSync microservice
  env:
    OLLAMA_MODEL: "neural-chat"   # LLM model for inference
```

#### Ingress

```yaml
ingress:
  enabled: false                  # Set true for production with proper domain
  className: "traefik"            # Traefik, nginx, haproxy, contour, kong
  hosts:
    - host: yourdomain.com
      paths:
        - path: /
          service: frontend
        - path: /api
          service: backend
        - path: /agent
          service: agent
  tls:
    - secretName: personal-site-tls
      hosts:
        - yourdomain.com
```

## Security Best Practices

### 1. Never Commit Secrets

Always provide secrets via:
- `--set` flags at install time
- External secret management (e.g., AWS Secrets Manager, HashiCorp Vault)
- Sealed Secrets or External Secrets Operator

```bash
# Good: Set secrets at install time
helm install personal-site ./helm \
  --set backend.secrets.jwtSecret="$(openssl rand -base64 32)" \
  --set postgresql.auth.password="$(openssl rand -base64 32)"
```

### 2. Use Managed Databases in Production

Set `postgresql.enabled=false` and use a managed database:

```bash
helm install personal-site ./helm \
  -f helm/values-prod.yaml \
  --set postgresql.enabled=false \
  --set postgresql.externalDatabaseUrl="postgresql://user:pass@rds.amazonaws.com:5432/db"
```

### 3. Use Private Image Registries

```yaml
global:
  imageRegistry: "gcr.io/my-project"
  imagePullSecrets:
    - name: gcr-json-key
```

### 4. Enable TLS/HTTPS

Use cert-manager with Traefik for automatic TLS certificates:

```yaml
ingress:
  enabled: true
  className: "traefik"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
  tls:
    - secretName: personal-site-tls
      hosts:
        - yourdomain.com
```

See [TRAEFIK_SETUP.md](TRAEFIK_SETUP.md) for complete Traefik installation guide.

## Resource Requirements

### Development (Minimal)

- CPU: ~1.5 cores
- Memory: ~2 GB
- Storage: 20 GB (if persistence enabled)

### Production (Recommended)

- CPU: ~8 cores (with HA replicas)
- Memory: ~6 GB
- Storage: 100 GB (database + model storage)

## Environment-Specific Deployments

### Development

```bash
helm upgrade --install personal-site ./helm \
  -n io-edwardnunez-dev \
  -f helm/values-dev.yaml \
  --create-namespace
```

Features:
- Local images (`imagePullPolicy: Never`)
- Lower resource limits
- Persistence disabled for faster cleanup
- LoadBalancer service type for easy access

### Production

```bash
helm upgrade --install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set backend.secrets.jwtSecret="${JWT_SECRET}" \
  --set postgresql.auth.password="${DB_PASSWORD}"
```

Features:
- Specific image tags (not `latest`)
- Multiple replicas for HA
- Pod anti-affinity for distribution
- Ingress with TLS
- Resource quotas and limits
- External secrets management

## Upgrading

```bash
# Update dependencies (if any)
helm dependency update ./helm

# Upgrade with new values
helm upgrade personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml

# Check upgrade status
helm status personal-site -n io-edwardnunez
```

## Rollback

```bash
# List releases
helm history personal-site -n io-edwardnunez

# Rollback to previous version
helm rollback personal-site -n io-edwardnunez

# Rollback to specific revision
helm rollback personal-site 2 -n io-edwardnunez
```

## Uninstalling

```bash
# Uninstall release
helm uninstall personal-site -n io-edwardnunez

# Clean up namespace (if desired)
kubectl delete namespace io-edwardnunez

# Note: PersistentVolumes may require manual cleanup
kubectl get pv | grep personal-site
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n io-edwardnunez

# View pod logs
kubectl logs -n io-edwardnunez <pod-name>

# Describe pod for events
kubectl describe pod -n io-edwardnunez <pod-name>
```

### Database Connection Errors

```bash
# Check PostgreSQL pod
kubectl get pods -n io-edwardnunez -l app.kubernetes.io/component=postgresql

# Test database connectivity from backend pod
kubectl exec -it -n io-edwardnunez <backend-pod> -- \
  env | grep DATABASE_URL

# Check secret values (be careful with sensitive data)
kubectl get secret -n io-edwardnunez personal-site-secrets -o yaml
```

### Image Pull Errors

```bash
# Check image pull secrets
kubectl get secrets -n io-edwardnunez

# Verify image exists
docker pull <image-name>:<tag>

# For development, ensure imagePullPolicy: Never
```

## Advanced Configuration

### Custom Storage Classes

```yaml
postgresql:
  persistence:
    storageClass: "fast-ssd"  # Your custom storage class

ollama:
  persistence:
    storageClass: "fast-ssd"
```

### GPU Support for Ollama (Optional)

```yaml
ollama:
  resources:
    requests:
      nvidia.com/gpu: "1"
    limits:
      nvidia.com/gpu: "1"
  nodeSelector:
    accelerator: nvidia-tesla-t4
  tolerations:
    - key: nvidia.com/gpu
      operator: Exists
      effect: NoSchedule
```

### Monitoring and Observability

The chart includes Prometheus annotations on pods:

```yaml
backend:
  podAnnotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "3000"
    prometheus.io/path: "/metrics"
```

## Chart Structure

```
helm/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default values
├── values-dev.yaml         # Development overrides
├── values-prod.yaml        # Production overrides
├── README.md               # This file
└── templates/
    ├── _helpers.tpl        # Template helpers
    ├── serviceaccount.yaml # Service accounts
    ├── configmap.yaml      # Configuration
    ├── secret.yaml         # Secrets
    ├── backend-*.yaml      # Backend resources
    ├── frontend-*.yaml     # Frontend resources
    ├── fit-sync-*.yaml        # FitSync resources
    ├── ollama-*.yaml       # Ollama resources
    ├── postgresql-*.yaml   # PostgreSQL resources
    └── ingress.yaml        # Ingress configuration
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/personal-site-v2/issues
- Documentation: See `/docs` directory in repository

## License

[Your License Here]

# Staging
helm install personal-site ./helm -f values-staging.yaml

# Production (use secure secrets)
helm install personal-site ./helm -f values-prod.yaml
```

## Example Custom Values (values-prod.yaml)

```yaml
global:
  environment: production
  namespace: personal-site

# Use strong secrets in production; prefer --set or a secret manager
backendSecrets:
  jwtSecret: "your-secure-jwt-secret"
  corsOrigin: "https://yourdomain.com"

postgresql:
  enabled: true
  auth:
    password: "your-secure-db-password"
  persistence:
    size: 50Gi
    storageClass: fast-ssd

backend:
  replicaCount: 3
  resources:
    requests:
      memory: "256Mi"
      cpu: "500m"
    limits:
      memory: "512Mi"
      cpu: "1000m"

frontend:
  replicaCount: 2
  service:
    type: LoadBalancer

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: personal-site.com
      paths:
        - path: /
          pathType: Prefix
```

## Accessing the Application

### Via Service
```bash
# Get the external IP of frontend service
kubectl get svc -n io-edwardnunez

# Access via port-forward
kubectl port-forward -n io-edwardnunez svc/frontend 8080:80
# Then visit http://localhost:8080
```

### Via Ingress (if enabled)
Access through your ingress controller's configured hostname.

## Monitoring and Debugging

```bash
# View logs
kubectl logs -n io-edwardnunez deployment/backend
kubectl logs -n io-edwardnunez deployment/frontend

# Debug pod
kubectl debug pod/backend-xxx -n io-edwardnunez -it

# Describe resources
kubectl describe deployment backend -n io-edwardnunez
```

## Chart Structure

```
helm/
├── Chart.yaml
├── values.yaml
├── README.md
└── templates/
    ├── namespace.yaml
    ├── configmap.yaml
    ├── secret.yaml
    ├── postgresql-deployment.yaml
    ├── postgresql-service.yaml
    ├── postgresql-pvc.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── ingress.yaml
    ├── mongodb-deployment.yaml
    ├── mongodb-service.yaml
    ├── mongodb-pvc.yaml
    └── _helpers.tpl
```

## Security Considerations

1. **Secrets**: Set `backendSecrets.jwtSecret` and `postgresql.auth.password` via `--set`, a secure values file, or a secret manager. Do not commit production secrets.
2. **Image Pull**: Update `imagePullPolicy` for production (e.g. Always when using a registry).
3. **Network Policy**: Add network policies for pod-to-pod communication if required.
4. **RBAC**: Configure RBAC as needed for your cluster.
5. **Resource Limits**: Adjust resource requests and limits based on your cluster.

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name> -n io-edwardnunez
kubectl logs <pod-name> -n io-edwardnunez
```

### PostgreSQL connection issues
```bash
# Check PostgreSQL pod
kubectl get pods -n io-edwardnunez -l app=postgresql
kubectl logs -n io-edwardnunez deployment/postgresql

# Test connection from backend pod
kubectl exec -it deployment/backend -n io-edwardnunez -- sh
# (if you have psql) psql $DATABASE_URL -c "SELECT 1"
```

### Backend failing (DATABASE_URL / JWT_SECRET)
Ensure the Secret `app-secrets` contains `DATABASE_URL` and `JWT_SECRET`:
```bash
kubectl get secret app-secrets -n io-edwardnunez -o jsonpath='{.data}' | jq 'keys'
```

### Service not accessible
```bash
kubectl get endpoints -n io-edwardnunez
kubectl get networkpolicies -n io-edwardnunez
```
