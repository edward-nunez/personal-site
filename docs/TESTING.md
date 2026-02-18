# Testing Guide

How to run tests, where they live, and how to add new tests for the Personal Site monorepo.

**Table of Contents**
- [Quick reference](#quick-reference)
- [Running tests](#running-tests)
- [Test structure](#test-structure)
- [Adding tests](#adding-tests)
- [Fixtures and mocks](#fixtures-and-mocks)
- [Coverage](#coverage)
- [CI](#ci)

---

## Quick reference

| What | Command (from repo root) |
|------|---------------------------|
| All tests (backend + frontend) | `npm run test` |
| Backend only | `npm run test:backend` |
| Frontend only | `npm run test:frontend` |
| E2E (Playwright) | `npm run test:e2e` |
| Coverage (both packages) | `npm run test:coverage` |

---

## Running tests

### Backend (Jest)

From the repo root:

```bash
npm run test:backend
```

From `packages/backend`:

```bash
npm test
```

- **Unit tests**: Use cases and shared utilities (e.g. `tests/unit/use-cases/*.test.ts`, `tests/unit/shared/*.test.ts`).
- **Integration tests**: HTTP API with supertest; the database layer is **mocked**, so no real PostgreSQL is required. See `tests/integration/api.test.ts`.

Optional env for integration tests (defaults work without a real DB):

```bash
NODE_ENV=test npm run test:backend
```

### Frontend (Vitest)

From the repo root:

```bash
npm run test:frontend
```

From `packages/frontend`:

```bash
npm test
```

- Unit tests live next to source or in `src/**/*.test.{ts,tsx}` (e.g. `utils.test.ts`, `Footer.test.tsx`).
- Vitest uses jsdom by default; see `packages/frontend/vitest.config.ts`.

Watch mode (re-run on file changes):

```bash
npm run test:frontend -- --watch
# or from packages/frontend: npm run test:watch
```

### E2E (Playwright)

From the repo root:

```bash
npm run test:e2e
```

- Tests are in the **`e2e/`** folder at the repo root (e.g. `e2e/home.spec.ts`, `e2e/navigation.spec.ts`, `e2e/contact-form.spec.ts`).
- Playwright starts the **frontend** dev server automatically (`packages/frontend` on port 5173). You do not need to run `npm run dev:frontend` first (unless you want the backend too for full API coverage).
- Default browser: Chromium. Config: `playwright.config.ts` at repo root.

UI mode (interactive):

```bash
npm run test:e2e:ui
```

---

## Test structure

```
personal-site-v2/
├── packages/
│   ├── backend/
│   │   └── tests/
│   │       ├── unit/
│   │       │   ├── use-cases/     # Use case tests (mocked repositories)
│   │       │   └── shared/        # Shared code (e.g. AppError)
│   │       └── integration/       # API tests (supertest, mocked DB)
│   │
│   └── frontend/
│       └── src/
│           ├── **/*.test.ts       # Unit tests (utils, lib)
│           └── **/*.test.tsx     # Component tests (Testing Library)
│
├── e2e/                           # Playwright E2E specs
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   └── contact-form.spec.ts
│
└── playwright.config.ts
```

---

## Adding tests

### Backend unit test (use case)

1. Create a file in `packages/backend/tests/unit/use-cases/` (e.g. `my-use-case.test.ts`).
2. Mock the repository with `jest.fn()` and pass it into the use case.
3. Assert on return values or repository calls.

Example pattern (see existing `project.use-cases.test.ts`, `auth.login.test.ts`):

```typescript
import { MyUseCase } from '../../src/application/use-cases/...';

describe('MyUseCase', () => {
  const mockRepo = {
    findById: jest.fn(),
    create: jest.fn(),
  };

  it('returns entity when found', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1, name: 'Test' });
    const useCase = new MyUseCase(mockRepo);
    const result = await useCase.execute({ id: 1 });
    expect(result.name).toBe('Test');
    expect(mockRepo.findById).toHaveBeenCalledWith(1);
  });
});
```

### Backend integration test (API)

1. Add a new `describe` block in `packages/backend/tests/integration/api.test.ts`, or create a new file in `tests/integration/`.
2. Use `request(app).get(...)` / `.post(...)` etc., where `app` is from `createApp()`.
3. The DB is already mocked at `src/infrastructure/persistence/db`, so no real database is needed. Mock other infrastructure if you add new dependencies.

### Frontend unit test

1. Add a file next to the module: `myModule.test.ts` or `MyComponent.test.tsx`.
2. For components, use `@testing-library/react` (render, screen, userEvent). See `Footer.test.tsx`, `Navbar.test.tsx`.
3. For pure functions, import and assert. See `utils.test.ts`, `formatters.test.ts`.

### E2E test (Playwright)

1. Add a new file in `e2e/` (e.g. `e2e/my-flow.spec.ts`) or a new `test.describe` in an existing file.
2. Use `page.goto()`, `page.getByRole()`, `page.getByLabel()`, `expect()` from `@playwright/test`.
3. Run with `npm run test:e2e`; the frontend is started automatically.

---

## Fixtures and mocks

### Backend

- **Database**: Integration tests mock `packages/backend/src/infrastructure/persistence/db` (healthCheck, connect, disconnect). No test database is required for current integration tests.
- **Repositories**: Unit tests pass fake repositories (plain objects with `jest.fn()` methods) into use cases.
- Shared test utilities or fixtures can be added under `packages/backend/tests/` (e.g. `tests/fixtures/`).

### Frontend

- **API**: Use Vitest mocks (`vi.mock()`) or MSW (Mock Service Worker) if you need to mock API responses in component tests.
- **Queries**: TanStack Query can be wrapped in a test provider; see Testing Library docs and existing component tests.

### E2E

- E2E tests run against the real frontend (and optionally the real backend if you start it). No fixtures are required for the current specs; use `page.goto('/path')` and real UI interactions.

---

## Coverage

Backend and frontend enforce a **70%+** coverage threshold in their configs.

From repo root:

```bash
npm run test:coverage
```

This runs:

- Backend: `jest --coverage` (see `packages/backend/jest.config.js` for `collectCoverageFrom` and `coverageThreshold`).
- Frontend: `vitest run --coverage` (see `packages/frontend/vitest.config.ts`).

Coverage reports are written in each package (e.g. `coverage/` directory). Open the HTML report to see line-by-line coverage.

---

## CI

Tests run in GitHub Actions on push and pull requests:

- Lint and build
- Backend tests (`npm run test:backend`)
- Frontend tests (`npm run test:frontend`)
- E2E tests (`npm run test:e2e` with `CI=1`; frontend started by Playwright)

See [.github/workflows/ci.yml](../.github/workflows/ci.yml). No extra setup is required to run the same commands locally.
