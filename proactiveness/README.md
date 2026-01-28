# מנוף הפרואקטיביות - Questionnaire Structure

This documents the specific structure and patterns used in this questionnaire. Other questionnaires may differ.

---

## Question Format: Bipolar Scale

Each question presents two opposing statements (right vs left). User selects 1-5 indicating which statement they identify with more.

```javascript
{
  id: 1,
  right: "Statement A (reactive pole)",  // Score 1 = full identification
  left: "Statement B (proactive pole)",  // Score 5 = full identification
}
```

**UI:** Two statement boxes side-by-side, with 1-5 scale below.

---

## Scoring: Category Ranges

Questions are grouped into 6 categories. Each category covers a range of question IDs, and scores are summed.

```javascript
{
  id: "control",
  title: "מיקוד שליטה",
  range: [1, 3],  // Questions 1, 2, 3
  // Sum of 3 questions → score range: 3-15
}
```

**Categories:**
| ID | Title | Questions | Score Range |
|----|-------|-----------|-------------|
| control | מיקוד שליטה | 1-3 | 3-15 |
| future | אוריינטציית עתיד | 4-6 | 3-15 |
| risk | נכונות לסיכון | 7-9 | 3-15 |
| efficacy | תחושת מסוגלות | 10-12 | 3-15 |
| environment | הקשבה סביבתית | 13-15 | 3-15 |
| action | הנעה לפעולה | 16-18 | 3-15 |

---

## Analysis: Three-Tier Interpretation

Scores are interpreted based on thresholds:

| Score Range | Label | Tone |
|-------------|-------|------|
| 3-6 | תגובתי (reactive) | reactive |
| 7-10 | מעורב (mixed) | mixed |
| 11-15 | פרואקטיבי (proactive) | proactive |

Each category has pre-written analysis text for reactive and proactive tones. Mixed scores get a generic message.

```javascript
analysis: {
  reactive: "Text explaining low score behavior...",
  proactive: "Text explaining high score behavior...",
}
```

---

## Screens

1. **Intro** - Instructions, start button, debug fill button
2. **Questions** - One at a time, progress bar, prev/next
3. **Results** - Score cards grid (6 categories)
4. **Analysis** - Summary stats + detailed card per category with interpretation
5. **Insights** - Actionable recommendations for categories with score ≤10

---

## Insights Structure

Only shown for categories where score ≤10 (room for improvement).

```javascript
{
  title: "Section title",
  insight: "What this score pattern means",
  action: "Specific recommendation to improve",
}
```

---

## Results Export (Markdown)

```markdown
# תוצאות אבחון עצמי

## ציונים לפי קטגוריה
- **מיקוד שליטה**: 12 (ציון פרואקטיבי)
- **אוריינטציית עתיד**: 5 (ציון תגובתי)
...

## תובנות אישיות
### פיתוח אוריינטציית עתיד
- ציון: 5 (תגובתי)
- תובנה: ...
- מה כדאי לעשות: ...

## סיכום אישי
- Overall interpretation...
```

---

## Reusability Assessment

**Likely reusable for other questionnaires:**
- Screen transition pattern
- Progress bar UI
- Copy-to-clipboard mechanism
- Basic intro → questions → results flow

**Specific to this questionnaire:**
- Bipolar question format (two statements)
- 1-5 scale with specific meaning (right=1, left=5)
- Category-based scoring with ranges
- Reactive/proactive analysis framework
- Three-tier interpretation thresholds

**TBD:** Whether similar patterns emerge in future questionnaires.

---

## See Also

- `docs/spec.md` - Overall project requirements
- `docs/design.md` - Shared technical patterns and implementation details
