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
├── shared.css              # Minimal shared styles (tokens + buttons)
├── docs/
│   ├── spec.md             # This file (requirements)
│   ├── design.md           # Technical implementation details
│   └── retro.md            # Retrospective, workflow insights, session logs
├── proactiveness/          # Questionnaire 1
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── README.md           # This questionnaire's specific structure
└── [questionnaire-name]/   # Future questionnaires follow same pattern
    ├── index.html
    ├── styles.css
    ├── app.js
    └── README.md
```

### Design Principles

- **Minimal shared styles** - `shared.css` contains only design tokens and buttons
- **Mostly self-contained** - each questionnaire has its own layout/component CSS
- No build tools, no frameworks - vanilla everything
- Mobile-ready by default

See `docs/design.md` for implementation details.

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

Each questionnaire is a single-page app with multiple screens. The specific structure (question types, scoring, analysis) varies per questionnaire.

### Common Elements

- **Screen flow:** Intro → Questions → Results (+ optional analysis screens)
- **Progress indication:** Visual feedback during question answering
- **Navigation:** Back to hub link, prev/next within questionnaire
- **Results export:** "העתק תוצאות" button copies Markdown to clipboard

### What Varies Per Questionnaire

- Question format (bipolar scale, multiple choice, etc.)
- Scoring algorithm and categories
- Number and type of result/analysis screens
- Interpretation logic

**See each questionnaire's `README.md` for its specific structure.**  
Example: `proactiveness/README.md`

---

## P2 Features (Future)

- [ ] Progress persistence (resume partially completed questionnaire)
- [ ] Results storage in localStorage
- [ ] View past results from hub
- [ ] Shared component library extraction
- [ ] Mobile share button (Web Share API → native share sheet)
- [ ] RTF export format option

---

## P3 Features (Later)

- [ ] **Test mode toggle** - Hub-level toggle that, when enabled:
  - Auto-fills random answers when entering any questionnaire
  - Skips directly to results/analysis screen
  - Useful for quickly testing all questionnaires without manual input

---

## Current Questionnaires

| Name | Folder | Status |
|------|--------|--------|
| מנוף הפרואקטיביות | `/proactiveness` | ✅ Complete |
| סגנונות תקשורת | `/communication-styles` | 🚧 In Progress |
| שאלון ניהול מצבי | `/situational-leadership` | 🚧 In Progress |

---

## Technical Notes

- No build step required
- Open index.html directly in browser or serve via any static server
- RTL direction set on `<html lang="he" dir="rtl">`
- CSS custom properties for theming
- Vanilla JS for interactivity (no dependencies)

---

## See Also

- `docs/design.md` - Technical implementation details, component patterns
- `proactiveness/README.md` - First questionnaire's specific structure
