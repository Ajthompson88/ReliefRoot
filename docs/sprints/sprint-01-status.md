# Sprint 1 Status

## Status

In Progress

## Current Focus

Backend API hardening, validation, and completion of the Sprint 1 API
foundation.

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
- Added product and session metadata.
- Created the analytics models:
    - Metric
    - Effect
    - SessionMetric
    - SessionEffect
- Added metric/effect categories and display ordering.
- Created and configured the Prisma seed workflow.
- Added the PostgreSQL Prisma driver adapter.
- Seeded the default Metric and Effect reference data.
- Verified tables, relationships, and seed records through Prisma
  Studio.
- Created a reusable Prisma Client instance for the API.
- Connected Express → Prisma → PostgreSQL.
- Added API routing, centralized error handling, and 404 route
  handling.
- Implemented and verified `GET /api/v1/metrics`.
- Implemented and verified `GET /api/v1/effects`.
- Implemented and verified Cultivar CRUD with 404 handling.
- Implemented and verified Organization CRUD with 404 handling.
- Implemented and verified Product CRUD with update persistence,
  deletion, and 404 handling.
- Implemented and verified complete Session CRUD:
    - `POST /api/v1/sessions`
    - `GET /api/v1/sessions`
    - `GET /api/v1/sessions/:id`
    - `PATCH /api/v1/sessions/:id`
    - `DELETE /api/v1/sessions/:id`
- Implemented nested Session creation with SessionMetric and
  SessionEffect records.
- Verified Session responses include linked Product, Metric, and
  Effect data.
- Implemented transactional Session updates.
- Verified Session PATCH can update Session fields and replace nested
  Metric and Effect records.
- Verified Session deletion using a disposable duplicate Session.
- Verified missing-record 404 handling for Session PATCH and DELETE.
- Preserved a complete Session record for continued
  development/testing.
- Completed the first end-to-end ReliefRoot tracking workflow:
    - Organization → Product → Session → Metrics/Effects
- Captured a README milestone screenshot for Session creation with
  metrics and effects.
- Updated CI to generate the Prisma Client before linting/building.
- Added a CI-safe `DATABASE_URL`.
- Verified GitHub Actions CI passes.
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

## Current API Surface

```text
GET    /api/v1/metrics
GET    /api/v1/effects

GET    /api/v1/cultivars
GET    /api/v1/cultivars/:id
POST   /api/v1/cultivars
PATCH  /api/v1/cultivars/:id
DELETE /api/v1/cultivars/:id

GET    /api/v1/organizations
GET    /api/v1/organizations/:id
POST   /api/v1/organizations
PATCH  /api/v1/organizations/:id
DELETE /api/v1/organizations/:id

GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id

GET    /api/v1/sessions
GET    /api/v1/sessions/:id
POST   /api/v1/sessions
PATCH  /api/v1/sessions/:id
DELETE /api/v1/sessions/:id
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

## Verified Session Workflow

The first complete ReliefRoot tracking workflow has been exercised
successfully through the REST API.

Initial Session test data included:

- Pain: `8 → 4`
- Anxiety: `6 → 2`
- Relaxed intensity: `8`
- Focused intensity: `6`

Session PATCH was then verified with:

- Dose amount: `0.5 → 0.75`
- Notes updated
- Pain: `8 → 3`
- Anxiety replaced with Stress: `7 → 3`
- Relaxed intensity: `9`
- Focused replaced with Sleepy intensity: `5`

The nested update is performed transactionally so Session fields and
replacement SessionMetric/SessionEffect records are handled as one
database operation.

## Next Steps

- Add request validation for Session creation and updates.
- Validate Session method, timestamps, metric values, effect
  intensity, and required identifiers.
- Prevent invalid or duplicate Metric/Effect input before it reaches
  Prisma.
- Verify Product and Organization relationships during Session
  creation/update.
- Add consistent validation/error responses across existing API
  resources.
- Review API behavior for invalid foreign keys and malformed request
  bodies.
- Continue capturing README screenshots for meaningful backend
  milestones.
- Update README/API documentation to reflect the completed Session
  workflow.
- Determine the remaining Sprint 1 acceptance criteria before closing
  the sprint.

## Sprint Notes

The core backend data path is now operational from Express through
Prisma to PostgreSQL.

Cultivar, Organization, Product, and Session resources have tested CRUD
implementations. Metric and Effect reference data are available through
read endpoints.

Session integration is complete for the current Sprint 1 CRUD scope. The
API can create a Session with nested metrics and effects, retrieve the
complete tracking record, transactionally update Session metadata and
nested analytics records, and delete Sessions while respecting cascade
relationships.

This completes the first meaningful end-to-end ReliefRoot data workflow
and demonstrates that the existing schema supports the central product
goal: connecting a consumed Product to before/after measurements and
experienced Effects.

During API testing, Postman intermittently displayed stale response
bodies. Equivalent `curl` requests were used to verify actual API
responses and persisted database state.

The next phase should focus on validation and API hardening rather than
expanding the schema prematurely.

## Development Log Entry

# Development Log --- September 1, 2026

## Summary

Advanced Sprint 1 from individual CRUD resources to a complete
end-to-end ReliefRoot Session workflow.

Session creation now connects an Organization and Product to
before/after Metric measurements and experienced Effects in a single API
request. Session retrieval returns the linked Product and nested
Metric/Effect reference data.

Session CRUD was completed with list, single-record retrieval,
transactional update, deletion, and missing-record handling. PATCH
testing confirmed that Session metadata can be changed while nested
SessionMetric and SessionEffect records are replaced atomically.

A duplicate Session created during testing was safely deleted, leaving
the primary milestone Session in the database for continued development.

All current TypeScript changes pass formatting, linting, and build
validation.

## Key Decisions

- Cultivars remain global reference records.
- Products belong to Organizations and may reference Cultivars.
- Sessions reference Products rather than Cultivars directly.
- Sessions also belong to Organizations.
- Metrics use before-and-after integer values.
- Effects are recorded separately with optional intensity.
- Metrics and Effects use global reference tables.
- Categories support filtering, organization, and future grouped
  analytics.
- Default reference data is inserted through an idempotent Prisma seed
  script.
- API resources follow controller/service/router separation.
- Prisma record-not-found errors are translated into API-level `404`
  responses.
- Session creation uses nested Prisma writes for SessionMetric and
  SessionEffect records.
- Session PATCH uses a Prisma transaction when replacing nested Metric
  and Effect records.
- Nested metrics/effects are replaced only when their respective
  arrays are supplied in a PATCH request.
- The milestone Session remains available for further API testing.

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
- Verification of stale Postman response bodies using `curl`.
- Session route/controller/service integration.
- Nested SessionMetric and SessionEffect creation.
- Transactional replacement of nested Session analytics data during
  PATCH.
- Session deletion and missing-record handling.

## Stopping Point

Cultivar, Organization, Product, and Session CRUD are complete and
tested. Metric and Effect read endpoints are working. The Express →
Prisma → PostgreSQL path is verified, CI is passing, and the first
complete ReliefRoot tracking workflow has been exercised successfully
through the API.

The next development session should begin with request validation and
API hardening, starting with Session creation and update payloads.
