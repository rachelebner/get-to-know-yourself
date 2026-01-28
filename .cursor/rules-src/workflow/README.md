# Workflows

Step-by-step processes for common development scenarios.

## Available Workflows

### Project Setup

| Workflow | File | When to Use |
|----------|------|-------------|
| New Project | [new-project-setup.md](new-project-setup.md) | Starting a brand new project |

### Quick UI Project

For UI-only or UI-mostly applications (React, Vanilla JS, simple full-stack).

| Phase | File | When to Use |
|-------|------|-------------|
| Start | [quick-ui-start.md](quick-ui-start.md) | Beginning of new UI project |
| Cleanup | [quick-ui-cleanup.md](quick-ui-cleanup.md) | Before finishing |
| Finish | [quick-ui-finish.md](quick-ui-finish.md) | Closing the agent |

### BMAD-Inspired Workflows

Structured processes adapted from [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD).

| Workflow | File | When to Use |
|----------|------|-------------|
| Brainstorming | [bmad-brainstorming.md](bmad-brainstorming.md) | Generating ideas, creative challenges |
| Design Thinking | [bmad-design-thinking.md](bmad-design-thinking.md) | User-focused design, new features |
| Problem Solving | [bmad-problem-solving.md](bmad-problem-solving.md) | Complex problems, root cause analysis |
| Code Review | [bmad-code-review.md](bmad-code-review.md) | PR reviews, quality checks |
| Story Development | [bmad-story-workflow.md](bmad-story-workflow.md) | Implementing user stories |

### Project Documentation Files

These workflows maintain three key files:

| File | Purpose | Updates |
|------|---------|---------|
| `spec.md` | System behavior description | Current state only |
| `design.md` | Technical architecture | Current state only |
| `retro.md` | Retrospective & workflow insights | Accumulates learnings per session |

---

## How to Use

Reference a workflow in your prompt:

```
"Follow my quick-ui-start workflow to initialize this project"
"Run the cleanup workflow before we finish"
"Let's do the finish workflow to wrap up"
"Use the design thinking workflow for this feature"
"Run the code review workflow on this PR"
```

Or use as a checklist during development.
