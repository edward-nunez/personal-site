# ADR-003: Migrate from Prisma ORM to Drizzle ORM

**Date**: February 2026  
**Status**: Accepted  
**Stakeholders**: Backend Team, DevOps

## Context

We initially adopted Prisma ORM for its excellent developer experience and type safety. However, after working with it in production, we discovered several friction points:

- **Complex migration management** - Prisma migrations can be fragile with multiple database instances
- **Limited query control** - Difficulty with complex custom queries without raw SQL
- **Overkill for simple schemas** - Our relatively simple 6-table schema doesn't need Prisma's abstraction layer
- **Better alternatives exist** - Drizzle offers similar DX with better control and lighter weight

## Decision

We will **migrate from Prisma ORM to Drizzle ORM** while keeping PostgreSQL as the database.

## Rationale

### Why Drizzle?

**Type Safety (Equal to Prisma)**
- Full TypeScript support with auto-generated types
- SQL-first approach (types derived from actual SQL)
- Type-safe query builder, not another abstraction layer

**Developer Experience**
- More intuitive for SQL developers
- Easier to write complex queries
- Better control when you need raw SQL
- Smaller bundle size (~80KB vs Prisma ~450KB)

**Query Control**
- Direct SQL query builder, not another layer
- Exact query optimization visible in code
- Can mix SQL builder with raw SQL seamlessly
- Better for complex filtering, aggregations, and JOINs

**Lighter Weight**
- ~80KB runtime vs Prisma's ~450KB
- Fewer dependencies
- Faster build times
- Better performance for Edge/Serverless deployments

**Better for Our Use Case**
- Simple 6-table schema (doesn't need Prisma's power)
- Mostly standard CRUD operations (Drizzle excels here)
- Some complex queries (Drizzle's SQL builder is superior)
- Future edge computing (Drizzle has better support)

### Comparison Matrix

| Feature | Prisma | Drizzle | Winner |
|---------|--------|---------|--------|
| Type Safety | ✅ Excellent | ✅ Excellent | Tie |
| Learning Curve | ⚠️ Steeper | ✅ Gentler | Drizzle |
| Query Control | ⚠️ Limited | ✅ Full | Drizzle |
| Bundle Size | ⚠️ 450KB | ✅ 80KB | Drizzle |
| Complex Queries | ⚠️ Awkward | ✅ Natural | Drizzle |
| Raw SQL | ⚠️ Secondary | ✅ First-class | Drizzle |
| Edge/Serverless | ⚠️ Poor | ✅ Good | Drizzle |
| Community | ✅ Large | ⚠️ Growing | Prisma |
| Maturity | ✅ Mature | ⚠️ Newer | Prisma |

## Migration Details

### What Changed

**Removed**:
- `@prisma/client` dependency
- `@prisma/adapter-pg` dependency
- `prisma` dev dependency
- `packages/backend/prisma/` directory (schema, migrations, seed)
- `packages/backend/src/infrastructure/persistence/prismaClient.ts`
- All `Prisma*Repository.ts` implementations

**Added**:
- `drizzle-orm` dependency (runtime)
- `drizzle-kit` dev dependency
- `packages/backend/drizzle.config.ts` (config file)
- `packages/backend/src/infrastructure/persistence/schema.ts` (table definitions)
- `packages/backend/src/infrastructure/persistence/db.ts` (client singleton)
- All `Drizzle*Repository.ts` implementations
- `packages/backend/drizzle/seed.ts` (seed script)
- `packages/backend/drizzle/migrations/` (auto-generated)

### Benefits Realized

✅ **Simpler database access** - SQL-first approach is more intuitive  
✅ **Better query performance** - Direct control over queries  
✅ **Smaller dependencies** - 80KB vs 450KB  
✅ **Cleaner migrations** - No complex metadata files  
✅ **Future-proof** - Better support for Edge/Serverless  
✅ **Same type safety** - All benefits of TypeScript ORM  

### Tradeoffs

⚠️ **Smaller ecosystem** - Drizzle is newer (though growing rapidly)  
⚠️ **Fewer built-in features** - No relation loading shortcuts like Prisma  
⚠️ **Repository pattern change** - More explicit SQL vs Prisma's abstraction  

## Implementation Notes

### New Scripts

```bash
# Database Management
npm run drizzle:generate   # Generate migrations from schema
npm run drizzle:migrate    # Apply migrations to database
npm run drizzle:push       # Push schema directly (no migration file)
npm run drizzle:studio     # Open Drizzle Studio (visual DB explorer)
npm run drizzle:seed       # Seed database with sample data
```

### Schema Definition

Tables are now defined in `packages/backend/src/infrastructure/persistence/schema.ts`:

```typescript
import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const experiences = pgTable('experiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  company: text('company').notNull(),
  role: text('role').notNull(),
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  // ... more columns
});
```

### Repository Pattern

Repositories now use Drizzle's query builder:

```typescript
import { db } from '../persistence/db.js';
import { experiences } from '../persistence/schema.js';
import { eq, desc } from 'drizzle-orm';

export class DrizzleExperienceRepository implements IExperienceRepository {
  async findAll() {
    return db.select().from(experiences).orderBy(desc(experiences.startDate));
  }
  
  async findById(id: string) {
    const rows = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
    return rows[0] ?? null;
  }
}
```

### Architecture Impact

**Domain Layer** - ✅ No changes (still interfaces)  
**Application Layer** - ✅ No changes (use cases unaffected)  
**Infrastructure Layer** - 🔄 Repositories rewritten for Drizzle  
**Presentation Layer** - ✅ No changes (controllers unaffected)  

The repository pattern isolates the ORM choice, making this migration transparent to business logic.

## Migration Path

1. ✅ Install Drizzle dependencies
2. ✅ Create schema definition from Prisma schema
3. ✅ Generate initial Drizzle migration
4. ✅ Rewrite all repositories
5. ✅ Update DB client singleton
6. ✅ Update seed script
7. ✅ Test all CRUD operations
8. ✅ Update documentation
9. ✅ Deploy to production (migrations apply automatically)

## Related ADRs

- [ADR-001: Use Clean Architecture Pattern](./0001-clean-architecture.md) (repositories still implement domain interfaces)
- [ADR-002: Use PostgreSQL with Prisma ORM](./0002-postgresql-prisma.md) (superseded by this ADR for ORM choice)

## Further Reading

- [Drizzle Documentation](https://orm.drizzle.team/)
- [Drizzle vs Prisma Comparison](https://orm.drizzle.team/docs/comparisons)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Last Updated**: February 2026
