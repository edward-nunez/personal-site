# API Reference

Complete documentation of all backend API endpoints. This is the contract between the backend and frontend.

**Base URL**: `http://localhost:3000/api` (development)

**Machine-readable spec**: An [OpenAPI 3.x spec](./openapi.yaml) is available for code generation, Swagger UI, or tooling. Use it alongside this document for full request/response schemas.

**Table of Contents**
- [Authentication](#authentication)
- [Experiences](#experiences)
- [Projects](#projects)
- [Blog](#blog)
- [Contact Submissions](#contact-submissions)
- [Consultation Requests](#consultation-requests)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

### Overview

The API uses **JWT (JSON Web Tokens)** for authentication:
1. Login with credentials → receive JWT token
2. Include token in subsequent requests via `Authorization` header
3. Token expires after 7 days (configurable)

### Login

**Endpoint**: `POST /auth/login`  
**Public**: ✅ Yes (no auth required)  
**Rate Limited**: ✅ Yes (5 requests per 15 minutes)

**Request**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password_123"
  }'
```

**Request Body**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | ✅ | Admin email address |
| password | string | ✅ | Admin password |

**Response** (201 Created)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": 1,
      "email": "admin@example.com",
      "createdAt": "2026-02-14T00:00:00Z"
    }
  }
}
```

**Error Responses**
```json
// 400 - Invalid email format
{
  "success": false,
  "error": "Invalid email format"
}

// 401 - Invalid credentials
{
  "success": false,
  "error": "Invalid email or password"
}

// 429 - Too many login attempts
{
  "success": false,
  "error": "Too many login attempts, please try again later"
}
```

### Get Current User

**Endpoint**: `GET /auth/me`  
**Public**: ❌ No (requires authentication)  
**Rate Limited**: ✅ Yes

**Request**
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "createdAt": "2026-02-14T00:00:00Z"
  }
}
```

**Error Responses**
```json
// 401 - Missing or invalid token
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## Experiences

Endpoints for managing professional work experiences.

### Get All Experiences

**Endpoint**: `GET /experiences`  
**Public**: ✅ Yes  
**Rate Limited**: ✅ Yes

**Request** (with optional filters)
```bash
# Get all experiences
curl http://localhost:3000/api/experiences

# Get featured experiences only
curl http://localhost:3000/api/experiences?featured=true

# Sort by custom order (ascending)
curl http://localhost:3000/api/experiences?orderBy=order&orderDirection=asc

# Sort by start date (descending)
curl http://localhost:3000/api/experiences?orderBy=startDate&orderDirection=desc
```

**Query Parameters**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| featured | boolean | none | Filter to featured experiences only |
| orderBy | string | startDate | Sort field: `startDate` or `order` |
| orderDirection | string | desc | Sort direction: `asc` or `desc` |

**Response** (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company": "Tech Corp",
      "role": "Senior Software Engineer",
      "startDate": "2023-01-15T00:00:00Z",
      "endDate": null,
      "description": "Led development of core platform...",
      "location": "San Francisco, CA",
      "employmentType": "Full-time",
      "achievements": [
        "Increased system performance by 40%",
        "Led team of 5 engineers"
      ],
      "skills": ["TypeScript", "React", "Node.js"],
      "technologies": ["PostgreSQL", "Docker", "Kubernetes"],
      "featured": true,
      "order": 1,
      "createdAt": "2026-02-14T10:00:00Z",
      "updatedAt": "2026-02-14T10:00:00Z"
    }
  ]
}
```

---

### Get Experience by ID

**Endpoint**: `GET /experiences/:id`  
**Public**: ✅ Yes  
**Rate Limited**: ✅ Yes

**Request**
```bash
curl http://localhost:3000/api/experiences/1
```

**URL Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | ✅ | Numeric experience ID |

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company": "Tech Corp",
    "role": "Senior Software Engineer",
    "startDate": "2023-01-15T00:00:00Z",
    "endDate": null,
    "description": "Led development of core platform...",
    "location": "San Francisco, CA",
    "employmentType": "Full-time",
    "achievements": [
      "Increased system performance by 40%",
      "Led team of 5 engineers"
    ],
    "skills": ["TypeScript", "React", "Node.js"],
    "technologies": ["PostgreSQL", "Docker", "Kubernetes"],
    "featured": true,
    "order": 1,
    "createdAt": "2026-02-14T10:00:00Z",
    "updatedAt": "2026-02-14T10:00:00Z"
  }
}
```

**Error Responses**
```json
// 404 - Experience not found
{
  "success": false,
  "error": "Experience not found"
}
```

---

### Create Experience

**Endpoint**: `POST /experiences`  
**Public**: ❌ No (admin only)  
**Rate Limited**: ✅ Yes  
**Requires Auth**: ✅ Yes

**Request**
```bash
curl -X POST http://localhost:3000/api/experiences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "company": "Acme Corp",
    "role": "Full Stack Engineer",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": null,
    "description": "Worked on web applications",
    "location": "New York, NY",
    "employmentType": "Full-time",
    "achievements": ["Built API", "Mentored junior developers"],
    "skills": ["TypeScript", "React"],
    "technologies": ["Node.js", "PostgreSQL"],
    "featured": false,
    "order": 5
  }'
```

**Request Body**
| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| company | string | ✅ | Max 200 chars | Company name |
| role | string | ✅ | Max 200 chars | Job title |
| startDate | string\|date | ✅ | ISO 8601 format | Employment start date |
| endDate | string\|date | ❌ | ISO 8601 format or null | Employment end date (null = current) |
| description | string | ❌ | Max 5000 chars | Job description |
| location | string | ❌ | Max 200 chars | Work location |
| employmentType | string | ❌ | Max 100 chars | E.g., "Full-time", "Contract" |
| achievements | array[string] | ❌ | Default: [] | List of achievements |
| skills | array[string] | ❌ | Default: [] | List of skills used |
| technologies | array[string] | ❌ | Default: [] | List of technologies used |
| featured | boolean | ❌ | Default: false | Show on homepage |
| order | integer | ❌ | Default: 0 | Display order (lower first) |

**Response** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 5,
    "company": "Acme Corp",
    "role": "Full Stack Engineer",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": null,
    "description": "Worked on web applications",
    "location": "New York, NY",
    "employmentType": "Full-time",
    "achievements": ["Built API", "Mentored junior developers"],
    "skills": ["TypeScript", "React"],
    "technologies": ["Node.js", "PostgreSQL"],
    "featured": false,
    "order": 5,
    "createdAt": "2026-02-14T10:30:00Z",
    "updatedAt": "2026-02-14T10:30:00Z"
  }
}
```

**Error Responses**
```json
// 400 - Validation error
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "company": "Company name is required",
    "startDate": "Start date must be a valid ISO 8601 date"
  }
}

