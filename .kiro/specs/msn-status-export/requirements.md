# MSN-AI: Status Selector + Save Conversation — Requirements

## Feature A: MSN-Style Status Selector

### User stories
- **US-A1** — As a user, I can select my status (Online / Busy / Away / Be Right Back) from a dropdown in the messenger header, so the UI reflects how I'd have set my status in real 2005 MSN.
- **US-A2** — As a user, I see a coloured status dot next to my name in the header that updates to match the selected status (green = Online, red = Busy, amber = Away, yellow/amber flashing = Be Right Back).
- **US-A3** — As a user, when I change my status the currently active AI bot sends a one-line nostalgia-flavored comment reacting to my new status, so the chat feels alive.
- **US-A4** — As a user, the status dropdown uses the same Windows XP-era styling (Tahoma, XP button chrome) as the rest of the app.

### Acceptance criteria
- Dropdown has exactly four options: **Online**, **Busy**, **Away**, **Be Right Back**.
- Selecting a status triggers an `addMsg` system message: *"You are now: [Status]."*
- Bot reaction is injected as an `ai` class message within ~1 second of status change.
- Each status maps to a distinct CSS class / dot colour consistent with the existing `.online`, `.busy`, `.away` palette.
- The status selector is visible in the messenger header area (`.titlebar` or immediately below it).

---

## Feature B: Save Conversation

### User stories
- **US-B1** — As a user, I can click a "💾 Save chat" button in the toolbar to download the current chat log as a `.txt` file, so I can keep my AI conversations forever.
- **US-B2** — As a user, the filename is `msn-chat-<ISO-timestamp>.txt` (e.g. `msn-chat-2026-11-13T01-42-40.txt`), so files from multiple sessions don't collide.
- **US-B3** — As a user, the saved file contains all messages in the visible chat log in readable plain text (Who says: message text), so the file is immediately legible without special software.
- **US-B4** — As a user, the save action is entirely client-side (no upload, no server), respecting the static-site nature of the project.

### Acceptance criteria
- Button labelled "💾 Save chat" appears in the existing `.toolbar`.
- Clicking it creates a `Blob` of type `text/plain` containing the full chat log text.
- A temporary `<a>` element with `download="msn-chat-<timestamp>.txt"` is programmatically clicked and removed.
- The timestamp in the filename uses a URL-safe format (colons replaced with hyphens).
- If the chat log is empty, a system message "Nothing to save yet!" is shown instead of downloading an empty file.
