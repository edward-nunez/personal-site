# Traefik Ingress Controller Setup Guide

## Installation

### 1. Install Traefik via Helm

```bash
# Add Traefik Helm repository
helm repo add traefik https://traefik.github.io/charts
helm repo update

# Install Traefik in its own namespace
helm install traefik traefik/traefik \
  --namespace traefik \
  --create-namespace \
  --skip-crds  # Use if Gateway API CRDs already exist (e.g., Cilium on DigitalOcean)
```

**Note:** If you encounter CRD conflicts with Gateway API CRDs (common on managed Kubernetes like DigitalOcean), use `--skip-crds` flag. The error message will indicate conflicts with `gateway.networking.k8s.io` CRDs.

### 2. Install cert-manager (for automatic TLS)

```bash
# Add cert-manager Helm repository
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true
```

### 3. Create Let's Encrypt ClusterIssuer

```bash
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com  # Change this!
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: traefik
EOF
```

### 4. Deploy Personal Site with Traefik Ingress

**IMPORTANT:** Generate secure secrets before deployment. See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#generating-production-secrets) for instructions.

```bash
# Generate JWT secret (required for production)
export JWT_SECRET=$(openssl rand -base64 64)

# Production deployment
helm install personal-site ./helm \
  -n io-edwardnunez \
  -f helm/values-prod.yaml \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=yourdomain.com \
  --set backend.secrets.jwtSecret="${JWT_SECRET}" \
  --create-namespace
```

## Traefik Features

### Automatic HTTPS
Traefik + cert-manager automatically obtains and renews Let's Encrypt certificates.

### Middleware System
The chart includes pre-configured middlewares:
- **HTTPS Redirect** - Force HTTPS
- **Security Headers** - HSTS, X-Frame-Options, etc.
- **Rate Limiting** - Protect against abuse
- **Compression** - Gzip/Brotli compression

### Dashboard Access

```bash
# Port-forward to Traefik dashboard
kubectl port-forward -n traefik $(kubectl get pods -n traefik -l app.kubernetes.io/name=traefik -o name) 9000:9000

# Access at http://localhost:9000/dashboard/
```

## Configuration Examples

### Custom Domain

Update [values-prod.yaml](values-prod.yaml):
```yaml
ingress:
  enabled: true
  hosts:
    - host: www.yourdomain.com
      paths:
        - path: /
          service: frontend
  tls:
    - secretName: personal-site-tls
      hosts:
        - www.yourdomain.com
```

### Multiple Domains

```yaml
ingress:
  hosts:
    - host: yourdomain.com
      paths:
        - path: /
          service: frontend
    - host: www.yourdomain.com
      paths:
        - path: /
          service: frontend
  tls:
    - secretName: personal-site-tls
      hosts:
        - yourdomain.com
        - www.yourdomain.com
```

### Custom Middleware

Create your own middleware:
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: custom-auth
spec:
  basicAuth:
    secret: authsecret
```

Reference in ingress:
```yaml
ingress:
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: default-custom-auth@kubernetescrd
```

## Verification

### Check Traefik Pods

```bash
kubectl get pods -n traefik
```

### Check Ingress

```bash
kubectl get ingress -n io-edwardnunez
kubectl describe ingress -n io-edwardnunez
```

### Check Middlewares

```bash
kubectl get middlewares -n io-edwardnunez
```

### Check Certificate

```bash
kubectl get certificate -n io-edwardnunez
kubectl describe certificate -n io-edwardnunez personal-site-tls
```

## Troubleshooting

### Certificate Not Issuing

```bash
# Check cert-manager logs
kubectl logs -n cert-manager deploy/cert-manager

# Check certificate status
kubectl describe certificate -n io-edwardnunez personal-site-tls

# Check challenge
kubectl get challenges -n io-edwardnunez
```

### Ingress Not Working

```bash
# Check Traefik logs
kubectl logs -n traefik -l app.kubernetes.io/name=traefik

# Verify ingress class
kubectl get ingressclass
```

### DNS Not Resolving

```bash
# Verify DNS points to Traefik LoadBalancer
kubectl get svc -n traefik traefik

# Check external IP
nslookup yourdomain.com
```

## Advanced Configuration

### Enable Access Logs

```bash
helm upgrade traefik traefik/traefik \
  --namespace traefik \
  --set logs.access.enabled=true
```

### Prometheus Metrics

```bash
helm upgrade traefik traefik/traefik \
  --namespace traefik \
  --set metrics.prometheus.enabled=true
```

### Custom Entrypoints

```bash
helm upgrade traefik traefik/traefik \
  --namespace traefik \
  --set ports.websecure.tls.certResolver=letsencrypt
```

## Benefits of Traefik

1. ✅ **Automatic HTTPS** - No manual certificate management
2. ✅ **Dynamic Configuration** - No restarts needed
3. ✅ **Cloud Native** - Kubernetes-native design
4. ✅ **Dashboard** - Beautiful UI for monitoring
5. ✅ **Middleware** - Reusable components for common tasks
6. ✅ **Performance** - Fast and resource-efficient
7. ✅ **Metrics** - Built-in Prometheus metrics
8. ✅ **Hot Reload** - Changes apply instantly

## Migration from Nginx

If migrating from nginx-ingress:

1. Install Traefik alongside nginx
2. Update ingress `className: "traefik"`
3. Convert nginx annotations to Traefik format
4. Test with `kubectl apply --dry-run`
5. Deploy and verify
6. Remove nginx-ingress when ready

## Resources

- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Traefik Helm Chart](https://github.com/traefik/traefik-helm-chart)
- [cert-manager Documentation](https://cert-manager.io/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
