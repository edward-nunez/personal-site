# ⚡ Quick Start Guide

Welcome to **personal-site-v2**! This guide gets you running in minutes. Choose your path below based on your primary role.

---

## 🎯 Choose Your Path

- **Backend Developer?** → [Backend Quick Start](#-backend-developers-expressjs--clean-architecture)
- **Frontend Developer?** → [Frontend Quick Start](#-frontend-developers-react--vite)
- **DevOps/Infrastructure?** → [DevOps Quick Start](#-devopsininfrastructure-dockerkubernetes)

---

## 🔧 Backend Developers (Express.js + Clean Architecture)

### Setup in 3 Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   # Copy the example (check docker-compose.yml for defaults)
   # Create packages/backend/.env with:
   # DATABASE_URL=postgresql://admin:admin123@localhost:5432/personal_site
   # PORT=3000
   # JWT_SECRET=your-secret-key-change-in-production
   ```

3. **Start the backend**
   ```bash
   npm run dev:backend
   ```
   Server runs at `http://localhost:3000`

### Most Common Next Action
Run tests and explore the API: `npm run test:backend` then visit `http://localhost:3000/health`

### 📚 Detailed Guide
See [guides/FEATURE_DEVELOPMENT.md](./guides/FEATURE_DEVELOPMENT.md) for Clean Architecture patterns, repository interfaces, and use case implementations.

---

## ⚛️ Frontend Developers (React + Vite)

### Setup in 3 Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   # Create packages/frontend/.env with:
   # VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Start the frontend**
   ```bash
   npm run dev:frontend
   ```
   App runs at `http://localhost:5173`

### Most Common Next Action
Explore components in `src/design-system/` and run tests: `npm test -w packages/frontend`

### 📚 Detailed Guide
See [architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md) for component structure, TanStack Query patterns, and styling with TailwindCSS v4.

---

## 🐳 DevOps/Infrastructure (Docker/Kubernetes)

### Setup in 3 Steps

1. **Start the full stack locally**
   ```bash
   docker-compose up -d
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`
   - PostgreSQL: `localhost:5432`

2. **Verify health**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Deploy to Kubernetes**
   ```bash
   helm install personal-site ./helm -n personal-site --create-namespace
   ```

### Most Common Next Action
Check logs: `docker-compose logs -f backend` or view Helm values: `helm/values.yaml`

### 📚 Detailed Guide
See [operations/DEPLOYMENT.md](./operations/DEPLOYMENT.md) for Kubernetes configuration, environment variables, and scaling.

---

## 🔗 What's Next?

- **Project Overview** → [SUMMARY.md](./SUMMARY.md)
- **Full Architecture** → [architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md)
- **Testing Strategy** → [guides/TESTING.md](./guides/TESTING.md)
- **API Reference** → [reference/API_REFERENCE.md](./reference/API_REFERENCE.md)
- **Observability Setup** → [observability/OVERVIEW.md](./observability/OVERVIEW.md)

---

## 💡 Pro Tips

- **Run everything locally:** `npm run dev` (starts backend + frontend)
- **See all available commands:** `npm run` in root or package directories
- **Database GUI:** `npm run drizzle:studio -w packages/backend`
- **Git hooks:** Husky auto-formats on commit (ESLint + Prettier)

**Happy coding!** 🚀
