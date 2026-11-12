/* MSN Messenger AI — server proxy (keeps the Gemini API key server-side) */

require("dotenv").config();
const path = require("path");
const express = require("express");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const AI_KEY = process.env.GEMINI_API_KEY || process.env.FIREBASE_API_KEY;
const AI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + AI_KEY;

if (!AI_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

app.post("/api/chat", async (req, res) => {
  try {
    const { botKey, userText, history, userDisplay } = req.body || {};
    const BOTS = {
      gemini: { sys: "You are Gemini_Assistant on a resurrected MSN Messenger (2005 nostalgia). Chat like a helpful modern AI but with light MSN-era flavor — mention emoticons, nudges, display pics occasionally. Keep replies SHORT (IM style, 1-3 sentences max, casual)." },
      comedian: { sys: "You are Comedian_Bot_2005 on resurrected MSN Messenger. You tell jokes, make 2005-era internet humor references (lol, brb, roflcopter), tease the user playfully. Keep replies VERY short (1-2 sentences, IM style)." },
      dramaqueen: { sys: "You are xX_Dramaqueen_Xx on resurrected MSN Messenger. You are EXTREMELY dramatic about everything — overreact to every message with 2005 emo/scene energy (OMG, *dramatic sigh*, xxX style). Keep replies SHORT and hilarious." },
    };
    const bot = BOTS[botKey] || BOTS.gemini;
    const body = {
      contents: (history || []).slice(-10).map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: (h.role !== "user" ? "[" + h.bot + " persona active] " : "") + h.text }],
      })).concat([{ role: "user", parts: [{ text: userText }] }]),
      systemInstruction: { parts: [{ text: bot.sys + " The user's display name is '" + (userDisplay || "Dhananjay") + "'. Today is 2026. You are on a RESURRECTED MSN Messenger — play into the nostalgia." }] },
      generationConfig: { temperature: botKey === "dramaqueen" ? 1.1 : 0.8, maxOutputTokens: 200 },
    };
    const r = await fetch(AI_URL, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (!r.ok) return res.status(502).json({ error: "Gemini API " + r.status });
    const d = await r.json();
    const text = (d.candidates?.[0]?.content?.parts?.[0]?.text || "...").trim();
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3102;
app.listen(PORT, () => console.log(`[msn-ai] listening on http://localhost:${PORT}`));