// 401 - Not authenticated
{
  "success": false,
  "error": "Unauthorized"
}
```

---

### Update Experience

**Endpoint**: `PUT /experiences/:id`  
**Public**: ❌ No (admin only)  
**Rate Limited**: ✅ Yes  
**Requires Auth**: ✅ Yes

**Request**
```bash
curl -X PUT http://localhost:3000/api/experiences/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "featured": true,
    "order": 2
  }'
```

**URL Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | ✅ | Numeric experience ID |

**Request Body**

All fields are optional. Only include fields you want to update:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| company | string | Max 200 chars | Company name |
| role | string | Max 200 chars | Job title |
| startDate | string\|date | ISO 8601 format | Employment start date |
| endDate | string\|date | ISO 8601 format or null | Employment end date |
| description | string | Max 5000 chars | Job description |
| location | string | Max 200 chars | Work location |
| employmentType | string | Max 100 chars | Employment type |
| achievements | array[string] | — | List of achievements |
| skills | array[string] | — | List of skills |
| technologies | array[string] | — | List of technologies |
| featured | boolean | — | Featured status |
| order | integer | — | Display order |

**Response** (200 OK)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company": "Tech Corp",
    "role": "Senior Software Engineer",
    "startDate": "2023-01-15T00:00:00Z",
    "endDate": null,
    "description": "Led development of core platform...",
    "location": "San Francisco, CA",
    "employmentType": "Full-time",
    "achievements": ["Increased system performance by 40%", "Led team of 5 engineers"],
    "skills": ["TypeScript", "React", "Node.js"],
    "technologies": ["PostgreSQL", "Docker", "Kubernetes"],
    "featured": true,
    "order": 2,
    "createdAt": "2026-02-14T10:00:00Z",
    "updatedAt": "2026-02-14T10:45:00Z"
  }
}
```

**Error Responses**
```json
// 404 - Experience not found
{
  "success": false,
  "error": "Experience not found"
}

// 400 - Validation error
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "order": "Order must be a positive integer"
  }
}
```

---

### Delete Experience

