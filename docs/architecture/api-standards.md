# ReliefRoot API Standards

## Purpose

This document defines the standards used when designing and implementing the ReliefRoot REST API.

Following these conventions keeps the API predictable, maintainable, and easy to consume.

---

## Base URL

All endpoints should begin with:

```text
/api/v1
```

Example:

```http
GET /api/v1/health
```

---

## Resource Naming

Use plural nouns.

✅ Good

```text
/users
/strains
/sessions
/products
/grows
```

❌ Avoid

```text
/getUsers
/createSession
/strainList
```

Resources represent data, not actions.

---

## HTTP Methods

| Method | Purpose                      |
| ------ | ---------------------------- |
| GET    | Retrieve data                |
| POST   | Create data                  |
| PUT    | Replace an existing resource |
| PATCH  | Update part of a resource    |
| DELETE | Remove a resource            |

Examples:

```http
GET    /api/v1/strains
GET    /api/v1/strains/:id
POST   /api/v1/strains
PUT    /api/v1/strains/:id
PATCH  /api/v1/strains/:id
DELETE /api/v1/strains/:id
```

---

## Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 204  | Success (No Content)  |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

## Response Format

### Success

```ts
interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}
```

Example:

```json
{
    "success": true,
    "data": {
        "id": "123",
        "name": "Garlic Kush"
    }
}
```

---

### Error

```ts
interface ApiErrorResponse {
    success: false;
    error: {
        message: string;
        code?: string;
        details?: unknown;
    };
}
```

Example:

```json
{
    "success": false,
    "error": {
        "message": "Session not found",
        "code": "SESSION_NOT_FOUND"
    }
}
```

---

## URL Parameters

Use route parameters to identify resources.

Example:

```http
GET /api/v1/strains/42
```

---

## Query Parameters

Use query parameters for filtering, sorting, and pagination.

Examples:

```http
GET /api/v1/strains?effect=sleep
GET /api/v1/sessions?page=2
GET /api/v1/products?sort=name
GET /api/v1/products?limit=25
```

Query parameters should never identify a resource.

---

## Request Body

Use JSON.

Example:

```json
{
    "strainId": "abc123",
    "rating": 9,
    "notes": "Excellent pain relief."
}
```

---

## Versioning

Breaking API changes require a new version.

Examples:

```text
/api/v1
/api/v2
```

Older versions should remain functional whenever practical.

---

## Validation

Every request should be validated before reaching business logic.

Validation should occur in middleware whenever possible.

Examples:

- Required fields
- Data types
- String lengths
- Number ranges
- Enum values

---

## Authentication

Protected routes should require authentication.

Authentication should occur in middleware before reaching controllers.

Public routes should remain accessible without authentication.

---

## Error Handling

Controllers should not expose stack traces.

Unexpected errors should be handled by centralized error middleware.

All error responses should follow the standard API response format.

---

## Logging

The API should log:

- Incoming requests
- Errors
- Authentication failures
- Important application events

Sensitive information should never be logged.

---

## Guiding Principles

- Keep URLs simple.
- Keep responses consistent.
- Use HTTP methods correctly.
- Validate early.
- Return meaningful status codes.
- Keep controllers thin.
- Keep services focused.
- Design for long-term maintainability.
