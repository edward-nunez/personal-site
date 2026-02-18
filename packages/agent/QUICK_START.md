# Agent Service - Quick Start Guide

## 1️⃣ Install Ollama

Download and install from [ollama.ai](https://ollama.ai) for your OS (Windows/Mac/Linux).

## 2️⃣ Pull a Model (13-14B recommended)

Open a terminal and run:

```bash
ollama pull neural-chat
```

Or choose an alternative:

```bash
ollama pull llama2:13b     # Excellent reasoning
ollama pull mistral        # Faster (7B)
```

Verify the model loaded:

```bash
ollama list
```

## 3️⃣ Start Ollama Service

In a separate terminal, run:

```bash
ollama serve
```

Leave this running in the background. You should see:

```
Loaded weights from ...
API server running on localhost:11434
```

## 4️⃣ Configure Agent Environment

From the monorepo root:

```bash
cd packages/agent
```

Check the `.env` file and make sure these values match your setup:

```env
OLLAMA_HOST=http://localhost:11434         # Where Ollama is running
OLLAMA_MODEL=neural-chat                   # Model you pulled
BACKEND_API_URL=http://localhost:3000      # Backend API URL
JWT_SECRET=your-jwt-secret                 # Must match backend JWT_SECRET
```

## 5️⃣ Install Dependencies

From monorepo root:

```bash
npm install
```

## 6️⃣ Start All Services

**Option A: Start all services together**

```bash
npm run dev
```

This starts:
- Backend on `http://localhost:3000`
- Frontend on `http://localhost:5173`
- Agent on `http://localhost:3001`

**Option B: Start only the agent (if backend is already running)**

```bash
npm run dev:agent
```

## 7️⃣ Test the Service

### Get a JWT Token

First, authenticate with the backend to get a JWT token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your-password"}'
```

Save the `token` from the response.

### Test Health Endpoint (No Auth)

```bash
curl http://localhost:3001/api/health
```

Response:

```json
{
  "success": true,
  "data": {
    "service": "agent",
    "status": "running",
    "timestamp": "2026-02-16T..."
  }
}
```

### Test Job Assessment (Requires Auth)

Replace `<TOKEN>` with the JWT token:

```bash
curl -X POST http://localhost:3001/api/assess/job-fit \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Senior DevOps Engineer",
    "jobDescription": "We are seeking a DevOps engineer with 5+ years of Kubernetes and AWS experience. Strong background in infrastructure automation, CI/CD pipelines, and containerization required."
  }'
```

Wait 2-10 seconds for the response. First time may take longer as the model loads.

Example response:

```json
{
  "success": true,
  "data": {
    "fitScore": 78,
    "fit": true,
    "recommendation": "I'm recommended for this role. I'd bring solid value to your core DevOps efforts with my infrastructure background. I'm excited to contribute and help your team scale securely.",
    "strengths": [
      {"title": "DevOps & Kubernetes Expertise", "description": "I have hands-on Kubernetes deployment experience that directly matches your core infrastructure requirements. I'm confident I can hit the ground running."},
      {"title": "AWS Cloud Proficiency", "description": "My AWS background gives me the platform expertise you need for managing infrastructure at scale."},
      {"title": "DevOps Leadership", "description": "Beyond just technical skills, I've mentored team members on DevOps best practices and I'm excited to bring that perspective to your team."}
    ],
    "gaps": ["I'm still expanding my hands-on Terraform experience—but I'm eager to dive deeper into infrastructure-as-code"]
  }
}
```

### Test Conversation (Requires Auth)

**First message (starts new session):**

```bash
curl -X POST http://localhost:3001/api/assess/conversation \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about your experience with Kubernetes",
    "context": "technical"
  }'
```

Example response:

```json
{
  "success": true,
  "data": {
    "reply": "I have extensive hands-on experience with Kubernetes, including...",
    "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }
}
```

**Follow-up message (continues conversation):**

```bash
curl -X POST http://localhost:3001/api/assess/conversation \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What about your Helm experience?",
    "context": "technical",
    "sessionId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
  }'
```

> **Note:** Sessions expire after 30 minutes of inactivity and are not persisted in the database for privacy.

## 📊 Expected Latencies

- **First request:** 5-20 seconds (model loads into memory)
- **Subsequent requests:** 2-10 seconds depending on prompt length
- **Ollama startup:** 2-3 seconds

This is normal for CPU-based inference. Inference is happening locally on your machine — no network calls to external APIs.

## 🛠️ Commands Summary

```bash
# Development
npm run dev              # Start all services
npm run dev:agent       # Start only agent service
npm run dev:backend     # Start only backend
npm run dev:frontend    # Start only frontend

# Building
npm run build:agent     # Compile TypeScript to dist/
npm run build           # Build all packages

# Testing
npm run test:agent      # Run agent tests
npm run lint:agent      # Lint TypeScript
npm run lint:fix:agent  # Fix linting issues
npm run format:agent    # Format code
```

## ❌ Troubleshooting

### "Connection refused" / "Failed to connect to Ollama"

Make sure Ollama is running:

```bash
ollama serve
```

Check `OLLAMA_HOST` in `.env` matches where Ollama runs.

### "Model not found"

Pull the model:

```bash
ollama pull neural-chat
```

Match the model name in `.env` `OLLAMA_MODEL` to what you pulled.

### "Invalid token" (401 error)

Get a fresh token from the backend:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

Use the new token in the Authorization header.

### Slow inference (>30 seconds)

This is expected on CPU for 13B+ models. Options:
- Use a smaller model: `ollama pull mistral` (7B, faster)
- Check system resources (RAM, CPU usage)
- Close other applications

### "BACKEND_API_URL unreachable"

Make sure the backend is running:

```bash
npm run dev:backend
```

And verify the URL in `.env` is correct (default: `http://localhost:3000`).

##  Next Steps

1. Integrate agent endpoints into your frontend
2. Build UI for job assessment and conversation
3. Deploy agent service with Ollama to production
4. Experiment with different models for better performance
5. Configure session TTL based on your use case (default: 30 minutes)

See [README.md](./README.md) for full documentation.
