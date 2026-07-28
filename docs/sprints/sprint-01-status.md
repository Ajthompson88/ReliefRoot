# Sprint 1 Status

## Status

In Progress

## Current Focus

Backend database foundation and analytics-ready session tracking.

## Completed

- Configured Prisma 7 with PostgreSQL.
- Configured Prisma migrations through `prisma.config.ts`.
- Connected Prisma to the Docker PostgreSQL container.
- Resolved the local PostgreSQL port conflict by mapping Docker to port `5433`.
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
- Verified all tables, relationships, and seed records through Prisma Studio.

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

### Next Steps

- Commit the analytics schema and seed workflow.
- Create a reusable Prisma Client instance for the API.
- Connect the Express API to Prisma.
- Implement read-only Metric and Effect endpoints.
- Implement Organization CRUD.
- Implement Cultivar CRUD.
- Implement Product CRUD.
- Implement Session creation with metrics and effects.
  -Test the first complete workflow through Postman.

## Sprint Notes

The core database is now capable of representing a complete ReliefRoot session, including the consumed product, global cultivar reference, before-and-after metric scores, and experienced effects.

The next phase should focus on exercising the current data model through the API rather than expanding the schema.
