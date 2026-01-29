# P2/P3 Features - Parallel Execution Plan

**Batch ID:** p2-p3-features  
**Created:** 2026-01-29  
**Status:** Planning  
**Reference:** [docs/parallel-process.md](../parallel-process.md)

---

## Overview

Implement two feature sets across all 7 questionnaires:
- **P2.5 Enhanced Share** - Multi-format share/copy (Markdown, Rich Text, Web Share API)
- **P3.1 Test Mode** - Hub toggle for auto-fill answers and skip to results

---

## Tasks

### Foundation Tasks (Phase 1)

| ID | Task | Description | Files Created | Dependencies |
|----|------|-------------|---------------|--------------|
| F1 | Test Mode Foundation | Test mode logic + hub toggle UI | `lib/testmode.js`, hub changes | None |
| F2 | Enhanced Share Helper | Multi-format copy/share utility | `lib/share.js` | None |

### Integration Tasks (Phase 2)

| ID | Task | Description | Files Modified | Dependencies |
|----|------|-------------|----------------|--------------|
| I1 | Proactiveness Integration | Integrate testmode + share | `proactiveness/app.js` | F1, F2 |
| I2 | Communication Styles Integration | Integrate testmode + share | `communication-styles/app.js` | F1, F2 |
| I3 | Situational Leadership Integration | Integrate testmode + share | `situational-leadership/app.js` | F1, F2 |
| I4 | Engagement Drivers Integration | Integrate testmode + share | `engagement-drivers/app.js` | F1, F2 |
| I5 | Leadership Circles Integration | Integrate testmode + share | `leadership-circles/app.js` | F1, F2 |
| I6 | Managerial Courage Integration | Integrate testmode + share | `managerial-courage/app.js` | F1, F2 |
| I7 | Assertiveness Integration | Integrate testmode + share | `assertiveness/app.js` | F1, F2 |

---

## Execution Strategy

- **Max concurrent:** 3 tasks
- **Total tasks:** 9 (2 foundations + 7 integrations)
- **Estimated rounds:** 4 (1 for foundations, 3 for integrations)
- **Worktrees:** Not needed (different files, can work in single branch)

### Conflict Analysis

| Task Group | Potential Conflicts | Mitigation |
|------------|-------------------|------------|
| F1, F2 | None - different files | Run parallel |
| I1-I7 | None - different folders | Run 3 at a time |
| Hub changes | F1 touches hub | F1 completes before I* tasks |

---

## Phase Breakdown

### Phase 1: Foundations (Parallel)

Run F1 and F2 simultaneously:

**F1: Test Mode Foundation**
```
Create: lib/testmode.js
- isTestMode() - check URL param ?testmode=1
- fillRandomAnswers(questionsCount, scaleMax) - generate random answers
- getTestModeToggle() - HTML for hub toggle switch

Modify: index.html (hub)
- Add test mode toggle in header
- Store state in URL param for persistence
```

**F2: Enhanced Share Helper**
```
Create: lib/share.js
- copyAsMarkdown(text) - plain text clipboard
- copyAsRichText(html) - rich text clipboard
- shareNative(data) - Web Share API wrapper
- getShareButtons() - HTML for share button group

Requirements to clarify:
- Image export (html2canvas?) - defer to later
- RTF format - evaluate complexity
```

**Completion criteria:** Both files exist, hub toggle works

---

### Phase 2: Integrations (3 at a time)

**Round 1:** I1, I2, I3  
**Round 2:** I4, I5, I6  
**Round 3:** I7

For each integration:
```javascript
// 1. Import helpers
import { isTestMode, fillRandomAnswers } from '../lib/testmode.js';
import { copyAsMarkdown, shareNative, getShareButtons } from '../lib/share.js';

// 2. Check test mode on init
if (isTestMode()) {
  answers = fillRandomAnswers(questions.length, 5);
  showResults();
}

// 3. Replace/enhance copy button
// - Add share button group with format options
// - Use shareNative() on mobile
```

**Completion criteria:** All 7 questionnaires have test mode + enhanced share

---

## Task Briefs

### F1: Test Mode Foundation

**Goal:** Global toggle that auto-fills questionnaires for testing

**Implementation:**
1. Create `lib/testmode.js`:
   ```javascript
   export const isTestMode = () => 
     new URLSearchParams(window.location.search).has('testmode');
   
   export const fillRandomAnswers = (count, max) => 
     Array.from({ length: count }, () => Math.floor(Math.random() * max) + 1);
   ```

2. Add toggle to hub header:
   ```html
   <label class="testmode-toggle">
     <input type="checkbox" id="testmode-toggle" />
     <span>מצב בדיקה</span>
   </label>
   ```

3. Toggle updates URL param and reloads if entering questionnaire

**Acceptance criteria:**
- [ ] Toggle visible in hub header
- [ ] URL shows `?testmode=1` when enabled
- [ ] State persists across page loads

---

### F2: Enhanced Share Helper

**Goal:** Multi-format share/copy functionality

**Implementation:**
1. Create `lib/share.js`:
   ```javascript
   export const copyAsMarkdown = async (text) => {
     await navigator.clipboard.writeText(text);
   };
   
   export const shareNative = async (data) => {
     if (navigator.share) {
       await navigator.share(data);
       return true;
     }
     return false;
   };
   ```

2. Provide button generator for consistent UI

**Acceptance criteria:**
- [ ] Markdown copy works
- [ ] Web Share API used on mobile (falls back to copy)
- [ ] Consistent button styling

---

### I1-I7: Questionnaire Integrations

**Goal:** Each questionnaire uses test mode + enhanced share

**Per-questionnaire changes:**
1. Import lib files (type="module" script)
2. Check `isTestMode()` on init
3. Replace copy button with share button group
4. Test all flows work

**Acceptance criteria:**
- [ ] Test mode auto-fills and shows results
- [ ] Share button shows format options
- [ ] Existing functionality preserved

---

## Status Tracking

| Task | Setup | Implement | Review | Test | Merge |
|------|-------|-----------|--------|------|-------|
| F1 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| F2 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| I1 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| I2 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| I3 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| I4 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| I5 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| I6 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| I7 | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

**Last updated:** 2026-01-29  
**Current phase:** Planning  
**Notes:** Awaiting approval to start Phase 1

---

## Execution Flow Diagram

```
Phase 1:  F1 ─────────►
          F2 ─────────►  (parallel, ~30 min)
                      │
                      ▼ (foundations complete)
                      
Phase 2:  I1 ─────►  I4 ─────►  I7 ─────►
          I2 ─────►  I5 ─────►
          I3 ─────►  I6 ─────►
          └── 3 at a time (~20 min each round) ──┘
                      │
                      ▼ (all integrations complete)
                      
Phase 3:  Review all → Test all → Merge to main
```

**Estimated total time:** ~2-3 hours (agent work) + review time

---

## Open Questions

1. **Rich Text format** - Is HTML clipboard sufficient, or need actual RTF?
2. **Image export** - Defer to separate batch? (requires html2canvas)
3. **Share button placement** - Replace copy button or add alongside?

---

## See Also

- [docs/parallel-process.md](../parallel-process.md) - General parallel workflow
- [docs/spec.md](../spec.md) - P2/P3 feature requirements
