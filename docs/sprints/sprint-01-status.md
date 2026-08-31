# Sprint 1 Status

## Status

In Progress

## Current Focus

Backend API implementation and complete session workflow integration.

## Completed

- Configured Prisma 7 with PostgreSQL.
- Configured Prisma migrations through `prisma.config.ts`.
- Connected Prisma to the Docker PostgreSQL container.
- Resolved the local PostgreSQL port conflict by mapping Docker to
  port `5433`.
- Created and migrated the core database models:
    - Organization
    - User
    - Cultivar
    - Product
    - Session
- Made Cultivar a global reference entity.
- Established the core relationship flow:
    - Session → Product → Cultivar
- Added product metadata:
    - Product type
    - Acquisition type
    - Brand
    - Batch number
    - Package weight
    - Cannabinoid percentages
- Added session metadata:
    - Method
    - Start time
    - Dose amount
    - Notes
- Created the analytics models:
    - Metric
    - Effect
    - SessionMetric
    - SessionEffect
- Added metric and effect categories.
- Added display ordering for metrics and effects.
- Created and configured the Prisma seed workflow.
- Added the PostgreSQL Prisma driver adapter.
- Seeded the default Metric and Effect reference data.
- Verified all tables, relationships, and seed records through Prisma
  Studio.
- Created a reusable Prisma Client instance for the API.
- Connected the Express API to Prisma and PostgreSQL.
- Added API routing, centralized error handling, and 404 route
  handling.
- Implemented and verified `GET /api/v1/metrics`.
- Implemented and verified `GET /api/v1/effects`.
- Implemented and verified Cultivar CRUD, including missing-record 404
  handling.
- Implemented and verified Organization CRUD, including missing-record
  404 handling.
- Implemented and verified Product CRUD, including missing-record 404
  handling.
- Verified Product update persistence against PostgreSQL.
- Verified Product deletion using a disposable Product record.
- Retained a Product record for upcoming Session API development.
- Updated CI to generate the Prisma Client before linting/building.
- Added a CI-safe `DATABASE_URL` for Prisma generation and build
  validation.
- Verified the GitHub Actions CI pipeline passes.
- Tested API behavior through Postman and `curl`.

## Current Database Flow

```text
Organization
├── User
├── Product
│   └── Cultivar
└── Session
    ├── SessionMetric
    │   └── Metric
    └── SessionEffect
        └── Effect
```

## Current Seed Data

### Metrics

- Pain
- Muscle Spasms
- Anxiety
- Mood
- Focus
- Energy
- Sleepiness
- Appetite
- Nausea
- Stress
- Depression

### Effects

- Relaxed
- Euphoric
- Creative
- Focused
- Happy
- Talkative
- Hungry
- Sleepy
- Dry Mouth
- Dry Eyes

## Next Steps

- Implement Session creation with metrics and effects.
- Test the first complete ReliefRoot workflow through the API and
  Postman.
- Add additional Session API operations and validation as needed.
- Capture and organize README screenshots for completed API
  milestones.
- Update project documentation as the Session workflow is completed.
- Commit and push the Session API milestone.

## Sprint Notes

The database and API foundation now support Organizations, Cultivars,
Products, Metrics, and Effects through tested API endpoints.

Cultivar, Organization, and Product CRUD operations have been exercised
against the PostgreSQL database, including update persistence, deletion,
and missing-record handling.

The next phase is Session integration. Session creation will connect the
existing Product, Metric, and Effect foundations into the first complete
ReliefRoot tracking workflow.

During API testing, Postman intermittently displayed stale response
bodies even when the HTTP status and backend behavior were correct.
Equivalent requests through `curl` were used to verify the actual API
responses and database persistence.

The current schema does not need expansion before Session API
development. The focus should remain on exercising the existing data
model through the API.

## Development Log Entry

# Development Log --- August 31, 2026

## Summary

Advanced Sprint 1 from an analytics-ready database foundation to a
working Prisma-backed REST API.

The Express API is now connected to PostgreSQL through Prisma. Metric
and Effect reference data can be retrieved through API endpoints, and
Cultivar, Organization, and Product resources have tested CRUD
implementations.

Product CRUD was verified through its complete lifecycle, including
creation, retrieval, update persistence, deletion, and missing-record
handling. A Product record remains available for the upcoming Session
workflow.

The GitHub Actions CI pipeline was also updated to generate the Prisma
Client before linting and building, allowing the current backend to pass
CI successfully.

## Key Decisions

- Cultivars remain global reference records.
- Products belong to organizations and may reference cultivars.
- Sessions reference products rather than cultivars directly.
- Metrics use before-and-after values.
- Effects are recorded separately with optional intensity.
- Metrics and effects use global reference tables.
- Categories support filtering, organization, and grouped analytics.
- Default reference data is inserted through an idempotent Prisma seed
  script.
- API resources follow a controller/service/router separation.
- Prisma record-not-found errors are translated into API-level `404`
  responses.
- The existing Product record will be retained to support Session API
  testing.

## Technical Issues Resolved

- Prisma 7 datasource configuration.
- Prisma 7 seed configuration.
- Docker PostgreSQL port conflict.
- Generated Prisma Client import path.
- Prisma PostgreSQL driver adapter requirement.
- Express-to-Prisma database integration.
- API-level 404 handling for missing CRUD records.
- Prisma Client generation in GitHub Actions.
- CI environment configuration for Prisma generation and TypeScript
  builds.
- Verification of misleading/stale Postman response bodies using
  direct `curl` requests.

## Stopping Point

Cultivar, Organization, and Product CRUD are complete and tested. Metric
and Effect read endpoints are working, the
Express-to-Prisma-to-PostgreSQL path is verified, and CI is passing.

The next development session should begin with Session creation and the
integration of SessionMetric and SessionEffect records into the first
complete ReliefRoot API workflow.
