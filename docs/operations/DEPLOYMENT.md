# Deployment Guide

Complete guide for deploying Personal Site v2 using Docker and Kubernetes (Helm).

**Table of Contents**
- [Deployment Options](#deployment-options)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment (Helm)](#kubernetes-deployment-helm)
- [Environment Configuration](#environment-configuration)
- [Health Checks & Monitoring](#health-checks--monitoring)
- [Troubleshooting](#troubleshooting)
- [Production Checklist](#production-checklist)
- [Launch Runbook](#launch-runbook)

---

## Deployment Options

| Option | Best For | Complexity | Cost |
|--------|----------|-----------|------|
| **Docker Compose** (Local) | Development, testing | Low | Free (local) |
| **Docker (Single host)** | Small production | Medium | Low |
| **Kubernetes (Helm)** | Scalable production | High | Medium-High |
| **Cloud (AWS ECS, GCP GKE)** | Enterprise | High | High |

This guide covers **Docker** and **Kubernetes (Helm)**.

**Production secrets:** Never commit `JWT_SECRET`, `DATABASE_URL`, or database passwords. Use environment variables, a secrets manager, or Helm `--set` / values files that are not committed. The Helm chart expects `backendSecrets.jwtSecret` and (when using in-cluster PostgreSQL) `postgresql.auth.password` to be set securely. See [Helm README](../helm/README.md) and [Environment Configuration](#environment-configuration) below.

---

## Docker Deployment

### Build Docker Images

Images must be built from the **repository root** (Dockerfiles use the monorepo layout):

```bash
# From repo root
docker build -t personal-site-backend:latest -f packages/backend/Dockerfile .
docker build -t personal-site-frontend:latest -f packages/frontend/Dockerfile .

# Or use docker-compose to build all (uses correct context and Dockerfile path)
docker-compose build
```

### Create Docker Network

```bash
# Create bridge network for service communication
docker network create personal-site
```

### Run PostgreSQL

```bash
docker run -d \
  --name postgres \
  --network personal-site \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=personal_site \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:18-alpine
```

### Run Backend

```bash
docker run -d \
  --name backend \
  --network personal-site \
  -e DATABASE_URL=postgresql://admin:secure_password@postgres:5432/personal_site?schema=public \
  -e JWT_SECRET=your-secret-key \
  -e CORS_ORIGIN=https://yourdomain.com \
  -e NODE_ENV=production \
  -p 3000:3000 \
  personal-site-backend:latest
```

### Run Frontend

The frontend image serves static files on port 80 via HAProxy 3.3-alpine with security headers. Map host port as needed (e.g. 80:80 or 5173:80):

```bash
docker run -d \
  --name frontend \
  --network personal-site \
  -e VITE_API_BASE_URL=https://api.yourdomain.com \
  -p 80:80 \
  personal-site-frontend:latest
```

### Verify Services

```bash
# Check running containers
docker ps

# View logs
docker logs -f backend
docker logs -f frontend
docker logs -f postgres

# Health checks
curl http://localhost:3000/health
curl http://localhost/
```

---

## Kubernetes Deployment (Helm)

### Prerequisites

- Kubernetes cluster running (1.20+)
- `kubectl` CLI installed
- Helm 3+ installed
- Docker images pushed to registry

### Quick Start

```bash
# From repo root; chart is in helm/
helm install personal-site ./helm \
  --namespace personal-site \
  --create-namespace

# With custom values file
helm install personal-site ./helm \
  --namespace personal-site \
  --create-namespace \
  -f helm/values-prod.yaml

# Verify installation
kubectl get all -n personal-site
kubectl get pods -n personal-site

# View service IPs
kubectl get svc -n personal-site
```

### Helm Chart Structure

```
helm/
├── Chart.yaml              # Chart metadata
├── values.yaml             # Default configuration
├── templates/
│   ├── namespace.yaml       # Kubernetes namespace
│   ├── configmap.yaml       # App configuration
│   ├── secret.yaml          # Sensitive data (passwords, tokens)
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── postgresql-deployment.yaml (or mongodb-* if not yet migrated)
│   ├── postgresql-service.yaml
│   ├── postgresql-pvc.yaml
│   └── ingress.yaml         # HTTP routing
```

**Note**: The chart deploys **PostgreSQL** (and optionally MongoDB, disabled by default). Backend secrets `DATABASE_URL` and `JWT_SECRET` are provided via the `app-secrets` Secret; see [helm/README.md](../helm/README.md) for required values and production setup.

### Configuration

#### values.yaml Overview

```yaml
# Image registry
dockerRegistry: "your-registry.docker.com"

# Backend configuration
backend:
  image: "personal-site-backend"
  tag: "latest"
  replicas: 3  # Number of pod copies
  
  env:
    NODE_ENV: "production"
    PORT: 3000
    JWT_EXPIRES_IN: "7d"
    
  # Resource limits
  resources:
    limits:
      cpu: "500m"
      memory: "512Mi"
    requests:
      cpu: "250m"
      memory: "256Mi"

# Frontend configuration
frontend:
  image: "personal-site-frontend"
  tag: "latest"
  replicas: 2
  
  env:
    VITE_API_BASE_URL: "https://api.yourdomain.com"

# PostgreSQL
postgresql:
  enabled: true
  replicas: 1
  user: "admin"
  password: "changeme"  # Use secrets instead!
  database: "personal_site"
```

### Deploy with Custom Values

```bash
# Create custom values file
cat > custom-values.yaml << EOF
backend:
  replicas: 5
  resources:
    limits:
      memory: "1Gi"
      cpu: "1000m"
  env:
    JWT_SECRET: "your-production-secret"

frontend:
  replicas: 3
  env:
    VITE_API_BASE_URL: "https://api.yourdomain.com"
EOF

# Deploy with custom values
helm install personal-site . \
  --namespace personal-site \
  --create-namespace \
  -f custom-values.yaml
```

### Update Deployment

```bash
# Update to new image version
helm upgrade personal-site . \
  --namespace personal-site \
  --set backend.tag=v1.2.3 \
  --set frontend.tag=v1.2.3

# Rollback if needed
helm rollback personal-site [REVISION]
helm history personal-site  # See revision history
```

### Access the Application

#### Via LoadBalancer Service (Cloud)
```bash
kubectl get svc -n personal-site
# Look for EXTERNAL-IP of frontend or ingress
# Access via: http://<EXTERNAL-IP>
```

#### Via Ingress (Recommended)
```bash
# Get ingress IP
kubectl get ingress -n personal-site

# Configure DNS to point to ingress IP
# Then access via https://yourdomain.com
```

#### Port Forward (Local Testing)
```bash
# Forward frontend to localhost:8080
kubectl port-forward -n personal-site svc/frontend 8080:80

# Forward backend to localhost:3000
kubectl port-forward -n personal-site svc/backend 3000:3000

# Access: http://localhost:8080
```

---

## Environment Configuration

### Secrets Management

#### Create Kubernetes Secret

```bash
# Create secret with sensitive data
kubectl create secret generic personal-site-secrets \
  --from-literal=JWT_SECRET=your-production-secret \
  --from-literal=DATABASE_PASSWORD=secure_db_password \
  --namespace personal-site
```

Or use Helm:

```yaml
# templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: personal-site-secrets
  namespace: {{ .Release.Namespace }}
type: Opaque
stringData:
  JWT_SECRET: {{ .Values.secrets.jwtSecret }}
  DATABASE_PASSWORD: {{ .Values.secrets.dbPassword }}
```

#### Use Secret in Deployment

```yaml
# In deployment template
env:
  - name: JWT_SECRET
    valueFrom:
      secretKeyRef:
        name: personal-site-secrets
        key: JWT_SECRET
```

### ConfigMap for Non-Secret Configuration

```yaml
# templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: personal-site-config
  namespace: {{ .Release.Namespace }}
data:
  CORS_ORIGIN: {{ .Values.backend.corsOrigin }}
  DATABASE_URL: {{ .Values.postgresql.connectionString }}
```

### Environment Variables Reference

**Backend**
```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://admin:password@postgres:5432/personal_site?schema=public

# CORS
CORS_ORIGIN=https://yourdomain.com

# Authentication
JWT_SECRET=your-long-secure-secret-here (min 32 chars recommended)
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
```

**Frontend**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## Health Checks & Monitoring

### Kubernetes Health Checks

The Helm templates include readiness and liveness probes:

```yaml
# Backend deployment
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

**Why both probes?**
- **Liveness**: Restarts pod if unresponsive
- **Readiness**: Removes pod from load balancer if not ready

### Check Pod Health

```bash
# Get pod status
kubectl get pods -n personal-site

# Describe pod (shows probe status)
kubectl describe pod <pod-name> -n personal-site

# Check logs for errors
kubectl logs <pod-name> -n personal-site

# Live log stream
kubectl logs -f <pod-name> -n personal-site
```

### Manual Health Check

```bash
# Health (simple status)
curl http://localhost:3000/health
# Response: { "status": "ok" }

# Readiness (includes database check)
curl http://localhost:3000/ready
# Response: { "status": "ready", "database": "connected" }
```

---

## Troubleshooting

### Pod Stuck in "Pending"

```bash
kubectl describe node
# Check: disk space, memory, resource requests

# Scale down if node overloaded
kubectl scale deployment backend --replicas=1 -n personal-site
```

### Pod CrashLoopBackOff

```bash
# Check logs
kubectl logs <pod-name> -n personal-site

# Common causes:
# 1. Missing environment variables
# 2. Database connection failure
# 3. Port already in use

# Fix: Update ConfigMap/Secret and restart pod
kubectl rollout restart deployment backend -n personal-site
```

### Database Connection Failed

```bash
# Verify PostgreSQL pod is running
kubectl get pods -n personal-site | grep postgres

# Check PostgreSQL logs
kubectl logs postgres-0 -n personal-site

# Connect to database manually
kubectl exec -it postgres-0 -n personal-site -- psql -U admin -d personal_site

# Run migrations if database is fresh
kubectl exec -it <backend-pod> -n personal-site -- npm run drizzle:migrate
```

### External Access Issues

#### Ingress not routing to service
```bash
# Check ingress status
kubectl get ingress -n personal-site

# Describe ingress
kubectl describe ingress personal-site-ingress -n personal-site

# Verify service exists
kubectl get svc -n personal-site
```

#### DNS not resolving
```bash
# Check DNS from pod
kubectl exec -it <pod> -n personal-site -- nslookup yourdomain.com

# Or test with curl
kubectl exec -it <pod> -n personal-site -- curl http://frontend
```

### Scaling Issues

```bash
# Auto-scaling (requires metrics-server)
kubectl autoscale deployment backend \
  --min=2 --max=10 \
  -n personal-site

# Manual scaling
kubectl scale deployment backend --replicas=5 -n personal-site
```

### View All Events

```bash
# See what's happening in the cluster
kubectl get events -n personal-site --sort-by='.lastTimestamp'
```

---

## Monitoring & Logging

*Optional Phase 5 follow-up:* For production you may add Prometheus metrics, log aggregation (e.g. Loki, CloudWatch), and alerting. The sections below are a starting point.

### View Logs (ELK Stack / Loki)

```bash
# Stream backend logs
kubectl logs -f deployment/backend -n personal-site

# Previous logs (if pod restarted)
kubectl logs <pod-name> --previous -n personal-site

# Logs from all pods
kubectl logs -f -l app=backend -n personal-site
```

### Metrics (Prometheus)

If Prometheus is installed:

```bash
# Node metrics
kubectl top nodes

# Pod metrics
kubectl top pods -n personal-site
```

### Set Up Monitoring

```bash
# Install metrics-server for resource metrics
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Install Prometheus for advanced monitoring
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker images
        run: |
          docker build -t registry/backend:${{ github.sha }} ./packages/backend
          docker push registry/backend:${{ github.sha }}
      
      - name: Deploy with Helm
        run: |
          helm upgrade personal-site ./helm \
            --namespace personal-site \
            --set backend.tag=${{ github.sha }}
```

---

## Backup & Disaster Recovery

### Backup PostgreSQL

```bash
# Create dump
kubectl exec postgres-0 -n personal-site -- \
  pg_dump -U admin personal_site > backup.sql

# Restore from dump
kubectl exec -i postgres-0 -n personal-site -- \
  psql -U admin personal_site < backup.sql
```

### Persistent Volume Backup

```bash
# List PVCs
kubectl get pvc -n personal-site

# Backup PVC (via pod)
kubectl exec <pod> -n personal-site -- tar czf - /data > backup.tar.gz

# Restore
kubectl exec -i <pod> -n personal-site -- tar xzf - -C /
```

---

## Production Checklist

*Phase 7 (Launch readiness):* Use this checklist and the [Launch Runbook](#launch-runbook) below before your first production deploy.

Before deploying to production, work through the items below. Where applicable, see [OPERATIONS.md](./OPERATIONS.md) (Secrets management, Disaster recovery) and [helm/README.md](../helm/README.md) (Helm values and required secrets).

- [ ] **Environment variables and secrets** – Use Secrets (not ConfigMaps) for `DATABASE_URL`, `JWT_SECRET`, and DB passwords. See [OPERATIONS.md – Secrets Management](./OPERATIONS.md#secrets-management) and [helm/README.md – Required secrets](../helm/README.md#required-secrets-backend).
- [ ] **Database backups enabled and tested** – Define schedule and retention; test restore. See [OPERATIONS.md – Disaster recovery](./OPERATIONS.md#disaster-recovery).
- [ ] **TLS/SSL certificates** – Configure Ingress with cert-manager or your provider’s TLS; document in your runbook.
- [ ] **Resource limits** – Set in Helm `values.yaml` (backend/frontend/postgresql resources); adjust for your cluster. See [helm/values.yaml](../helm/values.yaml).
- [ ] **Health checks** – Liveness and readiness probes are set in Helm (backend: `/health`, `/ready`; frontend: `/`). See [helm/values.yaml](../helm/values.yaml).
- [ ] **Logging and monitoring** – Optional Phase 5 follow-up. See [OPERATIONS.md – Monitoring](./OPERATIONS.md#monitoring-checklist) and [DEPLOYMENT – Monitoring & Logging](#monitoring--logging).
- [ ] **Database migrations** – Run before or as part of deploy: `npm run drizzle:migrate -w packages/backend` (or equivalent in your pipeline). See [GETTING_STARTED.md – Set Up Database](./GETTING_STARTED.md#step-3-set-up-database).
- [ ] **Load testing** – Optional; run post-launch or before go-live and document approach.
- [ ] **Disaster recovery plan** – Documented in [OPERATIONS.md – Disaster recovery](./OPERATIONS.md#disaster-recovery). Ensure team knows backup/restore steps.
- [ ] **Team trained on runbooks** – Share [OPERATIONS.md](./OPERATIONS.md) and this guide; confirm who runs backups and incident response.
- [ ] **DNS** – Point production domain to Ingress/LoadBalancer; verify with `kubectl get ingress -n personal-site` (or your namespace).
- [ ] **CORS_ORIGIN** – Set to production frontend URL in Helm `backendSecrets.corsOrigin` or backend env. See [helm/README.md](../helm/README.md).
- [ ] **JWT_SECRET** – Rotate from default; store in secrets manager or Helm `--set backendSecrets.jwtSecret=...`. See [OPERATIONS.md – Secrets management](./OPERATIONS.md#secrets-management).

---

## Launch Runbook

Ordered steps for a first production (or staging) deploy. Use with the [Production Checklist](#production-checklist) above.

### Pre-deploy

1. **Secrets** – Set `backendSecrets.jwtSecret`, `postgresql.auth.password` (or `backendSecrets.databaseUrl` for managed DB). Never commit real values. See [OPERATIONS.md – Secrets management](./OPERATIONS.md#secrets-management).
2. **Database** – If using in-cluster PostgreSQL, ensure PVC or use managed PostgreSQL and set `postgresql.enabled: false` and `backendSecrets.databaseUrl`. Run migrations (e.g. from a one-off job or locally against the target DB). See [helm/README.md](../helm/README.md).
3. **Backup** – If replacing an existing DB, take a backup first. See [OPERATIONS.md – Disaster recovery](./OPERATIONS.md#disaster-recovery).

### Deploy

4. **Build and push images** (if using a registry): from repo root, `./scripts/build-images.sh <tag>` or `docker build -f packages/backend/Dockerfile .` and same for frontend; push to your registry. Update Helm `values.yaml` or `--set` with image tag.
5. **Install or upgrade Helm release**: e.g. `helm upgrade --install personal-site ./helm -n personal-site --create-namespace -f values-prod.yaml`. See [Kubernetes Deployment (Helm)](#kubernetes-deployment-helm).
6. **Verify pods**: `kubectl get pods -n personal-site`; all should be Running/Ready.

### Post-deploy

7. **Smoke tests** – Call `https://<your-domain>/health` and `https://<your-domain>/ready`; open frontend and check one public page and, if applicable, admin login.
8. **DNS and CORS** – Confirm DNS points to the Ingress/LB and `CORS_ORIGIN` includes the frontend URL so API calls succeed from the browser.
9. **Monitoring** – Confirm logging/monitoring (if configured) and that alerts or runbooks are in place. See [OPERATIONS.md](./OPERATIONS.md).

---

**Last Updated**: February 2026  
**Deployment Tools**: Docker, Kubernetes, Helm  
**Database**: PostgreSQL 18
