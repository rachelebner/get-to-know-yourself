# Quick UI Project - Start

**Trigger:** Beginning of a new agent conversation for a UI-only or UI-mostly project

## Actions

### 1. Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b ui/<short-description>
```

**Branch naming:** `ui/<short-description>`
- Keep it lowercase, use hyphens
- Examples: `ui/todo-app`, `ui/landing-page`, `ui/dashboard`

### 2. Initialize Project Documentation

Create these files in the `docs/` folder:

#### `spec.md`
```markdown
# Specification

## Overview
[One paragraph describing what this app does]

## Features
- [ ] Feature 1
- [ ] Feature 2

## User Flows
[Key user interactions]

## Constraints
[Any limitations or requirements]
```

#### `design.md`
```markdown
# Technical Design

## Stack
- [Framework/libraries]

## Architecture
[How the app is structured]

## Key Components
[Main components and their responsibilities]

## Data Model
[If applicable]

## External Dependencies
[APIs, services, etc.]
```

#### `retro.md`
```markdown
# Project Retrospective & Insights

Accumulated learnings and reflections from building [project name].

Focus only on workflow, process, usefulness of rules etc. ignore the actual project's design and code.

---

## Session: [DATE] - [Title]

### What We Did
- [Key accomplishments]

### Decisions Made
- [Important choices and rationale]

### Workflow Observations
- [What worked well, what to improve]

### Rule Candidates
- [Patterns to add to racheli-personal-rules]
```


## Reminders

- `spec.md` and `design.md` reflect **current state only** - no history, no tradeoffs
- Update them as the system evolves
- `retro.md` is for meta-insights about YOUR preferences/workflow, not the project features
