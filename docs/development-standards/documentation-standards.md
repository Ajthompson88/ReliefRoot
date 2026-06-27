# Documentation Standards

## Purpose

Documentation should explain **why** and **how**, not just **what**.

ReliefRoot documentation exists to make the project understandable months or years after the code is written.

---

# Documentation Principles

Documentation should:

- Explain intent before implementation.
- Stay synchronized with the codebase.
- Favor clarity over completeness.
- Prefer diagrams when they communicate better than text.
- Be written for future contributors, including future-you.

---

# General Rules

- Use Markdown (`.md`) for all documentation.
- Use lowercase kebab-case filenames.
- One topic per document.
- Keep documentation current with code changes.
- Store documentation in the appropriate folder.
- Screenshots should support documentation, not replace it.

---

# Documentation Structure

| Folder        | Purpose                            | Naming Standard                 |
| ------------- | ---------------------------------- | ------------------------------- |
| adr           | Architecture Decision Records      | `0001-topic-name.md`            |
| api           | API documentation                  | `topic-name.md`                 |
| architecture  | System architecture                | `topic-name.md`                 |
| cheat-sheets  | Quick reference guides             | `topic-name.md`                 |
| diagrams      | Flowcharts and Excalidraw exports  | `YYYY-MM-DD-topic-name.ext`     |
| erd           | Entity Relationship Diagrams       | `v#-topic-name.ext`             |
| meeting-notes | Development session notes          | `YYYY-MM-DD-topic-name.md`      |
| research      | Research and technical references  | `topic-name.md`                 |
| screenshots   | Project milestone screenshots      | `YYYY-MM-DD-##-description.png` |
| sprints       | Sprint planning and retrospectives | `sprint-##-topic.md`            |
| standards     | Project standards                  | `topic-name.md`                 |

---

# Documentation Standards

## Screenshots

Purpose:

Capture important project milestones.

Naming:

```
YYYY-MM-DD-##-description.png
```

Example:

```
2026-06-26-02-initial-monorepo-scaffold.png
```

Screenshots should:

- Capture meaningful milestones.
- Be stored in `docs/screenshots/`.
- Remain in chronological order.
- Never replace written documentation.

---

## Diagrams

Create diagrams using Excalidraw whenever possible.

Store:

- `.excalidraw`
- `.png`

Location:

```
docs/diagrams/
```

---

## Entity Relationship Diagrams (ERDs)

Store:

- Source files
- PNG exports
- Version history

Naming:

```
v1-core-schema.excalidraw
v1-core-schema.png
```

---

## Architecture Decision Records (ADRs)

Record every significant architectural decision.

Naming:

```
0001-use-postgresql.md
0002-adopt-monorepo.md
```

Each ADR should answer:

- What was decided?
- Why was it chosen?
- What alternatives were considered?
- What are the consequences?

---

## Meeting Notes

Each development session should end with a recap.

Include:

- Work completed
- Decisions made
- Problems encountered
- Next steps

Naming:

```
YYYY-MM-DD-topic-name.md
```

---

# Documentation Checklist

Before committing documentation, verify:

- Documentation is current.
- Naming follows project conventions.
- Files are in the correct folder.
- Diagrams and screenshots are included when helpful.
- Links are valid.

---

# Guiding Principle

Good documentation reduces future confusion.

If future-you has to guess why something was built, the documentation is incomplete.
