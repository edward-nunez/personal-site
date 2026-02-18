# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Install dependencies
ENV HUSKY=0
RUN npm ci --workspace=packages/backend

# Copy source code
COPY packages/backend/src ./packages/backend/src
COPY packages/backend/tsconfig.json ./packages/backend/

# Copy Drizzle config and migrations
COPY packages/backend/drizzle.config.ts ./packages/backend/
COPY packages/backend/drizzle ./packages/backend/drizzle

# Build TypeScript
RUN npm run build -w packages/backend

# Production stage
FROM node:24-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Skip prepare script (husky) in production
ENV HUSKY=0
RUN npm ci --workspace=packages/backend --omit=dev --loglevel=verbose || npm ci --workspace=packages/backend --omit=dev --force || true

# Copy built application from builder
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/drizzle ./packages/backend/drizzle

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start", "-w", "packages/backend"]
