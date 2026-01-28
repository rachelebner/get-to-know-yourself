# Technical Design

## Stack

- **HTML5** - Semantic markup with RTL support (`<html lang="he" dir="rtl">`)
- **CSS3** - Custom properties for theming, Flexbox/Grid for layouts
- **Vanilla JavaScript** - No frameworks, ES6+ features
- **No build tools** - Files served directly

---

## Architecture

```
/
├── index.html              # Hub page (questionnaire directory)
├── styles.css              # Hub-only styles
├── shared.css              # Minimal shared styles (tokens + buttons)
├── docs/
│   ├── spec.md
│   ├── design.md
│   └── retro.md            # Retrospective, workflow insights, session logs
├── proactiveness/          # Questionnaire 1
│   ├── index.html
│   ├── styles.css          # Imports ../shared.css + local overrides
│   ├── app.js
│   ├── content.json        # Hebrew content
│   ├── README.md           # Documents this questionnaire's specific structure
│   └── *.pdf / *.docx      # Source document(s) - original questionnaire file
└── [future-questionnaire]/ # Same structure
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── content.json
    ├── README.md
    └── *.pdf / *.docx      # Source document(s)
```

### Design Decision: Minimal Shared Styles

**Approach:** Single `shared.css` at root with design tokens and button styles only.

**What goes in `shared.css` (keep it lean!):**
- CSS custom properties (colors, radii, shadows, fonts)
- Base reset (`box-sizing`, font-family)
- Button styles (`.primary`, `.ghost`)

**What stays local in each `styles.css`:**
- Layout (screens, grids, cards)
- Component-specific styles (progress bar, scale inputs, results)
- Any questionnaire-unique styling

**Usage in questionnaire CSS:**
```css
@import url("../shared.css");

/* Local styles below */
```

**Rationale:**
- Single source of truth for brand colors and button look
- Questionnaires remain mostly independent
- No build step required
- Easy to override locally if needed

---

## Design Tokens

Defined once in `shared.css`, used everywhere:

```css
:root {
  /* Colors */
  --bg: #f4f6fb;
  --card: #ffffff;
  --primary: #4c66ff;
  --primary-dark: #3947c6;
  --text: #1f2430;
  --muted: #6f7a8a;
  --border: #e3e7f0;
  
  /* Shadows */
  --shadow: 0 20px 50px rgba(21, 31, 55, 0.08);
  --shadow-primary: 0 12px 20px rgba(76, 102, 255, 0.25);
  
  /* Spacing */
  --radius-sm: 16px;
  --radius-md: 18px;
  --radius-lg: 24px;
  --radius-pill: 999px;
  
  /* Typography */
  --font-stack: "Heebo", "Assistant", "Segoe UI", sans-serif;
}
```

---

## Key Components

### 1. Hub Components

#### Hub Header
- Banner with site title "מרכז השאלונים - מירב ים חן"
- Logo placeholder (image slot)
- Optional subtitle

```html
<header class="hub-header">
  <div class="hub-header__logo"><!-- logo placeholder --></div>
  <h1 class="hub-header__title">מרכז השאלונים</h1>
  <p class="hub-header__subtitle">מירב ים חן</p>
</header>
```

#### Questionnaire Card
Grid item linking to a questionnaire.

```html
<article class="questionnaire-card">
  <h2 class="questionnaire-card__title">מנוף הפרואקטיביות</h2>
  <p class="questionnaire-card__description">
    אבחון עצמי של מנופי הפרואקטיביות שלך...
  </p>
  <div class="questionnaire-card__meta">
    <span class="questionnaire-card__time">כ-5 דקות</span>
  </div>
  <a href="./proactiveness/" class="questionnaire-card__cta primary">התחל</a>
</article>
```

#### Questionnaire Grid
Responsive grid container.

