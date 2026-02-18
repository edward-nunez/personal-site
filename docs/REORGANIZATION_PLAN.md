# Documentation Reorganization Plan

This document provides a concrete, step-by-step plan to implement the audit recommendations.

---

## Current vs. Proposed Structure

### Current (Flat - Hard to Navigate)
```
docs/
├── README.md ............................ Main index
├── ARCHITECTURE.md ..................... Architecture (693 lines) 
├── DEPLOYMENT.md ....................... Deployment (664 lines)
├── FEATURE_DEVELOPMENT.md .............. Feature dev (897 lines)
├── FEATURE_FLAGS.md .................... Feature flags (321 lines)
├── FRONTEND_OBSERVABILITY.md ........... Frontend observability (480 lines)
├── OBSERVABILITY.md .................... Backend observability (390 lines)
├── OBSERVABILITY_SETUP.md .............. Backend observability setup (338 lines)
├── API_REFERENCE.md .................... API docs
├── TESTING.md .......................... Testing guide (221 lines)
├── OPERATIONS.md ....................... Operations (729 lines)
├── SERVICE_CONTRACTS.md ................ Service contracts (563 lines)
├── GLOSSARY.md ......................... Glossary (280 lines)
├── GETTING_STARTED.md .................. Getting started (452 lines)
├── openapi.yaml ....................... OpenAPI spec
├── ADR/ ................................ Architecture decisions
└── research/ ........................... Research notes
```

**Problems**: Flat structure, overlapping content, 17 files at root level

---

### Proposed (Organized by Purpose - Easy to Navigate)
```
docs/
│
├── README.md .......................... Main navigation hub (update)
├── QUICK_START.md .................... NEW: 5-minute quick start
├── CHANGELOG.md ...................... NEW: Track doc updates
│
├── guides/ ........................... FOLDER: How-to guides & tutorials
│   ├── README.md ..................... NEW: Guides index
│   ├── GETTING_STARTED.md ............ MOVED: Getting started (452 lines)
│   ├── FEATURE_DEVELOPMENT.md ........ MOVED: Feature dev (897 lines)
│   └── TESTING.md .................... MOVED: Testing (221 lines)
│
├── reference/ ........................ FOLDER: API & reference docs
│   ├── README.md ..................... NEW: Reference index
│   ├── API_REFERENCE.md .............. MOVED: API docs
│   ├── SERVICE_CONTRACTS.md .......... MOVED: Service contracts (563 lines)
│   ├── GLOSSARY.md ................... MOVED: Glossary (280 lines)
│   ├── FEATURE_FLAGS.md .............. MOVED: Feature flags (321 lines)
│   └── openapi.yaml .................. MOVED: OpenAPI spec
│
├── operations/ ....................... FOLDER: Deployment & runbooks
│   ├── README.md ..................... NEW: Operations index
│   ├── DEPLOYMENT.md ................. MOVED: Deployment (664 lines)
│   └── OPERATIONS.md ................. MOVED: Operations (729 lines)
│
├── architecture/ ..................... FOLDER: Design & decisions
│   ├── README.md ..................... NEW: Architecture index
│   ├── ARCHITECTURE.md ............... MOVED: Architecture (693 lines)
│   └── ADR/ .......................... MOVED: Architecture Decision Records
│       ├── README.md ................. (existing)
│       ├── 0001-clean-architecture.md (existing)
│       └── ...
│
├── observability/ .................... FOLDER: Monitoring & error tracking
│   ├── README.md ..................... NEW: Observability index
│   ├── OVERVIEW.md ................... NEW: Concepts & overview
│   ├── BACKEND.md .................... NEW: Consolidate OBSERVABILITY.md
│   │                                    + OBSERVABILITY_SETUP.md
│   ├── FRONTEND.md ................... MOVED: Rename FRONTEND_OBSERVABILITY.md
│   └── TROUBLESHOOTING.md ............ NEW: Common issues & solutions
│
└── research/ ......................... FOLDER: Research notes
    ├── README.md ..................... NEW: Research index
    └── project-specs.md .............. (existing)
```

**Benefits**: Clear structure, logical grouping, easy to navigate, scales well

---

## Migration Checklist

### Phase 1: Create Directory Structure (Minimal disruption)

- [ ] Create new directories:
  ```bash
  mkdir -p docs/guides
  mkdir -p docs/reference
  mkdir -p docs/operations
  mkdir -p docs/architecture
  mkdir -p docs/observability
  mkdir -p docs/research
  ```

- [ ] Create placeholder `README.md` files in each directory (fill in content later):
  ```bash
  touch docs/guides/README.md
  touch docs/reference/README.md
  touch docs/operations/README.md
  touch docs/architecture/README.md
  touch docs/observability/README.md
  touch docs/research/README.md
  ```

