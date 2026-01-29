# Likert + Categories Questionnaire Template

Reusable template for questionnaires that use:
- **Single statement questions** with a 1-5 Likert scale
- **Category-based scoring** (sum questions per category)
- **Dominant category identification** (highest score wins)

---

## Questionnaires Using This Template

| Questionnaire | Categories | Questions | Special Features |
|---------------|------------|-----------|------------------|
| engagement-drivers | 4 × 4 | 16 | Top 2 drivers, all-low handling |
| managerial-courage | 5 × 6 | 30 | Analysis screen, 3-tier interpretation |

---

## How to Use

### 1. Copy Template Files

```bash
# From project root
cp -r _templates/likert-categories/ [questionnaire-name]/
```

### 2. Create content.json

Use `content-schema.json` as reference. Required sections:

```json
{
  "meta": { "title": "...", "description": "..." },
  "config": {
    "hasAnalysisScreen": true,
    "interpretationMode": "tiered",
    "showScaleLabelsInline": true
  },
  "intro": { ... },
  "ui": { ... },
  "questions": [ ... ],
  "categories": [ ... ],
  "results": { ... },
  "markdown": { ... }
}
```

### 3. Customize HTML

Update these elements in `index.html`:
- `<title>` tag
- Header title and subtitle
- Badge text
- Remove/add analysis screen based on config

### 4. Customize Styles (Optional)

The base `styles.css` works out of the box. Customize if needed:
- Scale label display style
- Analysis card styling
- Brand colors (via shared.css tokens)

---

## Configuration Options

### `config.hasAnalysisScreen`
- `true`: Shows Results → Analysis flow (like managerial-courage)
- `false`: Shows only Results screen (like engagement-drivers)

### `config.interpretationMode`
- `"tiered"`: Low/medium/high based on score ranges (requires `category.interpretation`)
- `"simple"`: Highest category wins (requires `category.description`)

### `config.showScaleLabelsInline`
- `true`: Shows short labels under scale numbers (1=בכלל לא, etc.)
- `false`: Shows full labels in intro only

---

## content.json Structure

See `content-schema.json` for complete documentation.

### Key Sections

**questions**: Array of `{ id, text }` objects
```json
{ "id": 1, "text": "אני מסוגל לבטא את דעתי בכל מצב" }
```

**categories**: Array with question mappings
```json
{
  "id": "communication",
  "title": "תקשורת",
  "questions": [1, 2, 3, 4],
  "description": "Short description for results",
  "scoreRange": [4, 20],
  "interpretation": {
    "low": "Text for low scores...",
    "medium": "Text for medium scores...",
    "high": "Text for high scores..."
  }
}
```

---

## File Structure

```
[questionnaire-name]/
├── index.html      # Copy and customize header
├── styles.css      # Copy as-is (imports ../shared.css)
├── app.js          # Copy as-is (config-driven)
├── content.json    # Create from scratch using schema
└── README.md       # Document questionnaire specifics
```

---

## Scoring Logic

1. **Category scores**: Sum of answers for questions in that category
2. **Dominant identification**: Category with highest score
3. **Ties**: All categories with max score are marked dominant
4. **Interpretation** (tiered mode):
   - Divide score range into thirds
   - Low: score ≤ min + (range/3)
   - Medium: score ≤ min + (2*range/3)
   - High: score > min + (2*range/3)

---

## Customization Points

| What | Where | How |
|------|-------|-----|
| Scale labels | content.json `intro.scaleLabels` | Change label text |
| Number of categories | content.json `categories[]` | Add/remove categories |
| Questions per category | content.json `categories[].questions` | Change question mappings |
| Results interpretation | content.json `results.*` | Change interpretation text |
| Visual style | styles.css | Override CSS variables |

---

## See Also

- `docs/design.md` - Overall project design patterns
- `engagement-drivers/README.md` - Example implementation
- `managerial-courage/README.md` - Example with analysis screen
