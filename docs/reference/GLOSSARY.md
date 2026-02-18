# Glossary

Technical terms and definitions used throughout the Personal Site v2 project.

---

## A

**API (Application Programming Interface)**
A set of rules and protocols that allows different software components to communicate. In this project, the backend Express server provides an API that the frontend consumes via HTTP requests (JSON).

**Authentication**
The process of verifying that a user is who they claim to be. Personal Site v2 uses JWT tokens for authentication - users log in with credentials and receive a token that proves their identity on subsequent requests.

**Authorization**
The process of determining whether an authenticated user has permission to perform an action. E.g., only authenticated admins can create projects (authentication confirms they're logged in; authorization confirms they're an admin).

---

## B

**Backend**
The server-side application (Express.js) that handles business logic, database operations, and serves APIs. Runs on port 3000.

**Clean Architecture**
An architectural pattern that organizes code into layers (Domain, Application, Infrastructure, Presentation) with inward-pointing dependencies. This makes code testable, maintainable, and independent of frameworks.

**Commit**
A snapshot of code changes in Git. Should be atomic (solve one specific problem) and include a descriptive message.

---

## C

**Controller**
In the Presentation layer, a class that handles HTTP requests, validates input, orchestrates use cases, and returns responses.

**CORS (Cross-Origin Resource Sharing)**
A security mechanism that allows browsers to make requests to APIs on different domains. Must be explicitly configured on the server.

---

## D

**DTO (Data Transfer Object)**
An object that carries data between architectural layers. DTOs define the shape and validation rules for input/output data. In Personal Site v2, defined using Zod schemas.

**Domain**
The innermost layer of Clean Architecture. Contains entities and interfaces that define core business rules. Has no dependencies on external frameworks.

**URL example**: `postgresql://user:password@host:port/database?schema=public`

---

## E

**Entity**
In the Domain layer, an interface or class representing a core business concept (e.g., Experience, Project). Contains only attributes and structure, no behavior.

**Environment Variables**
Configuration values stored in `.env` files (e.g., `DATABASE_URL`, `JWT_SECRET`). Different for each environment (development, staging, production).

**ESLint**
A static code analysis tool that enforces code style and quality rules. Automatically fixes many issues with `--fix` flag.

---

## F

**Feature Branch**
A Git branch created for developing a specific feature. Follows naming: `feature/[name]`, `fix/[bug]`, `docs/[doc]`. Merged back to `main` via PR.

**Frontend**
The client-side application (React) that users interact with. Runs on port 5173 in development.

---

## H

**Health Check**
An endpoint (`/health`, `/ready`) that returns the server's status. Used by load balancers and orchestrators to verify the application is healthy.

**Husky**
A Git hooks manager that runs scripts (linting, testing) before commits and pushes. Ensures code quality before entering version control.

**HPA (Horizontal Pod Autoscaler)**
Kubernetes feature that automatically scales the number of pod replicas based on metrics (CPU, memory).

---

## I

**Infrastructure Layer**
The layer in Clean Architecture that implements domain interfaces using concrete technologies (Prisma, databases, APIs). Holds implementation details.

**Integration Test**
A test that verifies multiple components work together (e.g., controller + repository + database).

**Ingress**
Kubernetes resource that manages external HTTP/HTTPS access to services. Acts as a reverse proxy and load balancer.

---

## J

**JWT (JSON Web Token)**
A standard token format for authentication. Contains encoded claims (e.g., user ID, expiration). Verified by the server on each request.

**Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwI...`

---

## K

**Kubernetes**
An open-source container orchestration platform. Manages containerized applications across clusters, handling deployment, scaling, and networking.

---

## L

**Linting**
Static analysis of code to find style violations and potential bugs. ESLint performs this on TypeScript/JavaScript files.

**LoadBalancer**
A Kubernetes service type that distributes traffic across multiple pod replicas. Exposes the service to external networks.

---

## M

**Middleware**
A function in Express that processes HTTP requests before they reach controllers (e.g., authentication, logging, error handling).

**Migration**
In databases, a versioned change to the schema (e.g., "create users table", "add email column"). Prisma migrations ensure schema consistency across environments.

**Monorepo**
A single Git repository containing multiple packages (backend, frontend). npm workspaces manage dependencies and scripts.

---

## N

**npm Workspaces**
Feature of npm that allows managing multiple packages in one repo. Scripts can target specific workspaces: `npm run dev -w packages/backend`.

---

## O

**ORM (Object-Relational Mapping)**
A tool that maps database tables to object models, allowing you to interact with databases using code (instead of raw SQL). Prisma is the ORM in this project.

---

## P

**Pod**
In Kubernetes, the smallest deployable unit. Usually contains one container but can contain multiple. Pods are ephemeral and managed by higher-level resources (Deployments).

**Prettier**
An opinionated code formatter. Automatically formats code to a consistent style. Runs on pre-commit via Husky.

**Prisma**
An ORM (Object-Relational Mapping) tool. Provides typed database client, migrations, and Studio GUI for data management.

---

## Q

**Query Optimization**
Improving database query performance through indexing, filtering, and pagination. Essential for scalable applications.

---

## R

**Repository Pattern**
A design pattern that abstracts database access behind an interface. Allows swapping database implementations without changing business logic.

**Request**
An HTTP message from client to server (method: GET, POST, etc.; path: /api/experiences; headers; body).

**Response**
An HTTP message from server to client (status code: 200, 404, 500; headers; body).

**Rollout**
In Kubernetes, the process of updating a deployment with new pod replicas while maintaining availability. Supports rolling updates and rollbacks.

---

## S

**SPA (Single Page Application)**
A web application that loads once and updates dynamically without full page refreshes. React is an SPA framework.

**Service**
In Kubernetes, an abstraction that exposes pods as a network service. Provides stable IP and DNS name for pod replicas.

**Slug**
A URL-friendly identifier (e.g., "my-awesome-project" instead of "My Awesome Project"). Created from titles, lowercase, hyphens.

---

## T

**TanStack Query (React Query)**
A library for managing server state in React. Handles caching, background updates, and data synchronization.

**Type-Safe**
Code that leverages type systems (TypeScript) to catch errors at compile-time instead of runtime. Prevents many bugs.

---

## U

**Unit Test**
A test that verifies a single function or component in isolation (with mocked dependencies).

**Use Case**
In the Application layer, a class that orchestrates a specific feature (e.g., CreateExperienceUseCase). Implements business logic using injected repositories.

---

## V

**Validation**
The process of checking that input data is correct (right type, format, value). Done with Zod schemas in DTOs.

**Vite**
A modern frontend build tool. Provides fast hot module reload (HMR) during development and optimized builds for production.

---

## W

**Webpack**
A module bundler (used by some frontend frameworks). Vite is a faster alternative.

---

## Z

**Zod**
A TypeScript-first schema validation library. Used to validate DTOs with clear error messages.

**Example**:
```typescript
const schema = z.object({
  email: z.string().email(),
  age: z.number().int().positive(),
});

// Throws validation error if invalid
const data = schema.parse(input);
```

---

## Acronyms

| Acronym | Meaning |
|---------|---------|
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| DTO | Data Transfer Object |
| E2E | End-to-End |
| HPA | Horizontal Pod Autoscaler |
| JWT | JSON Web Token |
| ORM | Object-Relational Mapping |
| PVC | Persistent Volume Claim |
| SPA | Single Page Application |
| SQL | Structured Query Language |
| URI | Uniform Resource Identifier |

---

**Last Updated**: February 2026
