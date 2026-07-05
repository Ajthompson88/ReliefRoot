# ADR 0001: Backend-First Development

## Status

Accepted

## Context

ReliefRoot is intended to support multiple possible clients over time, including a web frontend, mobile clients, analytics dashboards, and future AI-assisted features.

The project also needs a strong backend foundation before frontend design decisions create accidental constraints.

## Decision

ReliefRoot will be developed backend-first.

The backend API, database design, authentication, business logic, and response standards should be established before frontend development begins.

## Consequences

### Positive

- The backend becomes the source of truth.
- API behavior can be tested with Postman before frontend work begins.
- The frontend remains replaceable or expandable.
- React, Vue/Quasar, and mobile clients can consume the same API.
- Business logic stays out of the frontend.

### Tradeoffs

- The app will not have a visual UI early in development.
- Progress may feel less exciting at first.
- More planning is required before feature work begins.

## Notes

This decision supports ReliefRoot's long-term goal of becoming a scalable analytics and tracking platform rather than a frontend-heavy demo application.
