# Secret Management Guide

This guide covers best practices for managing secrets in the personal-site Kubernetes deployment.

## Table of Contents

1. [Overview](#overview)
2. [Secret Architecture](#secret-architecture)
3. [Creating Image Pull Secrets](#creating-image-pull-secrets)
4. [Managing Deployment Secrets](#managing-deployment-secrets)
5. [Secret Rotation Best Practices](#secret-rotation-best-practices)
6. [Troubleshooting](#troubleshooting)

## Overview

Secrets in the personal-site deployment are managed through Kubernetes native Secret objects. The Helm chart creates multiple focused Secret resources following the **DRY (Don't Repeat Yourself)** principle:

- `{release}-db-credentials`: Database connection credentials and connection string
- `{release}-app-secrets`: Application-specific secrets (JWT, CORS origins)
- `{release}-image-pull-secret`: Container registry authentication

**Security Principles Applied:**
- Secrets never stored in version control
- Secrets passed at deployment time via `--set` flags or external secret management
- Non-root container users for defense-in-depth
- Principle of least privilege for secret access

## Secret Architecture

### Database Credentials Secret

**Name:** `{release}-db-credentials`

**Contains:**
- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password
- `POSTGRES_DB`: Database name (for internal deployments)
- `DATABASE_URL`: Full connection string (format: `postgresql://user:pass@host:5432/db?schema=public`)

**Used by:**
- PostgreSQL initialization (when `postgresql.enabled: true`)
- Backend service (environment injection)
- FitSync service (if database access needed)

### Application Secrets

**Name:** `{release}-app-secrets`

**Contains:**
- `JWT_SECRET`: Token signing secret (64+ bytes for production)
- `JWT_EXPIRES_IN`: Token expiration (e.g., "7d", "24h")
- `BACKEND_CORS_ORIGIN`: Allowed CORS origins for backend (can be multiple separated by commas)
- `FITSYNC_CORS_ORIGIN`: Allowed CORS origins for FitSync service

**Used by:**
- Backend service
- FitSync service

### Image Pull Secret

**Name:** `{release}-image-pull-secret`

**Contains:**
- Registry credentials for authenticating with container registries (ghcr.io, Docker Hub, etc.)
- Used by all Pods when pulling container images

## Creating Image Pull Secrets

### For GitHub Container Registry (ghcr.io)

#### Step 1: Generate GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Set the following scopes:
   - `read:packages` - Read container images
   - `write:packages` - Push/update container images
4. Copy the generated token (you won't see it again!)

#### Step 2: Deploy with Image Pull Secret

```bash
# Option A: Using Helm --set flags
helm install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set imagePullSecrets.enabled=true \
  --set imagePullSecrets.username=edward-nunez \
  --set imagePullSecrets.password=ghp_xxxxxxxxxxxxxxxxxxxx \
  --set imagePullSecrets.email=your-email@example.com \
  --create-namespace

# Option B: Using environment variables
export GITHUB_USERNAME=edward-nunez
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
helm install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set imagePullSecrets.enabled=true \
  --set imagePullSecrets.username=$GITHUB_USERNAME \
  --set imagePullSecrets.password=$GITHUB_TOKEN \
  --create-namespace
```

#### Step 3: Verify Secret Creation

```bash
# Check secret exists
kubectl get secrets -n io-edwardnunez | grep image-pull

# Inspect secret (base64 encoded)
kubectl describe secret personal-site-image-pull-secret -n io-edwardnunez
```

### Pre-existing Secret Reference

If you've already created an image pull secret manually:

```bash
# Reference existing secret instead of having Helm create it
helm install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set 'imagePullSecrets.secretRef.name=my-ghcr-secret'
```

## Managing Deployment Secrets

### Generating Secure Secrets

#### JWT Secret (64 bytes recommended)

```bash
# Using OpenSSL
openssl rand -base64 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

# On Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(64))
```

Example JWT Secret (always generate a new one):
```
ZyV7mhz3d9QAHIdyxJKMvXe1WYA4RH6mhDEXX4oN7f0+hyTYvvzRMhBU4rcnk26cc4P3RcilY171OMHF0+eSxA==
```

### Securely Passing Secrets During Deployment

#### Using Helm --set Flags

```bash
# Single secret
helm install personal-site ./helm \
  --set backend.secrets.jwtSecret='your-generated-jwt-secret' \
  --set backend.secrets.corsOrigin='https://edwardnunez.io'

# Multiple secrets
helm install personal-site ./helm \
  -f helm/values-prod.yaml \
  --set backend.secrets.jwtSecret='...' \
  --set backend.secrets.corsOrigin='https://edwardnunez.io' \
  --set fitSync.secrets.corsOrigin='https://api.edwardnunez.io' \
  --set postgresql.auth.password='your-secure-password'
```

#### Using Environment Variables (More Secure)

```bash
# Set variables
export JWT_SECRET=$(openssl rand -base64 64)
export DB_PASSWORD=$(openssl rand -base64 32)
export CORS_ORIGIN="https://edwardnunez.io"

# Deploy
helm install personal-site ./helm \
  -f helm/values-prod.yaml \
  --set "backend.secrets.jwtSecret=$JWT_SECRET" \
  --set "backend.secrets.corsOrigin=$CORS_ORIGIN" \
  --set "postgresql.auth.password=$DB_PASSWORD"
```

#### Using Values File (For Non-Sensitive Data Only)

```bash
# Create helm/secrets.yaml with secret values
cat << EOF > helm/secrets.yaml
backend:
  secrets:
    jwtSecret: 'your-jwt-secret'
    corsOrigin: 'https://edwardnunez.io'
postgresql:
  auth:
    password: 'your-password'
EOF

# Deploy with values file
helm install personal-site ./helm \
  -f helm/values-prod.yaml \
  -f helm/secrets.yaml

# IMPORTANT: Add to .gitignore
echo 'helm/secrets.yaml' >> .gitignore
```

### Pre-Deployment Validation

Validate secrets before deployment:

```bash
# Validate production secrets
bash helm/validate-secrets.sh prod

# Example output:
# 🔍 Validating secrets for 'prod' environment...
# ✅ backend.secrets.jwtSecret is configured
# ✅ backend.secrets.corsOrigin is configured
# ✅ postgresql.auth.password is configured
# ✅ All required secrets are properly configured!
```

## Secret Rotation Best Practices

### JWT Secret Rotation

JWT secrets should be rotated periodically. Follow this process:

#### Step 1: Generate New Secret

```bash
NEW_JWT_SECRET=$(openssl rand -base64 64)
echo "New JWT Secret: $NEW_JWT_SECRET"
```

#### Step 2: Upgrade Deployment with New Secret

```bash
# Upgrade with new JWT secret
helm upgrade personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set "backend.secrets.jwtSecret=$NEW_JWT_SECRET"
```

#### Step 3: Verify Rollout

```bash
# Watch rollout progress
kubectl rollout status deployment/personal-site-backend -n io-edwardnunez

# Verify secret updated in pod
kubectl exec -it personal-site-backend-xxxxx -n io-edwardnunez -- \
  sh -c 'echo $JWT_SECRET'
```

**Impact on Existing Tokens:**
- Existing JWT tokens remain valid until their `jwtExpiresIn` expiration
- New tokens issued after rotation use the new secret
- Clients with existing tokens continue to work until expiration
- Consider shortening `jwtExpiresIn` before rotating for faster convergence

### Database Password Rotation

For managed databases (recommended for production), rotate through your cloud provider console. For in-cluster PostgreSQL:

```bash
# Generate new password
NEW_DB_PASSWORD=$(openssl rand -base64 32)

# Upgrade deployment
helm upgrade personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set "postgresql.auth.password=$NEW_DB_PASSWORD"

# Note: This will restart PostgreSQL and require database recreation
# For production, use managed database service with built-in rotation
```

### Image Pull Secret Rotation

When GitHub token expires or needs rotation:

```bash
# Generate new GitHub Personal Access Token (see above)

# Update secret in cluster
helm upgrade personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set imagePullSecrets.enabled=true \
  --set imagePullSecrets.username=edward-nunez \
  --set imagePullSecrets.password=ghp_new_token_here

# Existing pods can still pull images from cache
# New pods will use new credentials
```

### Rotation Schedule Recommendations

- **JWT Secret**: Every 90 days or on team member departure
- **Database Password**: Every 180 days (or per company policy)
- **Image Pull Secrets**: When tokens expire or annually
- **CORS Origins**: When domain changes or new domains added

### Recommended Architecture

```
Development:            Production:
├── Local images        ├── GitHub Container Registry (ghcr.io)
│   (Never uploaded)    └── Private images
└── imagePullPolicy:    └── imagePullPolicy:
    Never                   IfNotPresent
```

## Troubleshooting

### Pod Cannot Pull Image

**Symptom:** `ImagePullBackOff` error

**Solutions:**

```bash
# Check image pull secret exists
kubectl get secrets -n io-edwardnunez

# Verify pod has imagePullSecrets configured
kubectl get pod <pod-name> -n io-edwardnunez -o yaml | grep -A 10 imagePullSecrets

# Check image exists in registry
docker pull ghcr.io/edward-nunez/personal-site/backend:1.0.0

# Describe pod for detailed error
kubectl describe pod <pod-name> -n io-edwardnunez
```

### Secret Not Injected into Pod

**Symptom:** Environment variable not set in pod: `echo $JWT_SECRET` is empty

**Solutions:**

```bash
# Verify secret exists
kubectl get secret personal-site-app-secrets -n io-edwardnunez

# Check secret contains expected keys
kubectl describe secret personal-site-app-secrets -n io-edwardnunez

# Verify deployment references correct secret
kubectl get deployment personal-site-backend -n io-edwardnunez -o yaml | grep -i secret

# Restart pod to apply secret changes
kubectl rollout restart deployment/personal-site-backend -n io-edwardnunez
```

### Authentication Failed for Registry

**Symptom:** Error: `unauthorized: authentication required`

**Solutions:**

```bash
# Verify image pull secret credentials
kubectl get secret personal-site-image-pull-secret -n io-edwardnunez -o yaml | grep .dockercfg

# Decode and inspect (base64 encoded)
kubectl get secret personal-site-image-pull-secret -n io-edwardnunez -o jsonpath='{.data.\.dockercfg}' | base64 -d | jq .

# Test credentials locally
docker login -u $GITHUB_USERNAME -p $GITHUB_TOKEN ghcr.io
docker pull ghcr.io/edward-nunez/personal-site/backend:1.0.0

# Update secret with new credentials
helm upgrade personal-site ./helm \
  -n io-edwardnunez \
  --set imagePullSecrets.enabled=true \
  --set imagePullSecrets.password=<new-token>
```

### Secrets in Pod Environment Showing Plaintext

**Symptom:** Running `env` in pod shows secret values

**This is expected behavior.** Kubernetes Secrets are base64 encoded at rest and decrypted when mounted as environment variables.

**Mitigation:**

1. Implement Pod Security Policies to restrict `exec` access
2. Use RBAC to limit who can view Pods
3. Consider External Secrets Operator for additional encryption
4. Enable Kubernetes etcd encryption at rest (verify with your cluster provider)

```bash
# Check who can read secrets
kubectl get rolebindings,clusterrolebindings --all-namespaces -o json | \
  jq '.items[] | select(.roleRef.name == "admin") | .metadata.name'
```

## Quick Reference

### Common Commands

```bash
# View all secrets
kubectl get secrets -n io-edwardnunez

# View secret keys (without values)
kubectl get secret personal-site-app-secrets -n io-edwardnunez -o jsonpath='{.data.*}' | keys

# Update a secret
kubectl create secret generic personal-site-app-secrets \
  --from-literal=JWT_SECRET='new-value' \
  --dry-run=client -o yaml | kubectl apply -f -

# Delete a secret
kubectl delete secret personal-site-app-secrets -n io-edwardnunez

# Validate secrets before deployment
bash helm/validate-secrets.sh prod
```

## Security Checklist

- [ ] All secrets generated with cryptographically secure random sources
- [ ] Secrets passed via environment variables, not hardcoded
- [ ] helm/secrets.yaml in .gitignore
- [ ] Image pull secrets configured for private registries
- [ ] JWT secrets rotated every 90 days
- [ ] Database passwords rotated every 180 days
- [ ] RBAC policies restrict secret access
- [ ] Audit logging enables in Kubernetes for secret access
- [ ] Pods running as non-root users
- [ ] Pre-deployment validation script passes

## Additional Resources

- [Kubernetes Secret Best Practices](https://kubernetes.io/docs/concepts/configuration/secret/#best-practices)
- [OWASP Secret Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Container Registry Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [cert-manager for TLS Certificates](https://cert-manager.io/)
