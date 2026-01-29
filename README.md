# מרכז השאלונים - מירב ים חן

A collection of Hebrew personality questionnaires.

## Clone & Setup

```bash
# Clone the repo
git clone git@github.com:rachelebner/get-to-know-yourself.git
cd get-to-know-yourself
```

### Optional: Cursor Rules (Racheli's local setup)

If you have access to the personal Cursor rules repo:

```bash
# Clone rules repo alongside this project
git clone git@github.com:rachelebner/racheli-personal-rules.git ../racheli-personal-rules

# Create symlinks (from project root)
mkdir -p .cursor/rules
ln -s ../../../racheli-personal-rules/.cursor/rules/racheli .cursor/rules/racheli
ln -s ../../racheli-personal-rules/rules-src .cursor/rules-src
```

Both symlinks are gitignored, so this setup is local-only.

## Quick Start

```bash
# Start local server
python3 -m http.server 8000

# Then open in browser
open http://localhost:8000
```

Or just open `index.html` directly in your browser.

## Documentation

- `docs/spec.md` - Product requirements
- `docs/design.md` - Technical implementation
- `docs/retro.md` - Retrospective & workflow insights

## Questionnaires

| Name | Folder | Status |
|------|--------|--------|
| מנוף הפרואקטיביות | `/proactiveness` | ✅ Complete |
