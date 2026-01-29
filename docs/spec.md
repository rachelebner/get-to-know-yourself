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
├── hub.css                 # Hub-specific styles
├── favicon.svg             # Site favicon (blue question mark)
├── logo.avif               # Site logo
├── lib/                    # Shared utilities (CSS + JS)
│   ├── shared.css          # Shared styles (tokens, buttons, badges, actions)
│   ├── testmode.js         # Test mode detection and UI
│   └── share.js            # Multi-format copy/share utilities
├── docs/
│   ├── spec.md             # This file (requirements)
│   ├── design.md           # Technical implementation details
│   └── retro.md            # Retrospective, workflow insights, session logs
├── templates/              # Reusable questionnaire templates
│   └── likert-categories/  # For Likert scale + category scoring
└── quizzes/                # All questionnaires
    └── [questionnaire-name]/
        ├── index.html
        ├── styles.css
        ├── app.js
        ├── content.json    # Hebrew text content
        └── README.md       # Questionnaire-specific structure
```

### Design Principles

- **Shared styles** - `lib/shared.css` contains design tokens, buttons, header badges, and action button layouts
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
- **Results export:** Share buttons for copying results (desktop: single button, mobile: multiple formats)

### What Varies Per Questionnaire

- Question format (bipolar scale, multiple choice, etc.)
- Scoring algorithm and categories
- Number and type of result/analysis screens
- Interpretation logic

**See each questionnaire's `README.md` for its specific structure.**  
Example: `quizzes/proactiveness/README.md`

---

## Implemented Features

### Test Mode (P3.1)
- Toggle in hub header activates test mode
- When active: questionnaires auto-fill random answers and skip to results
- URL param `?testmode=1` persists state across navigation
- Visual indicator shown in questionnaire headers

### Enhanced Share (P2.5)
- **Desktop:** Single "העתק תוצאות" button (copies Markdown)
- **Mobile:** Separate buttons for Markdown, Rich Text, and native share
- Visual feedback ("הועתק!") after copy action

---

## Current Questionnaires

| Name | Folder | Status |
|------|--------|--------|
| מנוף הפרואקטיביות | `/quizzes/proactiveness` | ✅ Complete |
| סגנונות תקשורת | `/quizzes/communication-styles` | ✅ Complete |
| שאלון ניהול מצבי | `/quizzes/situational-leadership` | ✅ Complete |
| מנועי המחוברות | `/quizzes/engagement-drivers` | ✅ Complete |
| שלושת מעגלי המנהיגות | `/quizzes/leadership-circles` | ✅ Complete |
| מודל אומץ | `/quizzes/managerial-courage` | ✅ Complete |
| אסרטיביות | `/quizzes/assertiveness` | ✅ Complete |
| דומייני מנהיגות | `/quizzes/leadership-styles` | ✅ Complete |

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
- `quizzes/proactiveness/README.md` - First questionnaire's specific structure
