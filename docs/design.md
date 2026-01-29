# Technical Design: Parallel Questionnaire Processing

## Stack
- Vanilla JavaScript (consistent with existing questionnaires)
- HTML/CSS
- localStorage for state persistence

## Architecture

### Current State
Each questionnaire is a standalone app:
- `communication-styles/` - independent app with own app.js, content.json
- `proactiveness/` - independent app with own app.js, content.json  
- `situational-leadership/` - independent app with own app.js, content.json

### Proposed Approaches

#### Option A: Hub-Level Orchestrator
Create a new parallel mode in the hub (root index.html) that:
- Loads content.json from multiple questionnaires
- Manages a unified question queue
- Delegates scoring to questionnaire-specific logic
- Renders unified progress UI

**Pros:** Clean separation, questionnaires remain independent
**Cons:** Duplicates some rendering logic

#### Option B: Shared App Framework
Extract common questionnaire logic into shared module:
- Generic question renderer
- State management
- Scoring engine interface

**Pros:** DRY, easier to add new questionnaires
**Cons:** Requires refactoring existing questionnaires

#### Option C: iframe-based Switching
Keep questionnaires as-is, orchestrate at hub level via iframes:
- Each questionnaire in hidden iframe
- Hub controls which is visible
- Message passing for progress sync

**Pros:** Zero changes to existing code
**Cons:** Clunky, state sync complexity

## Key Components (TBD)

### QuestionnaireOrchestrator
- Manages active questionnaires
- Controls question ordering
- Tracks per-questionnaire state

### UnifiedProgressTracker
- Visual progress for all active questionnaires
- Overall completion percentage

### ResultsAggregator
- Collects results from completed questionnaires
- Optional: cross-questionnaire insights

## Data Model

### Session State
```javascript
{
  activeQuestionnaires: ['communication-styles', 'proactiveness'],
  currentQuestion: { questionnaire: 'communication-styles', index: 3 },
  progress: {
    'communication-styles': { answered: 3, total: 10 },
    'proactiveness': { answered: 1, total: 8 }
  },
  answers: {
    'communication-styles': [...],
    'proactiveness': [...]
  }
}
```

## External Dependencies
- None (pure frontend)

## Decisions Needed
1. Which architectural approach?
2. Interleaving strategy: round-robin vs random vs themed groups?
3. Where to store combined session state?
