# P2/P3 Parallel Development Plan

**Max concurrent tasks:** 3  
**Orchestration:** Queue-based, next task starts when a slot opens

---

## Features to Implement

| ID | Feature | Description |
|----|---------|-------------|
| P2.5 | Enhanced Share | Share/copy results in multiple formats (Markdown, Rich Text, Image) + Web Share API |
| P3.1 | Test Mode | Hub toggle: auto-fill answers, skip to results |

---

## Phase 1: Foundations (2 parallel)

Create shared utilities before touching questionnaires.

| Task | Creates | Description | Status |
|------|---------|-------------|--------|
| F1 | `lib/testmode.js` | Test mode logic + hub toggle UI | ⬜ |
| F2 | `lib/share.js` | Multi-format share/copy helper | ⬜ |

**Both run in parallel** → No file conflicts (each creates new file)

---

## Phase 2: Per-Questionnaire Integration (7 tasks, 3 at a time)

Each task integrates ALL features into ONE questionnaire.

| Task | Questionnaire | Integrates | Status |
|------|---------------|------------|--------|
| I1 | `proactiveness/` | testmode, share | ⬜ |
| I2 | `communication-styles/` | testmode, share | ⬜ |
| I3 | `situational-leadership/` | testmode, share | ⬜ |
| I4 | `engagement-drivers/` | testmode, share | ⬜ |
| I5 | `leadership-circles/` | testmode, share | ⬜ |
| I6 | `managerial-courage/` | testmode, share | ⬜ |
| I7 | `assertiveness/` | testmode, share | ⬜ |

**Zero file conflicts** → Each agent owns one folder

---

## Execution Flow

```
Phase 1:  F1 ─────►
          F2 ─────►  (parallel)
                   │
                   ▼
Phase 2:  I1 ─────►  I4 ─────►  I7 ─────►
          I2 ─────►  I5 ─────►
          I3 ─────►  I6 ─────►
          └── 3 at a time ──┘
```

---

## Task Briefs

### F1: Test Mode Foundation
- Create `lib/testmode.js` with `isTestMode()` and `fillRandomAnswers()`
- Add toggle switch to hub header (stores in URL param `?testmode=1`)
- Questionnaires check param on load

### F2: Enhanced Share Helper
- Create `lib/share.js` with multi-format copy/share
- Formats: Markdown (plain text), Rich Text (HTML), Image (optional)
- Web Share API for mobile native share
- Requirements TBD before implementation

### I1-I7: Questionnaire Integration
For each questionnaire:
1. Import `lib/testmode.js` → check on init, auto-fill if enabled
2. Import `lib/share.js` → replace/enhance existing copy button
3. Test both features work correctly

---

## Execution Checklist

```
Phase 1:
[ ] Start F1, F2 (parallel)
[ ] Both foundations complete → commit

Phase 2:
[ ] Start I1, I2, I3 (parallel)
[ ] I1 done → Start I4
[ ] I2 done → Start I5
[ ] I3 done → Start I6
[ ] I4 done → Start I7
[ ] All integrations complete → commit
```

---

## Summary

- **9 total tasks** (2 foundations + 7 integrations)
- **Phase 1:** 1 round (2 parallel)
- **Phase 2:** ~3 rounds (7 tasks, 3 at a time)
