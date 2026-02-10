# Share single questionnaire (client-only hub protection)

## Goal

- **Shareable:** User can send someone a link to **one** questionnaire (e.g. `https://site.com/quizzes/assertiveness/`). That link works with no login or token.
- **Hub hidden:** Recipients should **not** be able to reach the main hub (directory of all questionnaires). Best-effort only (client-side).

## Constraints

- Client-only: no server, no auth backend.
- Questionnaire URLs stay clean when shared.
- **Token lives only in the hub** — quizzes are not aware of the token at all.

---

## Refined behavior

### 1. Main page without token: motivational landing

When someone opens `/` or `index.html` **without** a valid access token, show a **friendly landing** (not an error):

- **Logo** (same as hub)
- **Minimal text** (e.g. site name / tagline)
- **Motivational quote in Hebrew** about self-discovery / personal growth

No links to any questionnaire. No “wrong link” or “404” tone.

### 2. Main page with valid token: full hub

When the URL has a valid token (e.g. `?access=TOKEN`), show the full hub (directory of all questionnaires) as today.

**Token storage: hub only, obfuscated**

- The token and gate logic live **only in the hub** (`index.html`), not in `lib/` or in any quiz.
- The token is **obfuscated** in source (e.g. base64 or character-code array) so it’s not a plain literal. It’s still client-side and discoverable by a determined user; the goal is to avoid it being obvious at a glance.

### 3. “Back to hub” in questionnaires: referrer only, no token

- **Condition to show** “חזרה למרכז השאלונים”: **only** “was my previous page the main page?” — i.e. `document.referrer` is same origin and path is `/` or `/index.html`. No token check, no hub-access code in the quizzes.
- **Link target:** When we show the link, set `href` to **`document.referrer`**. So the user returns to exactly the URL they came from (with or without token). The quiz never sees or stores the token.
- **Otherwise:** Hide the “חזרה למרכז השאלונים” links (direct visit or shared link).

So:

- **Hub:** Token + gate + landing live only in the hub; token obfuscated.
- **Quizzes:** One small shared script that only checks “did I come from the main page?” and shows or hides the back link, and sets `href = document.referrer`. No token, no hub-access module in quizzes.

---

## Summary

| Piece | Behavior |
|-------|----------|
| **Hub (no token)** | Show logo + minimal text + Hebrew motivational quote. No quiz links. |
| **Hub (with token)** | Full directory. Token only in hub, obfuscated (e.g. base64). |
| **Quizzes** | Show “חזרה למרכז השאלונים” only when referrer is main page; `href = document.referrer`. No token awareness. |
| **Shared questionnaire URL** | Unchanged; works with no token. |

---

## Implementation checklist

- [x] Hub: gate script (obfuscated token) only in `index.html`; show landing vs full hub.
- [x] Landing: logo + minimal text + Hebrew motivational quote; styles in hub.css.
- [x] `lib/back-to-hub.js`: `cameFromMainPage()` (referrer check) and `applyBackToHubLinks()` (show/hide, set href to referrer). No token.
- [x] Each quiz app.js: import and call `applyBackToHubLinks()` at startup (after DOM ready). Works with existing testmode `updateBackLinks`.

**Deployer note (changing the token):** The hub gate in `index.html` uses an obfuscated value (base64). To set your own token, replace the string inside `atob('...')` with the base64 encoding of your chosen token. In the browser console run `btoa('yourSecret')` and paste the result. The default is `change-me` (so `/?access=change-me` shows the full hub until you change it).
