# Copilot Instructions for Personal Site v2

## Architecture Overview

This is a **monorepo** using npm workspaces with three main components:
- **Backend** (`packages/backend`): Express.js API following Clean Architecture with Drizzle ORM
- **Frontend** (`packages/frontend`): React 19 + Vite SPA with TailwindCSS v4, served via HAProxy 3.3-alpine
- **FitSync** (`packages/fit-sync`): AI microservice with Ollama integration for job assessment
- **PostgreSQL**: Database with Drizzle (containerized or in Kubernetes)

### Backend Clean Architecture Layers
The backend strictly follows Clean Architecture with dependency inversion:
1. **Domain** (`src/domain/`): Entities and interfaces (no external dependencies)
2. **Application** (`src/application/`): Use cases and DTOs (depends only on Domain)
3. **Infrastructure** (`src/infrastructure/`): Database, external services (implements Domain interfaces)
4. **Presentation** (`src/presentation/`): Controllers, routes, middleware (orchestrates use cases)

**Critical**: Dependencies flow inward. Domain knows nothing about Infrastructure. Infrastructure implements Domain interfaces.

### Frontend Structure
- `src/pages/`: Page-level components
- `src/design-system/`: Design system with tokens, styles, and shared components (Button, Card, Input, etc.)
- `src/core/`: Core application infrastructure
  - `core/api/`: Axios client with interceptors (JWT auth, error handling)
  - `core/router/`: React Router v7 configuration
  - `core/providers/`: Context providers (QueryProvider, ThemeProvider, HelmetProvider)
  - `core/store/`: Zustand stores (e.g., useAuthStore)
- `src/features/`: Feature-specific code organized by domain
- `src/components/`: Shared components (common, layout)
- `src/hooks/`: Custom React hooks
- `src/utils/`: Utility functions (cn, validators, formatting)

## Development Workflows

### Running Locally
```bash
npm run dev              # Start all services (backend + frontend)
npm run dev:backend      # Backend only on port 3000
npm run dev:frontend     # Frontend only on port 5173
```

Backend uses `ts-node-dev` with hot reload. Frontend uses Vite HMR.

### Testing Strategy
- **Backend**: Jest with ts-jest for unit/integration tests. Run `npm run test:backend` or `npm test -w packages/backend`
- **Frontend**: Vitest for unit tests (`npm test -w packages/frontend`), Playwright for E2E (`npm run test:e2e -w packages/frontend`)
- **Frontend E2E UI Mode**: `npm run test:e2e:ui -w packages/frontend` or use root script `npm run test:frontend:ui`
- Coverage thresholds: 70% (branches/functions/lines/statements) enforced in backend `jest.config.js`

### Docker Development
```bash
docker-compose up -d     # Start all services (PostgreSQL, backend, frontend)
```

Services:
- Frontend: `http://localhost:5173` → HAProxy 3.3-alpine on port 80, mapped to host 5173, `VITE_API_BASE_URL=http://localhost:3000`
- Backend: `http://localhost:3000` → connects to PostgreSQL at `postgresql://admin:admin123@postgres:5432/personal_site`
- Agent: `http://localhost:3001` → connects to Ollama at `http://ollama:11434`
- PostgreSQL: `localhost:5432` (postgres:18-alpine image)
- Ollama: `localhost:11434` (ollama/ollama:latest image)

Volumes mount `src/` directories for hot reload in containers.

### Building & Deployment
```bash
npm run build            # Build all packages
npm run build:backend    # Compiles TypeScript to dist/
npm run build:frontend   # Vite build to dist/
```

**Kubernetes/Helm**: Deploy with `helm install personal-site ./helm -n io-edwardnunez --create-namespace`. See [helm/README.md](../helm/README.md) for configuration details.

### Docker Best Practices
- **Lifecycle scripts**: All Dockerfiles use `npm ci --ignore-scripts` to skip prepare/postinstall hooks (e.g., Husky git hooks)
- **Multi-stage builds**: Separate builder and runtime stages to minimize image size
- **Frontend architecture**: HAProxy 3.3-alpine handles reverse proxy with security headers, busybox httpd serves static files on localhost:8080
- **Security**: HAProxy chosen over nginx/Caddy due to superior security track record and minimal CVE exposure

