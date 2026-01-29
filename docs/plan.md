# Feature Implementation Plan

**Status:** Draft - Pending Review  
**Created:** 2026-01-29

---

## Features

| ID | Feature | Description | Spec |
|----|---------|-------------|------|
| P2.5 | Enhanced Share | Multi-format copy/share (Markdown, Rich Text, Web Share API) | [p2.5-enhanced-share.md](features/p2.5-enhanced-share.md) |
| P3.1 | Test Mode | Hub toggle for auto-fill + skip to results | [p3.1-test-mode.md](features/p3.1-test-mode.md) |

---

## Tasks

### Foundation Tasks

| ID | Task | Description | Creates | Dependencies |
|----|------|-------------|---------|--------------|
| F0 | Assertiveness Cleanup | Compare to other questionnaires, fix UI quality issues | `assertiveness/*` | None |
 F1 | Test Mode Lib | Core test mode logic | `lib/testmode.js` | None |
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
| I7 | Assertiveness | Integrate testmode + share | `assertiveness/app.js` | F1, F2, F3, I0 |

---

## Dependency Graph

```
I0 (assertiveness cleanup) ──────────────────────────────┐
                                                         │
F1 (testmode.js) ──┐                                     │
                   ├──► F3 (hub toggle) ──┐              │
F2 (share.js) ─────┘                      │              │
                                          ▼              ▼
                              ┌─────────────────────────────┐
                              │   Integration Tasks          │
                              │   I1, I2, I3, I4, I5, I6, I7 │
                              │   (parallel, I7 needs I0)    │
                              └─────────────────────────────┘
```

---

## Execution Order

### Phase 0: Cleanup
- I0 can run in parallel with Phase 1 (no dependencies)

**Batch 0:** I0 (parallel with Batch 1)

### Phase 1: Foundations (Parallel)
- F1 and F2 can run in parallel (no file conflicts)
- F3 depends on F1, runs after

**Batch 1:** F1, F2 (parallel with I0)  
**Batch 2:** F3 (after F1 complete)

### Phase 2: Integrations (Parallel, 3 at a time)
- I1-I6 depend on F1, F2, F3
- I7 also depends on I0 (assertiveness cleanup)
- No conflicts between integration tasks (different folders)

**Batch 3:** I1, I2, I3 (parallel)  
**Batch 4:** I4, I5, I6 (parallel)  
**Batch 5:** I7 (after I0 complete)

---

## Estimated Effort

| Phase | Tasks | Parallel Batches | Est. Time |
|-------|-------|------------------|-----------|
| Phase 0 | I0 | runs with Phase 1 | ~20 min |
| Phase 1 | F1, F2, F3 | 2 batches | ~30 min |
| Phase 2 | I1-I7 | 3 batches | ~45 min |
| Testing | All | 1 batch | ~15 min |
| **Total** | 11 tasks | 6 batches | ~90 min |

*Note: I0 runs in parallel with Phase 1, so no additional time.*

---

## Open Questions

1. **Image export** - Include in P2.5 or defer? (requires html2canvas dependency)
2. **Share button UI** - Dropdown menu or separate buttons?
3. **Test mode visual** - How prominent should the indicator be?

---

## Approval

- [ ] Feature scope approved
- [ ] Task breakdown approved
- [ ] Dependencies correct
- [ ] Execution order approved

**Ready to start?** Once approved, run: `"Start Phase 1 of the feature plan"`
