# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files (monorepo root + frontend workspace)
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN npm ci --workspace=packages/frontend

# Copy frontend source and config
COPY packages/frontend ./packages/frontend

# Build the app
RUN npm run build -w packages/frontend

# Production stage: serve static files with nginx
FROM nginx:alpine

# SPA: fallback to index.html for client-side routing
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        access_log off; \
        return 200 "OK"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