## Code Conventions

### TypeScript Configuration
- **Backend**: ES2020 modules (`"type": "module"` in package.json), strict mode enabled. Uses `.js` extension in imports (ESM requirement)
- **Frontend**: React 19 with Vite, ES2020 modules, path alias `@/` maps to `src/`
- Both enforce `noImplicitAny`, `strictNullChecks`, `noUnusedLocals/Parameters`

### ESLint Rules
- `@typescript-eslint/no-explicit-any: error` - No `any` types allowed
- `@typescript-eslint/no-unused-vars: error` - Prefix unused params with `_` (e.g., `_req`)
- Frontend: `react/react-in-jsx-scope: off` (React 19 automatic JSX transform)

### Code Comments
Follow DRY principles when commenting code:
- **Code shows HOW it works** — Comments must explain **WHY** it works (business logic, intent, architectural decisions)
- **Avoid redundant comments** — Don't restate what the code already clearly states
- **Document non-obvious decisions** — Explain trade-offs, performance considerations, or workarounds
- **Exception**: API endpoints receive exception — document both HOW and WHY for clarity and developer experience

**Example - Good**:
```typescript
// We use error pooling here because retrying transient DB failures improves resilience
// without adding significant latency for 90% of requests
const maxRetries = 3;
```

**Example - Avoid**:
```typescript
// Set maxRetries to 3
const maxRetries = 3; // ❌ Code already shows this
```

### Naming Patterns
- **Backend layers**: Strict file naming conventions
  - Entities: `src/domain/entities/[EntityName].ts` (PascalCase)
  - Interfaces: `src/domain/interfaces/I[EntityName]Repository.ts`
  - Use cases: `src/application/use-cases/[entity]/[Action][Entity].usecase.ts` (e.g., `CreateExperience.usecase.ts`)
  - Repositories: `src/infrastructure/repositories/Prisma[Entity]Repository.ts` (implements domain interface)
  - Controllers: `src/presentation/controllers/[entity].controller.ts` (lowercase)
  - DTOs: `src/application/dtos/[entity].dto.ts` (Zod schemas)
- **Frontend**: lowercase with dashes for directories, PascalCase for component files

### Git Hooks (Husky + lint-staged)
Pre-commit automatically runs:
- ESLint with `--fix` on staged `.ts`/`.tsx` files
- Prettier with `--write` on staged files
Setup with `npm install` (runs `prepare` script).

## Environment Variables

### Backend
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: development/production
- `DATABASE_URL`: PostgreSQL connection string (format: `postgresql://user:pass@host:port/db?schema=public`)
- `CORS_ORIGIN`: Allowed CORS origin (default: `http://localhost:5173`)
- `JWT_SECRET`: JWT signing secret (change in production!)
- `JWT_EXPIRES_IN`: Token expiration (default: 7d)

### Frontend
- `VITE_API_BASE_URL`: Backend API base URL (e.g., `http://localhost:3000`)

Use `.env` files in respective package directories. See `docker-compose.yml` for reference values.

## Key Files Reference

- **Monorepo root**: [package.json](../package.json) defines workspace scripts
- **Backend entry**: [packages/backend/src/index.ts](../packages/backend/src/index.ts) - Express server setup
- **Frontend entry**: [packages/frontend/src/main.tsx](../packages/frontend/src/main.tsx) - React app root
- **Docker compose**: [docker-compose.yml](../docker-compose.yml) - Full local stack
- **Helm chart**: [helm/values.yaml](../helm/values.yaml) - K8s deployment config
- **Backend Dockerfile**: [packages/backend/Dockerfile](../packages/backend/Dockerfile) - Multi-stage build with npm workspaces
- **Frontend Dockerfile**: [packages/frontend/Dockerfile](../packages/frontend/Dockerfile) - Multi-stage with HAProxy 3.3-alpine + busybox httpd

## Key Architectural Patterns

