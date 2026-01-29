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

---

## Session: 2026-01-28 - Polish & Content Extraction

### What We Did
- Extracted Hebrew content to JSON in proactiveness questionnaire (content separation)
- Fixed results-actions button layout (flex: 1 for even distribution)
- Added logo.avif to hub page (100px) and questionnaire headers (56px)
- Simplified primary button style: removed shadow and hover movement

### Decisions Made
- **Button style simplification** - No shadow, no movement; just color darken on hover
- **Logo sizing** - Larger on hub (brand presence), smaller on questionnaires (subtle)
- **Button layout** - Use `flex: 1` for equal-width buttons in action rows

### Workflow Observations
- Screenshot feedback from user was essential for visual bug fixes
- Quick iteration cycle worked well for style refinements

---

## Session: 2026-01-29 - Templates & Parallel Process

### What We Did
- Analyzed all 7 questionnaires for structural patterns
- Created `_templates/likert-categories/` template for Likert+category questionnaires
- Generalized `parallel-process.md` to work for any feature batch (not just questionnaires)
- Created `docs/batch-plans/` folder for specific batch execution plans
- Created `docs/questionnaire-patterns.md` with structure analysis guidelines
- Added `parallel-features.mdc` cursor rule for running parallel batches

### Decisions Made
- **Don't refactor existing questionnaires to use template** - Template is for NEW questionnaires only. Existing ones work fine, retrofitting has risk with no user benefit.
- **Template vs custom** - Only template when 2+ questionnaires share exact structure. Most questionnaires are unique enough to warrant custom implementation.
- **Separation of concerns** - `parallel-process.md` defines HOW (general workflow), `batch-plans/*.md` defines WHAT (specific batches)

### Workflow Observations
- Starting with structure analysis before jumping to solutions helped identify which questionnaires could share templates
- The ROI analysis (cost vs benefit of refactoring) was valuable - prevented unnecessary work
- Having clear criteria for "when to template" avoids over-engineering

### Rule Candidates
- Template decision criteria could be extracted to a general rule for any project
- The "analyze before refactor" pattern is useful beyond questionnaires

---

## Session: 2026-01-29 - Parallel Feature Implementation (P2.5 + P3.1)

### What We Did
- Implemented P2.5 (Enhanced Share) and P3.1 (Test Mode) across all 7 questionnaires
- Created `lib/testmode.js` - test mode detection, URL params, visual indicator
- Created `lib/share.js` - multi-format copy (Markdown, Rich Text, Web Share API)
- Added test mode toggle to hub header
- Added privacy statement to hub footer
- Added "back to hub" buttons on all questionnaire intro screens
- Removed legacy "מילוי אקראי" debug buttons from all questionnaires
- Removed "אבחון עצמי" text from all titles and content

### Decisions Made
- **Desktop vs Mobile share UI** - Desktop: single button (Markdown only). Mobile: separate buttons for each format
- **Test mode indicator position** - Scrolls with content (not fixed), centered near title
- **Test mode persistence** - URL param `?testmode=1` propagates through back links
- **Visual feedback on copy** - Subtle toast "הועתק!" appears briefly after copy action

### Workflow Observations
- Queue-based parallel execution worked well - spawning tasks as dependencies cleared
- User screenshot feedback was essential for catching visual inconsistencies (badge heights, button radius)
- Converting all questionnaires to ES modules (`type="module"`) was required for lib imports
- Having shared libs (`lib/`) reduced per-questionnaire code significantly

### Bugs Fixed During Session
- Engagement Drivers UI broken (missing `type="module"` in script tag)
- Assertiveness percentage > 100% (incorrect `totalMultiplier` in content.json)
- Managerial Courage button not working (stale DOM references in app.js)
- Test mode not persisting when returning to hub (added `updateBackLinks()`)

### Rule Candidates
- Checklist item: verify script tags have `type="module"` when using ES imports
- Pattern: URL param persistence for cross-page state (cleaner than localStorage for testing features)

---

## Session: 2026-01-29 - Quality Round & CSS Consolidation

### What We Did
- Extracted `.app__badge` from all 7 questionnaires to `shared.css`
- Added `.badge-row` flex container for badge + test-mode alignment
- Redesigned test mode indicator: orange gradient, smaller, 🧪 emoji
- Extracted `.actions` and `.results-actions` styles to `shared.css` (~350 lines removed)
- Added `favicon.svg` (blue gradient + white question mark)
- Updated all HTML files to include favicon link

### Decisions Made
- **Badge row pattern** - When test mode is active, JS wraps badge in `.badge-row` and adds indicator
- **Test mode indicator style** - Orange (warning color) to differentiate from app badge, smaller size
- **Actions in shared.css** - Common pattern across all questionnaires; situational-leadership keeps local overrides
- **SVG favicon** - Modern, scalable, matches primary brand color

### Code Quality Improvements
- Removed ~350 lines of duplicate CSS across questionnaire files
- Centralized badge and action styles for easier future changes
- Consistent spacing and alignment across all questionnaires

### Files Changed
- `shared.css` - Added badges, test-mode-indicator, actions sections
- `lib/testmode.js` - Uses CSS class instead of inline styles
- `favicon.svg` - New file
- All `*/index.html` - Added favicon link
- All `*/styles.css` - Removed duplicate badge/actions styles

