# מרכז השאלונים - מירב ים חן

## Overview

A vanilla HTML/CSS/JS hub for personality questionnaires. Each questionnaire is a standalone mini-app in its own folder. The main page serves as a directory/launcher for all available questionnaires.

**Language:** Hebrew only (RTL)  
**Target:** Mobile-first, works on desktop

---

## Architecture

```
/
├── index.html              # Hub page - questionnaire directory
├── styles.css              # Hub styles
├── docs/
│   ├── spec.md             # This file
│   └── retro.md            # Project retrospective & insights
├── proactiveness/          # Existing questionnaire
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── [questionnaire-name]/   # Future questionnaires follow same pattern
    ├── index.html
    ├── styles.css
    └── app.js
```

### Design Principles

- Each questionnaire is **self-contained** (own HTML/CSS/JS)
- No build tools, no frameworks - vanilla everything
- Similar visual style across questionnaires (not enforced, just encouraged)
- Mobile-ready by default

---

## Hub Page (index.html)

### Header

- Banner: "מרכז השאלונים - מירב ים חן"
- Logo placeholder (to be provided later)
- Optional subtitle/tagline

### Questionnaire Grid

A responsive grid of cards, one per questionnaire.

**Card content:**
- Title (questionnaire name)
- Brief description (1-2 sentences)
- Estimated completion time (e.g., "כ-5 דקות")
- "התחל" (Start) button → links to questionnaire's index.html

**Responsive behavior:**
- Desktop: 2-3 cards per row
- Mobile (<640px): 1 card per row, full width

### Visual Style

Inherit from existing proactiveness questionnaire:
- Primary color: `#4c66ff`
- Background: `#f4f6fb`
- Card background: white with shadow
- Rounded corners (24px for cards)
- Hebrew fonts: Heebo, Assistant, Segoe UI fallback

---

## Questionnaire Mini-App Structure

Each questionnaire follows this pattern (based on proactiveness example):

### Screens (sections within single HTML)

1. **Intro** - Instructions, "Start" button
2. **Questions** - One question at a time, progress bar, prev/next navigation
3. **Results** - Summary scores
4. **Analysis** - Detailed interpretation (optional)
5. **Insights** - Actionable recommendations (optional)

### Common UI Components

- Progress bar with fill animation
- Scale inputs (1-5 radio buttons styled as pills)
- Primary button (filled, shadow)
- Ghost button (outlined)
- Card container with screen transitions

### Navigation

- Back to hub: Link or button to return to main index.html
- Within questionnaire: Prev/Next buttons, screen transitions

### Results Export

At the end of each questionnaire, provide a **"העתק תוצאות"** (Copy Results) button that:
- Generates a Markdown-formatted summary of results
- Copies to clipboard using Clipboard API (with execCommand fallback)
- Can be pasted into email, notes, etc.

**Markdown format includes:**
- Questionnaire title
- Scores by category
- Analysis/interpretation per category
- Personal insights summary

---

## P2 Features (Future)

- [ ] Progress persistence (resume partially completed questionnaire)
- [ ] Results storage in localStorage
- [ ] View past results from hub
- [ ] Shared component library extraction
- [ ] Mobile share button (Web Share API → native share sheet)
- [ ] RTF export format option

---

## Current Questionnaires

| Name | Folder | Status |
|------|--------|--------|
| מנוף הפרואקטיביות | `/proactiveness` | ✅ Complete |

---

## Technical Notes

- No build step required
- Open index.html directly in browser or serve via any static server
- RTL direction set on `<html lang="he" dir="rtl">`
- CSS custom properties for theming
- Vanilla JS for interactivity (no dependencies)
