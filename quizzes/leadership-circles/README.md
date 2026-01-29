# שלושת מעגלי המנהיגות והניהול - Questionnaire Structure

This documents the specific structure and patterns used in this questionnaire.

---

## File Structure

```
leadership-circles/
├── index.html      # HTML structure
├── styles.css      # Styles (imports ../shared.css)
├── app.js          # Logic only - no Hebrew strings
├── content.json    # All Hebrew text (questions, circles, sub-categories)
└── README.md       # This file
```

**Content separation:** All Hebrew text is stored in `content.json`, keeping `app.js` focused on logic only.

---

## Question Format: Single Statement with 1-3 Scale

Each question presents a single statement. User selects 1-3 indicating their level of agreement/ability.

```json
{
  "id": 1,
  "text": "אני מכיר היטב את החוזקות שלי ומשתמש בהן בעבודתי היומיומית",
  "circle": 1,
  "subCategory": "self-awareness"
}
```

**Scale:**
- 1 = קיים במידה מועטה או לא קיים כלל (Exists minimally or not at all)
- 2 = קיים לעיתים, אך דורש חיזוק (Exists sometimes, but needs strengthening)
- 3 = קיים באופן משמעותי ומהווה חוזקה שלי (Exists significantly and is a strength)

**UI:** Single statement box with 1-3 scale below.

---

## Structure: Three Circles with Sub-Categories

The questionnaire is organized into 3 circles (מעגלים), each containing 3 sub-categories with 3 questions each.

### Circle 1: הובלה עצמית (Leading Self)
- **מודעות עצמית** (Self-awareness) - Questions 1-3
- **ניהול אישי** (Personal management) - Questions 4-6
- **חוסן אישי** (Personal resilience) - Questions 7-9

### Circle 2: הובלת אחרים (Leading Others)
- **ניהול והנעת צוות** (Team management and motivation) - Questions 10-12
- **בניית מערכות יחסים** (Relationship building) - Questions 13-15
- **פידבק והובלת שיחות משמעותיות** (Feedback and meaningful conversations) - Questions 16-18

### Circle 3: הובלה ארגונית (Leading the Organization)
- **השפעה רוחבית** (Lateral influence) - Questions 19-21
- **עבודה מול הנהלה בכירה** (Working with senior management) - Questions 22-24
- **תרבות של שיתוף פעולה** (Collaboration culture) - Questions 25-27

---

## Scoring

### Sub-Category Scores
Each sub-category has 3 questions. Scores are summed:
- **Range:** 3-9 (minimum 1×3 = 3, maximum 3×3 = 9)

### Circle Scores
Each circle has 9 questions (3 sub-categories × 3 questions). Scores are summed:
- **Range:** 9-27 (minimum 1×9 = 9, maximum 3×9 = 27)

---

## Screens

1. **Intro** - Instructions, scale explanation, start button, debug fill button
2. **Questions** - One at a time, progress bar, prev/next navigation
   - On Question 1, prev button shows "חזרה להנחיות" instead of being disabled
3. **Results** - Score cards grid showing all 3 circles with totals
4. **Details** - Detailed view showing:
   - Circle totals
   - Sub-category scores within each circle
   - Copy results button (Markdown export)

---

## Results Export (Markdown)

```markdown
# תוצאות אבחון עצמי - שלושת מעגלי המנהיגות והניהול

## ציונים לפי מעגל
- **מעגל 1: הובלה עצמית** (Leading Self): 21 / 27
- **מעגל 2: הובלת אחרים** (Leading Others): 18 / 27
- **מעגל 3: הובלה ארגונית** (Leading the Organization): 24 / 27

## ציונים לפי תת-קטגוריות
### מעגל 1: הובלה עצמית (Leading Self)
- **מודעות עצמית** (הכרת החוזקות האישיות והאתגרים האישיים): 7 / 9
- **ניהול אישי** (התמודדות עם עומסים, קבלת החלטות תחת לחץ ושחיקה): 8 / 9
- **חוסן אישי** (שמירה על מוטיבציה ופרואקטיביות בסביבה תובענית): 6 / 9
...
```

---

## Differences from Proactiveness Questionnaire

**Question format:**
- Proactiveness: Bipolar scale (two opposing statements, 1-5)
- Leadership Circles: Single statement (1-3 scale)

**Scoring structure:**
- Proactiveness: 6 categories, each with 3 questions (range 3-15)
- Leadership Circles: 3 circles, each with 3 sub-categories of 3 questions (circle range 9-27, sub-category range 3-9)

**Results screens:**
- Proactiveness: Results → Analysis → Insights
- Leadership Circles: Results → Details (sub-categories)

---

## See Also

- `docs/spec.md` - Overall project requirements
- `docs/design.md` - Shared technical patterns and implementation details
