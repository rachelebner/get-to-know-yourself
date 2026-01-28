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

---

## Reference: Submodule Commit Workflow

This project uses a git submodule at `.cursor/rules-src`. Here's how to commit changes properly.

> **Note:** The submodule uses HTTPS URL (not SSH) for CI/CD compatibility (e.g., Netlify). When cloning or adding submodules, always use HTTPS: `https://github.com/rachelebner/racheli-personal-rules.git`

### The Golden Rule
**Always commit & push the submodule BEFORE the parent repo.**

The parent repo stores a pointer to a specific commit in the submodule. If you push the parent first, it may reference a commit that doesn't exist on the remote.

### Workflow

```bash
# 1. Make changes in submodule
cd .cursor/rules-src
# ... edit files ...

# 2. Commit & push submodule
git add -A
git commit -m "your message"
git push origin main

# 3. Go back to parent repo
cd ../..

# 4. Commit parent (includes updated submodule pointer)
git add .cursor/rules-src  # stages the new commit pointer
git add <other-files>
git commit -m "your message"
git push origin main
```

### Useful Commands

```bash
# Check submodule status
git submodule status

# Update submodule to latest remote
git submodule update --remote

# Push parent + all submodules in one go (if submodules are committed)
git push --recurse-submodules=on-demand
```

### Common Pitfall
If you see `(modified content)` next to the submodule in `git status`, it means the submodule has uncommitted changes. Commit those first before committing the parent.



Start learnning about cursor commands/skills, in addition to rules.

---

## Session: 2026-01-28 - Communication Styles Questionnaire

### What We Did
- Built second questionnaire: סגנונות תקשורת (Communication Styles)
- 40 yes/no questions → 4 personality types (supportive, analytical, expressive, driver)
- Implemented content separation pattern (Hebrew text in content.json)
- Bar chart visualization for results
- Ranked analysis: top 2 dominant types (full details) + bottom 2 as FYI
- Added "חזרה להנחיות" button on question 1 (both questionnaires)

### Decisions Made
- **Content separation** - All Hebrew text in JSON, JS has logic only
- **Analysis hierarchy** - Show top 2 types in detail, bottom 2 minimized
- **Question 1 UX** - "Back to instructions" instead of disabled button

### Workflow Observations
- Barry (Solo Dev persona) worked well for fast execution
- Content separation adds ~1 file but makes future edits much cleaner
- Having proactiveness as reference made building second questionnaire faster

### Rule Candidates
- Content separation pattern should be documented in design.md ✓ (done)
- "Back to intro on Q1" could become a standard pattern for all questionnaires

