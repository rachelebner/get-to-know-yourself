# Project Retrospective & Insights

Accumulated learnings and reflections from building מרכז השאלונים.

Focus only on workflow, process, usefulness of rules etc. ignore the actual project's design and code.

---

## Session: 2026-01-28 - Project Kickoff

### What We Did
- how can I enhance botht he rules file and the rules-src file?

- before the quickstart, I need guidance for my own spec phase

---

## Session: 2026-01-28 - Technical Design

### What We Did
- Read existing proactiveness questionnaire code (HTML/CSS/JS)
- Created `docs/design.md` with technical implementation details
- Established `docs/retro.md` as the single file for retrospective + workflow insights
- Created `proactiveness/README.md` documenting questionnaire-specific patterns
- Added P3 feature: test mode toggle at hub level

### Decisions Made
- **Minimal shared styles** - `shared.css` for tokens + buttons only, not fully self-contained
- **Local documentation** - each questionnaire has its own README.md for structure docs
- **Don't assume uniformity** - questionnaire patterns may vary, document locally first

### Workflow Observations
- Starting with spec review before design worked well
- Iterating on design doc based on feedback was smooth
- Keeping spec.md and design.md in sync requires attention

### Suggestions for Future Sessions
- Run a consistency check between docs before finishing
- Consider a checklist for "what goes where" (spec vs design vs local README)


