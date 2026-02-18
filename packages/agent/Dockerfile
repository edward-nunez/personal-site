# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/agent/package*.json ./packages/agent/

# Install dependencies
ENV HUSKY=0
RUN npm ci --workspace=packages/agent

# Copy source code
COPY packages/agent/src ./packages/agent/src
COPY packages/agent/tsconfig.json ./packages/agent/

# Build TypeScript
RUN npm run build -w packages/agent

# Production stage
FROM node:24-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
COPY packages/agent/package*.json ./packages/agent/

# Skip prepare script (husky) in production
ENV HUSKY=0
RUN npm ci --workspace=packages/agent --omit=dev --loglevel=verbose ||  npm ci --workspace=packages/agent --omit=dev --force || true

# Copy built application from builder
COPY --from=builder /app/packages/agent/dist ./packages/agent/dist

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start", "-w", "packages/agent"]
