# Parallel Feature Processing Workflow

## Overview

Process multiple features/tasks in parallel using a queue-based approach. Tasks are spawned as slots become available (max 3 concurrent).

---

## Related Workflow Rules

| Rule | When to Use |
|------|-------------|
| `.cursor/rules/racheli/workflow/quick-ui-start.mdc` | Starting a new feature branch |
| `_inbox/quick-ui-cleanup.mdc` | Before finishing any task |
| `.cursor/rules-src/workflow/quick-ui-finish.md` | Completing and merging a feature |

---

## When to Use Parallel Processing

**Use when:**
- 3+ independent tasks need implementation
- Tasks have minimal file overlap
- Tasks can be reviewed/tested independently

**Don't use when:**
- Tasks are highly interdependent
- Only 1-2 small tasks
- Tasks require sequential feedback loops

---

## Feature Plan Input Format

Before starting parallel execution, provide a feature plan in this format:

```
FEATURE PLAN: [name]
MAX CONCURRENT: [N]

TASKS:
- [ID]: [description]
  SCOPE: [files/folders this task can modify]
  DEPENDS: [task IDs, or "none"]

- [ID]: [description]
  SCOPE: [files/folders]
  DEPENDS: [task IDs, or "none"]
```

**Example:**
```
FEATURE PLAN: P2-P3 Features
MAX CONCURRENT: 3

TASKS:
- F1: Create test mode library
  SCOPE: lib/testmode.js, index.html (hub header only)
  DEPENDS: none

- F2: Create share library  
  SCOPE: lib/share.js
  DEPENDS: none

- I1: Integrate features into proactiveness
  SCOPE: proactiveness/
  DEPENDS: F1, F2

- I2: Integrate features into communication-styles
  SCOPE: communication-styles/
  DEPENDS: F1, F2
```

**Rules:**
- Tasks with `DEPENDS: none` can start immediately
- Tasks wait until all dependencies complete
- Two tasks cannot have overlapping SCOPE

---

## Queue-Based Execution

```
QUEUE: [T1] [T2] [T3] [T4] [T5] [T6] [T7]
       ─────────────────────────────────►

SLOTS (max 3):
  [T1 running] [T2 running] [T3 running]
       │
       ▼ T1 completes
  [T4 running] [T2 running] [T3 running]
```

**Rules:**
1. Start with up to 3 tasks
2. When one completes, spawn next from queue
3. Continue until queue empty

---

## Task Lifecycle

### 1. Start Task
Follow `quick-ui-start.mdc`:
- Create branch `ui/<feature-name>` or work in main
- Clear scope: which files this task can modify

### 2. Implement
- Stay within file boundaries
- Commit incrementally
- Self-test before marking complete

### 3. Cleanup
Follow `quick-ui-cleanup.mdc`:
- Remove redundancies
- Update documentation
- Verify no lint errors

### 4. Complete
Follow `quick-ui-finish.md`:
- Push changes
- Merge to main (sequential, one at a time)
- Mark task done, spawn next

---

## File Boundaries

Prevent conflicts by assigning clear file ownership:

| Task Type | Owns | Can Read |
|-----------|------|----------|
| Foundation (lib/) | `lib/[feature].js` | Any |
| Integration | `[questionnaire]/` folder | `lib/`, `shared.css` |
| Hub changes | `index.html`, `styles.css` | Any |

**Rule:** Two tasks should never modify the same file simultaneously.

---

## Concurrency Guidelines

| Queue Size | Max Concurrent | Notes |
|------------|----------------|-------|
| 2-3 tasks | 2 | Low overhead |
| 4-6 tasks | 3 | Good balance |
| 7-10 tasks | 3-4 | Cap at 3 for safety |
| 10+ tasks | 3 | Process in waves |

---

## Communication Pattern

```
User: "Start feature queue"
Agent: "Starting T1, T2, T3 (3 slots)"
       [implements T1, T2, T3]
Agent: "T1 complete. Starting T4."
       "T2 complete. Starting T5."
       [continues until queue empty]
Agent: "All tasks complete. Ready to merge?"
```

---

## Feature Specifications

Store lightweight specs in `docs/features/`:

```
docs/features/
└── [feature-id]-[name].md
```

Each file: brief description, UI notes, implementation hints.

---

## Quick Reference

```bash
# Create feature branch
git checkout -b ui/<feature-name>

# Merge after completion
git checkout main && git merge ui/<feature-name>

# Cleanup branch
git branch -d ui/<feature-name>
```

---

## See Also

- `docs/features/` — Individual feature specifications
- `docs/questionnaire-patterns.md` — Questionnaire-specific patterns
- `docs/qa-review-checklist.md` — QA review checklist
