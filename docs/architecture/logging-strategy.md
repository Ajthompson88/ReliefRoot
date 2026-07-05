# ReliefRoot Logging Strategy

## Purpose

This document defines how ReliefRoot should log backend activity.

Logging should help with debugging, monitoring, and understanding application behavior without exposing sensitive information.

---

## Core Principle

Logs should be useful, readable, and safe.

The backend should log important events, but should never log secrets or sensitive user data.

---

## What Should Be Logged

ReliefRoot should log:

- Server startup
- Incoming requests
- Failed requests
- Authentication failures
- Validation failures
- Unexpected errors
- Important domain events
- Database connection issues

Examples of domain events:

- User created a session
- Product added
- Grow log created
- COA record attached
- Analytics job completed

---

## What Should Not Be Logged

ReliefRoot should not log:

- Passwords
- Password hashes
- Access tokens
- Refresh tokens
- API keys
- Full request bodies containing sensitive data
- Personally sensitive user data
- Database credentials

---

## Log Levels

| Level | Purpose                              |
| ----- | ------------------------------------ |
| info  | Normal application events            |
| warn  | Something unexpected but recoverable |
| error | A failure that needs attention       |
| debug | Extra development details            |

---

## Request Logging

Each incoming request should eventually log:

- HTTP method
- Request path
- Status code
- Response time
- Timestamp

Example:

```text
INFO GET /api/v1/health 200 12ms
```

---

## Error Logging

Unexpected errors should log enough context to debug the problem.

Useful context may include:

- Error message
- Error code
- Request path
- HTTP method
- Timestamp
- Stack trace in development only

---

## Development vs Production

### Development

Development logs may be more detailed.

They can include:

- Stack traces
- Debug messages
- Detailed request flow

### Production

Production logs should be safer and more structured.

They should avoid exposing internal details to users or logs.

---

## Future Tooling

ReliefRoot may eventually use a logging library such as:

- Pino
- Winston
- Morgan

Early development may begin with simple console logging, but the architecture should allow replacement with a proper logger later.

---

## Guiding Principles

- Log important behavior.
- Keep logs readable.
- Avoid noisy logs.
- Never log secrets.
- Prefer structured logs as the project matures.