```css
.questionnaire-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

@media (max-width: 640px) {
  .questionnaire-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 2. Questionnaire Components

These patterns appear in every questionnaire. Defined locally in each `styles.css`.

#### Screen Container & Transitions
Single-page app with multiple screens, one active at a time.

```css
.screen {
  opacity: 0;
  transform: translateY(16px);
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.screen--active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

#### Progress Bar
Shows completion progress during questions.

```html
<div class="progress">
  <span id="progress-text">שאלה 1 מתוך 18</span>
  <div class="progress__bar">
    <div class="progress__fill" id="progress-fill"></div>
  </div>
</div>
```

```css
.progress__bar {
  width: 100%;
  height: 10px;
  background: #edf0f7;
  border-radius: var(--radius-pill);
}

.progress__fill {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, var(--primary), #8b9bff);
  transition: width 0.3s ease;
}
```

#### Scale Input (1-5)
Radio buttons styled as selectable pills.

```html
<div class="scale">
  <label class="scale__item">
    <input type="radio" name="score" value="1" />
    <span>1</span>
  </label>
  <!-- ... 2, 3, 4, 5 ... -->
</div>
```

```css
.scale {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.scale__item {
  background: #f8f9fd;
  border-radius: var(--radius-sm);
  padding: 14px 0;
  text-align: center;
  cursor: pointer;
}

.scale__item:has(input:checked) {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow-primary);
}
```

#### Buttons (in `shared.css`)
Two variants: primary (filled) and ghost (outlined). Defined in shared styles.

```css
.primary, .ghost {
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.primary {
  background: var(--primary);
  color: white;
}

.primary:hover {
  background: var(--primary-dark);
}

.ghost {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--border);
}
```

#### Card Container
Main content wrapper with shadow and rounded corners.

```css
.card {
  background: var(--card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 32px;
}
```

---

### 3. Back to Hub Navigation

Every questionnaire needs a link back to the hub.

**Option A: In header**
```html
<header class="app__header">
  <a href="../" class="back-link">← חזרה למרכז השאלונים</a>
  <!-- ... rest of header -->
</header>
```

**Option B: In final screen**
```html
<div class="actions">
  <a href="../" class="ghost">חזרה למרכז השאלונים</a>
  <!-- ... other actions -->
</div>
```

**Recommendation:** Option A (always visible) for better UX.

---

## Data Model & Questionnaire Structure

**Each questionnaire may have its own unique structure.**

Question types, scoring logic, analysis patterns, and result formats vary by questionnaire. Document these in a local `README.md` within each questionnaire folder.

See `proactiveness/README.md` for the first example.

### Source Documents (MANDATORY)

**Every questionnaire MUST include its original source document(s) in the questionnaire folder.**

Source documents are the original PDF, DOCX, or other files that contain:
- The original questions and scoring methodology
- Theoretical background and research references
- Interpretation guidelines and category descriptions

**Requirements:**
- Store source files directly in the questionnaire folder (e.g., `proactiveness/שאלון.pdf`)
- Keep original Hebrew filenames for traceability
- Commit source documents to git (they are part of the project)
- Reference the source in the questionnaire's `README.md`

**Current source documents:**
```
proactiveness/שאלון אבחון מנופי הפרואקטיביות כולל פענוח.pdf
communication-styles/שאלון סגנונות תקשורת 2020.docx
situational-leadership/[source document needed]
engagement-drivers/מנועי המחוברות קווין קרוז שאלון.pdf
leadership-circles/שאלון אבחון עצמי 3 מעגלי המנהיגות והניהול.docx
managerial-courage/שאלון אומץ (קליין וקליין).pdf
assertiveness/שאלון אסרטיביות.rtf
```

**Rationale:**
- Source of truth for questions, scoring, and interpretations
- Enables verification and correction of content
- Preserves attribution and methodology
- Essential for future maintenance and enhancements

---

### Content Separation: Hebrew Text in JSON

**All Hebrew content must be stored separately from JavaScript logic.**

Each questionnaire folder contains:
```
questionnaire-name/
├── index.html
├── styles.css
├── app.js          # Logic only - no Hebrew strings
└── content.json    # All Hebrew text (questions, insights, descriptions)
```

**What goes in `content.json`:**
- Questions (text, options)
- Category/type titles and descriptions
- Analysis text and interpretations
- Insight content and recommendations
- UI labels (button text, screen titles) - optional

**What stays in `app.js`:**
- Scoring logic and algorithms
- Screen navigation
- DOM manipulation
- Event handlers
- Category/type configuration (IDs, question mappings)

**Loading pattern:**
```javascript
// At app initialization
const content = await fetch('./content.json').then(r => r.json());

// Usage
const questionText = content.questions[currentIndex].text;
const typeDescription = content.types[typeId].description;
```

**Rationale:**
- Content editors can modify Hebrew text without touching code
- Cleaner separation of concerns
- Easier to review/proofread content
- Future-proofs for potential localization

### What's Likely Shared

- Basic screen flow (intro → questions → results)
- Progress indication during questions
- Copy results to clipboard feature
- In-memory state management (no localStorage yet)

### What May Vary

- Question format (bipolar scale, multiple choice, open text, etc.)
- Scoring algorithm
- Number and type of result screens
- Analysis categories and interpretation logic

**Pattern extraction:** Once we have 2-3 questionnaires, we can identify recurring patterns and decide what to generalize.

---

## Responsive Breakpoints

| Breakpoint | Target | Adjustments |
|------------|--------|-------------|
| > 640px | Desktop/Tablet | Full layout, 2-3 column grids |
| ≤ 640px | Mobile | Single column, stacked actions, smaller padding |

Mobile-first approach: base styles are mobile, media queries add desktop enhancements.

---

## External Dependencies

None. All functionality is vanilla HTML/CSS/JS.

Google Fonts loaded via CSS `@import` or `<link>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Questionnaire folder | kebab-case, descriptive | `proactiveness`, `strengths-finder` |
| HTML files | Always `index.html` | — |
| CSS files | Always `styles.css` | — |
| JS files | Always `app.js` | — |

---

## Implementation Order

1. **Create `shared.css`** with tokens + buttons extracted from proactiveness
2. **Update proactiveness** to import `shared.css`, remove duplicated token/button styles
3. **Build hub page** (`index.html`, `styles.css`) importing `shared.css`
4. **Add back-to-hub link** to proactiveness questionnaire
5. **Test on mobile** and adjust responsive behavior

---

## See Also

- `docs/spec.md` - Product requirements, features, hub/questionnaire specs
- `proactiveness/README.md` - First questionnaire's specific data model and patterns
