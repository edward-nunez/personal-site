# Backend - Personal Site

Express.js API with **Clean Architecture** (Domain, Application, Infrastructure, Presentation layers), **PostgreSQL 18**, and **Drizzle ORM**. This is the backend package of the Personal Site monorepo.

## Purpose

- REST API for experiences, projects, blog posts, contact/consultation submissions, and admin auth
- JWT authentication and rate limiting
- Health (`/health`) and readiness (`/ready`) endpoints for deployment

## Tech Stack

- **Express 5** - HTTP framework
- **TypeScript** - Strict mode
- **Drizzle ORM** - Type-safe database access
- **PostgreSQL 18** - Database
- **Zod** - Request validation
- **Winston** - Logging
- **Jest** - Unit and integration tests

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 18+ (local or Docker)
- npm 9+

### Environment

Create `.env` in `packages/backend/` (see [GETTING_STARTED](../../docs/GETTING_STARTED.md) for full setup):

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://admin:admin123@localhost:5432/personal_site?schema=public
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Development

From the **monorepo root**:

```bash
npm install
npm run dev:backend
```

From the **backend package directory**:

```bash
cd packages/backend
npm run dev
```

API base: **http://localhost:3000**. Health: http://localhost:3000/health, Ready: http://localhost:3000/ready, API: http://localhost:3000/api.

### Database

From monorepo root:

```bash
npm run drizzle:migrate -w packages/backend
npm run drizzle:seed -w packages/backend
```

From backend directory: `npm run drizzle:migrate`, `npm run drizzle:seed`.

## Main Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (nodemon + tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm test` | Run Jest (unit + integration) |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run drizzle:migrate` | Apply migrations |
| `npm run drizzle:seed` | Seed database |
| `npm run drizzle:studio` | Open Drizzle Studio |

## Project Structure

```
src/
├── domain/           # Entities and repository interfaces
├── application/      # Use cases, DTOs, validation schemas
├── infrastructure/   # Drizzle repositories, DB service
├── presentation/     # Controllers, routes, middleware
├── shared/           # Errors, logger, config
├── configs/          # Configuration loading
├── app.ts            # Express app factory (no listen)
└── index.ts          # Server entry (listen)
tests/
├── unit/             # Use case and shared tests
└── integration/      # API tests (supertest)
drizzle/              # Migrations and seed
```

Full architecture is described in the [Architecture Guide](../../docs/ARCHITECTURE.md).

## Documentation

For full project documentation, see the [monorepo docs](../../docs/index.md):

- [Getting Started](../../docs/GETTING_STARTED.md) - Setup and first run
- [Architecture Guide](../../docs/ARCHITECTURE.md) - Clean Architecture layers
- [API Reference](../../docs/API_REFERENCE.md) - Endpoints and examples
- [Deployment](../../docs/DEPLOYMENT.md) - Docker and Helm

## Docker

Build from **repository root** (Dockerfile expects monorepo context):

```bash
docker build -t personal-site-backend:latest -f packages/backend/Dockerfile .
```

See [Deployment Guide](../../docs/DEPLOYMENT.md) for full Docker and Kubernetes instructions.
