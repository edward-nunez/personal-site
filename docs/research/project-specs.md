The project specification is now mature and ready for implementation. Below is the **final consolidated Project Request** followed by a precise, actionable implementation plan.

```markdown
# Project Name
Edward Nunez Personal Site

## Target Audience
Prospective clients, employers, recruiters, and technical peers seeking a Senior DevSecOps Engineer, Cloud Architect, and Lead Software Engineer with full-stack and game development experience.

## Desired Features
### Core Pages & Navigation
- [ ] Responsive SPA with persistent navigation bar and footer.
  - [ ] Pages: Home, About, Experience, Projects, Blog, Consultation, Contact.

### Professional Showcase
- [ ] Experience: Searchable, filterable timeline of roles, skills, achievements.
- [ ] About: Professional bio, skills matrix, certifications.

### Portfolio & Projects
- [ ] Projects page: Grid of cards with detailed modal/view for each project.
  - [ ] Godot game project: Embedded playable Web export (iframe), screenshots, dev logs link to blog category.
  - [ ] Searchable by technology, type, or keyword.

### Blog
- [ ] Listing and individual post views.
  - [ ] Dedicated “Godot Development” category.
  - [ ] Full-text search across all posts.
  - [ ] Markdown content.

### Forms & Interaction
- [ ] Contact form → stored in DB.
- [ ] Consultation request form → stored in DB.
- [ ] Global site search covering Experience, Projects, and Blog.

### Admin Panel
- [ ] JWT-protected admin section/routes for full CRUD on:
  - Experience entries
  - Projects
  - Blog posts
  - Form submissions (view/mark as read)

### Analytics & SEO
- [ ] Plausible Analytics integration (script in <head>).
- [ ] Comprehensive SEO: meta tags, Open Graph, JSON-LD structured data, sitemap.xml, robots.txt.

## Design Requests
- [ ] Monochromatic black & white theme with red-orange accents.
- [ ] Mobile-first responsive design (breakpoints: sm, md, lg, xl).
- [ ] WCAG 2.1 AA compliance (semantic HTML, ARIA, keyboard navigation, alt text, contrast ≥ 4.5:1).
- [ ] Performance optimizations: lazy loading, code splitting, image optimization.

## Other Notes
- [ ] Security: HTTPS only, CSP headers, rate limiting on forms, input sanitization, JWT auth for admin.
- [ ] Deployment: Docker containers → DigitalOcean Kubernetes via Helm, CI/CD with GitHub Actions + security scans.
```

### Requirements

**Functional**
- Public read-only access to all content.
- Global search (client-side or lightweight backend).
- Embedded Godot Web exports via iframe.
- Contact & Consultation form submissions persisted in PostgreSQL.
- JWT-protected admin CRUD interface.
- Plausible Analytics tracking.

**Non-Functional**
- Browser compatibility: Last 2 versions of modern browsers.
- Performance: Lighthouse ≥ 95 (mobile/desktop).
- Accessibility: WCAG 2.1 AA.
- Security: OWASP top 10 mitigations, secret management via Kubernetes secrets.
- Scalability: Stateless Node.js pods behind Ingress.
- Observability: PM2 logs, Plausible dashboard.

### Specifications

**High-Level Architecture**
```
Browser (HTTPS)
   └──> Ingress Controller (TLS termination, rate limiting)
         ├── static.edwardnunez.com → React build files (served via Nginx or Express fallback)
         └── api.edwardnunez.com → Node.js/Express (PM2 clustered)
                └── PostgreSQL (DigitalOcean Managed or pod)
```

**Tech Stack**
- Frontend: React 18 + TypeScript + Vite
- Routing: React Router v6
- State: React Query (for data fetching) + Zustand (light global state)
- Styling: Tailwind CSS + Headless UI (accessible components)
- Forms: React Hook Form + Zod
- Markdown: react-markdown + remark-gfm
- Search: Fuse.js (client-side fuzzy search)
- Auth: JWT (httpOnly cookie) + simple login endpoint
- Backend: Express.js + TypeScript + Prisma ORM
- Process Manager: PM2 (in Docker container)
- Analytics: Plausible script
- Container: Multi-stage Docker build

**Key Data Models** (Prisma)
```prisma
model Experience { ... }       // as previously defined
model Project { ... }
model BlogPost { ... }
model ContactSubmission { ... }
model ConsultationSubmission { ... }
model AdminUser { id Int @id @default(autoincrement()) hashedPassword String }
```

### Implementation Plan

**Phase 0: Repository & CI/CD Setup (1-2 days)**
1. Create monorepo (or separate frontend/backend).
2. GitHub Actions workflows:
   - Lint + type check + test
   - Build Docker images on tag
   - Trivy vulnerability scan
   - Snyk/npm audit
3. Configure repository secrets for Docker Hub / DigitalOcean.

**Phase 1: Backend & Database (4-5 days)**
1. Initialize Express + TypeScript + Prisma.
2. Define schema, run `prisma migrate dev`.
3. Implement JWT auth middleware (simple login with bcrypt).
4. CRUD routes for all models (public read + protected write).
5. Form endpoints with Zod validation + rate limiting (express-rate-limit).
6. Error handling, logging (winston or pino).

**Phase 2: Frontend Core (6-8 days)**
1. Vite + React + TypeScript + Tailwind setup.
2. Shared layout: Navbar, Footer, Theme provider.
3. Implement pages:
   - Home (hero + recent projects/blog)
   - About
   - Experience (timeline component + Fuse.js search)
   - Projects (grid + detail modal, iframe embed for Godot)
   - Blog (listing + post view with react-markdown)
   - Consultation & Contact forms
4. Global search component using Fuse.js indexed data.

**Phase 3: Admin Panel (3-4 days)**
1. Protected route `/admin` with login form.
2. Dashboard with CRUD forms for each entity.
3. Re-use same API endpoints with auth header.

**Phase 4: Polish & Optimizations (4-5 days)**
1. Accessibility audit (axe-core, manual keyboard testing).
2. Performance:
   - Route-based code splitting
   - Lazy load images (react-lazy-load-image-component)
   - Optimize Godot export assets
3. SEO: vite-plugin-pages + react-helmet-async for dynamic meta.
4. Add Plausible script (environment variable for self-hosted URL).
5. Generate sitemap.xml at build time.

**Phase 5: Containerization & Deployment (3-4 days)**
1. Multi-stage Dockerfile:
   ```dockerfile
   # Backend
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:20-alpine
   WORKDIR /app
   RUN npm install pm2 -g
   COPY --from=builder /app/dist ./dist
   COPY ecosystem.config.js .
   CMD ["pm2-runtime", "ecosystem.config.js"]
   ```
   `ecosystem.config.js`:
   ```js
   module.exports = {
     apps: [{
       name: 'api',
       script: 'dist/index.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: { NODE_ENV: 'production' }
     }]
   };
   ```
2. Helm chart with:
   - Deployment (backend)
   - Service + Ingress (TLS via cert-manager)
   - PostgreSQL (or external managed DB connection)
3. Deploy and test on DigitalOcean Kubernetes.

**Total Estimated Effort**: 4–6 weeks part-time, ~120–150 hours.

This plan is production-grade, secure, performant, and fully demonstrates your expertise in modern full-stack development, DevSecOps practices, and cloud-native deployment.

If this specification and plan meet your approval, we can proceed to detailed component breakdowns, Helm chart templates, or begin implementation on any specific phase. Let me know how you'd like to move forward!