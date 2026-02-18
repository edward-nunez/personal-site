# Personal Site v2 - Documentation Index

Welcome to the Personal Site v2 documentation! This guide is organized by role and topic to help you quickly find what you need.

---

## 🚀 **Quick Start** 

**New to the project or just want to get running?**  
👉 [**QUICK START.md**](./QUICK_START.md) - Get running in 5 minutes

---

## 📚 **Browse by Section**

### 👨‍💻 **[Developer Guides](./guides/README.md)** - Learn how to build
- [Getting Started](./guides/GETTING_STARTED.md) - Setup your environment
- [Feature Development](./guides/FEATURE_DEVELOPMENT.md) - Build new features
- [Testing](./guides/TESTING.md) - Write tests

### 📖 **[Reference Docs](./reference/README.md)** - Quick lookup
- [API Reference](./reference/API_REFERENCE.md) - Endpoint documentation
- [Service Contracts](./reference/SERVICE_CONTRACTS.md) - Service communication
- [Feature Flags](./reference/FEATURE_FLAGS.md) - Feature management
- [Glossary](./reference/GLOSSARY.md) - Terms & definitions

### ⚙️ **[Operations](./operations/README.md)** - Deploy & troubleshoot
- [Deployment](./operations/DEPLOYMENT.md) - Docker & Kubernetes
- [Operations](./operations/OPERATIONS.md) - Production runbooks

### 🏗️ **[Architecture](./architecture/README.md)** - Understand the design
- [Architecture Guide](./architecture/ARCHITECTURE.md) - System overview
- [Architectural Decisions](./architecture/ADR/) - Why we made choices

### 📊 **[Observability](./observability/README.md)** - Monitor & debug
- [Overview](./observability/OVERVIEW.md) - What & why
- [Backend Setup](./observability/BACKEND.md) - Node.js monitoring
- [Frontend Setup](./observability/FRONTEND.md) - React monitoring
- [Troubleshooting](./observability/TROUBLESHOOTING.md) - Common issues

---

## 📋 **Documentation Organization**

```
docs/
├── README.md                    ← You are here
├── QUICK_START.md               ← Start here!
├── SUMMARY.md                   ← Audit & improvements
├── CHANGELOG.md                 ← Document updates
│
├── guides/                      ← How-to tutorials
│   ├── GETTING_STARTED.md
│   ├── FEATURE_DEVELOPMENT.md
│   └── TESTING.md
│
├── reference/                   ← Lookup specs
│   ├── API_REFERENCE.md
│   ├── SERVICE_CONTRACTS.md
│   ├── FEATURE_FLAGS.md
│   ├── GLOSSARY.md
│   └── openapi.yaml
│
├── operations/                  ← Deployment & runbooks
│   ├── DEPLOYMENT.md
│   └── OPERATIONS.md
│
├── architecture/                ← Design decisions
│   ├── ARCHITECTURE.md
│   └── ADR/                     ← Architecture Decision Records
│
├── observability/               ← Monitoring & debugging
│   ├── OVERVIEW.md
│   ├── BACKEND.md
│   ├── FRONTEND.md
│   └── TROUBLESHOOTING.md
│
└── research/                    ← Investigation notes
```

## 📖 **Project Overview**

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

## 🎯 **Find What You Need**

| I want to... | Go to... |
|--------------|----------|
| Get my dev environment running | [guides/GETTING_STARTED.md](./guides/GETTING_STARTED.md) |
| Add a new API endpoint | [guides/FEATURE_DEVELOPMENT.md](./guides/FEATURE_DEVELOPMENT.md) |
| Understand system architecture | [architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md) |
| Call a backend API from frontend | [reference/API_REFERENCE.md](./reference/API_REFERENCE.md) |
| Write tests | [guides/TESTING.md](./guides/TESTING.md) |
| Deploy to Kubernetes | [operations/DEPLOYMENT.md](./operations/DEPLOYMENT.md) |
| Respond to production issues | [operations/OPERATIONS.md](./operations/OPERATIONS.md) |
| Set up error monitoring | [observability/BACKEND.md](./observability/BACKEND.md) or [observability/FRONTEND.md](./observability/FRONTEND.md) |
| Understand terminology | [reference/GLOSSARY.md](./reference/GLOSSARY.md) |
| Learn architectural decisions | [architecture/ADR/](./architecture/ADR/) |

---

## 🤝 **Need Help?**

- **Getting started issues?** → [guides/GETTING_STARTED.md](./guides/GETTING_STARTED.md)
- **Architecture questions?** → [architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md)
- **API documentation?** → [reference/API_REFERENCE.md](./reference/API_REFERENCE.md)
- **Feature development?** → [guides/FEATURE_DEVELOPMENT.md](./guides/FEATURE_DEVELOPMENT.md)
- **Production problems?** → [operations/OPERATIONS.md](./operations/OPERATIONS.md)
- **Observability setup?** → [observability/README.md](./observability/README.md)
- **Design decisions?** → [architecture/ADR/](./architecture/ADR/)

**Still stuck?** Reach out to the team or consult [.github/copilot-instructions.md](../.github/copilot-instructions.md) for additional context.

---

## 📝 **Documentation Improvements**

We recently reorganized our documentation for better navigation and scalability. See [SUMMARY.md](./SUMMARY.md) for details about the improvements and [CHANGELOG.md](./CHANGELOG.md) for recent updates.

---

**Last Updated**: February 18, 2026  
**Status**: Active documentation (reviewed with each release)  
**Structure**: Organized by role and topic for easy discovery
