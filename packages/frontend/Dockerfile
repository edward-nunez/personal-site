# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files (monorepo root + frontend workspace)
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies (skip lifecycle scripts like husky)
RUN npm ci --workspace=packages/frontend --ignore-scripts

# Copy frontend source and config
COPY packages/frontend ./packages/frontend

# Build the app
RUN npm run build -w packages/frontend

# Production stage: HAProxy 3.3 Alpine
FROM haproxy:3.3-alpine

# Install busybox-extras for httpd (run as root)
USER root
RUN apk add --no-cache busybox-extras

# Copy HAProxy configuration
COPY packages/frontend/haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
COPY packages/frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy built frontend assets from builder
COPY --from=builder /app/packages/frontend/dist /srv

# Make /srv writable for the Kubernetes-enforced UID (fsGroup: 1000)
# Note: Kubernetes security context will run container with runAsUser: 1000,
# so we need group-writable permissions to allow that UID to write runtime-config.js
RUN chown -R root:root /srv && chmod -R 775 /srv

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/health || exit 1

# Start busybox httpd on port 8081 and HAProxy in foreground
CMD ["/docker-entrypoint.sh"]
