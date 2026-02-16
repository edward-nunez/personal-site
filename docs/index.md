# Personal Site v2 - Documentation Index

Welcome to the Personal Site v2 documentation! This guide is organized by audience and topic to help you quickly find what you need.

## Quick Navigation

### 🚀 **Getting Started** (For Everyone)
Start here if you're new to the project or setting up your development environment.
- [Getting Started Guide](./GETTING_STARTED.md) - Local development, Docker, and first steps

### 👨‍💻 **For Developers**
- [Architecture Guide](./ARCHITECTURE.md) - Clean Architecture patterns, layer breakdown, and design decisions
- [Feature Development Guide](./FEATURE_DEVELOPMENT.md) - Step-by-step guide to adding new features
- [API Reference](./API_REFERENCE.md) - Complete API documentation with examples for frontend consumption
- [Code Standards & Contributing](./CONTRIBUTING.md) - ESLint rules, naming conventions, PR process

### 🔧 **For DevOps/Infrastructure**
- [Deployment Guide](./DEPLOYMENT.md) - Docker, Kubernetes (Helm), environment configuration
- [Operations & Troubleshooting](./OPERATIONS.md) - Production runbooks, debugging, monitoring, common issues

### 📚 **Reference**
- [Glossary](./GLOSSARY.md) - Technical terms and definitions
- [Architecture Decision Records](./ADR/) - Historical decisions and their rationale

---

## Project Overview

**Personal Site v2** is a modern monorepo featuring:
- **Backend**: Express.js API with Clean Architecture (PostgreSQL + Drizzle)
- **Frontend**: React 19 + Vite with TailwindCSS
- **Infrastructure**: Docker containerization, Kubernetes deployment with Helm
- **Database**: PostgreSQL 18 with Drizzle ORM

### Key Technologies
- TypeScript (strict mode, no `any` types)
- Express.js (backend HTTP framework)
- React 19 (frontend framework)
- Drizzle (type-safe ORM + database management)
- PostgreSQL 18 (database)
- Helm (Kubernetes package manager)
- Docker Compose (local development)

---

## Common Tasks

### I want to...

| Task | Document |
|------|----------|
| Get my dev environment running locally | [Getting Started](./GETTING_STARTED.md) |
| Understand how the backend layers work | [Architecture Guide](./ARCHITECTURE.md) |
| Add a new API endpoint | [Feature Development](./FEATURE_DEVELOPMENT.md) |
| Call a backend API from the frontend | [API Reference](./API_REFERENCE.md) |
| Deploy to Kubernetes | [Deployment Guide](./DEPLOYMENT.md) |
| Debug a production issue | [Operations Guide](./OPERATIONS.md) |
| Learn the codebase structure | [Architecture Guide](./ARCHITECTURE.md) |
| Set up CI/CD or monitoring | [Operations Guide](./OPERATIONS.md) |

---

## Documentation Standards

All documentation is:
- **Stored in version control** (`/docs` folder)
- **Reviewed with each release** - updates should be submitted in PRs
- **Maintained collaboratively** - see [CONTRIBUTING.md](./CONTRIBUTING.md) for process
- **Written for clarity** - assume readers have varying familiarity with the codebase

### Keeping Docs Current
- Update docs **when you make code changes** that affect the documented behavior
- Flag outdated content with `⚠️ OUTDATED` markers
- Questions? Check existing docs first, then ask team members
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for the documentation review process

---

## Monorepo Structure

```
personal-site-v2/
├── packages/
│   ├── backend/          # Express API (Clean Architecture)
│   │   ├── src/
│   │   │   ├── domain/          # Core business logic (entities, interfaces)
│   │   │   ├── application/     # Use cases and DTOs
│   │   │   ├── infrastructure/  # Database and external service implementations
│   │   │   ├── presentation/    # Controllers, routes, middleware
│   │   │   └── shared/          # Shared utilities (error handling, logger, config)
│   │   └── tests/               # Unit and integration tests
│   │
│   └── frontend/         # React SPA
│       ├── src/
│       │   ├── pages/           # Page-level components
│       │   ├── features/        # Feature-specific code
│       │   ├── components/      # Shared UI components
│       │   ├── design-system/   # Design tokens and system components
│       │   ├── core/            # App infrastructure (API client, router, providers)
│       │   ├── hooks/           # Custom React hooks
│       │   └── utils/           # Utility functions
│       └── tests/               # Unit and E2E tests
│
├── helm/                 # Kubernetes configuration (Helm charts)
├── docs/                 # This documentation
└── docker-compose.yml    # Local development stack
```

---

## Support & Communication

- **Questions about setup?** → Check [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Questions about architecture?** → Check [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Questions about APIs?** → Check [API_REFERENCE.md](./API_REFERENCE.md)
- **Questions about adding features?** → Check [FEATURE_DEVELOPMENT.md](./FEATURE_DEVELOPMENT.md)
- **Production issues?** → Check [OPERATIONS.md](./OPERATIONS.md)

Still stuck? Reach out to the team or consult the backend's [`copilot-instructions.md`](../.github/copilot-instructions.md) for additional context.

---

**Last Updated**: February 2026  
**Status**: Active documentation (reviewed with each release)