**Endpoint**: `DELETE /experiences/:id`  
**Public**: ❌ No (admin only)  
**Rate Limited**: ✅ Yes  
**Requires Auth**: ✅ Yes

**Request**
```bash
curl -X DELETE http://localhost:3000/api/experiences/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**URL Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | ✅ | Numeric experience ID |

**Response** (200 OK)
```json
{
  "success": true,
  "message": "Experience deleted successfully"
}
```

**Error Responses**
```json
// 404 - Experience not found
{
  "success": false,
  "error": "Experience not found"
}

// 401 - Not authenticated
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## Response Format

### Standard Response Structure

All API responses follow a consistent format:

#### ✅ Success Response
```json
{
  "success": true,
  "data": {
    // Requested data (object or array)
  }
}
```

#### ❌ Error Response
```json
{
  "success": false,
  "error": "Human-readable error message",
  "details": {
    // (Optional) Field-level error details for validation errors
    "field": "Error message"
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Authenticated but lacks permission |
| 404 | Not Found | Resource doesn't exist OR endpoint doesn't exist |
| 405 | Method Not Allowed | Unsupported HTTP method on valid endpoint |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

### Error Response Format

All error responses return JSON (never HTML):

**Route Not Found (404)**
```json
{
  "success": false,
  "error": "Route not found",
  "message": "The requested endpoint does not exist"
}
```

**Method Not Allowed (405)**
```json
{
  "success": false,
  "error": "Method Not Allowed",
  "message": "DELETE is not supported on this endpoint",
  "allowedMethods": ["GET", "POST"]
}
```

**Validation Error (400)**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**Unauthorized (401)**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Missing or invalid authentication token"
}
```

**Server Error (500)**
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```
| 500 | Internal Server Error | Unhandled server error |

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Unauthorized" | Missing `Authorization` header or invalid token | Add valid JWT token to header |
| "Token expired" | JWT token older than 7 days | Login again to get new token |
| "Validation failed" | Invalid request body | Check field types and constraints |
| "Not found" | Resource doesn't exist | Verify the ID is correct |
| "Rate limit exceeded" | Too many requests | Wait before retrying |

### How Frontend Handles Errors

```typescript
// API client interceptor catches errors and shows toast
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Logout user, redirect to login
      store.logout();
    }
    // Show error toast to user
    toast.error(error.response?.data?.error || "Error occurred");
    return Promise.reject(error);
  }
);
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/login` | 5 requests | 15 minutes |
| `/api/*` (all other) | 100 requests | 15 minutes |

**Rate Limit Headers** (returned with every response):
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 98
X-RateLimit-Reset: 1676380800
```

When limit exceeded:
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1676380860

{
  "success": false,
  "error": "Too many requests, please try again later"
}
```

---

## Frontend Integration Examples

### Using the API in React Components

#### Example 1: Fetch data with TanStack Query
```typescript
// hooks/useExperiences.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

export function useExperiences(featured?: boolean) {
  return useQuery({
    queryKey: ['experiences', featured],
    queryFn: async () => {
      const url = `/experiences${featured ? '?featured=true' : ''}`;
      const response = await apiClient.get<{ success: boolean; data: Experience[] }>(url);
      return response.data.data;  // Extract the data array
    },
  });
}
```

#### Example 2: Mutate data (create/update)
```typescript
// hooks/useCreateExperience.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

export function useCreateExperience() {
  return useMutation({
    mutationFn: async (input: CreateExperienceDTO) => {
      const response = await apiClient.post<{ success: boolean; data: Experience }>(
        '/experiences',
        input
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Refetch experiences list
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
    onError: (error) => {
      // Error toast automatically shown by interceptor
    },
  });
}
```

#### Example 3: Component using hooks
```typescript
// components/ExperienceList.tsx
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { Loading, ErrorMessage, ExperienceCard } from '@/components';

export function ExperienceList() {
  const { data: experiences, isLoading, error } = useExperiences();

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {experiences?.map(exp => (
        <ExperienceCard key={exp.id} experience={exp} />
      ))}
    </div>
  );
}
```

---

## Next Steps

- Want to add a new endpoint? See [Feature Development Guide](./FEATURE_DEVELOPMENT.md)
- Want to understand the architecture? See [Architecture Guide](./ARCHITECTURE.md)
- Need to call these APIs from the frontend? See [Frontend Integration Examples](#frontend-integration-examples) above

---

**Last Updated**: February 2026  
**API Version**: 1.0  
**Authentication**: JWT Bearer Token  
**Response Format**: JSON
