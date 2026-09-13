# ReliefRoot Agent Instructions

## Validation

After modifying application code, run the project's standard validation sequence:

1. `npm run prisma:validate`
2. `npm run lint`
3. `npm run format:check`
4. `npm run build`

These commands correspond to the VS Code `ReliefRoot: Full Validation` task.

- Do not consider work complete if a validation failure caused by your changes remains unresolved.
- Report validation failures that existed before your changes rather than modifying unrelated code to fix them.
- Run additional targeted tests when tests relevant to the changed code exist.

## Agent Autonomy

Codex may without prior approval:

- Inspect and search the repository.
- Run read-only Git commands.
- Run validation, linting, formatting checks, builds, and tests.
- Run Prisma validation and migration status commands.
- Inspect Docker container status and logs.
- Fix linting, formatting, and type errors caused by its own changes.
- Update documentation related to its changes.

Codex must request approval before:

- Adding, removing, or upgrading dependencies.
- Creating or applying database migrations.
- Seeding, resetting, or deleting database data.
- Changing environment variables or secrets.
- Modifying Docker infrastructure.
- Creating, deleting, or renaming branches.
- Committing or pushing changes.
- Making architectural changes outside the scope of the requested task.

## Git

- Do not modify existing commits.
- Do not force push.
- Show a concise git diff summary after changes.
- Do not create branches unless explicitly requested.

## Database

- Never edit an already-applied Prisma migration.
- Generate a new migration for schema changes.
- Do not reset or delete development data unless explicitly requested.

## Architecture

- Keep route handlers thin.
- Put business logic in services.
- Keep database access behind Prisma.
- Preserve `/api/v1` conventions.

## Dependencies

- Prefer existing dependencies.
- Before adding a dependency, explain why it is necessary.

## Pre-Commit Review

When asked to perform a pre-commit review:

1. Inspect `git status`.
2. Inspect the complete working-tree diff, including staged and unstaged changes.
3. Identify:

- Likely bugs or regressions.
- Type-safety problems.
- Database or Prisma concerns.
- Debugging code or accidental changes.
- Secrets, credentials, or sensitive data that should not be committed.
- Unnecessary or unrelated changes.
- Missing documentation when the change requires it.

4. Run the standard validation sequence:

- `npm run prisma:validate`
- `npm run lint`
- `npm run format:check`
- `npm run build`

5. Run relevant targeted tests when they exist.
6. Do not modify files during the review unless explicitly requested.
7. Do not stage, commit, push, or create branches.
8. Finish with a concise report containing:

- Files changed.
- Validation results.
- Findings grouped by severity.
- Any recommended fixes.
- Final status: `READY TO COMMIT` or `NOT READY TO COMMIT`.

A pre-commit review is read-only by default. If an issue is found, report it and wait for approval before making changes.

## End-of-Session Review

When asked to perform an end-of-session review:

1. Inspect `git status`.
2. Inspect staged and unstaged changes.
3. Review commits made during the current development session when they can be identified reliably.
4. Do not modify, stage, commit, push, or delete files.
5. Determine the current state of the work, including:

- Work completed during the session.
- Work that remains incomplete.
- TODO or FIXME items related to the current work.
- Known errors, warnings, or validation failures.
- Uncommitted or untracked files.
- Database or migration state when relevant.

6. If application code changed and current validation results are not already known, run the standard validation sequence:

- `npm run prisma:validate`
- `npm run lint`
- `npm run format:check`
- `npm run build`

7. Run relevant targeted tests when they exist.
8. Identify the most logical next development step based only on the current repository state and work performed.
9. Finish with a concise handoff report containing:

- Completed work.
- Current Git state.
- Validation status.
- Unfinished work or known issues.
- Recommended next step.

An end-of-session review is read-only. Report problems without fixing them unless explicitly requested.

## Repository Health Check

When asked to perform a repository health check:

1. Inspect the repository without modifying files.
2. Inspect `git status` and report uncommitted or untracked work.
3. Run the standard validation sequence:
    - `npm run prisma:validate`
    - `npm run lint`
    - `npm run format:check`
    - `npm run build`
4. Run `git diff --check`.
5. Inspect relevant project configuration and source code for:
    - TODO and FIXME items.
    - Type-safety concerns.
    - Obvious dead or duplicated code.
    - Debugging code that appears unintentionally retained.
    - Dependency or configuration concerns.
    - Prisma schema and migration concerns.
    - Docker configuration concerns.
    - Missing or outdated documentation.
    - Obvious security concerns such as exposed secrets or unsafe configuration.
6. Check Prisma migration status when the database is available.
7. Inspect Docker service status when Docker is available.
8. Do not install, remove, or upgrade dependencies.
9. Do not apply migrations, modify database data, or change Docker infrastructure.
10. Do not modify, stage, commit, push, or delete files.
11. Do not treat speculative improvements or personal style preferences as defects.
12. Prioritize findings as:
    - Critical
    - High
    - Medium
    - Low
13. Finish with a concise report containing:
    - Validation results.
    - Git state.
    - Database and Docker status when checked.
    - Findings grouped by severity.
    - Recommended actions in priority order.
    - Final repository health: `HEALTHY`, `NEEDS ATTENTION`, or `UNHEALTHY`.

A repository health check is read-only. Report findings without fixing them unless explicitly requested.
