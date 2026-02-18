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

# Switch to root for installation
USER root

# Install busybox-extras for httpd (lightweight static file server)
RUN apk add --no-cache busybox-extras

# Copy HAProxy configuration
COPY packages/frontend/haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

# Copy built frontend assets from builder
COPY --from=builder /app/packages/frontend/dist /srv

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O- http://localhost/health || exit 1

# Start busybox httpd on port 8080 and HAProxy in foreground
CMD ["/bin/sh", "-c", "httpd -f -p 8080 -h /srv & haproxy -db -f /usr/local/etc/haproxy/haproxy.cfg"]
