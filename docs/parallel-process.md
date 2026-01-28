# Parallel Questionnaire Processing Workflow

## Overview

Process multiple questionnaires from source documents to deployed code, working in parallel where possible.

---

## Directory Structure

```
get-to-know-yourself/
├── _inbox/                     # Temp upload location for source documents
│   ├── questionnaire-a.pdf
│   ├── questionnaire-b.docx
│   └── ...
├── communication-styles/       # Existing
├── proactiveness/              # Existing
├── situational-leadership/     # Existing
└── [new-questionnaire]/        # Created per workflow
```

**Worktrees (parallel branches):**
```
get-to-know-yourself-[name]/    # One worktree per questionnaire
```

---

## Workflow Phases

### Phase 0: Setup (Once)

1. Create `_inbox/` folder in main repo
2. User uploads all source documents to `_inbox/`
3. Agent reviews documents, proposes folder names

**Deliverable:** List of questionnaires with proposed names

---

### Phase 1: Worktree Creation (Parallel)

For each questionnaire:

```bash
# From main repo
git checkout main && git pull origin main
git worktree add ../get-to-know-yourself-[name] -b ui/[name]
```

**Naming convention:** 
- Branch: `ui/[short-name]` (e.g., `ui/values-assessment`)
- Worktree: `get-to-know-yourself-[short-name]`
- Folder: `/[short-name]/` in repo

**Deliverable:** 4 worktrees ready for parallel work

---

### Phase 2: Content Extraction (Parallel)

For each questionnaire:

1. Move source doc from `_inbox/` to questionnaire folder
2. Create `content.json` with:
   - Questions extracted from source
   - Answer options/scales
   - Scoring rules
   - Result categories/interpretations
3. Create `README.md` documenting:
   - Questionnaire structure
   - Scoring algorithm
   - Special handling notes

**Deliverable:** `content.json` + `README.md` per questionnaire

---

### Phase 3: Implementation (Parallel)

For each questionnaire:

1. Create standard file structure:
   ```
   [questionnaire]/
   ├── index.html
   ├── styles.css
   ├── app.js
   ├── content.json
   └── README.md
   ```

2. Implement screens:
   - Intro screen (instructions)
   - Question screens (with navigation)
   - Results screen(s)
   - Analysis screens (if applicable)

3. Follow existing patterns from `proactiveness/` or `communication-styles/`

**Deliverable:** Working questionnaire app

---

### Phase 4: Review (Sequential per questionnaire)

For each questionnaire:

1. **Self-review checklist:**
   - [ ] All questions match source document
   - [ ] Scoring logic correct
   - [ ] RTL layout works
   - [ ] Mobile responsive
   - [ ] "העתק תוצאות" works
   - [ ] Navigation (prev/next/back to hub) works

2. **User review:**
   - Run locally, complete questionnaire
   - Verify results match expected scoring
   - Flag any content/UX issues

**Deliverable:** Review feedback addressed

---

### Phase 5: Testing (Parallel)

For each questionnaire:

1. Full walkthrough with various answer patterns
2. Edge cases (all min, all max, mixed)
3. Mobile device testing
4. Copy results and verify markdown format

**Deliverable:** Test confirmation

---

### Phase 6: Merge (Sequential)

For each questionnaire (one at a time to avoid conflicts):

```bash
# In worktree
git add -A
git commit -m "feat: Add [questionnaire-name] questionnaire"
git push -u origin ui/[name]

# Create PR or merge directly
git checkout main
git merge ui/[name]
git push origin main

# Cleanup worktree
git worktree remove ../get-to-know-yourself-[name]
git branch -d ui/[name]
```

Update hub `index.html` to include new questionnaire card.

**Deliverable:** Questionnaire live on main

---

## Parallelization Strategy

| Phase | Parallel? | Notes |
|-------|-----------|-------|
| 0. Setup | No | One-time setup |
| 1. Worktree creation | Yes | All 4 at once |
| 2. Content extraction | Yes | All 4 at once |
| 3. Implementation | Yes | All 4 at once (different worktrees) |
| 4. Review | Mixed | Can review multiple, but user time is serial |
| 5. Testing | Yes | All 4 at once |
| 6. Merge | No | One at a time to avoid conflicts |

---

## Agent Task Batching

When working with agent, batch requests by phase:

**Good:** "Extract content for all 4 questionnaires"  
**Good:** "Create worktrees for: values, strengths, team-roles, conflict-styles"  
**Less efficient:** "Do everything for questionnaire A, then B, then C, then D"

---

## Handoff Points

Clear handoff between user and agent:

| Step | Owner | Handoff |
|------|-------|---------|
| Upload source docs | User | "Documents uploaded to _inbox/" |
| Review proposed names | User | "Names approved" or "Change X to Y" |
| Review extracted content | User | "Content verified" or "Fix question 5" |
| Test completed app | User | "Approved" or "Issues: ..." |
| Final approval | User | "Merge it" |

---

## Status Tracking

| Questionnaire | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Phase 6 |
|---------------|---------|---------|---------|---------|---------|---------|
| engagement-drivers | [x] | [x] | [x] | [ ] | [ ] | [ ] |
| leadership-circles | [x] | [x] | [x] | [ ] | [ ] | [ ] |
| managerial-courage | [x] | [x] | [x] | [ ] | [ ] | [ ] |
| assertiveness | [x] | [x] | [x] | [ ] | [ ] | [ ] |

**Last updated:** 2026-01-28

**Notes:**
- All 4 worktrees created and committed
- Awaiting user review (Phase 4) before testing and merge

---

## Quick Commands Reference

```bash
# List all worktrees
git worktree list

# Switch to worktree
cd ../get-to-know-yourself-[name]

# Check branch status
git status

# Remove worktree after merge
git worktree remove ../get-to-know-yourself-[name]
```
