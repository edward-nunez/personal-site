# Frontend - Personal Site

Modern React 19 single-page application (SPA) built with Vite, TailwindCSS v4, and TypeScript. This is the frontend package of the Personal Site monorepo.

## Tech Stack

- **React 19** - UI framework with automatic JSX transform
- **Vite 7** - Fast build tool with HMR (Hot Module Replacement)
- **TailwindCSS v4** - Utility-first CSS framework
- **TypeScript 5** - Type-safe JavaScript
- **React Router v7** - Client-side routing
- **TanStack Query v5** - Server state management
- **Radix UI** - Unstyled, accessible component primitives (shadcn/ui)
- **React Hook Form** - Performant form validation
- **Zod** - TypeScript-first schema validation
- **Framer Motion** - Animation library
- **Vitest** - Unit testing framework
- **Lucide React** - Icon library

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Development

From the **monorepo root**:

```bash
# Install dependencies (if not already done)
npm install

# Start frontend dev server only
npm run dev:frontend

# Or start all services (backend + frontend)
npm run dev
```

From the **frontend package directory**:

```bash
cd packages/frontend

# Start dev server
npm run dev
```

The app will be available at **http://localhost:5173**

### Building

```bash
# From monorepo root
npm run build:frontend

# From frontend directory
npm run build
```

Production build outputs to `dist/` directory.

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Shared React components
│   ├── common/      # Reusable UI components
│   └── layout/      # Layout components (Header, Footer, etc.)
├── data/            # Static data and constants
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and helpers
├── pages/           # Page-level components (routes)
├── test/            # Test utilities and setup
├── App.tsx          # Root application component
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

**Note**: Vite exposes environment variables prefixed with `VITE_` to the client bundle.

## Configuration Files

- **vite.config.ts** - Vite configuration (build, dev server, plugins)
- **vitest.config.ts** - Vitest testing configuration
- **tsconfig.json** - TypeScript compiler options
- **tailwind.config.js** - TailwindCSS configuration (if present)
- **eslint.config.js** - ESLint linting rules
- **components.json** - shadcn/ui component configuration

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint rules (enforced in pre-commit hooks)
- Use Prettier for code formatting
- Prefer functional components with hooks

### Component Patterns
- Keep components small and focused
- Use composition over prop drilling
- Extract reusable logic into custom hooks
- Colocate related files (component + styles + tests)

### State Management
- Use **TanStack Query** for server state
- Use **React Context** or **Zustand** for client state
- Avoid prop drilling; lift state only when necessary

### Styling
- Use TailwindCSS utility classes
- Use `cn()` helper from `lib/utils.ts` for conditional classes
- Prefer component composition over custom CSS

### API Integration
- API client configured in `src/lib/api.ts` (if present)
- Use TanStack Query hooks for data fetching
- Handle loading, error, and success states

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |

## Deployment

### Docker

Build the frontend Docker image:

```bash
# From monorepo root (context must be repo root)
docker build -t personal-site-frontend:latest -f packages/frontend/Dockerfile .
```

### Kubernetes

Deploy using Helm from the monorepo root:

```bash
helm install personal-site ./helm -n personal-site --create-namespace
```

See [../../helm/README.md](../../helm/README.md) for Kubernetes deployment details.

### Static Hosting

The production build (`dist/`) is a static SPA that can be deployed to:
- HAProxy (current Docker setup)
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

**Important**: Configure the server to redirect all routes to `index.html` for client-side routing to work.

## Contributing

See the main project [CONTRIBUTING.md](../../docs/CONTRIBUTING.md) guide for:
- Git workflow
- Branch naming conventions
- Commit message format
- Code review process

## Documentation

For full project documentation, start at the [documentation index](../../docs/index.md). Key docs:

- [Getting Started](../../docs/GETTING_STARTED.md) - Setup, Docker, first run
- [Architecture Guide](../../docs/ARCHITECTURE.md) - Backend and frontend structure
- [API Reference](../../docs/API_REFERENCE.md) - Backend endpoints
- [Testing Guide](../../docs/TESTING.md) - How to run and add tests

## Troubleshooting

### Port already in use
If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.)

### Hot reload not working
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server

### Build fails
- Clear dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

## License

See [../../LICENSE](../../LICENSE) for project license information.
