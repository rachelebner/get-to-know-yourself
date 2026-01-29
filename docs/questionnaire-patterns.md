# Questionnaire Patterns & Template Guidelines

Guidelines for analyzing questionnaire structures and deciding when to create/use templates.

---

## Step 1: Classify Questionnaire Structure

When receiving a new source document, identify these structural elements:

### Question Format

| Format | Description | Example |
|--------|-------------|---------|
| **Single statement** | One statement, user rates agreement/frequency | "אני מסוגל לבטא את דעתי" |
| **Bipolar** | Two opposing statements, user picks position | "תגובתי ←→ פרואקטיבי" |
| **Binary** | Yes/No answer | "האם אתה נוטה ל..." כן/לא |
| **Scenario-based** | Situation description + multiple choice actions | "המנהל שלך מבקש... מה תעשה?" |
| **Open-ended** | Free text response | (rare in our context) |

### Scale Type

| Scale | Values | Meaning |
|-------|--------|---------|
| **Agreement** | 1-5 | לחלוטין לא מסכים → מסכים לחלוטין |
| **Frequency** | 1-5 | אף פעם → תמיד |
| **Degree** | 1-5 | בכלל לא → במידה רבה מאוד |
| **Position** | 1-5 | Left pole → Right pole (bipolar) |
| **Existence** | 1-3 | לא קיים → קיים משמעותית |
| **Binary** | כן/לא | Yes/No |

### Scoring Method

| Method | Description | Example |
|--------|-------------|---------|
| **Category sums** | Sum answers per category | engagement-drivers (4 cats × 4 Qs) |
| **Category counts** | Count specific answers per category | communication-styles (count "yes") |
| **Total sum** | Single total score, no categories | assertiveness |
| **Hierarchical** | Nested categories (circles → sub-cats) | leadership-circles |
| **Dual scoring** | Two scores per answer (frequency + effectiveness) | situational-leadership |

### Results Interpretation

| Interpretation | Description |
|----------------|-------------|
| **Highest wins** | Category with highest score is dominant |
| **Tiered thresholds** | Low/medium/high based on score ranges |
| **Profile blend** | Multiple categories shown as profile |
| **Single tier** | Overall score mapped to tier (e.g., assertive levels) |

---

## Step 2: Match to Existing Templates

### Current Templates

| Template | Question Format | Scale | Scoring | Interpretation |
|----------|-----------------|-------|---------|----------------|
| `likert-categories` | Single statement | 1-5 | Category sums | Highest wins OR Tiered |

### Template Match Decision Tree

```
Is the question format "single statement"?
├── NO → Need custom implementation
└── YES → Is the scale 1-5?
    ├── NO → Need custom implementation
    └── YES → Is scoring "category sums"?
        ├── NO → Need custom implementation
        └── YES → Use likert-categories template ✓
```

---

## Step 3: When to Create a New Template

### Create template when:
- **2+ questionnaires** share the exact same structure
- Structure is **fundamentally different** from existing templates
- Parameterization is **clean** (config in content.json, not code changes)
- **Time savings** justify the upfront investment

### Do NOT template when:
- Only **1 questionnaire** uses the pattern (wait for second)
- Structure requires **significant code branching** to accommodate
- Questionnaire is **unique enough** that template would be forced
- **Simpler to copy-paste** and modify than to generalize

### Template ROI Calculation

```
Template creation cost: ~2 hours
Per-questionnaire savings: ~1 hour (if using template)
Break-even: 3rd questionnaire using template

If < 3 questionnaires expected: Don't template
If ≥ 3 questionnaires expected: Template is worth it
```

---

## Step 4: Template Design Principles

### Configuration over Code
- All variations should be configurable via `content.json`
- Avoid `if/else` branches in app.js for structural differences
- If you need code changes per questionnaire, it's not templatable

### Optional Sections, Not Conditional Logic
- HTML: Include all possible screens, hide unused via config
- CSS: Include all possible component styles
- JS: Check for element existence before attaching handlers

### Clear Documentation
- `README.md`: How to use, configuration options, customization points
- `content-schema.json`: Required vs optional fields, types, defaults
- Examples in comments where helpful

---

## Current Questionnaire Classification

| Questionnaire | Question Format | Scale | Scoring | Template Match |
|---------------|-----------------|-------|---------|----------------|
| proactiveness | Bipolar | 1-5 position | Category sums | ❌ (bipolar) |
| communication-styles | Single statement | Binary | Category counts | ❌ (binary, counts) |
| situational-leadership | Scenario | 4 options | Dual scoring | ❌ (scenario, dual) |
| engagement-drivers | Single statement | 1-5 agreement | Category sums | ✅ likert-categories |
| leadership-circles | Single statement | 1-3 | Hierarchical sums | ❌ (1-3, hierarchical) |
| managerial-courage | Single statement | 1-5 degree | Category sums | ✅ likert-categories |
| assertiveness | Single statement | 1-5 frequency | Total sum | ❌ (no categories) |

**Template candidates:** engagement-drivers, managerial-courage

---

## Template Creation Checklist

When creating a new template:

- [ ] Identify 2+ questionnaires with identical structure
- [ ] List all variations between them (screens, interpretation, display)
- [ ] Determine which variations can be config-driven
- [ ] Create template files (index.html, styles.css, app.js)
- [ ] Create content-schema.json with all fields documented
- [ ] Write README.md with usage instructions
- [ ] Update docs/design.md to list new template
- [ ] Test template with both original questionnaires' content

---

## See Also

- `templates/likert-categories/README.md` - First template implementation
- `docs/design.md` - Overall architecture and templates section
- `docs/parallel-process.md` - Parallel processing workflow
