# ADR-001: Use Clean Architecture Pattern

**Date**: February 2026  
**Status**: Accepted  
**Stakeholders**: Backend Team, Tech Lead

## Context

Personal Site v2 is a greenfield project requiring architectural decisions. The team needs to choose an architecture pattern that will:
- Scale with team growth and codebase complexity
- Enable testing of business logic without database/HTTP dependencies
- Allow framework and tool flexibility in the future
- Be maintainable and understood by new developers

## Decision

We will use **Clean Architecture** (also known as Hexagonal Architecture / Onion Architecture) to organize backend code into four layers:

1. **Domain Layer** - Core business logic, entities, interfaces (no external dependencies)
2. **Application Layer** - Use cases, orchestration, DTOs (depends only on Domain)
3. **Infrastructure Layer** - Database, external services (implements Domain interfaces)
4. **Presentation Layer** - HTTP controllers, routes, middleware (orchestrates Application layer)

Dependencies flow **inward only** - Presentation → Application → Domain ← Infrastructure.

## Rationale

### Clean Architecture Solves Our Problems

**Testability**
- Business logic (use cases) is testable without database or HTTP
- Mock repositories to test use cases in isolation
- No need for integration test database setup for unit tests

**Framework Independence**
- Domain and Application layers don't depend on Express
- Could swap Express for another HTTP framework without changing business logic
- Could derive a CLI or GraphQL interface from same use cases

**Scalability**
- Clear separation of concerns makes adding features straightforward
- New developers understand where code should go
- Changes to one layer don't cascade throughout system

**Maintainability**
- Each layer has a single responsibility
- Dependencies are explicit (through constructor injection)
- Easier to debug (know exactly which layer an issue is in)

### Trade-offs Accepted

- **More files/structure** - More boilerplate than simpler architectures, but worth it for mature projects
- **Learning curve** - New team members need to understand the pattern, but documentation helps
- **May be over-engineered for small scripts** - But this project is expected to grow

## Consequences

### Positive
- ✅ Business logic is highly testable (unit tests don't need database)
- ✅ Easy to add new endpoints (follow established pattern)
- ✅ Easy to understand codebase organization (where to find code)
- ✅ Framework agnostic (could swap Express → Fastify)
- ✅ Clear dependency direction prevents circular dependencies

### Negative
- ⚠️ More files and folders (7+ layers instead of 1-2 in simple projects)
- ⚠️ Initial setup is more complex
- ⚠️ May feel like overkill for very small projects
- ⚠️ Requires discipline from team to maintain boundaries

## Alternatives Considered

### Option A: Layered Architecture (3 layers)
- Controllers → Services → Data Access
- Simpler than Clean Architecture
- **Rejected Because**: Less testable, mixed concerns (Services often contain business logic AND database access)

### Option B: Feature-Based Organization (Vertical Slices)
- Organize by feature rather than technical layer (e.g., /auth, /projects)
- Each feature self-contained
- **Rejected Because**: Can lead to code duplication; harder to enforce boundaries

### Option C: No Architecture (Code Anywhere)
- **Rejected Because**: Would become unmaintainable as project grows

## Implementation Notes

### How We Implement This

1. **Domain Layer** (`src/domain/`)
   - Interfaces for repositories (no implementations)
   - Entity types (pure TypeScript interfaces)
   - Business rules as entity methods and use cases

2. **Application Layer** (`src/application/`)
   - Use cases (one per action, e.g., GetAllProjects.usecase.ts)
   - DTOs with Zod validation
   - Orchestrate repositories through dependency injection

3. **Infrastructure Layer** (`src/infrastructure/`)
   - Repository implementations (Prisma, databases, APIs)
   - External service integrations
   - Implements domain interfaces

4. **Presentation Layer** (`src/presentation/`)
   - Controllers (coordinate request → use case → response)
   - Routes (HTTP method + path → controller method)
   - Middleware (authentication, error handling)

### Enforcement Mechanisms

- **TypeScript imports** - Domain imports nothing; prevents circular deps
- **ESLint rules** - Could add rules to prevent Infrastructure imports from Presentation
- **Code review** - Reviewers watch for layer violations
- **Documentation** - See [Architecture Guide](../ARCHITECTURE.md)

### Timeline

- **Immediate**: Apply to all new backend code
- **Existing code**: Refactor gradually as features are touched

## Related ADRs

- [ADR-002: Use PostgreSQL with Prisma ORM](./0002-postgresql-prisma.md) (Infrastructure layer decision)

---

**Questions?** See [Architecture Guide](../ARCHITECTURE.md) for detailed explanation and examples.
