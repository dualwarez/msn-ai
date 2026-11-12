# MSN-AI — Structure Steering

## Directory layout
```
msn-ai/
├── src/
│   └── app.js              # Entry point — Firebase init, bot definitions, chat logic, event wiring
├── public/
│   ├── index.html          # Full UI: CSS, HTML, inline <script> for DOM event handlers
│   └── bundle.js           # esbuild output (committed, served locally & on Vercel)
├── docs/
│   ├── index.html          # Mirror of public/index.html — GitHub Pages deployment root
│   └── bundle.js           # Mirror of public/bundle.js
├── .kiro/
│   ├── steering/
│   │   ├── product.md      # What/why the product is
│   │   ├── tech.md         # Build tools, stack, constraints
│   │   └── structure.md    # This file — layout & conventions
│   └── specs/
│       ├── msn-ai-resurrection.md   # Original hackathon spec
│       └── msn-status-export/      # Feature specs: status selector + save conversation
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── package.json
├── package-lock.json
├── vercel.json
├── .env                    # Local secrets (not committed)
├── .gitignore
└── LICENSE
```

## Conventions

### Where code lives
- **Bundle code** (anything that imports from `firebase/*` or uses ES module syntax) → `src/app.js`.
- **DOM-dependent inline code** (event listeners, UI helpers that run after the page loads) → bottom `<script>` block in `public/index.html`.
- Features that bridge both layers use `window.*` exports: `src/app.js` attaches shared state/functions to `window`, the HTML script reads them.

### How to add a feature
1. If it needs Firebase/AI → add to `src/app.js`, export via `window`.
2. If it's pure DOM work → add to the inline `<script>` in `index.html`.
3. If it's UI-only → add styles in the `<style>` block, HTML in the body, event wiring in the inline script.
4. Rebuild bundle after any `src/app.js` change.
5. Mirror `public/` → `docs/` after every build.

### Naming
- CSS classes: BEM-lite, kebab-case, MSN-themed (`.buddy`, `.chat-area`, `.titlebar`, `.xpbtn`).
- JS: camelCase for functions/variables, SCREAMING_SNAKE for module-level constants (`BOTS`, `ACTIVE`, `CHAT_LOG`).
- Status values: lowercase string literals (`"online"`, `"busy"`, `"away"`, `"brb"`).
