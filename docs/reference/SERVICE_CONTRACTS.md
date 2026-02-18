# Service Communication Contracts

This document defines the explicit contracts between the three services in the Personal Site v2 architecture: **Frontend**, **Backend**, and **Agent**. These contracts ensure loose coupling while maintaining operational reliability.

## Table of Contents

1. [Service Overview](#service-overview)
2. [Backend ↔ Agent Communication](#backend--agent-communication)
3. [Frontend ↔ Agent Communication](#frontend--agent-communication)
4. [Frontend ↔ Backend Communication](#frontend--backend-communication)
5. [Authentication & Authorization](#authentication--authorization)
6. [Error Handling Contracts](#error-handling-contracts)
7. [Versioning Strategy](#versioning-strategy)

---

## Service Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Frontend   │────────▶│   Backend   │◀────────│    Agent    │
│  Port 5173  │         │  Port 3000  │         │  Port 3001  │
└─────────────┘         └─────────────┘         └─────────────┘
       │                                                │
       │                                                │
       └───────────────────────────────────────────────┘
              (Direct Communication for Assessment)
```

### Service Responsibilities

- **Frontend**: User interface, client-side state management
- **Backend**: Portfolio data, authentication, content management
- **Agent**: AI-powered job assessment, conversational engagement

---

## Backend ↔ Agent Communication

The Agent service consumes public portfolio data from the Backend to provide context for job fit assessments.

### 1. Get All Experiences

**Endpoint**: `GET http://localhost:3000/api/experiences`

**Purpose**: Retrieve candidate's work experience history for assessment context

**Request**:
```http
GET /api/experiences HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**Query Parameters** (optional):
- `featured` (boolean): Filter to featured experiences only

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-v4",
      "company": "ACME Corp",
      "role": "Senior Software Engineer",
      "startDate": "2022-01-15T00:00:00.000Z",
      "endDate": null,
      "description": "Lead backend development...",
      "achievements": ["Reduced API latency by 40%"],
      "skills": ["Node.js", "PostgreSQL"],
      "technologies": ["Express.js", "Docker"],
      "location": "Remote",
      "employmentType": "Full-time",
      "featured": true,
      "order": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Agent Usage**:
```typescript
// packages/agent/src/infrastructure/services/PortfolioDataService.ts
const experiences = await this.httpClient.get<Experience[]>(
  `${this.backendUrl}/api/experiences`
);
```

**Error Responses**:
- `500 Internal Server Error`: Database connection failure

---

### 2. Get All Projects

**Endpoint**: `GET http://localhost:3000/api/projects`

**Purpose**: Retrieve candidate's portfolio projects for assessment context

**Request**:
```http
GET /api/projects HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**Query Parameters** (optional):
- `featured` (boolean): Filter to featured projects only
- `category` (string): Filter by project category
- `status` (string): Filter by project status

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-v4",
      "title": "Personal Site v2",
      "slug": "personal-site-v2",
      "description": "Full-stack portfolio website with Clean Architecture",
      "shortDescription": "Portfolio site with microservices",
      "technologies": ["React", "Express", "PostgreSQL"],
      "category": "Web Development",
      "tags": ["full-stack", "clean-architecture"],
      "githubUrl": "https://github.com/user/repo",
      "liveUrl": "https://example.com",
      "godotWebExport": null,
      "images": ["/images/project1.png"],
      "featured": true,
      "status": "completed",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-06-01T00:00:00.000Z",
      "order": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Agent Usage**:
```typescript
// packages/agent/src/infrastructure/services/PortfolioDataService.ts
const projects = await this.httpClient.get<Project[]>(
  `${this.backendUrl}/api/projects`
);
```

**Error Responses**:
- `500 Internal Server Error`: Database connection failure

---

### Contract Guarantees

**Backend Promises**:
- Portfolio endpoints (`/api/experiences`, `/api/projects`) are public (no auth required)
- Response format follows standard: `{ success: boolean, data: T }`
- Data types match TypeScript interfaces exported from Backend domain
- Endpoints are versioned (currently implicit v1, path: `/api/*`)

**Agent Promises**:
- Agent does not mutate Backend data (read-only consumer)
- Agent caches portfolio data for duration of assessment request (no persistent cache)
- Agent handles Backend unavailability gracefully (returns error to Frontend)

**Failure Modes**:
- Backend unreachable → Agent returns 502 Bad Gateway to Frontend
- Backend returns 500 → Agent returns 502 Bad Gateway to Frontend
- Invalid data shape → Agent logs error, returns generic 500 to Frontend

---

## Frontend ↔ Agent Communication

The Frontend directly communicates with the Agent for AI-powered job assessment features.

### 1. Assess Job Fit

**Endpoint**: `POST http://localhost:3001/api/assess/job-fit`

**Purpose**: Initial job fit assessment with optional conversation session creation

**Request**:
```http
POST /api/assess/job-fit HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Accept: application/json

{
  "jobDescription": "We are looking for a Senior Full-Stack Engineer with 5+ years of experience...",
  "sessionId": "optional-uuid-v4"
}
```

**Request Schema** (Zod):
```typescript
{
  jobDescription: string (min 10 chars),
  sessionId?: string (uuid-v4, optional)
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "fitScore": 85,
    "fit": true,
    "strengths": [
      {
        "title": "Backend Architecture Expertise",
        "description": "Demonstrated strong understanding of Clean Architecture patterns and microservices design through Personal Site v2 project."
      },
      {
        "title": "Full-Stack Proficiency",
        "description": "5 years of hands-on experience with React, Node.js, and PostgreSQL across multiple production systems."
      }
    ],
    "gaps": [
      "Limited experience with AWS cloud infrastructure (job requires extensive AWS knowledge)",
      "No mention of Terraform or Infrastructure as Code experience"
    ],
    "recommendation": "I'm a strong match for this role based on my full-stack expertise and proven track record with scalable architecture. While I have less AWS-specific experience than preferred, my quick learning ability and strong fundamentals in distributed systems position me well to close that gap rapidly.",
    "sessionId": "abc-123-def-456"
  }
}
```

**Frontend Usage**:
```typescript
// packages/frontend/src/core/api/assessment.ts
const response = await apiClient.post('/assess/job-fit', {
  jobDescription,
  sessionId: existingSessionId
});
```

**Error Responses**:
- `400 Bad Request`: Invalid request body (Zod validation failure)
- `500 Internal Server Error`: LLM inference failure or portfolio data retrieval failure
- `502 Bad Gateway`: Backend unreachable (portfolio data unavailable)

---

### 2. Continue Conversation

**Endpoint**: `POST http://localhost:3001/api/assess/conversation`

**Purpose**: Multi-turn conversation for follow-up questions about job fit

**Request**:
```http
POST /api/assess/conversation HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Accept: application/json

{
  "message": "Can you tell me more about your experience with microservices?",
  "sessionId": "abc-123-def-456"
}
```

**Request Schema** (Zod):
```typescript
{
  message: string (min 1 char),
  sessionId: string (uuid-v4, required)
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "reply": "I have extensive hands-on experience designing and implementing microservices architectures. In my current role at ACME Corp, I led the migration from a monolithic application to a microservices-based system...",
    "sessionId": "abc-123-def-456"
  }
}
```

**Frontend Usage**:
```typescript
// packages/frontend/src/core/api/assessment.ts
const response = await apiClient.post('/assess/conversation', {
  message: userInput,
  sessionId: currentSessionId
});
```

**Error Responses**:
- `400 Bad Request`: Invalid request body or missing sessionId
- `404 Not Found`: Session expired or does not exist (30-minute TTL)
- `500 Internal Server Error`: LLM inference failure

**Session Management**:
- Sessions expire after 30 minutes of inactivity
- Maximum 21 messages per session (10 exchanges + 1 system prompt)
- Sessions are stored in-memory (do not survive service restart)

---

### Contract Guarantees

**Agent Promises**:
- Assessment endpoints follow standard response format: `{ success: boolean, data: T }`
- Session IDs are UUID v4 format
- Conversation history persists for 30 minutes from creation
- No database storage of conversation data (privacy guarantee)
- First-person responses ("I am", not "The candidate is")

**Frontend Promises**:
- Frontend sends well-formed requests (validated client-side before sending)
- Frontend handles 404 gracefully (session expiration scenario)
- Frontend does not assume session persistence across service restarts

**Failure Modes**:
- Session not found (404) → Frontend creates new assessment, notifies user
- Agent returns 500 → Frontend shows error toast, allows retry
- Agent returns 502 → Frontend shows "Portfolio data unavailable" message

---

## Frontend ↔ Backend Communication

### Authentication Flow

**Login**: `POST http://localhost:3000/api/auth/login`

**Request**:
```json
{
  "username": "admin",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-v4",
      "username": "admin",
      "email": "admin@example.com"
    }
  }
}
```

**Frontend Storage**:
- Token stored in Zustand store (`useAuthStore`)
- Automatically included in subsequent requests via Axios interceptor

**Protected Endpoints**:
- All `/api/admin/*` routes require `Authorization: Bearer <token>` header
- Invalid/expired token → 401 Unauthorized

---

### Portfolio Data (Public)

**Experiences**: `GET /api/experiences`
**Projects**: `GET /api/projects`

Both endpoints are public (no authentication required), same contract as Backend ↔ Agent section above.

---

### Engagement Endpoints (Public)

**Contact Form**: `POST /api/forms/contact`
**Consultation Form**: `POST /api/forms/consultation`

Standard validation, rate limiting applied (10 requests per 15 minutes per IP).

---

## Authentication & Authorization

### Shared JWT Secret

**Environment Variable**: `JWT_SECRET`

**Usage**:
- Backend signs JWT tokens with `JWT_SECRET`
- Agent does NOT validate JWT tokens (does not consume protected endpoints)
- Frontend receives token from Backend, includes in Authorization header

**Token Expiration**: 7 days (default, configurable via `JWT_EXPIRES_IN`)

**Security Considerations**:
- Change `JWT_SECRET` in production (current default is for local development)
- Backend validates token signature + expiration on protected routes
- Frontend removes token from store on 401 response (auto-logout)

---

## Error Handling Contracts

All services follow a standard error response format:

### Success Response

```json
{
  "success": true,
  "data": { /* payload */ }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200  | OK | Successful request |
| 201  | Created | Resource successfully created |
| 400  | Bad Request | Validation error (Zod schema failure) |
| 401  | Unauthorized | Missing or invalid JWT token |
| 404  | Not Found | Resource or session does not exist |
| 429  | Too Many Requests | Rate limit exceeded |
| 500  | Internal Server Error | Unexpected error (database, LLM failure) |
| 502  | Bad Gateway | Upstream service unavailable (Agent → Backend) |

### Validation Errors

**Zod Validation Failure** (400 Bad Request):
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "jobDescription",
      "message": "String must contain at least 10 character(s)"
    }
  ]
}
```

**Frontend Handling**:
- Display field-level errors inline (forms)
- Show toast notification for non-field errors
- Log full error object to console for debugging

---

## Versioning Strategy

### Current State (Implicit v1)

All APIs are currently **unversioned** (implicit v1):
- Backend: `/api/*`
- Agent: `/api/assess/*`

### Future Versioning (when needed)

When breaking changes are required:
1. Add version prefix to path: `/api/v2/*`
2. Maintain v1 endpoints for backward compatibility (6-month deprecation period)
3. Add `X-API-Version` header to responses
4. Document migration guide in `CHANGELOG.md`

**Breaking Change Examples**:
- Changing response data structure
- Renaming fields
- Removing endpoints
- Changing authentication mechanism

**Non-Breaking Change Examples**:
- Adding optional fields to requests
- Adding new endpoints
- Adding new fields to responses (Frontend should ignore unknown fields)

---

## Service Health Checks

### Backend Health Check

**Endpoint**: `GET http://localhost:3000/health`

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2024-06-15T10:30:00.000Z",
  "database": "connected"
}
```

### Agent Health Check

**Endpoint**: `GET http://localhost:3001/health`

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2024-06-15T10:30:00.000Z",
  "ollama": "connected"
}
```

**Usage**: Kubernetes liveness and readiness probes use these endpoints.

---

## Operational Considerations

### Service Dependency Chain

```
Frontend → Agent → Backend → PostgreSQL
                 ↓
              Ollama
```

**Failure Propagation**:
1. PostgreSQL down → Backend returns 500 → Agent returns 502 → Frontend shows error
2. Ollama down → Agent returns 500 → Frontend shows LLM-specific error
3. Backend down → Agent returns 502 → Frontend shows "Portfolio data unavailable"

### Timeout Configuration

| Service Call | Timeout | Retry Logic |
|-------------|---------|-------------|
| Frontend → Backend | 30s | No retry (user-initiated) |
| Frontend → Agent | 60s | No retry (LLM processing time) |
| Agent → Backend | 10s | 1 retry with exponential backoff |
| Agent → Ollama | 90s | No retry (long inference time) |

### Monitoring Recommendations

1. **Backend**: Monitor `/health` endpoint, log all 5xx errors
2. **Agent**: Monitor `/health`, track LLM response times, log session creation/expiration
3. **Frontend**: Track failed API calls, monitor 401/403 for auth issues

---

**Last Updated**: February 2025  
**Version**: 1.0 (Implicit)  
**Maintained By**: Edward Nunez
