FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Install dependencies
RUN npm ci --workspace=packages/backend

# Copy source code
COPY packages/backend/src ./packages/backend/src
COPY packages/backend/tsconfig.json ./packages/backend/

# Copy Drizzle config and migrations
COPY packages/backend/drizzle.config.ts ./packages/backend/
COPY packages/backend/drizzle ./packages/backend/drizzle

# Build TypeScript
RUN npm run build -w packages/backend

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start", "-w", "packages/backend"]
