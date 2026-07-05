# ReliefRoot Environment Configuration

## Purpose

This document defines how ReliefRoot should manage environment variables and application configuration.

Configuration should be centralized, validated, and kept separate from source code.

---

## Core Principle

Secrets and environment-specific values should never be hardcoded.

The application should read configuration from environment variables.

---

## Environment Files

Local development may use:

```text
.env
```

Example:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/reliefroot
JWT_SECRET=change_me
```

---

## Git Safety

The `.env` file should never be committed.

The repository should include an example file instead:

```text
.env.example
```

The `.env.example` file should document required environment variables without real secrets.

---

## Example `.env.example`

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=
JWT_SECRET=
```

---

## Required Variables

Initial required variables may include:

| Variable     | Purpose                        |
| ------------ | ------------------------------ |
| NODE_ENV     | Current runtime environment    |
| PORT         | API server port                |
| DATABASE_URL | Database connection string     |
| JWT_SECRET   | Secret used for signing tokens |

---

## Configuration Module

ReliefRoot should eventually centralize environment access in a config module.

Example location:

```text
apps/api/src/config/env.ts
```

The rest of the application should import configuration from this module instead of reading directly from `process.env`.

---

## Validation

Environment variables should be validated when the app starts.

The app should fail early if required configuration is missing.

Example failure:

```text
Missing required environment variable: DATABASE_URL
```

---

## Development vs Production

### Development

Development values may use local services such as Docker.

Example:

```text
localhost PostgreSQL container
```

### Production

Production values should come from the deployment platform or secrets manager.

Production secrets should never exist in source code.

---

## Security Rules

Never commit:

- `.env`
- API keys
- Database passwords
- JWT secrets
- OAuth secrets
- Private keys

---

## Guiding Principles

- Keep configuration centralized.
- Validate configuration early.
- Never hardcode secrets.
- Keep `.env.example` updated.
- Prefer clear variable names.
