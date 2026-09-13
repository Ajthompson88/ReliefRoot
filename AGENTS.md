# ReliefRoot Agent Instructions

## Core Operating Rules

- Work only within the scope of the requested task.
- Inspect existing implementation and conventions before changing code.
- Prefer existing architecture, patterns, and dependencies.
- Do not make unrelated cleanup changes.
- Report pre-existing problems rather than silently fixing unrelated code.

## Validation

Run the standard validation sequence after modifying application code:

1. `npm run prisma:validate`
2. `npm run lint`
3. `npm run format:check`
4. `npm run build`

These commands correspond to the VS Code `ReliefRoot: Full Validation` task.

- Work is not complete if validation failures caused by the agent remain unresolved.
- Report pre-existing failures rather than fixing them outside the requested scope.
- Run relevant targeted tests when they exist.

## Execution Autonomy

The agent may perform the following without repository-level approval:

- Repository searches and file inspection.
- Read-only Git commands, including status, diff, and log.
- Validation, linting, formatting checks, builds, and tests.
- Prisma validation and migration-status inspection.
- Docker container/service status and log inspection.
- Other operations that inspect state without intentionally changing repository, database, dependency, infrastructure, environment, or Git state.
- Fixes for linting, formatting, or type errors caused by the agent's own authorized changes.
- Documentation updates directly related to authorized changes.

The agent must obtain explicit authorization before intentionally changing:

- Dependencies, including additions, removals, or upgrades.
- Database schema or migration state, including creating or applying migrations.
- Seed or persistent database data, including seeding, resetting, or deleting data.
- Environment variables or secrets.
- Docker infrastructure or container lifecycle, including starting, stopping, or recreating containers.
- Git branches, including creating, deleting, or renaming them.
- Commits, pushes, or remote Git state.
- Architecture outside the explicitly requested task.

Request approval when that authorization has not already been provided. Authorization does not
permit actions explicitly prohibited elsewhere in this policy.

Runtime or sandbox permissions are separate from repository authorization. A command permitted by
AGENTS.md may still require approval to access resources outside the execution environment's sandbox.
Do not interpret a runtime or sandbox permission request as an AGENTS.md policy violation.

## Git

- Never modify existing commits.
- Never force push.
- Follow Execution Autonomy authorization requirements for branches, commits, pushes, and remotes.
- Show a concise Git diff summary after changes.

## Database

- Never edit an already-applied Prisma migration.
- Generate a new migration for schema changes, subject to the Execution Autonomy approval requirements.
- Never reset or delete development data without explicit authorization.

## Architecture

- Keep route handlers thin.
- Put business logic in services.
- Keep database access behind Prisma.
- Preserve `/api/v1` conventions.

## Dependencies

- Prefer existing dependencies.
- Before adding a dependency, explain why it is necessary and obtain approval.

## TODO Management

`TODO.md` is the repository's living development work tracker. Each work-item heading is the canonical
machine-readable representation of its identity and state. Use these exact formats:

```markdown
### TODO RR-### [PLANNED]: Description

### TODO RR-### [IN_PROGRESS]: Description

### TODO RR-### [BLOCKED]: Description

### RR-### [COMPLETED]: Description
```

- Valid states are exactly `PLANNED`, `IN_PROGRESS`, `BLOCKED`, and `COMPLETED`.
- Heading state is canonical; do not infer state from prose or maintain a separate Status field.
- Each RR identifier is permanent and unique. Never reuse or renumber identifiers.
- Assign new identifiers sequentially after inspecting existing IDs.
- Unfinished headings retain `TODO`; completed headings must not contain `TODO`.
- Heading state and section must agree: `PLANNED` in `Planned`, `IN_PROGRESS` in `In Progress`, `BLOCKED` in `Blocked`, and `COMPLETED` in `Completed`.
- Preserve priorities, descriptions, acceptance criteria, notes, and other useful work-item information.
- Add actionable work only when directly supported by repository evidence. Do not add speculative improvements, stylistic preferences, or unrelated ideas.
- Retain completed items in `Completed`; do not delete them.
- If `TODO.md` does not exist, create it before recording actionable work, with `In Progress`, `Planned`, `Blocked`, and `Completed` sections.
- Do not create `TODO.md` solely because the repository has no outstanding actionable work.
- If `TODO.md` is unexpectedly missing but Git history shows it previously existed, report the discrepancy rather than recreating it automatically.

