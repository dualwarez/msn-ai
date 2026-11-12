# MSN-AI: Status Selector + Save Conversation — Tasks

## Task list

### Feature A: Status Selector
- [x] **A1** — Add `<span id="user-status-dot" class="status-indicator online">` and `<select id="status-select">` with four `<option>` values (`online`, `busy`, `away`, `brb`) to `.titlebar` in `public/index.html`.
- [x] **A2** — Add CSS for `.status-select`, `.status-indicator`, and status-specific classes (`.online`, `.busy`, `.away`, `.brb`) + `@keyframes brb-blink` to the `<style>` block.
- [x] **A3** — Add `STATUS_REACTIONS` map and `change` event listener on `#status-select` in the inline `<script>` block: update dot class, fire system `addMsg`, schedule bot reaction via `setTimeout`.
- [x] **A4** — Verify: change status to "Be Right Back" → system message appears → bot reacts within ~1 second.

### Feature B: Save Conversation
- [x] **B1** — Add `<button id="btn-save">💾 Save chat</button>` to the `.toolbar` in `public/index.html`.
- [x] **B2** — Add click handler on `#btn-save` in the inline `<script>`: collect `.msg-line` text, build `Blob`, create `<a download="msn-chat-<timestamp>.txt">`, click it, clean up.
- [x] **B3** — Handle empty log edge case: show "Nothing to save yet!" system message.
- [x] **B4** — Verify: click Save chat after a conversation → browser downloads `msn-chat-<timestamp>.txt` with readable content.

### Build & deploy
- [x] **D1** — Run `npx esbuild src/app.js --bundle --format=iife --outfile=public/bundle.js`.
- [x] **D2** — Copy `public/bundle.js` → `docs/bundle.js`.
- [x] **D3** — Copy `public/index.html` → `docs/index.html`.
- [x] **D4** — Grep `docs/bundle.js` for `Be Right Back` and `msn-chat-` to confirm they are present.

## Completion criteria
All tasks checked, `docs/bundle.js` contains both verification strings, `docs/index.html` contains the status selector and save button HTML.
