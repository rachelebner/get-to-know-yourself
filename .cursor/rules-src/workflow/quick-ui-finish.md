# Quick UI Project - Finish

**Trigger:** Project complete, ready to close the agent

## Pre-Flight Checks

- [ ] Cleanup pass completed (`quick-ui-cleanup.md`)
- [ ] `spec.md` reflects current system
- [ ] `design.md` reflects current architecture
- [ ] `retro.md` captures insights for rule evolution
- [ ] All tests pass (if applicable)
- [ ] App runs without errors


## Completion Steps

### 1. Commit Cleanup Changes

```bash
git add -A
git commit -m "cleanup: final review and documentation update"
```

### 2. Push Branch

```bash
git push -u origin HEAD
```

### 3. Merge to Main

```bash
git checkout main
git pull origin main
git merge ui/<branch-name> --no-ff -m "merge: ui/<branch-name>"
git push origin main
```

### 4. Archive the Branch

```bash
# Rename locally
git branch -m ui/<branch-name> archived/ui/<branch-name>

# Push the renamed branch
git push origin archived/ui/<branch-name>

# Delete the old remote branch
git push origin --delete ui/<branch-name>
```


## Post-Project

### Transfer Insights to Rules

Review `retro.md` and consider:

1. **New rules to add** - patterns that should apply to future projects
2. **Workflow improvements** - update these workflow files
3. **Persona adjustments** - refine personas based on what worked

Location: `/Users/rebner/Documents/Code/AI_RULES/racheli-personal-rules/`
