# ADR 0002: REST API Architecture

## Status

Accepted

## Context

ReliefRoot will expose functionality through an HTTP API that may eventually serve multiple clients, including:

- React applications
- Vue/Quasar applications
- Mobile applications
- Internal analytics tools
- AI services

The project requires an API that is easy to understand, test, document, and maintain.

## Decision

ReliefRoot will begin as a REST API.

Endpoints will represent resources and use standard HTTP methods.

Examples:

```http
GET    /api/v1/strains
GET    /api/v1/strains/:id
POST   /api/v1/sessions
PUT    /api/v1/sessions/:id
DELETE /api/v1/sessions/:id
```

## Rationale

REST provides:

- Excellent tooling support
- Easy testing with Postman
- Clear request/response behavior
- Simple documentation
- Broad compatibility

REST is also well suited to the CRUD-heavy nature of ReliefRoot's early development.

## Consequences

### Positive

- Easy for new contributors to understand.
- Well-supported by existing tooling.
- Easy to version.
- Predictable endpoint structure.
- Simple integration with future frontends.

### Tradeoffs

- Some requests may require multiple API calls.
- Complex analytics endpoints may eventually benefit from GraphQL.

## Future Considerations

GraphQL may be introduced later if it provides clear value for analytics or highly connected data.

REST will remain the primary interface until there is a demonstrated need for an additional API style.
