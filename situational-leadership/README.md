# שאלון ניהול מצבי - Questionnaire Structure

This documents the specific structure and patterns used in the Situational Leadership questionnaire. Based on Hersey & Blanchard's Situational Leadership Theory.

---

## Question Format: Scenario-Based Multiple Choice

Each question presents a management scenario with 4 possible responses (א, ב, ג, ד). User selects the action they would take as a manager.

```javascript
{
  id: 1,
  scenario: "Description of a management situation...",
  options: [
    { id: "א", text: "Response option A" },
    { id: "ב", text: "Response option B" },
    { id: "ג", text: "Response option C" },
    { id: "ד", text: "Response option D" },
  ]
}
```

**UI:** Scenario text at top, 4 response buttons below.

---

## The Four Leadership Styles

Each response option maps to one of 4 leadership styles:

| Style | Hebrew | Task Level | Relationship Level |
|-------|--------|------------|-------------------|
| Directing | מכוון | High | Low |
| Coaching | מדריך | High | High |
| Supporting | תומך | Low | High |
| Delegating | מאציל | Low | Low |

### Style Descriptions

**מכוון (Directing)** - High task, low relationship
- Gives instructions, defines roles, supervises closely
- Effective: Clear leader who knows what they want
- Ineffective: Doesn't trust others, only cares about immediate results

**מדריך (Coaching)** - High task, high relationship  
- Explains decisions, motivates, sets high standards
- Effective: Motivates work, treats each employee uniquely
- Ineffective: Tries to please everyone, constantly maneuvering

**תומך (Supporting)** - Low task, high relationship
- Shares decisions, facilitates, develops people
- Effective: Trusts people, develops their skills
- Ineffective: Wants to be liked, fears losing relationships

**מאציל (Delegating)** - Low task, low relationship
- Hands off responsibility, lets team decide
- Effective: Lets subordinates decide how work is done
- Ineffective: Uninvolved, passive, doesn't show care

---

## Scoring: Style Mapping + Effectiveness

Each question has a hidden mapping of which option corresponds to which style, plus an effectiveness score.

```javascript
// Example for question 1
{
  id: 1,
  mapping: {
    "א": { style: "directing", score: +2 },
    "ב": { style: "supporting", score: -1 },
    "ג": { style: "coaching", score: +1 },
    "ד": { style: "delegating", score: -2 },
  }
}
```

**Score meanings:**
- `+2` = Most appropriate response for this situation
- `+1` = Acceptable but not optimal
- `-1` = Not ideal for this situation
- `-2` = Least appropriate response

---

## Results Calculation

After all 12 questions:

1. **Style frequency:** Count how many times each style was chosen (0-12)
2. **Style effectiveness:** Sum the effectiveness scores for each style (-24 to +24 per style)

**Ideal profile:** 3 choices per style (balanced), all +2 scores (+6 effectiveness per style)

---

## Analysis: Effectiveness Interpretation

For each style, interpret the effectiveness sum:

| Score Range | Interpretation |
|-------------|----------------|
| +1 and above | Using this style effectively |
| 0 | Using this style adequately |
| -1 and below | Using this style ineffectively |

---

## Screens

1. **Intro** - Instructions explaining the questionnaire, start button
2. **Questions** - One scenario at a time, 4 options, progress bar
3. **Results** - Grid showing:
   - Times each style was chosen
   - Effectiveness score per style
   - Interpretation (effective/adequate/ineffective)
4. **Analysis** - Detailed explanation of dominant style(s) and recommendations

---

## Results Export (Markdown)

```markdown
# תוצאות שאלון ניהול מצבי

## פרופיל הסגנונות שלי
| סגנון | מספר בחירות | ציון יעילות | פירוש |
|-------|-------------|-------------|-------|
| מכוון | 4 | +5 | יעיל |
| מדריך | 3 | +2 | יעיל |
| תומך | 3 | -1 | לא יעיל |
| מאציל | 2 | +1 | יעיל |

## סגנון דומיננטי
מכוון (4 בחירות)

## תובנות
- הסגנון המאפיין אותך הוא "מכוון" - אתה נוטה לתת הוראות ולפקח מקרוב
- אתה משתמש בסגנון זה ביעילות (+5)
- שים לב: הסגנון "תומך" דורש שיפור...
```

---

## Question Data

12 scenarios covering various management situations:
- Team performance declining/improving
- New manager taking over
- Implementing organizational changes
- Problem-solving situations
- Setting performance standards

See `app.js` for full question data with Hebrew text.

---

## Reusability Assessment

**Likely reusable for other questionnaires:**
- Screen transition pattern
- Progress bar UI
- Copy-to-clipboard mechanism
- Multiple choice question format
- Grid-based results display

**Specific to this questionnaire:**
- 4-option scenario format
- Style-to-option mapping per question
- Dual scoring (frequency + effectiveness)
- Leadership style framework
- Effectiveness interpretation thresholds

---

## See Also

- `docs/spec.md` - Overall project requirements
- `docs/design.md` - Shared technical patterns and implementation details
