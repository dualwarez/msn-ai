# MSN-AI — Product Steering

## What
MSN-AI is a resurrected MSN Messenger (2005 era) web app with three AI bot contacts powered by Google Gemini via Firebase AI Logic. It is a nostalgia-first, hackathon-grade static site that runs entirely in the browser.

## Why
Built for the **Kiroween 2026 hackathon** (Resurrection category). The goal is to bring back the chaotic, emoticon-saturated experience of MSN Messenger — nudges, display pics, buddy lists, the .NET Messenger Service sign-in screen — but wire it to modern AI so the bots actually talk back.

## Core experience pillars
1. **Retro fidelity** — Windows XP chrome, Tahoma font, MSN blue gradient titlebar, ad bar at the bottom, the works.
2. **AI personalities** — Three distinct bots (Gemini_Assistant, Comedian_Bot_2005, xX_Dramaqueen_Xx) with persona-locked system prompts, short IM-style replies.
3. **Nostalgia interactions** — Nudge, group chat, display pic cycling, emoticon injection.
4. **Status awareness** — User status (Online / Busy / Away / Be Right Back) is visible and bots react with one-line 2005-flavored comments.
5. **Conversation portability** — Users can save any chat as a plain-text file for posterity.

## Non-goals
- No server-side auth, databases, or user accounts — everything is client-side.
- No monetisation or analytics.
- Do NOT touch the Firebase config (`firebaseConfig` object) or the AI SDK initialisation.