### Backend Clean Architecture Flow
1. **Controller** receives HTTP request, validates params/query
2. Instantiates **Repository** (e.g., `new PrismaExperienceRepository()`)
3. Instantiates **Use Case** with repository dependency injection
4. Use Case executes business logic via repository interface
5. Controller returns standardized JSON response

**Example from ExperienceController**:
```typescript
const repository = new PrismaExperienceRepository();
const useCase = new GetAllExperiencesUseCase(repository);
const experiences = await useCase.execute(options);
res.json({ success: true, data: experiences });
```

### Frontend Data Fetching
- **TanStack Query** for server state management
- API client (`core/api/client.ts`) handles auth tokens automatically via interceptors
- Query keys centralized in `core/api/keys.ts`
- Form validation with **react-hook-form** + **Zod resolvers**

### Error Handling
- Backend: Custom error classes (NotFoundError, ValidationError, UnauthorizedError) extend AppError
- Global `errorHandler` middleware catches all errors, formats responses, logs with Winston
- Zod validation errors automatically formatted with field-level messages
- Frontend: Axios interceptor catches 401, triggers logout; uses `sonner` for toast notifications

### Validation Pattern
- DTOs defined with Zod schemas in `application/dtos/`
- Validated in controllers before passing to use cases:
```typescript
const validatedData = CreateExperienceSchema.parse(req.body);
```

## Integration Points

- **Frontend → Backend**: Axios client in `src/core/api/client.ts` with request/response interceptors for JWT auth
- **Backend → PostgreSQL**: Prisma Client ORM (uses `PrismaService` singleton from `infrastructure/persistence/prisma.config.js`)
- **Backend health checks**: `/health` (simple status) and `/ready` (includes DB connectivity check)
- **API responses**: Standard format `{ success: true, data: ... }` or `{ success: false, error: ... }`
- **Authentication**: JWT tokens in Authorization header (`Bearer <token>`), managed by `authMiddleware` and axios interceptors
- **Rate limiting**: Different limits for API routes (`/api`), forms, and auth endpoints using express-rate-limit

## Common Tasks

### Adding a New Backend Feature
1. **Define entity** in `src/domain/entities/[Entity].ts`
   - Export TypeScript interface and input types
2. **Create repository interface** in `src/domain/interfaces/I[Entity]Repository.ts`
3. **Implement Prisma repository** in `src/infrastructure/repositories/Prisma[Entity]Repository.ts`
   - Must implement the domain interface
4. **Create use cases** in `src/application/use-cases/[entity]/`
   - Follow naming: `GetAll[Entity].usecase.ts`, `Create[Entity].usecase.ts`, etc.
   - Inject repository via constructor
5. **Define DTO schemas** in `src/application/dtos/[entity].dto.ts` using Zod
6. **Add controller** in `src/presentation/controllers/[entity].controller.ts`
   - Instantiate repository and use cases per method
   - Validate with Zod schemas before use case execution
7. **Register routes** in `src/presentation/routes/[entity].routes.ts`
   - Apply `authMiddleware` for protected routes
   - Register in `src/routes/index.ts`

### Adding a New Frontend Page
1. Create page component in `src/pages/[PageName]/`
2. Add route in `src/core/router/routes.tsx`
3. Create API hooks using TanStack Query in `src/core/api/` or feature-specific location
4. Use design system components from `src/design-system/components/`
5. Add E2E test in `tests/e2e/[page-name].spec.ts`

### Working with Prisma
```bash
npm run prisma:generate -w packages/backend  # Generate Prisma Client
npm run prisma:migrate -w packages/backend   # Create migration
npm run prisma:push -w packages/backend      # Push schema without migration
npm run prisma:studio -w packages/backend    # Open Prisma Studio GUI
```

### Debugging
- **Backend**: Logs written to `packages/backend/logs/` via Winston (error.log, combined.log)
- **Frontend**: React DevTools + Vite HMR with source maps
- **Docker**: `docker-compose logs -f [service]` or `docker-compose logs -f backend postgres`
- **Database**: Use Prisma Studio or connect directly to PostgreSQL on port 5432
