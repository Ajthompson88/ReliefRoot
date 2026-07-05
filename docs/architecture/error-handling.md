# ReliefRoot Error Handling Strategy

## Purpose

This document defines how ReliefRoot should handle errors across the backend API.

The goal is to keep error responses consistent, useful, and safe.

---

## Core Principle

Errors should be handled centrally whenever possible.

Controllers and services should avoid repeating custom error response logic.

---

## Standard Error Response

All API errors should follow this format:

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
        "message": "Resource not found",
        "code": "RESOURCE_NOT_FOUND"
    }
}
```

---

## Error Categories

| Category         | Status Code | Example                             |
| ---------------- | ----------- | ----------------------------------- |
| Bad Request      | 400         | Malformed request body              |
| Unauthorized     | 401         | Missing or invalid token            |
| Forbidden        | 403         | Authenticated user lacks permission |
| Not Found        | 404         | Resource does not exist             |
| Conflict         | 409         | Duplicate email or unique field     |
| Validation Error | 422         | Invalid request fields              |
| Server Error     | 500         | Unexpected backend failure          |

---

## Controller Behavior

Controllers should:

- Receive the request.
- Call the appropriate service.
- Return a successful response.
- Pass errors to centralized error middleware.

Controllers should not:

- Build custom error responses repeatedly.
- Expose stack traces.
- Contain complex business logic.

---

## Service Behavior

Services should:

- Contain business logic.
- Throw meaningful errors when something fails.
- Avoid working directly with HTTP response objects.

Services should not:

- Return Express responses.
- Know about HTTP status codes unless absolutely necessary.

---

## Custom Application Errors

ReliefRoot should eventually use custom error classes.

Example:

```ts
class AppError extends Error {
    statusCode: number;
    code?: string;
    details?: unknown;

    constructor(message: string, statusCode = 500, code?: string, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
```

---

## Global Error Middleware

All unhandled backend errors should flow into global error middleware.

This middleware should:

- Determine the correct status code.
- Return the standard error response shape.
- Hide stack traces in production.
- Log unexpected errors.

---

## Production Safety

Production responses should never expose:

- Stack traces
- Environment variables
- Database connection details
- Internal file paths
- Secrets or tokens

---

## Guiding Principles

- Fail clearly.
- Fail safely.
- Keep errors consistent.
- Log enough to debug.
- Never leak sensitive data.
