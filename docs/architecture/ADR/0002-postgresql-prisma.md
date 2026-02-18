# ADR-002: Use PostgreSQL with Prisma ORM ⚠️ SUPERSEDED

**Date**: February 2026  
**Status**: Superseded (see ADR-003)  
**Stakeholders**: Backend Team, DevOps, DBA

> **Note**: This ADR documents the original decision. As of February 2026, we have migrated to Drizzle ORM. See [ADR-003: Migrate from Prisma ORM to Drizzle ORM](./0003-drizzle-orm-migration.md) for details.


## Context

We need to choose a database system and ORM for Personal Site v2. Key requirements:

- Handle structured data (experiences, projects, blog posts, users)
- Support complex queries and filtering
- Enable schema migrations across environments
- Provide type-safe database access from TypeScript
- Support production deployments

## Decision

We will use:
- **PostgreSQL 18** - Open-source relational database
- **Prisma ORM** - Type-safe ORM with auto-generated client and migrations

## Rationale

### Why PostgreSQL?

**Reliability**
- Battle-tested, used in production worldwide
- ACID transactions guarantee data consistency
- Strong data integrity with constraints

**Feature-Rich**
- Complex queries with JOINs, subqueries, aggregations
- JSON support for semi-structured data
- Full-text search, arrays, ranges
- Indexes and query optimization

**Scalability**
- Handles millions of records efficiently
- Connection pooling support
- Replication and backup tools available
- Open-source with large community

**Cost**
- Free and open-source
- No licensing fees
- Can run on cheap cloud infrastructure

### Why Prisma ORM?

**Type Safety**
- Auto-generated, type-safe TypeScript client
- Intellisense in IDE (autocomplete for database queries)
- Catch errors at development time, not runtime

**Developer Experience**
- Intuitive query interface (better than raw SQL for most cases)
- Visual schema with Prisma Studio GUI
- Built-in migrations without raw SQL

**Integration**
- Works seamlessly with TypeScript
- Zero-runtime overhead for generated types
- Can mix Prisma queries with raw SQL when needed

**Community & Stability**
- Well-maintained by Prisma team
- Large community, excellent documentation
- Used in production by many companies

## Consequences

### Positive
- ✅ Type-safe database queries (catch errors early)
- ✅ Auto-generated Prisma Client (no manual DAO/repo boilerplate)
- ✅ Schema versioning with migrations (safe deployments)
- ✅ Visual schema editor (Prisma Studio)
- ✅ PostgreSQL is rock-solid and scalable
- ✅ No vendor lock-in (can always write raw SQL)

### Negative
- ⚠️ Learning curve - Prisma has its own concepts and syntax
- ⚠️ Overkill for very simple schemas
- ⚠️ Vendor dependency - Prisma team controls the tool (though open-source)
- ⚠️ Migration complexity - Multi-database deployments need environment-specific configs

## Alternatives Considered

### Option A: MongoDB + Mongoose
**Why Rejected**:
- Document databases not ideal for structured relational data (experiences → users → role)
- SQL easier for complex queries and filtering
- PostgreSQL more suitable for portfolio/blog data

### Option B: Raw SQL + Query Builder (Knex.js)
**Why Rejected**:
- Type safety requires manual DTO interfaces (error-prone)
- More boilerplate code for CRUD operations
- Less enjoyable developer experience vs Prisma

### Option C: TypeORM
**Why Rejected**:
- More complex setup than Prisma
- Decorators approach less familiar to team
- Prisma's generated client is simpler and more type-safe

### Option D: Firebase/Firestore
**Why Rejected**:
- Vendor lock-in (hard to migrate away)
- Complex pricing model
- Not suitable for complex relational queries

## Implementation Notes

### PostgreSQL Setup

**Local Development**:
```bash
# Via Docker Compose
docker-compose up postgres

# Or Homebrew (macOS)
brew install postgresql
brew services start postgresql
```

**Environment**:
```env
DATABASE_URL=postgresql://admin:password@localhost:5432/personal_site?schema=public
```

**Prisma Integration** (Now Drizzle - see [ADR-003](./0003-drizzle-orm-migration.md)):
```typescript
// Generate Drizzle migrations
npm run drizzle:generate

// Create schema (see src/infrastructure/persistence/schema.ts)

// Apply migrations
npm run drizzle:migrate -w packages/backend

// View via Drizzle Studio
npm run drizzle:studio -w packages/backend
```

### Schema Design

**Key Principles**:
- Normalize data (avoid duplication)
- Use constraints (unique, required fields)
- Index frequently-queried columns
- Add audit fields (createdAt, updatedAt)

**Example Model**:
```prisma
model Experience {
  id          Int     @id @default(autoincrement())
  company     String  @db.VarChar(255)
  role        String  @db.VarChar(255)
  startDate   DateTime
  endDate     DateTime?
  description String? @db.Text
  skills      String[]          // Array support
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([startDate])  // Index for sorting
}
```

### Repository Pattern Implementation

**Interface** (Domain layer):
```typescript
export interface IExperienceRepository {
  findAll(): Promise<Experience[]>;
  findById(id: number): Promise<Experience | null>;
  create(input: CreateExperienceInput): Promise<Experience>;
}
```

**Implementation** (Infrastructure layer - now using Drizzle, see [ADR-003](./0003-drizzle-orm-migration.md)):
```typescript
export class DrizzleExperienceRepository implements IExperienceRepository {
  async findAll() {
    return db.select().from(experiences).orderBy(desc(experiences.startDate));
  }
  // ... etc
}
```

This keeps Drizzle details isolated, allowing swaps later if needed.

### Migrations

**Creating Migrations**:
```bash
# From workspace root, runs interactive migration
npm run prisma:migrate -w packages/backend
# You'll be prompted to name the migration (e.g., "add_projects")

# Or directly from backend package
cd packages/backend
npx prisma migrate dev --name create_experience_table
```

**Applying in Production**:
```bash
# Migrations run automatically on deploy
# Or manually:
npm run prisma:migrate deploy
```

### Backup & Scaling

**Backup**:
```bash
# pg_dump
docker exec postgres pg_dump -U admin personal_site > backup.sql

# Restore
docker exec -i postgres psql -U admin personal_site < backup.sql
```

**Scaling**:
- Read replicas for read-heavy workloads
- Connection pooling (PgBouncer) for many connections
- Sharding (rarely needed for this scale)

## Related ADRs

- [ADR-001: Use Clean Architecture Pattern](./0001-clean-architecture.md) (repositories still implement domain interfaces)
- [ADR-003: Migrate from Prisma ORM to Drizzle ORM](./0003-drizzle-orm-migration.md) (ORM choice superseded by this)

---

**Last Updated**: February 2026 (Superseded - see ADR-003 for current ORM implementation)
