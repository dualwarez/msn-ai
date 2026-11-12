# MSN-AI — Tech Steering

## Runtime stack
| Layer | Choice | Notes |
|---|---|---|
| Language | Vanilla JavaScript (ES modules) | No framework — keep it lean and 2005-spirited |
| AI backend | Firebase AI Logic (`firebase/ai`) cloud Gemini | `InferenceMode.ONLY_IN_CLOUD`; model sessions held in `CHATS` map |
| Auth / App Check | Firebase App Check with custom debug token | Acceptable for hackathon scope |
| Bundler | **esbuild** (`npx esbuild src/app.js --bundle --format=iife --outfile=public/bundle.js`) | IIFE format so it loads as a plain `<script src="bundle.js">` |
| Hosting | **GitHub Pages** — `docs/` folder is the deployment root | Also works on Vercel (see `vercel.json`) |

## Build pipeline
```
src/app.js  ──esbuild──►  public/bundle.js
                               │
                               └──copy──►  docs/bundle.js
public/index.html  ──copy──►  docs/index.html
```

The `package.json` `build` script runs esbuild. Run `npm run build` or the esbuild command directly.

## Key constraints
- `firebaseConfig` and AI Logic initialisation in `src/app.js` must **never** be modified.
- All UI logic that cannot be bundled (inline event wiring that depends on the DOM) lives in a `<script>` block at the bottom of `public/index.html`.
- `src/app.js` is the entry point for the bundle; it must export or attach anything the HTML script block needs to `window`.
- No build-time environment variables — the Firebase API key is public (Firebase security rules enforce access).

## Dev commands
```bash
# Install deps (first time)
npm install

# Build bundle
npx esbuild src/app.js --bundle --format=iife --outfile=public/bundle.js

# Copy to docs/ (PowerShell)
Copy-Item public/bundle.js docs/bundle.js
Copy-Item public/index.html docs/index.html
```
