# QA Review Checklist - Questionnaires

Review checklist for the 4 questionnaires awaiting QA validation before merge.

**Date created:** 2026-01-29  
**Status:** Pending QA review

---

## How to Test

1. Open each questionnaire in a browser (serve locally or open HTML directly)
2. Complete the questionnaire with various answer patterns
3. Verify each item in the checklist below
4. Mark items as ✅ (pass) or ❌ (fail with notes)

---

## 1. מנועי המחוברות (Engagement Drivers)

**Location:** `/engagement-drivers/`  
**Source document:** `מנועי המחוברות קווין קרוז שאלון.pdf`

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1.1 | All questions match source document | | |
| 1.2 | Scoring logic correct (4 categories, sum per category) | | |
| 1.3 | RTL layout displays correctly | | |
| 1.4 | Mobile responsive (test on phone or narrow window) | | |
| 1.5 | "העתק תוצאות" copies Markdown to clipboard | | |
| 1.6 | Navigation works (prev/next/back to hub) | | |
| 1.7 | "חזרה להנחיות" appears on question 1 | | |
| 1.8 | Results interpretation displays correctly | | |
| 1.9 | Highest driver(s) highlighted correctly | | |
| 1.10 | "מילוי אקראי" debug button works | | |

**QA Reviewer:** _______________  
**Date reviewed:** _______________  
**Overall status:** ⬜ Pass / ⬜ Fail

---

## 2. שלושת מעגלי המנהיגות (Leadership Circles)

**Location:** `/leadership-circles/`  
**Source document:** `שאלון אבחון עצמי 3 מעגלי המנהיגות והניהול.docx`

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 2.1 | All 27 questions match source document | | |
| 2.2 | Scoring logic correct (3 circles, 3 sub-categories each) | | |
| 2.3 | RTL layout displays correctly | | |
| 2.4 | Mobile responsive (test on phone or narrow window) | | |
| 2.5 | "העתק תוצאות" copies Markdown to clipboard | | |
| 2.6 | Navigation works (prev/next/back to hub) | | |
| 2.7 | "חזרה להנחיות" appears on question 1 | | |
| 2.8 | Circle totals calculated correctly (9-27 range each) | | |
| 2.9 | Sub-category scores shown in details screen | | |
| 2.10 | "מילוי אקראי" debug button works | | |

**QA Reviewer:** _______________  
**Date reviewed:** _______________  
**Overall status:** ⬜ Pass / ⬜ Fail

---

## 3. שאלון אומץ (Managerial Courage)

**Location:** `/managerial-courage/`  
**Source document:** `שאלון אומץ (קליין וקליין).pdf`

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 3.1 | All 30 questions match source document | | |
| 3.2 | Scoring logic correct (5 categories, 6 questions each) | | |
| 3.3 | RTL layout displays correctly | | |
| 3.4 | Mobile responsive (test on phone or narrow window) | | |
| 3.5 | "העתק תוצאות" copies Markdown to clipboard | | |
| 3.6 | Navigation works (prev/next/back to hub) | | |
| 3.7 | "חזרה להנחיות" appears on question 1 | | |
| 3.8 | Dominant drivers highlighted correctly | | |
| 3.9 | Analysis screen shows interpretation per category | | |
| 3.10 | "מילוי אקראי" debug button works | | |

**QA Reviewer:** _______________  
**Date reviewed:** _______________  
**Overall status:** ⬜ Pass / ⬜ Fail

---

## 4. שאלון אסרטיביות (Assertiveness)

**Location:** `/assertiveness/`  
**Source document:** `שאלון אסרטיביות.rtf`

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 4.1 | All 20 questions match source document | | |
| 4.2 | Scoring logic correct (total sum, percentage calculation) | | |
| 4.3 | RTL layout displays correctly | | |
| 4.4 | Mobile responsive (test on phone or narrow window) | | |
| 4.5 | "העתק תוצאות" copies Markdown to clipboard | | |
| 4.6 | Navigation works (prev/next/back to hub) | | |
| 4.7 | "חזרה להנחיות" appears on question 1 | | |
| 4.8 | Score interpretation matches the 5 tiers (תוקפן/תקיף מאוד/תקיף/כנוע/מאוד כנוע) | | |
| 4.9 | Percentage displayed correctly | | |
| 4.10 | "מילוי אקראי" debug button works | | |

**QA Reviewer:** _______________  
**Date reviewed:** _______________  
**Overall status:** ⬜ Pass / ⬜ Fail

---

## Summary

| Questionnaire | Status | Reviewer | Date |
|---------------|--------|----------|------|
| מנועי המחוברות | ⬜ Pending | | |
| שלושת מעגלי המנהיגות | ⬜ Pending | | |
| שאלון אומץ | ⬜ Pending | | |
| שאלון אסרטיביות | ⬜ Pending | | |

---

## After QA Approval

Once all questionnaires pass QA:
1. Update `docs/parallel-process.md` status table (Phase 4 → ✅)
2. Proceed to Phase 5 (Testing) and Phase 6 (Merge)
3. Merge branches to main
