# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records - documents that capture important architectural decisions made during the project.

## Why ADRs?

ADRs serve as:
- **Historical context** - Understand WHY past decisions were made
- **Knowledge sharing** - Help new team members understand design philosophy
- **Decision documentation** - Avoid repeating past discussions
- **Design rationale** - Justify trade-offs made

## Format

Each ADR follows this structure:

```markdown
# ADR-###: [Title]

**Date**: YYYY-MM-DD  
**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-NNN

## Context
Problem or decision needed.

## Decision
What was chosen and why.

## Consequences
Positive and negative impacts.

## Alternatives Considered
Other options and why they were rejected.
```

## Active ADRs

| ID | Title | Status |
|----|----|--------|
| [001](./0001-clean-architecture.md) | Use Clean Architecture pattern | Accepted |
| [002](./0002-postgresql-prisma.md) | Use PostgreSQL with Prisma ORM | ⚠️ Superseded (see ADR-003) |
| [003](./0003-drizzle-orm-migration.md) | Migrate from Prisma ORM to Drizzle ORM | Accepted |
| (more as needed) | ... | Proposed/Accepted |

## Creating a New ADR

1. Choose next available number (e.g., ADR-003)
2. Create file: `docs/ADR/0003-[topic].md`
3. Use the template below
4. Submit as PR for team review
5. Update this index when accepted

---

## Template

```markdown
# ADR-NNN: [Decision Title]

**Date**: YYYY-MM-DD  
**Status**: Proposed | Accepted  
**Stakeholders**: List who should review  

## Context
What is the issue we're facing? Why do we need to make a decision?

## Decision
What option did we choose? State the decision clearly and concisely.

## Rationale
Why did we choose this over alternatives? What are the benefits?

## Consequences

### Positive
- Benefit 1
- Benefit 2

### Negative
- Trade-off 1
- Risk 1

## Alternatives Considered

### Option A: [Name]
Why we rejected this...

### Option B: [Name]
Why we rejected this...

## Implementation Notes
- How will this be implemented?
- What dependencies or migrations are needed?
- Timeline?

## Related ADRs
- Link to other related decisions
```

---

**Last Updated**: February 2026
