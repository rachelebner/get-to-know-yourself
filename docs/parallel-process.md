# Parallel Feature Processing Workflow

## Overview

Process multiple features/tasks in parallel using git worktrees or separate branches. This document defines the general workflow pattern - specific batch plans reference this document.

**Related:** See `docs/batch-plans/` for specific batch execution plans.

---

## When to Use This Workflow

Use parallel processing when:
- **3+ independent tasks** need implementation
- Tasks have **minimal file overlap** (different folders/files)
- You want to **maximize throughput** vs sequential work
- Tasks can be **reviewed/tested independently**

Don't use when:
- Tasks are **highly interdependent** (changes to shared files)
- Only **1-2 small tasks** (overhead not worth it)
- Tasks require **sequential feedback loops**

---

## Directory Structure

```
project/
├── docs/
│   ├── parallel-process.md      # This file (general guidance)
│   └── batch-plans/             # Specific batch execution plans
│       └── [batch-name].md      # Individual batch plan
├── _inbox/                      # Source documents/specs (if applicable)
└── [feature-folders]/           # Created per task
```

**Worktrees (for true parallelism):**
```
project-[feature-name]/          # One worktree per feature
```

---

## Workflow Phases

### Phase 0: Planning

1. **Define the batch** - List all features/tasks
2. **Analyze dependencies** - Identify shared files, execution order
3. **Create batch plan** - Document in `docs/batch-plans/[name].md`
4. **Determine parallelization** - How many concurrent tasks?

**Deliverable:** Batch plan document with task list and dependencies

---

### Phase 1: Setup (Sequential)

1. Ensure main branch is up to date
2. Create worktrees/branches for parallel work
3. Set up any shared foundations (if needed)

```bash
git checkout main && git pull origin main
git worktree add ../project-[feature-a] -b feat/[feature-a]
git worktree add ../project-[feature-b] -b feat/[feature-b]
```

**Deliverable:** Worktrees/branches ready for parallel work

---

### Phase 2: Implementation (Parallel)

For each feature (in parallel):

1. Implement the feature in its worktree/branch
2. Self-test within the worktree
3. Commit with clear message

**Parallelization rules:**
- Run up to N tasks concurrently (defined in batch plan)
- When a slot opens, start next task from queue
- Keep tasks in their designated folders to avoid conflicts

**Deliverable:** Working feature per task

---

### Phase 3: Review (Mixed)

Agent self-review checklist:
- [ ] Feature works as specified
- [ ] No lint errors introduced
- [ ] Mobile responsive (if UI)
- [ ] Follows existing patterns

User review (if needed):
- Test the feature
- Provide feedback or approve

**Deliverable:** Review complete, feedback addressed

---

### Phase 4: Testing (Parallel)

For each feature:
1. Run full test scenario
2. Test edge cases
3. Verify no regressions

**Deliverable:** Test confirmation

---

### Phase 5: Merge (Sequential)

Merge features one at a time to avoid conflicts:

```bash
# In worktree
git add -A
git commit -m "feat: [description]"
git push -u origin feat/[feature-name]

# From main repo
git checkout main
git merge feat/[feature-name]
git push origin main

# Cleanup
git worktree remove ../project-[feature-name]
git branch -d feat/[feature-name]
```

**Deliverable:** Features merged to main

---

## Parallelization Strategy

| Phase | Parallel? | Notes |
|-------|-----------|-------|
| 0. Planning | No | One-time setup |
| 1. Setup | No | Sequential branch creation |
| 2. Implementation | **Yes** | Main parallelization opportunity |
| 3. Review | Mixed | Agent parallel, user serial |
| 4. Testing | **Yes** | Can test multiple concurrently |
| 5. Merge | No | Sequential to avoid conflicts |

---

## Concurrency Guidelines

| Batch Size | Recommended Concurrent | Rationale |
|------------|----------------------|-----------|
| 2-3 tasks | 2 | Low overhead |
| 4-6 tasks | 3-4 | Good balance |
| 7-10 tasks | 4-5 | Agent context limits |
| 10+ tasks | Split into waves | Avoid overwhelming |

---

## Agent Task Batching

When working with agent, batch requests by phase:

**Good:**
- "Implement all foundation tasks (F1, F2)"
- "Integrate feature into all 7 questionnaires"

**Less efficient:**
- "Do everything for feature A, then B, then C"

**Communication pattern:**
```
User: "Start Phase 2 - implement F1, F2, F3 in parallel"
Agent: [implements all three]
Agent: "F1, F2, F3 complete. Ready for Phase 3 review?"
```

---

## Handoff Points

Clear handoffs between user and agent:

| Step | Owner | Handoff Signal |
|------|-------|----------------|
| Define batch | User | "Batch plan ready in docs/batch-plans/X.md" |
| Approve plan | User | "Plan approved, start Phase 1" |
| Review implementation | User | "Approved" or "Issues: ..." |
| Final approval | User | "Merge it" |

---

## Status Tracking Template

Copy this to your batch plan:

```markdown
## Status

| Task | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|------|---------|---------|---------|---------|---------|
| task-a | [ ] | [ ] | [ ] | [ ] | [ ] |
| task-b | [ ] | [ ] | [ ] | [ ] | [ ] |

**Last updated:** [DATE]
**Notes:** [Current status]
```

---

## Quick Commands Reference

```bash
# List all worktrees
git worktree list

# Create new worktree
git worktree add ../project-[name] -b feat/[name]

# Switch to worktree
cd ../project-[name]

# Check branch status
git status

# Remove worktree after merge
git worktree remove ../project-[name]
git branch -d feat/[name]
```

---

## Batch Plan Template

Create new batch plans in `docs/batch-plans/[name].md`:

```markdown
# [Batch Name] - Parallel Execution Plan

**Batch ID:** [unique-id]
**Created:** [date]
**Status:** Planning | In Progress | Complete

## Overview
[What this batch accomplishes]

## Tasks

| ID | Task | Description | Dependencies |
|----|------|-------------|--------------|
| T1 | ... | ... | None |
| T2 | ... | ... | T1 |

## Execution Strategy
- **Max concurrent:** [N]
- **Estimated phases:** [N rounds]

## Phase Breakdown
[Details per phase]

## Status Tracking
[Use template from parallel-process.md]
```

---

## See Also

- `docs/batch-plans/` - Specific batch execution plans
- `docs/questionnaire-patterns.md` - Questionnaire-specific patterns
