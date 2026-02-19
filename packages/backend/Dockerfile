# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Install dependencies (skip lifecycle scripts like husky)
RUN npm ci --workspace=packages/backend --ignore-scripts

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

# Create non-root user for security
RUN addgroup -g 1001 -S backend && adduser -S backend -u 1001

# Copy package files and install production dependencies only
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Install production dependencies (skip lifecycle scripts)
RUN npm ci --workspace=packages/backend --omit=dev --ignore-scripts

# Copy built application from builder
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/drizzle ./packages/backend/drizzle

# Create writable log directories and set ownership for runtime user
RUN mkdir -p /app/logs /app/packages/backend/logs \
  && chown -R backend:backend /app

# Switch to non-root user
USER backend

# Expose port
EXPOSE 3000

# Health check (using wget for faster execution)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start", "-w", "packages/backend"]
