# Operations & Troubleshooting

Runbooks and troubleshooting guides for production operations, debugging, and incident response.

**Table of Contents**
- [Production Runbooks](#production-runbooks)
- [Secrets Management](#secrets-management)
- [Disaster Recovery](#disaster-recovery)
- [Common Issues & Solutions](#common-issues--solutions)
- [Debugging Guide](#debugging-guide)
- [Performance Optimization](#performance-optimization)
- [Monitoring Checklist](#monitoring-checklist)

---

## Production Runbooks

### Emergency: Application Not Responding

**Initial Triage (5 minutes)**

```bash
# 1. Check if service is running
kubectl get pods -n personal-site
# Look for: All RUNNING status? Any CrashLoopBackOff?

# 2. Check health endpoints
curl http://localhost:3000/health
curl http://localhost:3000/ready
# Should return 200 with { "status": "ok" } or { "status": "ready" }

# 3. Check recent logs
kubectl logs -f deployment/backend -n personal-site --tail=50

# 4. Check database connectivity
kubectl logs -f deployment/backend -n personal-site | grep -i "database\|connection"
```

**If Backend Pod is Down**

```bash
# Check pod status
kubectl describe pod <pod-name> -n personal-site

# Common causes:
# - Out of memory: kubectl top pods -n personal-site
# - Database unreachable: kubectl logs... | grep database
# - Readiness probe failing: Pod crashed, needs restart

# Restart the deployment
kubectl rollout restart deployment/backend -n personal-site

# Watch rollout status
kubectl rollout status deployment/backend -n personal-site
```

**If Database is Down**

```bash
# Check PostgreSQL pod
kubectl describe pod postgres-0 -n personal-site
kubectl logs postgres-0 -n personal-site

# Attempted restart
kubectl delete pod postgres-0 -n personal-site
# Kubernetes will recreate it

# If still failing, restore from backup
kubectl exec -i postgres-0 -n personal-site < /path/to/backup.sql
```

**If Network/Ingress Issue**

```bash
# Test pod-to-pod communication
kubectl exec -it <frontend-pod> -n personal-site -- curl http://backend:3000/health

# Check ingress
kubectl get ingress -n personal-site
kubectl describe ingress personal-site-ingress -n personal-site

# Check DNS (if external)
nslookup yourdomain.com
# Verify IP matches ingress IP
```

**Recovery Steps**
1. Identify root cause from logs
2. If configuration issue: update ConfigMap → rollout restart
3. If database issue: restore from backup
4. If code issue: rollback to previous version (`helm rollback personal-site`)
5. Monitor logs and metrics for 15 minutes

---

### Secrets Management

**Where secrets live**

- **Backend** requires at least:
  - `DATABASE_URL` – PostgreSQL connection string (never commit; use env or Kubernetes Secret).
  - `JWT_SECRET` – Used to sign and verify JWTs (min 32 chars in production).
  - Optionally: `CORS_ORIGIN` for production frontend URL(s).

- **Docker / docker-compose**: Set in `environment` or an env file that is not committed (e.g. `.env` in `packages/backend`, listed in `.gitignore`).

- **Kubernetes (Helm)**: The chart expects these in the `app-secrets` Secret. Set them via:
  - `helm install ... --set backendSecrets.jwtSecret="..." --set postgresql.auth.password="..."`
  - Or a values file that is not committed (e.g. `values-prod.yaml` in CI secrets or a secret manager).

**Do not**

- Commit real `JWT_SECRET`, `DATABASE_URL`, or database passwords to the repo.
- Rely on default/example values in code for production (backend config uses defaults only for dev/test).

**Rotating secrets**

1. **JWT_SECRET**: Generate a new value; update the Secret (or env); restart backend. All existing tokens become invalid; users must log in again.
2. **Database password**: Change password in PostgreSQL; update `DATABASE_URL` (or `postgresql.auth.password` and Secret); restart backend (and any app that connects to the DB).

---

### Disaster Recovery

**Database backup and restore**

- **Backup (PostgreSQL)**  
  With in-cluster or local PostgreSQL:

  ```bash
  # From host (adjust pod/service name and namespace)
  kubectl exec -n personal-site deployment/postgresql -- pg_dump -U admin personal_site > backup_$(date +%Y%m%d).sql

  # Or with Docker
  docker exec personal-site-postgres pg_dump -U admin personal_site > backup_$(date +%Y%m%d).sql
  ```

  For managed PostgreSQL (e.g. cloud), use the provider’s backup/snapshot feature and document the restore procedure in your runbook.

- **Restore**  
  Restore into an existing empty database or a new database:

  ```bash
  # Kubernetes
  kubectl exec -i -n personal-site deployment/postgresql -- psql -U admin personal_site < backup_YYYYMMDD.sql

  # Docker
  docker exec -i personal-site-postgres psql -U admin personal_site < backup_YYYYMMDD.sql
  ```

  Then restart the backend so it uses the restored data.

- **Point-in-time recovery (PITR)**  
  Not covered here. If you use a managed PostgreSQL service with PITR, follow the provider’s docs and add the exact steps to this runbook.

**Runbook checklist**

- Backup frequency (e.g. daily) and retention.
- Who can run backups/restores and where backups are stored.
- Restore test at least once to confirm the process.

---

### Scaling Under Load

**Detected: High CPU/Memory Usage**

```bash
# Check current resource usage
kubectl top pods -n personal-site
kubectl top nodes

# If pod using > 80% memory:
kubectl get pod <pod-name> -o yaml | grep -A 5 limits

# Scale up replicas temporarily
kubectl scale deployment backend --replicas=5 -n personal-site

# Monitor the effect
watch kubectl top pods -n personal-site
```

**If Out of Node Resources**

```bash
# Check node capacity
kubectl describe nodes

# Add new node (cluster-specific, e.g., AWS)
# Then Kubernetes auto-schedules pods

# Or request more resources from cloud provider
```

**Enable Auto-Scaling**

```bash
# Install metrics-server (if not present)
kubectl get deployment metrics-server -n kube-system

# Set up HPA (Horizontal Pod Autoscaler)
kubectl autoscale deployment backend \
  --min=2 \
  --max=10 \
  --cpu-percent=70 \
  -n personal-site

# View HPA status
kubectl get hpa -n personal-site
watch kubectl get hpa -n personal-site
```

---

### 🔄 Zero-Downtime Deployment

**Rolling Update Strategy**

```bash
# Update image (automatically does rolling update)
helm upgrade personal-site ./helm \
  --namespace personal-site \
  --set backend.tag=v1.2.3

# Watch rollout progress
kubectl rollout status deployment/backend -n personal-site

# Rollback if issues detected
helm rollout history personal-site -n personal-site
helm rollback personal-site 1 -n personal-site
```

**Verify No Downtime**

```bash
# In separate terminal, continuously test endpoint
while true; do
  curl -w "\n" http://localhost:3000/api/experiences
  sleep 1
done

# Should see no 5xx errors or timeouts during deployment
```

---

### 🔐 Secrets Rotation

**Update JWT Secret**

```bash
# Generate new secret (minimum 32 chars, random)
NEW_SECRET=$(openssl rand -base64 32)

# Update Kubernetes secret
kubectl patch secret personal-site-secrets \
  -p '{"data":{"JWT_SECRET":"'$(echo -n $NEW_SECRET | base64)'"}}' \
  -n personal-site

# Restart backend to pick up new secret
kubectl rollout restart deployment/backend -n personal-site

# Old tokens will be invalid (users need to re-login)
# This is expected behavior
```

**Update Database Password**

```bash
# WARNING: Complex process, plan during maintenance window

# 1. Create new PostgreSQL user
kubectl exec -it postgres-0 -n personal-site -- psql -U postgres
#> CREATE USER newuser WITH PASSWORD 'newpassword';
#> GRANT ALL ON DATABASE personal_site TO newuser;
#> \q

# 2. Update secret
kubectl patch secret personal-site-secrets \
  -p '{"data":{"DATABASE_URL":"postgresql://newuser:newpassword@postgres:5432/personal_site"}}' \
  -n personal-site

# 3. Restart backend
kubectl rollout restart deployment/backend -n personal-site

# 4. (Optional) Remove old user if no longer needed
# DELETE USER olduser;
```

---

## Common Issues & Solutions

### Issue: 502 Bad Gateway

**Symptoms**: Frontend loads, but API calls fail with 502

**Diagnosis**:
```bash
# Check if backend service exists
kubectl get svc backend -n personal-site

# Check if backend pods are ready
kubectl get pods -l app=backend -n personal-site

# Check backend logs
kubectl logs deployment/backend -n personal-site
```

**Solutions**:
1. **Backend pods not running**: `kubectl describe pod <pod>`
2. **Backend service misconfigured**: Check `kubectl get svc backend -o yaml`
3. **Ingress routing wrong**: Check `kubectl describe ingress`

```bash
# Quick fix: Restart backend
kubectl rollout restart deployment/backend -n personal-site

# If that doesn't work: Check database connection
kubectl logs deployment/backend -n personal-site | grep -i database
```

---

### Issue: Database Connection Timeout

**Symptoms**: Backend logs: `connection timeout` or `ECONNREFUSED`

**Diagnosis**:
```bash
# 1. Check if PostgreSQL pod is running
kubectl get pod postgres-0 -n personal-site

# 2. Check PostgreSQL logs
kubectl logs postgres-0 -n personal-site

# 3. Test connectivity from app pod
kubectl exec -it <backend-pod> -n personal-site -- \
  psql "postgresql://admin:password@postgres:5432/personal_site" -c "SELECT 1"
```

**Solutions**:

**PostgreSQL not running**:
```bash
kubectl get pvc -n personal-site  # Check persistent volume
kubectl describe pod postgres-0 -n personal-site  # Check events
kubectl logs postgres-0 -n personal-site  # Check startup logs
```

**Wrong connection string**:
```bash
# Verify DATABASE_URL in secret
kubectl get secret personal-site-secrets -o yaml -n personal-site
# Check: host should be "postgres" (service name), not "localhost"
# Format: postgresql://user:password@postgres:5432/personal_site
```

**Network issue**:
```bash
# Test DNS from pod
kubectl exec <pod> -n personal-site -- nslookup postgres

# Test network connectivity
kubectl exec <pod> -n personal-site -- nc -zv postgres 5432
# Should show: Connection to postgres:5432 succeeded!
```

---

### Issue: High Memory Usage

**Symptoms**: Backend pod using > 500MB, app slow or crashing

**Diagnosis**:
```bash
# Check memory usage trend
kubectl top pod <pod-name> -n personal-site

# Check nodejs heap size
kubectl exec <pod> -n personal-site -- node --version
# Node should have memory limit from container

# Check for memory leaks
kubectl logs <pod> -n personal-site | grep -i "memory\|gc\|heap"
```

**Solutions**:

**Increase container limits**:
```yaml
# In Helm values.yaml
backend:
  resources:
    limits:
      memory: "1Gi"    # Was 512Mi
```

**Identify memory leak in code**:
```bash
# Enable heap snapshots
NODE_OPTIONS="--max-old-space-size=512" npm run dev:backend

# Check for:
# - Event listener leaks
# - Unclosed database connections
# - Growing caches without cleanup
```

**Use load testing to reproduce**:
```bash
npm install -g autocannon
autocannon http://localhost:3000/api/experiences -c 10 -d 30
# Watch memory usage while running
```

---

### Issue: JWT Token Errors

**Symptoms**: `401 Unauthorized`, user logged in but requests fail

**Diagnosis**:
```bash
# Check token in browser storage
localStorage.getItem('auth.token')

# Decode token (online: jwt.io)
# Check: "exp" (expiration), "iat" (issued at)

# Check backend logs for token validation
kubectl logs deployment/backend -n personal-site | grep -i "token\|auth"
```

**Solutions**:

**Token expired**:
- User needs to login again
- Verify JWT_EXPIRES_IN is reasonable (7d by default)

**Token signature invalid**:
- Backend JWT_SECRET doesn't match old token
- User must logout and login to get new token

**Token validation failing**:
```bash
# Check JWT_SECRET is set
kubectl get secret personal-site-secrets -o yaml -n personal-site | grep JWT_SECRET
# Decode: echo '<base64>' | base64 -d

# Verify it's long enough (32+ chars recommended)
```

---

### Issue: Slow API Response Times

**Symptoms**: API calls take > 1 second, database queries slow

**Diagnosis**:
```bash
# Check backend CPU/Memory
kubectl top pod <backend-pod> -n personal-site

# Enable query logging
kubectl exec <postgres-pod> -n personal-site -- psql -U admin -d personal_site
#> SET log_min_duration_statement = 1000;  -- Log queries > 1s
```

**Solutions**:

**Missing database indexes**:
```bash
# Check Drizzle schema for index definitions
grep -r "index(" packages/backend/src/infrastructure/persistence/schema.ts

# Add missing indexes in schema definition:
# index('table_featured_idx').on(table.featured)  -- for filtering featured=true
# index('table_created_at_idx').on(table.createdAt)  -- for sorting by date

# Then: npm run drizzle:generate && npm run drizzle:migrate
```

**N+1 query problem** (frontend makes too many requests):
```typescript
// Frontend: Use TanStack Query caching
const { data, isLoading } = useQuery({
  queryKey: ['experiences'],
  queryFn: fetchAll,
  staleTime: 5 * 60 * 1000,  // Cache 5 minutes
});
```

**Database connection pool exhausted**:
```bash
# Check Prisma pool settings
# In: src/infrastructure/persistence/prisma.config.ts
# Default: 10 connections per app instance
# If too many instances × 10 > PostgreSQL max_connections (100), scale down
```

---

## Debugging Guide

### Enable Debug Logging

**Backend**:
```bash
# In Kubernetes:
kubectl set env deployment/backend \
  LOG_LEVEL=debug \
  -n personal-site

kubectl rollout restart deployment/backend -n personal-site

# Now logs will show:
# - All requests (method, path, status)
# - Database queries
# - JWT token validation
# - Error stack traces
```

**Frontend**:
```bash
# In browser console:
localStorage.setItem('DEBUG', '*')
// Reload page

// Disable:
localStorage.removeItem('DEBUG')
```

### Tail Logs in Real-Time

```bash
# Backend logs
kubectl logs -f deployment/backend -n personal-site

# Frontend logs (if logging to console)
kubectl logs -f deployment/frontend -n personal-site

# Specific pod
kubectl logs -f pod/<pod-name> -n personal-site

# Filter for errors
kubectl logs deployment/backend -n personal-site | grep -i error
```

### Interactive Debugging

```bash
# Shell into running pod
kubectl exec -it <pod-name> -n personal-site -- /bin/sh

# Inside pod:
$ npm run test             # Run tests
$ ps aux                   # See running processes
$ cat /app/logs/error.log  # View error logs
$ env | grep DATABASE_URL  # Check environment variables
```

### Network Debugging

```bash
# Test service-to-service communication
kubectl exec <frontend-pod> -n personal-site -- curl http://backend:3000/health

# DNS resolution
kubectl exec <pod> -n personal-site -- nslookup postgres

# Port scanning
kubectl exec <pod> -n personal-site -- nc -zv backend 3000

# Full packet capture (requires tcpdump)
kubectl exec <pod> -n personal-site -- tcpdump -i eth0 'port 3000'
```

---

## Performance Optimization

### Database Query Optimization

**1. Add Indexes**
```prisma
// schema.prisma
model Experience {
  // ...
  featured Boolean  // Query by featured? Add index
  @@index([featured])  // ← Add this
}

// Then migrate
npm run prisma:migrate
```

**2. Optimize Queries** (in repositories)
```typescript
// Instead of fetching all then filtering:
// Wrong: const all = await prisma.experience.findMany();
// Wrong: return all.filter(e => e.featured);

// Do filtering in database:
// Correct: Only fetch featured experiences
return prisma.experience.findMany({
  where: { featured: true },
  orderBy: { createdAt: 'desc' },
  take: 10,  // Pagination
  skip: (page - 1) * 10,
});
```

**3. Use Pagination**
```typescript
// Backend route handler
const page = parseInt(req.query.page as string) || 1;
const limit = 10;

const experiences = await repo.findAll({
  skip: (page - 1) * limit,
  take: limit,
});
```

### Application Performance

**1. Enable Caching** (Frontend)
```typescript
// TanStack Query: Cache results 5 minutes
useQuery({
  queryKey: ['experiences'],
  queryFn: fetchExperiences,
  staleTime: 5 * 60 * 1000,  // ← 5 minute cache
});
```

**2. Compress Responses** (Backend)
```typescript
// Already enabled in main server (helmet.js includes compression)
// But verify:
app.use(compression());
```

**3. CDN for Frontend** (Images, CSS, JS)
```bash
# Build frontend for CDN
npm run build:frontend

# Upload dist/ folder to CDN
# Point CNAME to CDN
```

### Resource Limits

**Set appropriate limits** (Helm values.yaml):
```yaml
backend:
  replicas: 2
  resources:
    requests:        # Guaranteed
      cpu: "250m"
      memory: "256Mi"
    limits:          # Maximum
      cpu: "500m"
      memory: "512Mi"
```

**Benefits**:
- Prevents one pod from starving others
- Kubernetes can make intelligent scheduling decisions
- Triggers scaling when needed

---

## Monitoring Checklist

### Daily Monitoring Tasks

**Every morning**:
```bash
# Check pod health
kubectl get pods -n personal-site
# All RUNNING? Any restarts?

# Check resource usage
kubectl top pods -n personal-site
# Any pods at > 80% memory/CPU?

# Check error logs
kubectl logs deployment/backend -n personal-site | grep -i error | head -20

# Check database size
kubectl exec postgres-0 -n personal-site -- \
  psql -U admin -d personal_site -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
```

### Weekly Monitoring

**Every week**:
```bash
# Review events
kubectl get events -n personal-site --sort-by='.lastTimestamp' | head -30

# Check disk usage
kubectl exec postgres-0 -n personal-site -- df -h
# Should be < 80% full

# Database backups working?
ls -lh /backups/postgres/  # Verify recent dumps exist
```

### Monthly Tasks

**Every month**:
- [ ] Rotate secrets (JWT_SECRET, DB password)
- [ ] Update Docker base images
- [ ] Review and archive old logs
- [ ] Test disaster recovery (restore from backup)
- [ ] Review uptime and SLOs
- [ ] Update runbooks based on incidents
- [ ] Capacity planning: Do we need more resources?

---

**Last Updated**: February 2026  
**Intended Audience**: DevOps engineers, SREs  
**Escalation Path**: Team Slack → On-call engineer