- [ ] Git commit: `docs: create directory structure (no content changes)`

### Phase 2: Create New Documents

**Create: `docs/QUICK_START.md`**
- 5-minute getting started for backend devs
- 5-minute getting started for frontend devs
- 5-minute getting started for DevOps
- Link to detailed guides

**Create: `docs/observability/OVERVIEW.md`**
- What observability means in this project
- Why LaunchDarkly (business value)
- For backend vs. frontend developers
- Quick navigation: "Which doc should I read?"

**Create: `docs/observability/TROUBLESHOOTING.md`**
- Extract troubleshooting sections from:
  - OBSERVABILITY.md
  - OBSERVABILITY_SETUP.md
  - FRONTEND_OBSERVABILITY.md
- Consolidate into single troubleshooting guide

**Create: `docs/CHANGELOG.md`**
- Format: `## YYYY-MM-DD | Version X.Y`
- Track: Document additions, consolidations, deprecations
- Start entries from today forward

---

### Phase 3: Reorganize Existing Files

**Move to `docs/guides/`**
```bash
mv docs/GETTING_STARTED.md docs/guides/
mv docs/FEATURE_DEVELOPMENT.md docs/guides/
mv docs/TESTING.md docs/guides/
```

**Move to `docs/reference/`**
```bash
mv docs/API_REFERENCE.md docs/reference/
mv docs/SERVICE_CONTRACTS.md docs/reference/
mv docs/GLOSSARY.md docs/reference/
mv docs/FEATURE_FLAGS.md docs/reference/
mv docs/openapi.yaml docs/reference/
```

**Move to `docs/operations/`**
```bash
mv docs/DEPLOYMENT.md docs/operations/
mv docs/OPERATIONS.md docs/operations/
```

**Move to `docs/architecture/`**
```bash
mv docs/ARCHITECTURE.md docs/architecture/
mv docs/ADR docs/architecture/
```

**Consolidate observability docs**
```bash
# Move to observability folder for consolidation
mv docs/OBSERVABILITY.md docs/observability/
mv docs/OBSERVABILITY_SETUP.md docs/observability/
mv docs/FRONTEND_OBSERVABILITY.md docs/observability/
```

---

### Phase 4: Consolidate Observability Docs

This is the high-impact change. Create unified structure:

**Create: `docs/observability/BACKEND.md`**
- Merge content from:
  - `OBSERVABILITY.md` (backend focus sections)
  - `OBSERVABILITY_SETUP.md` (step-by-step, no duplication)
- Keep structure: Overview → Setup → Configuration → Troubleshooting
- Remove duplicates, keep best explanation

**Rename: `docs/observability/FRONTEND.md`**
- Rename from FRONTEND_OBSERVABILITY.md
- Update to reference backend docs where needed
- Clear separation: "For frontend developers only"

**Delete**: 
```bash
rm docs/observability/OBSERVABILITY.md  # Merged into BACKEND.md
rm docs/observability/OBSERVABILITY_SETUP.md  # Merged into BACKEND.md
```

**Update**: `docs/observability/README.md`
```markdown
# Observability Setup

Choose your guide based on role:

**👨‍💻 Backend Developer**
Start with [Backend Setup Guide](./BACKEND.md)

**⚛️ Frontend Developer**
Start with [Frontend Setup Guide](./FRONTEND.md)

**🔧 Having Issues?**
See [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

## What This Covers

- Automatic error tracking and monitoring
- Error sampling (production: 10%, dev: 100%)
- Integration with LaunchDarkly observability SDK
```

---

### Phase 5: Fill Directory READMEs

Create navigation guides for each major section:

**`docs/guides/README.md`**
```markdown
# Developer Guides

Step-by-step tutorials for common development tasks.

## Getting Started
- [Getting Started](./GETTING_STARTED.md) - Set up local environment

## Development
- [Feature Development](./FEATURE_DEVELOPMENT.md) - Add new features
- [Testing](./TESTING.md) - Write and run tests

## Time Estimates
- Getting Started: 15 minutes
- Your first feature: 30-60 minutes
```

**`docs/reference/README.md`**
```markdown
# Reference Documentation

API specs, contracts, and definitions.

## Guides
- [API Reference](./API_REFERENCE.md) - Complete endpoint documentation
- [Service Contracts](./SERVICE_CONTRACTS.md) - Inter-service communication
- [Feature Flags](./FEATURE_FLAGS.md) - LaunchDarkly feature management
- [Glossary](./GLOSSARY.md) - Technical terms and definitions

## Formats
- [OpenAPI Spec](./openapi.yaml) - Swagger/OpenAPI specification
```

