# שאלון אסרטיביות - Questionnaire Structure

This documents the specific structure and patterns used in this questionnaire.

---

## File Structure

```
assertiveness/
├── index.html      # HTML structure
├── styles.css      # Styles (imports ../shared.css)
├── app.js          # Logic only - no Hebrew strings
├── content.json    # All Hebrew text (questions, interpretations)
└── README.md       # This file
```

**Content separation:** All Hebrew text is stored in `content.json`, keeping `app.js` focused on logic only.

---

## Question Format: Single Statement with Frequency Scale

Each question presents a single statement. User selects 1-5 indicating how often this applies to them.

```json
{
  "id": 1,
  "text": "אני יכול לבטא את דעתי בכל מצב."
}
```

**Scale:**
- 1 = אף פעם (Never)
- 2 = לעיתים רחוקות (Rarely)
- 3 = לעיתים (Sometimes)
- 4 = לעיתים קרובות (Often)
- 5 = תמיד (Always)

---

## Scoring: Total Sum with Multiplier

Unlike category-based questionnaires, this one uses a single total score:

1. Sum all 20 answers (range: 20-100)
2. Multiply by 5 to get percentage (range: 100-500, but effectively 20-100%)

Actually, the original scoring: sum × 5 gives the percentage score directly.

**Score calculation:**
- Minimum possible: 20 × 1 = 20, × 5 = 100% (but actually sum of 20 ones = 20)
- Wait, let me recalculate: 20 questions, each 1-5
- Sum range: 20-100
- The percentage IS the sum (since 20 questions × 5 max = 100)

---

## Interpretation: Five Tiers

| Score Range | Title | Meaning |
|-------------|-------|---------|
| 90-100 | תוקפן (Aggressive) | Too assertive, may hurt others |
| 70-89 | תקיף מאוד (Very Assertive) | Good balance, occasionally too strong |
| 50-69 | תקיף (Assertive) | Generally good, picks battles carefully |
| 30-49 | כנוע (Passive) | Too yielding, needs more assertion |
| 20-29 | מאוד כנוע (Very Passive) | Significantly needs improvement |

---

## Screens

1. **Intro** - Instructions with scale legend, start button
2. **Questions** - One at a time with 1-5 frequency scale
3. **Results** - Total score, percentage, and interpretation

---

## Results Export (Markdown)

```markdown
# תוצאות שאלון אסרטיביות

## ציון כולל
75 מתוך 100

## ציון באחוזים
75%

## פירוש התוצאה
**תקיף מאוד**

אתה מוכן באופן קבוע להגן על הזכויות שלך...
```

---

## Key Differences from Proactiveness

| Aspect | Proactiveness | Assertiveness |
|--------|---------------|---------------|
| Question format | Bipolar (two statements) | Single statement |
| Scoring | Category sums | Single total |
| Scale meaning | Left vs right pole | Frequency |
| Results | 6 category scores | 1 total score |
| Interpretation | Per category | Overall only |

---

## See Also

- `docs/spec.md` - Overall project requirements
- `docs/design.md` - Shared technical patterns
