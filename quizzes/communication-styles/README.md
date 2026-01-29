# שאלון סגנונות תקשורת - Questionnaire Structure

This documents the specific structure and patterns used in this questionnaire.

---

## Question Format: Yes/No (Binary)

Each question is a single Hebrew statement. User answers yes (כן) or no (לא).

```javascript
{
  id: 1,
  text: "אני נוטה לקחת על עצמי את תפקיד ה'עובד הסוציאלי'",
}
```

**UI:** Statement text with two buttons: כן / לא

---

## Scoring: Type-based Question Mapping

Questions are mapped to 4 personality types. Each type has 10 specific questions (not consecutive ranges). Score = count of "yes" answers.

```javascript
{
  id: "supportive",
  title: "תומך/ידידותי",
  questions: [1, 6, 11, 17, 19, 24, 27, 32, 36, 37],
  // Count of "yes" answers → score range: 0-10
}
```

**Types:**
| ID | Hebrew Title | English | Questions |
|----|--------------|---------|-----------|
| supportive | תומך/ידידותי | Supportive | 1, 6, 11, 17, 19, 24, 27, 32, 36, 37 |
| analytical | אנליטי/מנתח | Analytical | 2, 5, 10, 14, 15, 21, 23, 28, 34, 39 |
| expressive | מוחצן/חברתי | Expressive | 3, 8, 12, 13, 22, 25, 29, 31, 33, 38 |
| driver | משימתי/מנהל | Driver | 4, 7, 9, 16, 18, 20, 26, 30, 35, 40 |

---

## Analysis: Type Descriptions

Each type has detailed characteristics describing:
- Appearance/dress style
- Personal space behavior
- Body language
- Communication style
- Voice/speech patterns

These are shown on the results page for the user's dominant type(s).

---

## Results Visualization

**Bar Chart:** All 4 types displayed with scores on 0-10 scale.

```
10 |
 9 |          ▓▓▓
 8 |    ▓▓▓   ▓▓▓   ▓▓▓
 7 |    ▓▓▓   ▓▓▓   ▓▓▓
 6 |    ▓▓▓   ▓▓▓   ▓▓▓   ▓▓▓
 5 |    ▓▓▓   ▓▓▓   ▓▓▓   ▓▓▓
...
   | תומך  אנליטי מוחצן משימתי
```

**Interpretation:**
- Highest score = dominant communication style
- Multiple high scores = blend of styles
- Consider relative differences between types

---

## Screens

1. **Intro** - Instructions (answer honestly, no right/wrong), start button, debug fill button
2. **Questions** - One at a time, yes/no buttons, progress bar, prev/next (question 1 shows "חזרה להנחיות")
3. **Results** - Bar chart showing all 4 types with scores
4. **Analysis** - Top 2 dominant types with full descriptions, bottom 2 as FYI

---

## Key Differences from Proactiveness Questionnaire

| Aspect | Proactiveness | Communication Styles |
|--------|---------------|---------------------|
| Questions | 18 | 40 |
| Answer format | Bipolar 1-5 scale | Yes/No binary |
| Categories | 6 (consecutive ranges) | 4 (scattered questions) |
| Score range | 3-15 per category | 0-10 per type |
| Scoring | Sum of values | Count of "yes" |
| Visualization | Score cards | Bar chart |

---

## Results Export (Markdown)

```markdown
# תוצאות שאלון סגנונות תקשורת

## ציונים לפי סגנון
- **תומך/ידידותי**: 7
- **אנליטי/מנתח**: 4
- **מוחצן/חברתי**: 8
- **משימתי/מנהל**: 5

## הסגנון הדומיננטי שלך: מוחצן/חברתי

[Detailed description of the type...]
```

---

## File Structure

```
communication-styles/
├── index.html      # HTML structure
├── styles.css      # Local styles (imports ../shared.css)
├── app.js          # Logic only - no Hebrew strings
├── content.json    # All Hebrew text (questions, types, descriptions)
└── README.md       # This file
```

**Content separation:** All Hebrew text is in `content.json`, loaded at runtime. See `docs/design.md` for the pattern.

---

## See Also

- `docs/spec.md` - Overall project requirements
- `docs/design.md` - Shared technical patterns
- `proactiveness/README.md` - First questionnaire's structure (for comparison)
