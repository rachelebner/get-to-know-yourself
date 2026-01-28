# מנועי המחוברות - Questionnaire Structure

This documents the specific structure and patterns used in this questionnaire. Other questionnaires may differ.

---

## File Structure

```
engagement-drivers/
├── index.html      # HTML structure
├── styles.css      # Styles (imports ../shared.css)
├── app.js          # Logic only - no Hebrew strings
├── content.json    # All Hebrew text (questions, categories, descriptions)
└── README.md       # This file
```

**Content separation:** All Hebrew text is stored in `content.json`, keeping `app.js` focused on logic only. See `docs/design.md` for the rationale.

---

## Question Format: Agreement Scale

Each question presents a single statement. User selects 1-5 indicating their level of agreement.

```json
{
  "id": 1,
  "text": "חשוב להיפגש עם המנהל 1:1 לפחות אחת לשבוע",
  "category": "communication"
}
```

**Scale:**
- 1 = לחלוטין לא מסכים (Strongly Disagree)
- 2 = לא מסכים (Disagree)
- 3 = ניטרלי (Neutral)
- 4 = מסכים (Agree)
- 5 = מסכים לחלוטין (Strongly Agree)

**UI:** Single statement box with 1-5 scale below.

---

## Scoring: Category Sums

Questions are grouped into 4 categories. Each category has 4 questions, and scores are summed.

```json
{
  "id": "communication",
  "title": "תקשורת",
  "questions": [1, 2, 3, 4],
  "description": "תקשורת היא מנוע המחוברות שלך..."
}
```

Sum of 4 questions → score range: 4-20

**Categories:**
| ID | Title | Questions | Score Range |
|----|-------|-----------|-------------|
| communication | תקשורת | 1-4 | 4-20 |
| growth | צמיחה והתפתחות | 5-8 | 4-20 |
| recognition | הכרה והוקרה | 9-12 | 4-20 |
| trust | אמון ובטחון | 13-16 | 4-20 |

---

## Results Interpretation

### Highest Score Wins
The category with the highest score is the user's "engagement driver" (מנוע המחוברות).

### Special Cases

1. **Tie:** If multiple categories have the same highest score, user has multiple drivers. All should be incorporated into action plan.

2. **All Scores Below 12:** If all category scores are below 12, the user's engagement drivers are different from the four measured. They should reflect on what was important in past workplaces where they felt engaged.

---

## Screens

1. **Intro** - Instructions, scale explanation, start button, debug fill button
2. **Questions** - One at a time, progress bar, prev/next
3. **Results** - Score cards grid (4 categories) + interpretation text

---

## Results Display

- **Score Cards:** Grid showing all 4 categories with their scores
- **Highest Driver Badge:** The category with highest score gets a "מנוע המחוברות שלך" badge
- **Interpretation:** Dynamic text explaining:
  - What the highest driver means
  - How to apply it daily
  - Shared responsibility with manager
  - Action plan guidance
  - Special cases (ties, low scores)

---

## Results Export (Markdown)

```markdown
# תוצאות שאלון מנועי המחוברות

## ציונים לפי קטגוריה
- **תקשורת**: 16
- **צמיחה והתפתחות**: 12
- **הכרה והוקרה**: 14
- **אמון ובטחון**: 18

---

## מנוע המחוברות שלך

**אמון ובטחון**

אמון ובטחון הוא מנוע המחוברות שלך...

[Interpretation text continues...]
```

---

## Reusability Assessment

**Likely reusable for other questionnaires:**
- Screen transition pattern
- Progress bar UI
- Copy-to-clipboard mechanism
- Basic intro → questions → results flow
- Single-statement question format with scale

**Specific to this questionnaire:**
- 1-5 agreement scale
- Category-based scoring with sums
- Highest-score-wins logic
- Special handling for ties and low scores
- Kevin Kruse engagement drivers framework

---

## See Also

- `docs/spec.md` - Overall project requirements
- `docs/design.md` - Shared technical patterns and implementation details
