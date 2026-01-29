# Feature Implementation Plan

**Status:** ✅ Complete  
**Created:** 2026-01-29  
**Completed:** 2026-01-29

---

## Features

| ID | Feature | Description | Spec |
|----|---------|-------------|------|
| P2.5 | Enhanced Share | Multi-format copy/share (Markdown, Rich Text, Web Share API) | [p2.5-enhanced-share.md](features/p2.5-enhanced-share.md) |
| P3.1 | Test Mode | Hub toggle for auto-fill + skip to results | [p3.1-test-mode.md](features/p3.1-test-mode.md) |

---

## Tasks

This list will guide the execution, parallelization and dependencies.

### Foundation Tasks

| ID | Task | Description | Creates | Dependencies |
|----|------|-------------|---------|--------------|
| F0 | Assertiveness Cleanup | Compare to other questionnaires, fix UI quality issues | `assertiveness/*` | None |
| F1 | Test Mode Lib | Core test mode logic | `lib/testmode.js` | None |
| F2 | Share Lib | Multi-format share/copy utility | `lib/share.js` | None |
| F3 | Hub Toggle | Test mode toggle in hub header | `index.html` changes | F1 |




### Integration Tasks

| ID | Task | Description | Modifies | Dependencies |
|----|------|-------------|----------|--------------|
| I1 | Proactiveness | Integrate testmode + share | `proactiveness/app.js` | F1, F2, F3 |
| I2 | Communication Styles | Integrate testmode + share | `communication-styles/app.js` | F1, F2, F3 |
| I3 | Situational Leadership | Integrate testmode + share | `situational-leadership/app.js` | F1, F2, F3 |
| I4 | Engagement Drivers | Integrate testmode + share | `engagement-drivers/app.js` | F1, F2, F3 |
| I5 | Leadership Circles | Integrate testmode + share | `leadership-circles/app.js` | F1, F2, F3 |
| I6 | Managerial Courage | Integrate testmode + share | `managerial-courage/app.js` | F1, F2, F3 |
| I7 | Assertiveness | Integrate testmode + share | `assertiveness/app.js` | F1, F2, F3, F0 |

---

## Dependency Graph

```
F0 (assertiveness cleanup) ──────────────────────────────┐
                                                         │
F1 (testmode.js) ──┐                                     │
                   ├──► F3 (hub toggle) ──┐              │
F2 (share.js) ─────┘                      │              │
                                          ▼              ▼
                              ┌─────────────────────────────┐
                              │   Integration Tasks          │
                              │   I1, I2, I3, I4, I5, I6, I7 │
                              │   (parallel, I7 needs F0)    │
                              └─────────────────────────────┘
```

---

## Estimated Effort

| Phase | Tasks | Parallel Batches | Est. Time |
|-------|-------|------------------|-----------|
| Phase 0 | F0 | runs with Phase 1 | ~20 min |
| Phase 1 | F1, F2, F3 | 2 batches | ~30 min |
| Phase 2 | I1-I7 | 3 batches | ~45 min |
| Testing | All | 1 batch | ~15 min |
| **Total** | 11 tasks | 6 batches | ~90 min |

*Note: F0 runs in parallel with Phase 1, so no additional time.*

---

## Decisions

1. **Image export** - Deferred (no html2canvas dependency for now)
2. **Share button UI** - Desktop: single "העתק תוצאות" | Mobile: separate buttons ("העתק כטקסט", "העתק מעוצב", "שתף")
3. **Test mode visual** - Toggle visible on hub AND questionnaires. Removes "מילוי אקראי" debug button from all questionnaires.

---

## Approval

- [x] Feature scope approved
- [x] Task breakdown approved
- [x] Dependencies correct
- [x] Execution order approved
