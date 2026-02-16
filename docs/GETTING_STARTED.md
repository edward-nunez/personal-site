# Getting Started with Personal Site v2

This guide will help you set up your development environment and get the application running locally. Choose the setup method that works best for your workflow.

**Table of Contents**
- [System Requirements](#system-requirements)
- [Local Development Setup](#local-development-setup)
- [Docker Setup](#docker-setup)
- [Frontend Theme & Styling](#frontend-theme--styling)
- [Verify Installation](#verify-installation)
- [First Steps](#first-steps)
- [Troubleshooting](#troubleshooting)

---

## System Requirements

### All Environments
- **Node.js**: 18.x or higher (verify with `node --version`)
- **npm**: 9.x or higher (verify with `npm --version`)
- **Git**: Latest version

### Local Development (without Docker)
- **PostgreSQL**: 18+ running locally
- **Environment files**: `.env` in both `packages/backend` and `packages/frontend`

### Docker Environment
- **Docker Desktop**: Latest version
- **Docker Compose**: 2.0+

---

## Local Development Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/personal-site-v2.git
cd personal-site-v2

# Install dependencies (monorepo root uses npm workspaces)
npm install
```

### Step 2: Configure Environment Variables

Create `.env` files in both packages with the correct values.

**Backend** - `packages/backend/.env`
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://admin:admin123@localhost:5432/personal_site?schema=public

# CORS
CORS_ORIGIN=http://localhost:5173

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

**Frontend** - `packages/frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Step 3: Set Up Database

```bash
# Generate Drizzle migrations
npm run drizzle:generate -w packages/backend

# Apply migrations (creates tables)
npm run drizzle:migrate -w packages/backend

# (Optional) Seed database with sample data
npm run drizzle:seed -w packages/backend
```

### Step 4: Start Development Servers

You can run both servers simultaneously in one command:

```bash
# Terminal 1: Start both backend and frontend
npm run dev

# Or run them separately in different terminals:
# Terminal 2: Backend only (port 3000)
npm run dev:backend

# Terminal 3: Frontend only (port 5173)
npm run dev:frontend
```

Frontend supports **hot reload** via Vite:
- **Frontend**: Changes to [`packages/frontend/src/**`](../packages/frontend/src) auto-reload via Vite HMR

**Note**: Backend requires manual restart after code changes

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health
- **Readiness Check**: http://localhost:3000/ready

---

## Docker Setup

### Quick Start (Recommended for new developers)

```bash
# Start all services (PostgreSQL, backend, frontend)
docker-compose up -d

# Verify services are running
docker-compose ps

# View logs (useful for debugging)
docker-compose logs -f           # All services
docker-compose logs -f backend   # Backend only
docker-compose logs -f postgres  # Database only
```

### Service URLs (Docker)
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **PostgreSQL** (direct): localhost:5432

### Useful Docker Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (full reset)
docker-compose down -v

# Rebuild without using cache
docker-compose up -d --build

# Drop into backend container shell
docker exec -it personal-site-v2-backend-1 /bin/sh

# Check backend logs
docker-compose logs -f backend --tail 100

# View database via Drizzle Studio (from backend service)
docker exec -it personal-site-v2-backend-1 npm run drizzle:studio
```

### Database Reset in Docker

```bash
# If you need to reset the database:
docker-compose down -v          # Remove volume (loses data)
docker-compose up -d postgres   # Start fresh PostgreSQL
docker-compose logs postgres    # Wait until "database system is ready"
docker-compose up -d            # Start other services
```

---

## Frontend Theme & Styling

### Theme System Overview

The frontend uses a **CSS-based design token system** with **class-based dark mode**:

- **Light Mode** (Default): CSS variables in `:root`
- **Dark Mode**: CSS variables overridden in `.dark` class (toggled on `<html>` element)
- **Toggle**: Saved to `localStorage` via Zustand store
- **Tailwind**: v4 with `@custom-variant` for `.dark` class support

### Design Tokens

All theme colors are defined in `packages/frontend/src/design-system/styles/globals.css`:

**Light Mode** (`:root`):
```css
--color-bg: #FFFFFF;
--color-fg: #111827;           /* Near-black text */
--color-fg-secondary: #4B5563; /* Dark gray */
--color-bg-tertiary: #F3F4F6;  /* Light gray for inputs */
```

**Dark Mode** (`.dark`):
```css
--color-bg: #0A0A0A;
--color-fg: #FAFAFA;           /* Near-white text */
--color-fg-secondary: #A1A1A1; /* Light gray */
--color-bg-tertiary: #1A1A1A;  /* Dark gray for inputs */
```

### Input Fields in Dark Mode

Inputs automatically get a **light background with dark text** in dark mode for readability:
```css
.dark input,
.dark textarea,
.dark select {
  background-color: #F3F4F6;  /* Light gray background */
  color: #111827;              /* Black text */
}
```

Icons inside inputs use the `.input-icon` class for consistent dark color in dark mode.

### Common Tailwind Classes

Use these theme-aware classes throughout the app:

| Class | Light | Dark |
|-------|-------|------|
| `text-fg` | #111827 | #FAFAFA |
| `text-fg-secondary` | #4B5563 | #A1A1A1 |
| `bg-bg` | #FFFFFF | #0A0A0A |
| `border-border` | #E5E7EB | #262626 |

**No need for `dark:` prefix** — CSS variables handle the switching automatically.

### Modal Backdrop

Modals use different backdrops for each mode:
- **Light Mode**: `bg-white/80` (white wash) so black elements contrast with page background
- **Dark Mode**: `bg-black/80` (dark overlay) for traditional modal appearance

### Testing Dark Mode Locally

```bash
# Open DevTools Console in browser and run:
# Toggle dark mode
document.documentElement.classList.toggle('dark');

# Or programmatically
document.documentElement.classList.add('dark');      # Enable
document.documentElement.classList.remove('dark');   # Disable
```

---

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health
# Expected response: { "status": "ok" }

# Backend readiness (includes database check)
curl http://localhost:3000/ready
# Expected response: { "status": "ready", "database": "connected" }

# Frontend health (check if page loads)
open http://localhost:5173
# You should see the React app loaded
```

### Test the API

```bash
# Get all experiences (public endpoint)
curl http://localhost:3000/api/experiences

# Expected response:
# {
#   "success": true,
#   "data": [...]
# }
```

If you get a 200 response with valid JSON, everything is working! ✅

---

## First Steps

### 1. Explore the Codebase

Start by reading these docs in order:
1. [Architecture Guide](./ARCHITECTURE.md) - Understand the structure
2. [API Reference](./API_REFERENCE.md) - See what endpoints exist
3. [Feature Development Guide](./FEATURE_DEVELOPMENT.md) - Learn how to add features

### 2. Run Tests

```bash
# Backend tests
npm run test:backend

# Frontend tests
npm run test:frontend

# Frontend E2E tests
npm run test:e2e -w packages/frontend
```

### 3. Try Making a Change

1. Open the frontend in your browser (http://localhost:5173)
2. Edit `packages/frontend/src/App.tsx`
3. Save the file and watch the app update automatically (hot reload)

### 4. Authenticate (Admin-only features)

To test protected endpoints, you'll need a JWT token:

```bash
# Login to get a token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'

# Response includes: { "token": "eyJ..." }

# Use token in subsequent requests
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJ..."
```

---

## Troubleshooting

### "Port 3000 is already in use"

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or specify a different PORT in .env
PORT=3001 npm run dev:backend
```

### "Cannot find module" or TypeScript errors

```bash
# Rebuild TypeScript
npm run build

# Or regenerate Drizzle types/migrations
npm run drizzle:generate -w packages/backend
```

### Database connection failed

**Local Dev** - Ensure PostgreSQL is running:
```bash
# macOS (Homebrew)
brew services start postgresql

# Linux (systemd)
sudo systemctl start postgresql

# Windows
# Start PostgreSQL via Services or PostgreSQL shell: pg_ctl -D "C:\Program Files\PostgreSQL\data" start
```

**Docker** - Check PostgreSQL container health:
```bash
docker-compose logs postgres
docker-compose ps  # Check STATUS

# If postgres fails to start, reset:
docker-compose down -v
docker-compose up -d postgres
docker-compose logs postgres  # Watch startup logs
```

### "DATABASE_URL not found" error

Make sure `.env` file exists in `packages/backend/` with `DATABASE_URL` set.

```bash
# Check file exists
cd packages/backend
ls -la .env  # Should list the .env file

# Verify contents (don't commit this!)
cat .env    # Should show DATABASE_URL
```

### Drizzle migration fails

```bash
# Manually push schema (applies to database)
npm run drizzle:push -w packages/backend

# View migrations
ls packages/backend/drizzle/migrations/
```

### Hot reload isn't working

**Backend**: Verify `packages/backend/src/**` files are being modified
- Check file watcher limit on Linux: `ulimit -n` (should be > 1000)

**Frontend**: Clear Vite cache and restart
```bash
rm -rf packages/frontend/node_modules/.vite
npm run dev:frontend
```

### Tests fail randomly

```bash
# Clear Jest cache
npm run test:backend -- --clearCache

# Or start fresh
rm -rf packages/backend/node_modules
npm install
npm run test:backend
```

---

## Next Steps

✅ **Once you're up and running:**
- Read [Architecture Guide](./ARCHITECTURE.md) to understand the codebase organization
- Check [Feature Development Guide](./FEATURE_DEVELOPMENT.md) to see how to add new features
- Review [API Reference](./API_REFERENCE.md) for available endpoints

**Stuck?** Ask the team on the project Slack channel or check [OPERATIONS.md](./OPERATIONS.md) for debugging tips.

---

**Last Updated**: February 16, 2026 - Phase 2 Complete with Theme/Styling Refinements
