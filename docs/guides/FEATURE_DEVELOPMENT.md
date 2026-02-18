# Feature Development Guide

This guide walks you through adding a complete feature - from database schema to API endpoint to frontend consumption.

**Table of Contents**
- [Quick Start](#quick-start)
- [Complete Example: Adding a New Endpoint](#complete-example-adding-a-new-endpoint)
- [Step-by-Step Walkthrough](#step-by-step-walkthrough)
- [Common Patterns](#common-patterns)
- [Testing Your Feature](#testing-your-feature)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

The fastest checklist for adding a simple CRUD endpoint:

### Backend
1. [ ] Update Drizzle schema (`packages/backend/src/infrastructure/persistence/schema.ts`)
2. [ ] Run migration (`npm run drizzle:generate` then `npm run drizzle:migrate`)
3. [ ] Create domain entity (`src/domain/entities/[Entity].ts`)
4. [ ] Create repository interface (`src/domain/interfaces/I[Entity]Repository.ts`)
5. [ ] Implement Drizzle repository (`src/infrastructure/repositories/Drizzle[Entity]Repository.ts`)
6. [ ] Create DTOs with Zod validation (`src/application/dtos/[entity].dto.ts`)
7. [ ] Create use cases (`src/application/use-cases/[entity]/`)
8. [ ] Create controller (`src/presentation/controllers/[entity].controller.ts`)
9. [ ] Create routes file (`src/presentation/routes/[entity].routes.ts`)
10. [ ] Register routes (`src/routes/index.ts`)
11. [ ] Test with `npm run test:backend`

### Frontend
1. [ ] Create custom hook (`src/core/api/hooks/use[Entity].ts`)
2. [ ] Create page/component (`src/pages/[Feature]/`)
3. [ ] Add routes (`src/core/router/routes.tsx`)
4. [ ] Test with `npm run test:e2e`

---

## Complete Example: Adding a New Endpoint

Let's walk through adding a **projects** endpoint (GET, POST, PUT, DELETE).

---

## Step-by-Step Walkthrough

### Phase 1: Database Setup (Infrastructure)

#### Step 1.1: Update Drizzle Schema

File: `packages/backend/src/infrastructure/persistence/schema.ts`

Add a new table definition:

```typescript
import { pgTable, uuid, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  technologies: text('technologies').array().notNull().default([]),
  link: text('link'),
  featured: boolean('featured').notNull().default(false),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('projects_featured_idx').on(table.featured),
  index('projects_order_idx').on(table.order),
]);
```

#### Step 1.2: Generate and Run Migration

```bash
# From workspace root, generate migration from schema
npm run drizzle:generate -w packages/backend

# Apply the migration to your database
npm run drizzle:migrate -w packages/backend
```
# This creates a timestamped migration file and updates the database schema
```

The migration creates the table in PostgreSQL. Your TypeScript types are automatically generated from the schema.

---

### Phase 2: Domain Layer (Business Rules)

#### Step 2.1: Create Domain Entity

File: `packages/backend/src/domain/entities/Project.ts`

```typescript
/**
 * Project Domain Entity
 * Represents a portfolio project
 */
export interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  technologies: string[];
  link?: string | null;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating a new project
 */
export interface CreateProjectInput {
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  technologies?: string[];
  link?: string | null;
  featured?: boolean;
  order?: number;
}

/**
 * DTO for updating a project
 */
export interface UpdateProjectInput {
  id: number;
  title?: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  technologies?: string[];
  link?: string | null;
  featured?: boolean;
  order?: number;
}
```

**File Location**: `packages/backend/src/domain/entities/Project.ts`

---

#### Step 2.2: Create Repository Interface

File: `packages/backend/src/domain/interfaces/IProjectRepository.ts`

```typescript
import { Project, CreateProjectInput, UpdateProjectInput } from '../entities/Project.js';

/**
 * Repository interface for Project persistence
 * Infrastructure will implement this using Drizzle
 */
export interface IProjectRepository {
  findAll(options?: QueryOptions): Promise<Project[]>;
  findById(id: number): Promise<Project | null>;
  findBySlug(slug: string): Promise<Project | null>;
  create(input: CreateProjectInput): Promise<Project>;
  update(id: number, input: UpdateProjectInput): Promise<Project>;
  delete(id: number): Promise<void>;
}

export interface QueryOptions {
  featured?: boolean;
  orderBy?: 'order' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}
```

**Key Insight**: This interface defines the contract. The Infrastructure layer will implement it. The Application layer uses this interface, never directly accessing the database.

---

### Phase 3: Application Layer (Business Logic & Validation)

#### Step 3.1: Create DTOs with Zod Validation

File: `packages/backend/src/application/dtos/project.dto.ts`

```typescript
import { z } from 'zod';

/**
 * Validation schema for creating a project
 */
export const CreateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(255)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(5000).nullable().optional(),
  imageUrl: z.string().url('Invalid image URL').max(500).nullable().optional(),
  technologies: z.array(z.string()).default([]),
  link: z.string().url('Invalid project link URL').max(500).nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

/**
 * Validation schema for updating a project
 */
export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectSchema>;
```

**Why Zod here?**
- Validates input **before** business logic
- Provides type-safe, inferrable types
- Centralized validation rules
- Better error messages for frontend

---

#### Step 3.2: Create Use Cases

Create a folder: `packages/backend/src/application/use-cases/project/`

File: `packages/backend/src/application/use-cases/project/GetAllProjects.usecase.ts`

```typescript
import { Project } from '../../../domain/entities/Project.js';
import { IProjectRepository, QueryOptions } from '../../../domain/interfaces/IProjectRepository.js';

/**
 * Use Case: Fetch all projects with optional filters
 */
export class GetAllProjectsUseCase {
  constructor(private repository: IProjectRepository) {}

  async execute(options?: QueryOptions): Promise<Project[]> {
    // Business logic can go here
    // For now, simply delegate to repository
    return this.repository.findAll(options);
  }
}
```

File: `packages/backend/src/application/use-cases/project/CreateProject.usecase.ts`

```typescript
import { Project, CreateProjectInput } from '../../../domain/entities/Project.js';
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository.js';

/**
 * Use Case: Create a new project
 */
export class CreateProjectUseCase {
  constructor(private repository: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    // Business logic examples:
    // - Validate slug uniqueness
    // - Generate thumbnail
    // - Send notifications
    
    // For now, just create
    return this.repository.create(input);
  }
}
```

File: `packages/backend/src/application/use-cases/project/GetProjectById.usecase.ts`

```typescript
import { Project } from '../../../domain/entities/Project.js';
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Use Case: Fetch a specific project by ID
 */
export class GetProjectByIdUseCase {
  constructor(private repository: IProjectRepository) {}

  async execute(id: number): Promise<Project> {
    const project = await this.repository.findById(id);
    
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }
}
```

File: `packages/backend/src/application/use-cases/project/UpdateProject.usecase.ts`

```typescript
import { Project, UpdateProjectInput } from '../../../domain/entities/Project.js';
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Use Case: Update an existing project
 */
export class UpdateProjectUseCase {
  constructor(private repository: IProjectRepository) {}

  async execute(input: UpdateProjectInput): Promise<Project> {
    // Verify project exists
    const existing = await this.repository.findById(input.id);
    if (!existing) {
      throw new NotFoundError('Project not found');
    }

    return this.repository.update(input.id, input);
  }
}
```

File: `packages/backend/src/application/use-cases/project/DeleteProject.usecase.ts`

```typescript
import { IProjectRepository } from '../../../domain/interfaces/IProjectRepository.js';
import { NotFoundError } from '../../../shared/errors/index.js';

/**
 * Use Case: Delete a project
 */
export class DeleteProjectUseCase {
  constructor(private repository: IProjectRepository) {}

  async execute(id: number): Promise<void> {
    // Verify exists before deleting
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Project not found');
    }

    await this.repository.delete(id);
  }
}
```

File: `packages/backend/src/application/use-cases/project/index.ts` (barrel export)

```typescript
export { GetAllProjectsUseCase } from './GetAllProjects.usecase.js';
export { GetProjectByIdUseCase } from './GetProjectById.usecase.js';
export { CreateProjectUseCase } from './CreateProject.usecase.js';
export { UpdateProjectUseCase } from './UpdateProject.usecase.js';
export { DeleteProjectUseCase } from './DeleteProject.usecase.js';
```

---

### Phase 4: Infrastructure Layer (Database Implementation)

#### Step 4.1: Implement Drizzle Repository

File: `packages/backend/src/infrastructure/repositories/DrizzleProjectRepository.ts`

```typescript
import { db } from '../persistence/db.js';
import { projects } from '../persistence/schema.js';
import { eq, desc } from 'drizzle-orm';
import { Project, CreateProjectInput, UpdateProjectInput } from '../../domain/entities/Project.js';
import { IProjectRepository, QueryOptions } from '../../domain/interfaces/IProjectRepository.js';

/**
 * Drizzle implementation of Project repository
 */
export class DrizzleProjectRepository implements IProjectRepository {
  async findAll(options?: QueryOptions): Promise<Project[]> {
    const orderByField = options?.orderBy || 'order';
    const orderDirection = options?.orderDirection || 'asc';
    const orderFn = orderDirection === 'asc' ? asc(projects[orderByField]) : desc(projects[orderByField]);
    
    return db
      .select()
      .from(projects)
      .where(options?.featured ? eq(projects.featured, true) : undefined)
      .orderBy(orderFn);
  }

  async findById(id: string): Promise<Project | null> {
    const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return rows[0] ?? null;
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return rows[0] ?? null;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const rows = await db.insert(projects).values(input).returning();
    return rows[0];
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project | null> {
    const rows = await db
      .update(projects)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return rows[0] ?? null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }
}
```

---

### Phase 5: Presentation Layer (HTTP API)

#### Step 5.1: Create Controller

File: `packages/backend/src/presentation/controllers/project.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { DrizzleProjectRepository } from '../../infrastructure/repositories/DrizzleProjectRepository.js';
import {
  GetAllProjectsUseCase,
  GetProjectByIdUseCase,
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
} from '../../application/use-cases/project/index.js';
import { CreateProjectSchema, UpdateProjectSchema } from '../../application/dtos/project.dto.js';

/**
 * Project Controller
 * Handles HTTP requests for Project resources
 */
export class ProjectController {
  private repository = new DrizzleProjectRepository();

  /**
   * GET /api/projects
   * Get all projects
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAllProjectsUseCase(this.repository);
      
      const options = {
        featured: req.query.featured === 'true' ? true : undefined,
        orderBy: (req.query.orderBy as 'order' | 'createdAt') || 'order',
        orderDirection: (req.query.orderDirection as 'asc' | 'desc') || 'asc',
      };

      const projects = await useCase.execute(options);

      res.json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/projects/:id
   * Get project by ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const useCase = new GetProjectByIdUseCase(this.repository);
      
      const project = await useCase.execute(id);

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/projects
   * Create new project (admin only)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = CreateProjectSchema.parse(req.body);
      const useCase = new CreateProjectUseCase(this.repository);
      
      const project = await useCase.execute(validatedData);

      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/projects/:id
   * Update project (admin only)
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const validatedData = UpdateProjectSchema.parse(req.body);
      const useCase = new UpdateProjectUseCase(this.repository);
      
      const project = await useCase.execute({ id, ...validatedData });

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/projects/:id
   * Delete project (admin only)
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      const useCase = new DeleteProjectUseCase(this.repository);
      
      await useCase.execute(id);

      res.json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

#### Step 5.2: Create Routes

File: `packages/backend/src/presentation/routes/project.routes.ts`

```typescript
import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
const controller = new ProjectController();

// Public routes
router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.get('/:id', (req, res, next) => controller.getById(req, res, next));

// Protected routes (require authentication)
router.post('/', authMiddleware, (req, res, next) => controller.create(req, res, next));
router.put('/:id', authMiddleware, (req, res, next) => controller.update(req, res, next));
router.delete('/:id', authMiddleware, (req, res, next) => controller.delete(req, res, next));

export default router;
```

---

#### Step 5.3: Register Routes

File: `packages/backend/src/routes/index.ts`

```typescript
import { Router } from 'express';
import experienceRoutes from '../presentation/routes/experience.routes.js';
import projectRoutes from '../presentation/routes/project.routes.js';
import authRoutes from '../presentation/routes/auth.routes.js';

const router = Router();

// Mount routes
router.use('/experiences', experienceRoutes);
router.use('/projects', projectRoutes);  // ← ADD THIS LINE
router.use('/auth', authRoutes);

export default router;
```

---

### Phase 6: Test Backend Endpoint

```bash
# Start backend server
npm run dev:backend

# Test GET all projects
curl http://localhost:3000/api/projects

# Test CREATE (requires auth - TODO: get token from login)
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{
    "title": "My Awesome Project",
    "slug": "my-awesome-project",
    "description": "A cool project I built",
    "technologies": ["TypeScript", "React"],
    "featured": true
  }'
```

---

### Phase 7: Frontend Integration

#### Step 7.1: Create Custom Hook

File: `packages/frontend/src/features/projects/hooks/useProjects.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

export interface Project {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  technologies: string[];
  link?: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// GET: Fetch all projects
export function useProjects(featured?: boolean) {
  return useQuery({
    queryKey: ['projects', featured],
    queryFn: async () => {
      const url = `/projects${featured ? '?featured=true' : ''}`;
      const res = await apiClient.get<{ success: boolean; data: Project[] }>(url);
      return res.data.data;
    },
  });
}

// POST: Create project
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
      const res = await apiClient.post<{ success: boolean; data: Project }>('/projects', input);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// PUT: Update project
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Partial<Project> & { id: number }) => {
      const { id, ...data } = input;
      const res = await apiClient.put<{ success: boolean; data: Project }>(`/projects/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// DELETE: Delete project
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
```

#### Step 7.2: Create Component

File: `packages/frontend/src/pages/Projects/index.tsx`

```typescript
import { useProjects } from '@/features/projects/hooks/useProjects';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { Loading, ErrorMessage } from '@/components';

export function ProjectsPage() {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      <h1>My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

#### Step 7.3: Add Route

File: `packages/frontend/src/core/router/routes.tsx`

```typescript
// Add to routes array
{
  path: '/projects',
  element: <ProjectsPage />,
}
```

---

## Common Patterns

### Pattern 1: Filtering & Pagination

**Backend (UseCase)**:
```typescript
export class GetAllProjectsUseCase {
  async execute(options?: {
    featured?: boolean;
    skip?: number;
    take?: number;
  }): Promise<{ data: Project[]; total: number }> {
    const [data, total] = await Promise.all([
      this.repository.findAll(options),
      this.repository.count(options?.where),
    ]);
    return { data, total };
  }
}
```

**Frontend (Hook)**:
```typescript
export function useProjects(page = 1) {
  const [filters, setFilters] = useState({ featured: false });
  
  return useQuery({
    queryKey: ['projects', filters, page],
    queryFn: async () => {
      const res = await apiClient.get('/projects', {
        params: {
          ...filters,
          skip: (page - 1) * 10,
          take: 10,
        }
      });
      return res.data.data;
    },
  });
}
```

### Pattern 2: Error Handling

**Backend**:
```typescript
// Throw custom errors
if (!project) throw new NotFoundError('Project not found');
if (existing.ownerId !== req.user.id) throw new ForbiddenError('Not your project');
```

**Frontend**:
```typescript
try {
  await createProject(data);
  toast.success('Project created!');
} catch (error) {
  // Error toast automatically shown via interceptor
  console.error(error);
}
```

---

## Testing Your Feature

### Backend Tests

File: `packages/backend/tests/unit/use-cases/project.test.ts`

```typescript
import { GetAllProjectsUseCase } from '@/application/use-cases/project';
import { Project } from '@/domain/entities/Project';

describe('GetAllProjectsUseCase', () => {
  it('should return projects sorted by order', async () => {
    const mockRepository = {
      findAll: jest.fn().mockResolvedValue([
        { id: 1, title: 'Project 1', order: 1 },
        { id: 2, title: 'Project 2', order: 2 },
      ]),
    };

    const useCase = new GetAllProjectsUseCase(mockRepository);
    const result = await useCase.execute({ orderBy: 'order' });

    expect(result).toHaveLength(2);
    expect(result[0].order).toBeLessThan(result[1].order);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});
```

### Frontend Tests (Vitest)

```typescript
import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ProjectsPage } from '@/pages/Projects';

describe('ProjectsPage', () => {
  it('should display projects', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProjectsPage />
      </QueryClientProvider>
    );

    expect(screen.getByText('My Projects')).toBeInTheDocument();
  });
});
```

---

## Troubleshooting

### "Module not found" after adding new file
```bash
# Rebuild TypeScript
npm run build

# Or just restart the dev server
npm run dev:backend
```

### Drizzle type errors
```bash
# Regenerate Drizzle migrations
npm run drizzle:generate -w packages/backend
```

### Routes not working
1. Check route is registered in `src/routes/index.ts`
2. Verify middleware order (auth should be before controller)
3. Test with curl: `curl http://localhost:3000/api/projects`

### Frontend can't find API endpoint
- Verify `VITE_API_BASE_URL` in `.env`
- Check network tab in browser DevTools
- Verify backend is running (`npm run dev:backend`)

---

**Next Steps**: Add tests, check [CONTRIBUTING.md](./CONTRIBUTING.md) for PR process, submit for review!