**`docs/operations/README.md`**
```markdown
# Operations & Deployment

For DevOps, SRE, and on-call teams.

## Guides
- [Deployment Guide](./DEPLOYMENT.md) - Docker & Kubernetes deployment
- [Operations](./OPERATIONS.md) - Runbooks, troubleshooting, monitoring

Use Deployment for: Initial setup, CI/CD pipelines
Use Operations for: Production runbooks, incident response
```

**`docs/architecture/README.md`**
```markdown
# Architecture & Design

System design, architectural patterns, and decisions.

## Guides
- [Architecture Guide](./ARCHITECTURE.md) - System overview, layer breakdown
- [Architecture Decision Records](./ADR/) - Historical design decisions

## Why Decisions Matter
Each ADR captures the context, rationale, and trade-offs of past decisions.
```

**`docs/observability/README.md`** (already mentioned above)

**`docs/research/README.md`**
```markdown
# Research & Notes

Exploration documents and research notes.

This folder contains:
- Design explorations
- Investigation notes
- POC documentation
```

---

### Phase 6: Update Links & References

**Update main `docs/README.md`**
- Add new structure explanation
- Update "Quick Navigation" to use new paths
- Add time estimates
- Add "Search by audience" section

**Find and update all internal links**
```bash
# Search for old paths
grep -r "ARCHITECTURE.md" docs/
grep -r "GETTING_STARTED.md" docs/
# Update to new paths (e.g., architecture/ARCHITECTURE.md)
```

**Update root-level references**
- Check [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) for doc links
- Update [root `README.md`](../README.md) if it references docs

---

### Phase 7: Git & Communication

**Commit strategy** (don't do it all in one monster commit):
```bash
# Commit 1: Create directory structure
git add docs/guides docs/reference docs/operations docs/architecture docs/observability docs/research
git commit -m "docs: create directory structure for improved organization"

# Commit 2: Create new documents
git add docs/QUICK_START.md docs/CHANGELOG.md
git commit -m "docs: add quick start and changelog"

# Commit 3: Move guide docs
git add docs/{guides,reference,operations,architecture,observability}
git commit -m "docs: reorganize existing documentation into categories

- guides/: Getting started, feature development, testing
- reference/: API, service contracts, glossary
- operations/: Deployment, operations, runbooks
- architecture/: Architecture guide, ADRs
- observability/: Monitoring setup (backend & frontend)"

# Commit 4: Consolidate observability
git add docs/observability/
git commit -m "docs: consolidate observability documentation

- Merge OBSERVABILITY.md + OBSERVABILITY_SETUP.md → BACKEND.md
- Rename FRONTEND_OBSERVABILITY.md → FRONTEND.md
- Create unified observability overview and troubleshooting guides
- Remove duplicate content"

# Commit 5: Update documentation index
git add docs/README.md docs/*/*README.md
git commit -m "docs: update navigation and indexing for new structure"
```

**Communicate to team**:
```markdown
📚 Documentation Reorganization Complete

We've reorganized docs/ for better navigation:
- New folders: guides/, reference/, operations/, architecture/, observability/
- Consolidated observability docs (was 3, now 2 + index)
- Added QUICK_START.md for 5-minute onboarding

📍 Links have been updated. Old links still work (git preserves history).

🎯 Benefits:
- Easier to find docs by role (backend dev vs DevOps)
- Reduced content duplication (easier maintenance)
- Better scalability for future documentation growth
- Clear navigation for different audiences

Questions? See docs/README.md
```

---

## Rollback Plan

If you need to revert:
```bash
# See git history for each file
git log --name-status --oneline -- docs/

# Revert last N commits
git revert <commit-hash>
```

Since we're moving files (not deleting), old references still work in git history.

---

## Success Criteria

After implementation, verify:

- [ ] All internal links work (check with link validator)
- [ ] No broken references in root README or copilot-instructions
- [ ] Directory structure matches proposed layout
- [ ] Each directory has a README with navigation
- [ ] Observability docs merged (3 → 2 files)
- [ ] QUICK_START.md created and accurate
- [ ] Team can find docs faster (subjective but measurable via feedback)

---

## Effort Estimate

| Phase | Task | Time |
|-------|------|------|
| 1 | Create directories | 5 min |
| 2 | Create new docs (QUICK_START, consolidated observability) | 30 min |
| 3 | Move files | 10 min |
| 4 | Consolidate observability (merge + remove dupes) | 30 min |
| 5 | Fill directory READMEs | 20 min |
| 6 | Update links & references | 20 min |
| 7 | Git commits & communication | 15 min |
| **Total** | | **~2 hours** |

Plus testing/validation: ~1 hour

---

**Ready to implement? Start with Phase 1.**

