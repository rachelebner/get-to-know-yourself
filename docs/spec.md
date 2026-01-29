# Specification: Parallel Questionnaire Processing

## Overview
Enable users to work through multiple questionnaires simultaneously rather than completing them one at a time sequentially. This feature explores ways to interleave questions from different questionnaires, track progress across multiple assessments, and provide unified insights.

## Features
- [ ] Interleaved question presentation from multiple questionnaires
- [ ] Unified progress tracking across all active questionnaires
- [ ] Combined results/insights view
- [ ] Pause/resume capability per questionnaire
- [ ] Smart question ordering (group similar themes? alternate?)

## User Flows

### Starting Multiple Questionnaires
1. User selects which questionnaires to take in parallel
2. System presents questions in interleaved manner
3. Progress indicators show status for each questionnaire
4. Upon completion of any questionnaire, results become available

### Progress Management
- See overall progress vs per-questionnaire progress
- Option to prioritize/focus on specific questionnaire
- Resume from where left off

## Constraints
- Must work with existing questionnaire data format (content.json)
- Should not require changes to individual questionnaire logic
- Results should match what sequential completion would produce

## Open Questions
- What's the optimal interleaving strategy?
- How to handle questionnaires of different lengths?
- Should there be a "mixed results" view combining insights?
- How to manage cognitive load of context-switching between topics?
