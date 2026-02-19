# FitSync - LLM-Powered Job Assessment

A Node.js self-hosted AI microservice built with Express and Ollama, designed to evaluate job opportunities and engage in conversations to showcase your professional expertise.

## Features

- **Job Fit Assessment** — Analyze job postings and receive a fit score (0-100) with Edward's key strengths and growth areas
- **Intelligent Conversation** — Engage in natural conversations about your professional experience and capabilities
- **Portfolio Context** — Automatically fetches and uses your portfolio (experiences, projects, skills) to inform LLM responses
- **JWT Authentication** — Secure endpoints with JWT tokens aligned with the main backend
- **Clean Architecture** — Domain-driven design with separated concerns (Domain → Application → Infrastructure → Presentation)
- **CPU-Optimized** — Runs on standard CPU hardware using 13-14B parameter models (no GPU required)

## Prerequisites

### Required Services

1. **Ollama** — Local LLM inference engine
   - Download from [ollama.ai](https://ollama.ai)
   - After installation, run: `ollama serve`
   - Pull a 13-14B model: `ollama pull neural-chat` (or `llama2:13b`, `mistral`)

2. **Backend Service** — Running on port 3000
   - Provides JWT token validation
   - Exposes portfolio data endpoints (`/api/experiences`, `/api/projects`)

3. **Node.js** — v18+ with npm workspaces support

## Setup

### 1. Install Dependencies

```bash
# Install all workspace dependencies (from monorepo root)
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp packages/fit-sync/.env.example packages/fit-sync/.env
```

Edit `packages/fit-sync/.env`:

```env
PORT=3001
NODE_ENV=development
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=neural-chat
BACKEND_API_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-from-backend
LOG_LEVEL=info
```

**Key Variables:**
- `OLLAMA_HOST` — URL where Ollama is running
- `OLLAMA_MODEL` — Model name to use (must be pulled with `ollama pull <model>`)
- `BACKEND_API_URL` — URL of the main backend API
- `JWT_SECRET` — Must match the backend's JWT secret

### 3. Verify Ollama is Running

```bash
# Test Ollama API
curl http://localhost:11434/api/chat/completion -d '{"model":"neural-chat","messages":[{"role":"user","content":"hi"}]}'
```

Ollama should respond with a JSON completion. If it fails, start Ollama with `ollama serve`.

## Running the Service

### Development (with hot reload)

```bash
# Run FitSync service only
npm run dev:fit-sync

# Or run all services (backend, frontend, FitSync)
npm run dev
```

The service will start on `http://localhost:3001`

### Production

```bash
# Build TypeScript
npm run build:fit-sync

# Start compiled service
npm run start -w packages/fit-sync
```

## API Endpoints

All endpoints require JWT authentication in the `Authorization: Bearer <token>` header.

### Job Fit Assessment

**POST** `/api/assess/job-fit`

Evaluate how well a job opportunity aligns with your profile.

**Request:**

```json
{
  "jobTitle": "Senior DevOps Engineer",
  "jobDescription": "We're seeking a DevOps engineer with 5+ years of Kubernetes and AWS experience...",
  "company": "Tech Corp",
  "requiredSkills": ["Kubernetes", "AWS", "Terraform"],
  "yearsExperience": 5,
  "location": "Remote",
  "type": "full-time"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fitScore": 78,
    "fit": true,
    "recommendation": "I'm recommended for this role. My infrastructure background is solid and I'd bring real value to your team's DevOps efforts. While there are some areas to develop, I'm confident I can contribute meaningfully from day one.",
    "strengths": [
      {"title": "DevOps & Infrastructure Experience", "description": "I've spent over 5 years hands-on with DevOps and have solid Kubernetes expertise under my belt. This directly matches what you're looking for in your core infrastructure work."},
      {"title": "Cloud Platform Proficiency", "description": "My AWS background has given me real experience optimizing cloud costs and managing infrastructure at scale. I'm excited to bring those insights to your team."},
      {"title": "System Design Thinking", "description": "I've architected scalable solutions on projects like the Cloud Orchestrator, so I'm comfortable designing resilient systems that can grow with your needs."}
    ],
    "gaps": [
      "My Terraform experience is limited compared to what you're seeking—though I'm eager to level up here"
    ]
  }
}
```

### Conversation

**POST** `/api/assess/conversation`

Engage in a multi-turn conversation about your professional capabilities. The conversation maintains context through session management.

**First Message (New Conversation):**

```json
{
  "message": "What's your experience with implementing CI/CD pipelines?",
  "context": "technical"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "reply": "I have extensive experience building and optimizing CI/CD pipelines across multiple projects. I've worked with Jenkins, GitLab CI, and GitHub Actions, implementing automated testing, deployment stages, and rollback strategies for production environments.",
    "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }
}
```

**Follow-up Message (Continue Conversation):**

```json
{
  "message": "Can you tell me more about the GitHub Actions workflows you've built?",
  "context": "technical",
  "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

**Session Management:**
- Sessions are stored in-memory with a **30-minute TTL** (time-to-live)
- Sessions automatically expire after 30 minutes of inactivity
- Privacy-preserving: No conversation history stored in database
- Conversations are lost on server restart (by design)
- Maximum 10 exchanges per session (20 messages + system prompt)

**Context Options:**
- `"general"` — Balanced, professional response
- `"technical"` — Focus on technical skills and project experience
- `"culture"` — Emphasize work ethic, collaboration, and cultural fit
- `undefined` — Default balanced tone

### Health Check (No Auth Required)

**GET** `/api/health`

Simple health check endpoint to verify service is running.

**Response:**

```json
{
  "success": true,
  "data": {
    "service": "agent",
    "status": "running",
    "timestamp": "2026-02-16T10:30:00.000Z"
  }
}
```

## Architecture

### Clean Architecture Layers

```
src/
├── domain/                    # Business rules (no external deps)
│   ├── entities/             # Domain types (JobPosting, Assessment, etc.)
│   └── interfaces/           # Service contracts (IOllamaService, IPortfolioDataService)
├── application/               # Business logic
│   ├── use-cases/            # Feature implementations
│   │   └── assessment/
│   │       ├── ReviewJobOpportunity.usecase.ts
│   │       └── EngageInConversation.usecase.ts
│   └── dtos/                 # Request validation (Zod schemas)
├── infrastructure/            # External integrations
│   └── services/
│       ├── OllamaService.ts          # HTTP client to Ollama
│       └── PortfolioDataService.ts   # Fetches portfolio from backend
├── presentation/              # HTTP layer
│   ├── middleware/           # Auth, error handling
│   ├── routes/               # Route definitions
│   └── controllers/          # Endpoint handlers
├── shared/                    # Utilities
│   ├── errors/               # Custom error classes
│   └── utils/                # Logger, auth helpers
├── app.ts                     # Express configuration
└── index.ts                   # Server entry point
```

### Data Flow

```
Client Request
    ↓
[JWT Auth Middleware]
    ↓
[Route Handler / Controller]
    ↓
[Use Case] → [Portfolio Data Service] (fetch context from backend)
    ↓
[Ollama Service] → [HTTP to Ollama 11434]
    ↓
[LLM Response] → [Parse & Format]
    ↓
Client Response JSON
```

## Model Recommendations

### Neural Chat (Recommended)

```bash
ollama pull neural-chat
```

- **Size:** ~13B parameters
- **Speed:** 2-10 seconds per response on CPU
- **Strengths:** Good balance of speed, reasoning, and conversation quality
- **Use case:** Job assessments and multi-turn conversation

### Other Options

**Mistral 7B** (faster, smaller)

```bash
ollama pull mistral
```

- Size: 7B
- Speed: 1-5 seconds
- Better for quick responses, less nuanced reasoning

**Llama 2 13B** (versatile)

```bash
ollama pull llama2:13b
```

- Size: 13B
- Speed: 3-10 seconds
- Excellent reasoning and knowledge

**Llama 2 70B** (powerful, slower)

```bash
ollama pull llama2:70b
```

- Size: 70B
- Speed: 10-60 seconds (CPU inference is slow)
- Best reasoning but requires significant CPU resources

## Error Handling

The service uses typed error classes that return appropriate HTTP status codes:

| Error | Status | Example |
|-------|--------|---------|
| `ValidationError` | 400 | Invalid request body |
| `UnauthorizedError` | 401 | Missing/invalid JWT token |
| `OllamaConnectionError` | 503 | Ollama service not running |
| `OllamaTimeoutError` | 504 | Model inference timeout |

**Example Error Response:**

```json
{
  "success": false,
  "error": "Failed to connect to Ollama service",
  "message": "connect ECONNREFUSED 127.0.0.1:11434"
}
```

## Testing

### Run Tests

```bash
npm run test:agent
```

### Lint & Format

```bash
# Lint TypeScript
npm run lint:agent

# Fix linting issues
npm run lint:fix:agent

# Format code
npm run format:agent
```

## Environment-Specific Configuration

### Development

```env
NODE_ENV=development
LOG_LEVEL=debug
OLLAMA_HOST=http://localhost:11434
```

### Production

```env
NODE_ENV=production
LOG_LEVEL=info
OLLAMA_HOST=http://ollama-service:11434  # Container hostname
JWT_SECRET=<strong-secret-from-env>
```

## Troubleshooting

### "Ollama service is not running"

**Solution:** Start Ollama in a separate terminal:

```bash
ollama serve
```

Make sure `OLLAMA_HOST` in `.env` matches where Ollama is running.

### "Model not found" or inference fails

**Solution:** Download the model:

```bash
ollama pull neural-chat
```

Verify it's available:

```bash
ollama list
```

### "Invalid or expired token"

**Solution:** Request a new JWT token from the backend:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"password"}'
```

Use the returned `token` in the Authorization header:

```bash
curl http://localhost:3001/api/assess/health \
  -H "Authorization: Bearer <token>"
```

### Slow responses

**Solution:** CPU inference is inherently slow. Expected latency:

- First request to a model: 5-20 seconds (model loading)
- Subsequent requests: 2-10 seconds depending on model size and CPU

To speed up:
- Use a smaller model (Mistral 7B)
- Increase system RAM
- Close other applications consuming CPU
- Consider GPU acceleration (outside scope of current setup)

## Performance Considerations

### Response Time by Model

| Model | Size | Avg Latency | Notes |
|-------|------|------------|-------|
| Mistral | 7B | 1-5s | Fast, good for quick responses |
| Neural Chat | 13B | 2-10s | Balanced (recommended) |
| Llama 2 | 13B | 3-10s | Strong reasoning |
| Llama 2 | 70B | 20-60s | Powerful but slow on CPU |

### System Requirements

- **CPU:** Modern multi-core processor (8+ cores recommended)
- **RAM:** 16GB+ (model loading + inference)
- **Disk:** 20GB+ (for model files)
- **Network:** Negligible (all processing local)

## Integration with Main Backend

The FitSync service integrates with the main backend to:

1. **Validate JWT tokens** — Uses the same `JWT_SECRET`
2. **Fetch portfolio data** — Calls `/api/experiences` and `/api/projects`
3. **Share authentication model** — Same Bearer token pattern

No database changes or migrations required — completely independent service.

## Future Enhancements

- [ ] Conversation history (persist in database or client-side)
- [ ] Multi-turn context (remember previous messages in conversation)
- [ ] Custom prompts (allow different assessment frameworks)
- [ ] Response streaming (SSE for real-time token generation)
- [ ] More Ollama model options (in UI configuration)
- [ ] Rate limiting per user
- [ ] Performance metrics and logging

## Contributing

Follow the Clean Architecture patterns when adding features:

1. Define domain entities/interfaces
2. Implement use cases in application layer
3. Create infrastructure services for external calls
4. Wire up in presentation routes
5. Add tests for use cases
6. Update documentation

## License

MIT
