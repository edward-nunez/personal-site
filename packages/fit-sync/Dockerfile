# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/fit-sync/package*.json ./packages/fit-sync/

# Install dependencies (skip lifecycle scripts like husky)
RUN npm ci --workspace=packages/fit-sync --ignore-scripts

# Copy source code
COPY packages/fit-sync/src ./packages/fit-sync/src
COPY packages/fit-sync/tsconfig.json ./packages/fit-sync/

# Build TypeScript
RUN npm run build -w packages/fit-sync

# Production stage
FROM node:24-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S fit-sync && adduser -S fit-sync -u 1001

# Copy package files and install production dependencies only
COPY package*.json ./
COPY packages/fit-sync/package*.json ./packages/fit-sync/

# Install production dependencies (skip lifecycle scripts)
RUN npm ci --workspace=packages/fit-sync --omit=dev --ignore-scripts

# Copy built application from builder
COPY --from=builder /app/packages/fit-sync/dist ./packages/fit-sync/dist

# Set correct ownership
RUN chown -R fit-sync:fit-sync /app

# Switch to non-root user
USER fit-sync

# Expose port
EXPOSE 3001

# Health check (using wget for faster execution)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start application
CMD ["npm", "start", "-w", "packages/fit-sync"]
