# Workflow Rules & Recommendations

Accumulated best practices from building מרכז השאלונים.

---

## Documentation Flow

### Order of Operations
1. **Spec review first** - Review spec.md before starting any tech-design work
2. **Design after spec** - Update tech-design.md with implementation decisions
3. **Local README last** - Document questionnaire-specific patterns in local README.md

### What Goes Where

| Document | Contains | Updates |
|----------|----------|---------|
| `spec.md` | Requirements, features, expected behaviors | When requirements change |
| `tech-design.md` | Architecture, patterns, technical decisions | When implementation changes |
| `[questionnaire]/README.md` | Specific data model, scoring, unique patterns | Per questionnaire |
| `retro.md` | Session logs, workflow insights, rule candidates | After each session |

### Pre-Finish Checklist
- [ ] Run consistency check between spec ↔ design ↔ local READMEs
- [ ] Verify all questionnaires have content separation (content.json)
- [ ] Confirm all Hebrew text is in JSON, not in JS

---

## Git Workflow

### SUSPENDED for now: Submodule Commit Order (Critical)

When the project has submodules (e.g., `.cursor/rules-src`):

**Always commit & push submodule BEFORE parent repo.**

```bash
# 1. Commit submodule changes
cd .cursor/rules-src
git add -A && git commit -m "message" && git push

# 2. Then commit parent
cd ../..
git add .cursor/rules-src <other-files>
git commit -m "message" && git push
```

**Why:** Parent repo stores a pointer to a specific submodule commit. Pushing parent first may reference a non-existent remote commit.

### Branch Naming
- `ui/<short-description>` for UI-focused work
- Examples: `ui/docs-update`, `ui/new-questionnaire`, `ui/hub-polish`

---

## Agent Collaboration

### Persona Selection
- **Barry (Solo Dev)** - Use for fast execution, straightforward implementation
- Works well for: building questionnaires, quick iterations, style fixes


---

## Coding Patterns

### Content Separation (Mandatory)
All questionnaires must follow the content separation pattern:
- `content.json` - All Hebrew text (questions, descriptions, recommendations)
- `app.js` - Logic only (no Hebrew strings)

### Standard UX Patterns
- **Question 1:** Show "חזרה להנחיות" button instead of disabled prev
- **Action buttons:** Use `flex: 1` for equal-width distribution
- **Button hover:** Color darken only (no shadow, no movement)

---

## Future Considerations

### Skill Development
Consider creating Cursor skills (in addition to rules) for:
- Questionnaire scaffolding
- Content extraction workflow
- Doc consistency checking

### Pattern Extraction
After 3+ questionnaires, evaluate extracting:
- Shared screen navigation logic
- Common result display patterns
- Unified scoring utilities
