# ReliefRoot Backend Architecture

## Purpose

The ReliefRoot backend is responsible for handling application logic, data access, validation, authentication, analytics preparation, and API responses.

The frontend should not contain business rules. The backend is the source of truth.

---

## Request Flow

```text
Client / Postman
       │
       ▼
     Route
       │
       ▼
   Middleware
       │
       ▼
   Controller
       │
       ▼
    Service
       │
       ▼
 Database Layer
       │
       ▼
    Response
```

---

## Folder Responsibilities

### `routes/`

Defines API endpoints and connects each route to the appropriate controller.

**Responsibilities**

- Define API endpoints.
- Connect requests to controllers.
- Keep routing organized.

**Should NOT**

- Contain business logic.
- Access the database directly.

---

### `controllers/`

Handles the HTTP request and response lifecycle.

**Responsibilities**

- Read request parameters, query strings, and request body.
- Call the appropriate service.
- Return API responses.
- Pass errors to error middleware.

**Should NOT**

- Contain business logic.
- Query the database directly.

---

### `services/`

Contains the application's business logic.

Examples include:

- Creating user sessions.
- Calculating relief scores.
- Comparing product effects.
- Preparing analytics data.
- Processing grow information.

Services should remain independent of HTTP request and response objects whenever possible.

---

### `middleware/`

Contains reusable request/response functionality.

Examples:

- Authentication
- Authorization
- Validation
- Request logging
- Error handling
- Rate limiting

---

### `config/`

Stores application configuration.

Examples:

- Environment variables
- Application settings
- Database configuration
- Third-party integrations
- Constants

---

### `types/`

Contains shared TypeScript interfaces and types.

Examples:

- API response types
- Authenticated request types
- Domain models
- Shared interfaces

---

### `utils/`

Contains reusable helper functions.

Utilities should be generic and independent of business logic.

Examples:

- Date formatting
- String helpers
- UUID helpers
- Math utilities

---

### `models/`

Temporary placeholder folder.

Once Prisma is introduced, the Prisma schema will become the source of truth for database models. This folder may be removed or repurposed depending on project needs.

---

## API Response Standards

### Successful Responses

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

### Error Responses

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
        "message": "User not found",
        "code": "USER_NOT_FOUND"
    }
}
```

---

## API Versioning

Initial API routes will be versioned.

Base path:

```text
/api/v1
```

Example endpoint:

```http
GET /api/v1/health
```

Future breaking changes will use new API versions instead of modifying existing endpoints.

---

## Error Handling Strategy

The application should use centralized error handling.

Controllers should remain as small as possible and avoid excessive `try/catch` blocks.

Unhandled errors should flow into a global error middleware that returns consistent API responses without exposing stack traces to clients.

---

## Backend-First Development

ReliefRoot will be developed backend-first.

Before frontend development begins, the backend should provide:

- Stable API routes
- Consistent response structures
- Database models
- Authentication
- Authorization
- Business logic
- Postman-tested endpoints

This allows any frontend (React, Vue/Quasar, mobile, etc.) to consume the same API.

---

## Database Strategy

Prisma will be introduced during the database sprint.

Before writing database models, the project will define:

- Entities
- Relationships
- ER diagrams
- Data lifecycle
- Naming conventions
- Normalization strategy

The database design should reflect the domain model rather than being driven by implementation details.

---

## Current Architectural Direction

ReliefRoot will begin as a modular REST API.

The architecture should remain flexible enough to support:

- React frontend
- Vue/Quasar frontend
- Mobile applications
- AI-assisted insights
- Analytics dashboards
- Grow tracking
- Product tracking
- Session tracking
- Community features
- Future machine learning integrations

---

## Guiding Principles

- Keep controllers thin.
- Keep services focused.
- Separate business logic from HTTP logic.
- Design the database before implementing it.
- Build reusable modules.
- Favor readability over cleverness.
- Write documentation alongside code.
- Build for maintainability first and features second.
