# Personal Site v2 Helm Chart

Helm chart for deploying the Personal Site v2 application to Kubernetes: backend (Express + Drizzle), frontend (React), and PostgreSQL. The application uses **PostgreSQL** (not MongoDB); MongoDB templates are present but disabled by default for optional compatibility.

## Prerequisites

- Kubernetes cluster (v1.19+)
- Helm 3.x

## Required secrets (backend)

The backend receives these from the `app-secrets` Secret (see `values.yaml` and `templates/secret.yaml`):

- **DATABASE_URL** – PostgreSQL connection string (set automatically when `postgresql.enabled: true`; for managed DB, set via external secret or override).
- **JWT_SECRET** – Secret for JWT signing (set `backendSecrets.jwtSecret` in values or via `--set`; never commit real secrets).
- **CORS_ORIGIN** (optional) – Allowed origin for CORS; set `backendSecrets.corsOrigin` if needed.

For production, set `backendSecrets.jwtSecret` and optionally `postgresql.auth.password` via a secure values file or `--set`; do not commit production secrets to the repo.

## Installation

1. **Add the chart repository** (if using a remote repo):
   ```bash
   helm repo add personal-site https://your-repo-url
   helm repo update
   ```

2. **Install the chart** (from repo root, `helm/` is the chart directory):
   ```bash
   # Using default values (PostgreSQL in-cluster; change backendSecrets.jwtSecret in production)
   helm install personal-site ./helm -n personal-site --create-namespace

   # With custom values
   helm install personal-site ./helm -n personal-site --create-namespace -f values-prod.yaml

   # Override secrets at install time (recommended for production)
   helm install personal-site ./helm -n personal-site --create-namespace \
     --set backendSecrets.jwtSecret="your-secure-jwt-secret" \
     --set postgresql.auth.password="your-db-password"
   ```

3. **Verify installation**:
   ```bash
   kubectl get pods -n personal-site
   kubectl get services -n personal-site
   ```

## Upgrading

```bash
helm upgrade personal-site ./helm -n personal-site -f values.yaml
```

## Uninstalling

```bash
helm uninstall personal-site -n personal-site
```

## Configuration

All configuration options are defined in `values.yaml`. Key sections:

### PostgreSQL (application database)
- `postgresql.enabled` – Deploy PostgreSQL in the cluster (default: true). Set to false if using a managed database; then provide `DATABASE_URL` via an external secret or custom template.
- `postgresql.auth.username` – PostgreSQL user.
- `postgresql.auth.password` – PostgreSQL password (change in production).
- `postgresql.database` – Database name (`personal_site`).
- `postgresql.persistence.enabled` – Use a PVC for data.
- `postgresql.persistence.size` – Storage size (e.g. 10Gi).
- `postgresql.persistence.storageClass` – Storage class name.

### Backend secrets (in Secret, not ConfigMap)
- `backendSecrets.jwtSecret` – JWT signing secret (required; set securely in production).
- `backendSecrets.corsOrigin` – Optional CORS origin.

### Backend
- `backend.replicaCount` – Number of backend replicas.
- `backend.image` – Docker image name.
- `backend.imageTag` – Docker image tag.
- `backend.resources` – CPU/Memory requests and limits.
- `backend.service.type` – Service type (ClusterIP, LoadBalancer, etc.)

### Frontend
- `frontend.replicaCount` – Number of frontend replicas.
- `frontend.image` – Docker image name.
- `frontend.imageTag` – Docker image tag.
- `frontend.service.type` – Service type (LoadBalancer recommended).
- `ingress.enabled` – Enable Ingress controller.

### MongoDB (optional, not used by app)
- `mongodb.enabled` – Default: false. The app uses PostgreSQL; MongoDB is only for optional compatibility.

## Environment-Specific Values

Create custom values files for different environments:

```bash
# Development
helm install personal-site ./helm -f values-dev.yaml

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
      memory: "512Mi"
      cpu: "500m"
    limits:
      memory: "1Gi"
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
kubectl get svc -n personal-site

# Access via port-forward
kubectl port-forward -n personal-site svc/frontend 8080:80
# Then visit http://localhost:8080
```

### Via Ingress (if enabled)
Access through your ingress controller's configured hostname.

## Monitoring and Debugging

```bash
# View logs
kubectl logs -n personal-site deployment/backend
kubectl logs -n personal-site deployment/frontend

# Debug pod
kubectl debug pod/backend-xxx -n personal-site -it

# Describe resources
kubectl describe deployment backend -n personal-site
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
kubectl describe pod <pod-name> -n personal-site
kubectl logs <pod-name> -n personal-site
```

### PostgreSQL connection issues
```bash
# Check PostgreSQL pod
kubectl get pods -n personal-site -l app=postgresql
kubectl logs -n personal-site deployment/postgresql

# Test connection from backend pod
kubectl exec -it deployment/backend -n personal-site -- sh
# (if you have psql) psql $DATABASE_URL -c "SELECT 1"
```

### Backend failing (DATABASE_URL / JWT_SECRET)
Ensure the Secret `app-secrets` contains `DATABASE_URL` and `JWT_SECRET`:
```bash
kubectl get secret app-secrets -n personal-site -o jsonpath='{.data}' | jq 'keys'
```

### Service not accessible
```bash
kubectl get endpoints -n personal-site
kubectl get networkpolicies -n personal-site
```