## Work Item Lifecycle

When implementing an existing RR item:

1. Review its scope, acceptance criteria, and related TODO items.
2. Change `PLANNED` to `IN_PROGRESS` before implementation begins.
3. Preserve its RR identifier throughout all state changes.
4. Change `IN_PROGRESS` to `BLOCKED` if an unresolved dependency or required decision prevents continuation.
5. Update checklists and concise implementation notes as work progresses.
6. Change to `COMPLETED` only after acceptance criteria are satisfied and relevant validation passes.
7. For every state change, update the canonical heading, retain `TODO` only for unfinished work, and move the item to the matching section.
8. If implementation materially changes another existing RR item's scope or acceptance criteria, update that item without incorrectly changing its state.
9. Mention TODO changes in the final implementation summary.

## Pre-Commit Review

A pre-commit review is read-only by default. Do not modify files unless explicitly requested, and do
not stage, commit, push, or create branches during the review.

1. Inspect Git status and the complete staged and unstaged diff, including untracked files.
2. Check for bugs or regressions, type-safety problems, Prisma/database issues, debugging artifacts, secrets or sensitive data, unrelated changes, and missing required documentation.
3. Run the standard validation sequence and relevant targeted tests.
4. Report problems and recommended fixes without applying them unless explicitly authorized.
5. Finish with files changed, validation results, findings grouped by severity, recommended fixes, and `READY TO COMMIT` or `NOT READY TO COMMIT`.

## End-of-Session Review

An end-of-session review is read-only. Do not modify, stage, commit, push, or delete files.

1. Inspect Git status, staged and unstaged changes, and untracked files.
2. Review commits from the development session when they can be identified reliably.
3. Determine completed and incomplete work, related TODO/FIXME items, known errors or warnings, validation failures, and relevant database/migration state.
4. Run the standard validation sequence if application code changed and current validation results are not already known. Run relevant targeted tests.
5. Verify that canonical TODO states reflect the current repository state and agree with their sections. Report discrepancies without editing TODO.md.
6. Identify the highest-priority unfinished RR item and recommend the most logical next development step based on repository evidence.
7. Finish with a concise handoff covering completed work, Git state, validation status, unfinished work or known issues, and the recommended next step.

## Repository Health Check

A repository health check is strictly read-only. Do not modify repository files or TODO.md, stage,
commit, push, delete files, change dependencies, apply migrations, change persistent data, or alter
Docker infrastructure or container lifecycle.

1. Inspect Git status and report uncommitted and untracked work.
2. Run the standard validation sequence, relevant targeted tests, and `git diff --check`.
3. Inspect relevant configuration and source for TODO/FIXME items, type-safety concerns, obvious dead or duplicated code, accidental debugging artifacts, dependency/configuration concerns, Prisma/migration concerns, Docker configuration concerns, missing or outdated documentation, and obvious security issues.
4. Check Prisma migration status when the database is available and inspect Docker status when Docker is available.
5. Compare findings against TODO.md and identify matching RR items. Recommend additions or updates only when directly supported by repository evidence; do not change an item's state merely because it was rediscovered.
6. Do not treat speculative improvements or personal style preferences as defects.
7. Group findings as Critical, High, Medium, or Low.
8. Finish with validation results, Git state, database/Docker status when checked, severity-grouped findings, prioritized recommended actions, recommended TODO additions or updates, and `HEALTHY`, `NEEDS ATTENTION`, or `UNHEALTHY`.
