# Personal Site v2

A modern monorepo featuring a **React frontend**, **Express.js backend** with **Clean Architecture**, **PostgreSQL database**, and **Kubernetes deployment** via Helm.

> 📚 **All documentation is in the [`docs/` folder](./docs/index.md)**. Start there!

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Docker & Docker Compose (optional, for containerized development)

### Get Running in 3 Steps

```bash
# 1. Install dependencies
npm install

# 2. Start all services (backend + frontend)
npm run dev

# 3. Open in browser
# Frontend: http://localhost:8080
# Backend API: http://localhost:3000/api
```

**First time?** → See [Getting Started Guide](./docs/GETTING_STARTED.md)

---

## 📖 Documentation

This project has **comprehensive documentation** for every audience:

| I'm a... | Start here |
|----------|-----------|
| **New developer** | [Getting Started](./docs/GETTING_STARTED.md) → [Architecture Guide](./docs/ARCHITECTURE.md) |
| **Backend engineer** | [Architecture Guide](./docs/ARCHITECTURE.md) → [Feature Development](./docs/FEATURE_DEVELOPMENT.md) |
| **Frontend engineer** | [API Reference](./docs/API_REFERENCE.md) → [Feature Development](./docs/FEATURE_DEVELOPMENT.md) |
| **DevOps/Infrastructure** | [Deployment Guide](./docs/DEPLOYMENT.md) → [Operations Guide](./docs/OPERATIONS.md) |
| **Contributing code** | [Contributing Guide](./docs/CONTRIBUTING.md) |

👉 **[Full Documentation Index](./docs/index.md)**

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────┐
│     Frontend (React 19 + Vite)          │
│         http://localhost:8080           │
└────────────────┬────────────────────────┘
                 │ HTTP + JWT Auth
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Backend (Express.js Clean Architecture)                │
│  - Domain Layer (business logic)                         │
│  - Application Layer (use cases)                         │
│  - Infrastructure Layer (database)                       │
│  - Presentation Layer (HTTP API)                         │
│         http://localhost:3000/api                        │
└────────────────┬────────────────────────────────────────┘
                 │ Drizzle ORM
                 ▼
┌─────────────────────────────────────────┐
│       PostgreSQL 18 Database            │
│           localhost:5432                │
└─────────────────────────────────────────┘
```

---

## 🚀 Key Features

- ✅ **Clean Architecture** - Testable, maintainable backend following industry best practices
- ✅ **Type-Safe** - Full TypeScript with strict mode, no `any` types
- ✅ **RESTful API** - Well-documented endpoints with OpenAPI-standards
- ✅ **Monorepo** - Backend, frontend, and Helm charts in one repo using npm workspaces
- ✅ **PostgreSQL + Drizzle** - Type-safe SQL query builder with migrations
- ✅ **Authentication** - JWT-based auth with secure token handling
- ✅ **Testing** - Jest (backend), Vitest + Playwright E2E (frontend)
- ✅ **Docker & Kubernetes** - Production-ready deployment with Helm
- ✅ **Git Hooks** - Husky enforces code quality on commit

---

## 📝 Common Commands

### Development
```bash
npm run dev              # Start all services
npm run dev:backend      # Backend only (port 3000)
npm run dev:frontend     # Frontend only (port 8080)
```

### Testing
```bash
npm run test             # All unit/integration tests (backend + frontend)
npm run test:backend     # Backend unit + integration (Jest)
npm run test:frontend    # Frontend unit (Vitest)
npm run test:coverage    # Coverage for both packages (70%+ threshold)
npm run test:e2e         # E2E tests (Playwright, starts frontend automatically)
npm run test:e2e:ui      # E2E with Playwright UI
```
E2E runs the frontend dev server automatically; optional: run backend (`npm run dev:backend`) for full API during E2E.

### Build & Deployment
```bash
npm run build            # Build all packages
npm run lint             # Lint all code
npm run format           # Auto-format code
docker-compose up        # Full stack with Docker
```

See [package.json](./package.json) for all available scripts.

---

## 🏢 Project Structure

```
personal-site-v2/
├── packages/
│   ├── backend/              # Express API (Clean Architecture)
│   │   ├── src/
│   │   │   ├── domain/       # Entities & interfaces
│   │   │   ├── application/  # Use cases & DTOs
│   │   │   ├── infrastructure/  # Repositories & database
│   │   │   ├── presentation/ # Controllers & routes
│   │   │   └── shared/       # Utilities & config
│   │   └── tests/
│   │
│   └── frontend/             # React SPA (Vite)
│       ├── src/
│       │   ├── pages/        # Page components
│       │   ├── features/     # Feature modules
│       │   ├── components/   # Shared UI components
│       │   ├── core/         # App infrastructure
│       │   ├── design-system/ # Design tokens & styles
│       │   └── utils/        # Utilities
│       └── tests/
│
├── helm/                     # Kubernetes Helm charts
├── docs/                     # 📚 Comprehensive documentation
└── docker-compose.yml        # Local development stack
```

---

## 🎯 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TypeScript, TailwindCSS, TanStack Query |
| **Backend** | Express.js, TypeScript, Drizzle ORM, PostgreSQL 18 |
| **Testing** | Jest, Vitest, Playwright, React Testing Library |
| **Quality** | ESLint, Prettier, Husky (pre-commit hooks) |
| **Deployment** | Docker, Kubernetes, Helm, docker-compose |
| **Auth** | JWT tokens, bcrypt password hashing |

---

## 🚢 Deployment

### Local Development (Docker Compose)
```bash
docker-compose up -d
# Frontend: http://localhost:8080
# Backend: http://localhost:3000
```

### Production (Kubernetes + Helm)
```bash
helm install personal-site ./helm -n personal-site --create-namespace
```

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 🤝 Contributing

Before submitting changes, please read:
1. [Contributing Guide](./docs/CONTRIBUTING.md) - Workflow, standards, PR process
2. [Code Standards](#code-standards) below

### Code Standards

- **No `any` types** - Use explicit TypeScript types
- **No unused variables** - Clean code enforced by linter
- **Tests required** - 70% coverage threshold
- **Commit messages** - Follow Conventional Commits pattern
- **Auto-linting** - Husky runs ESLint & Prettier on commit

```bash
# Fix linting & formatting
npm run lint -- --fix
npm run format
```

---

## 📚 Learning Resources

- [Architecture Guide](./docs/ARCHITECTURE.md) - Explains Clean Architecture pattern
- [API Reference](./docs/API_REFERENCE.md) - All endpoints documented
- [Feature Development](./docs/FEATURE_DEVELOPMENT.md) - Complete walkthrough of adding features
- [Glossary](./docs/GLOSSARY.md) - Technical terms defined
- [copilot-instructions.md](./.github/copilot-instructions.md) - Detailed system context

---

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
PORT=3001 npm run dev:backend
```

**Database connection error?**
```bash
# Make sure PostgreSQL is running (Docker Compose or local)
npm run drizzle:migrate -w packages/backend
```

**Can't access API from frontend?**
```bash
# Check VITE_API_BASE_URL in packages/frontend/.env
cat packages/frontend/.env
```

See [Operations Guide](./docs/OPERATIONS.md) for more troubleshooting.

---

## 📜 License

MIT

---

## 🆘 Need Help?

- 📖 Check the [docs folder](./docs/index.md) first
- 🔍 Search existing issues on GitHub
- 💬 Ask the team on Slack
- 🐛 File a bug report with details

---

**Last Updated**: February 2026  
**Maintainers**: [@edwardxie](https://github.com/edwardxie) and team
