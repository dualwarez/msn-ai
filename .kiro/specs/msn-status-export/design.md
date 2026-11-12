# MSN-AI: Status Selector + Save Conversation — Design

## Architecture overview

Both features are **pure client-side, DOM-only** additions. They live entirely in:
- **HTML** — new elements in `public/index.html` body
- **CSS** — new rules in the `<style>` block of `public/index.html`
- **Inline script** — new handlers in the `<script>` block at the bottom of `public/index.html`

Neither feature requires changes to `src/app.js` (no Firebase/AI involvement).

---

## Feature A: Status Selector

### HTML placement
Insert a `<select id="status-select">` inside the `.titlebar` div, to the left of the window buttons. Wrap it with a small `<span class="status-indicator" id="user-status-dot">` coloured dot.

```html
<!-- inside .titlebar, before .winbtns -->
<span class="status-indicator" id="user-status-dot" title="Your status"></span>
<select id="status-select" class="status-select">
  <option value="online">🟢 Online</option>
  <option value="busy">🔴 Busy</option>
  <option value="away">🟡 Away</option>
  <option value="brb">🟠 Be Right Back</option>
</select>
```

### CSS
```css
.status-select {
  font-family: Tahoma, sans-serif;
  font-size: 10px;
  background: #1C4F7C;
  color: #fff;
  border: 1px solid #5a8bb6;
  padding: 1px 4px;
  cursor: pointer;
}
.status-indicator {
  display: inline-block;
  width: 9px; height: 9px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
  border: 1px solid rgba(255,255,255,0.4);
}
.status-indicator.online { background: #3CB44B; }
.status-indicator.busy   { background: #D0413A; }
.status-indicator.away   { background: #E8A33D; }
.status-indicator.brb    { background: #E8A33D; animation: brb-blink 1s step-end infinite; }
@keyframes brb-blink { 50% { opacity: 0.3; } }
```

### JS logic
```js
const STATUS_REACTIONS = {
  online:  "wb!! ur back online 😄 i missed u (not really lol)",
  busy:    "busy?? ok ok i'll stop spamming… (Y)",
  away:    "away huh… *sets own status to Away in solidarity*",
  brb:     "brb?? u said that in 2005 too and came back 3 hours later lmaooo",
};

document.getElementById("status-select").addEventListener("change", function() {
  const val = this.value;
  const dot = document.getElementById("user-status-dot");
  dot.className = "status-indicator " + val;
  addMsg("", "You are now: " + this.options[this.selectedIndex].text.replace(/^.+ /, ""), "system");
  setTimeout(() => addMsg(BOTS[ACTIVE_BOT].name, STATUS_REACTIONS[val], "ai"), 900);
});
```

---

## Feature B: Save Conversation

### HTML placement
Add button to the existing `.toolbar`:
```html
<button id="btn-save">💾 Save chat</button>
```

### JS logic
```js
document.getElementById("btn-save").addEventListener("click", () => {
  const lines = [...CHAT_LOG.querySelectorAll(".msg-line")].map(el => el.innerText.trim());
  if (!lines.length) {
    addMsg("", "Nothing to save yet!", "system");
    return;
  }
  const header = "MSN Messenger AI — Chat Log\nSaved: " + new Date().toLocaleString() + "\n" + "=".repeat(40) + "\n\n";
  const blob = new Blob([header + lines.join("\n\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const ts = new Date().toISOString().replace(/:/g, "-").replace(/\..+/, "");
  const a = document.createElement("a");
  a.href = url;
  a.download = "msn-chat-" + ts + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  addMsg("", "Chat saved as msn-chat-" + ts + ".txt ✔", "system");
});
```

---

## Data flow

```
User selects status
  → change event fires
  → update status dot CSS class
  → addMsg() system message
  → setTimeout 900ms → addMsg() bot reaction (ai class)

User clicks Save chat
  → collect all .msg-line innerText
  → build Blob(text/plain)
  → synthetic <a download="msn-chat-<ts>.txt"> click
  → cleanup URL object
  → addMsg() confirmation
```

## Retro fidelity notes
- Status reactions use 2005 IM slang (brb, lol, (Y) emoticon, lmaooo) to stay in character.
- "Be Right Back" is spelled out in the `<option>` label — this exact string must appear in the DOM (and therefore in the bundle via the inline script, which references it).
- The save filename `msn-chat-<timestamp>` echoes the era of naming everything "msn-something".
