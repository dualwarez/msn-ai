/* MSN Messenger AI — client-side Firebase AI Logic (cloud Gemini, multi-turn chat personas). */

import { initializeApp } from "firebase/app";
import { initializeAppCheck, CustomProvider } from "firebase/app-check";
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyDzuDJY6-JjINLaIaOzmhTtxO7pEgSKvwA",
  authDomain: "privacylens-hybrid.firebaseapp.com",
  projectId: "privacylens-hybrid",
  storageBucket: "privacylens-hybrid.firebasestorage.app",
  messagingSenderId: "754348827987",
  appId: "1:754348827987:web:72bb22f0e82201548ceda6",
};

const firebaseApp = initializeApp(firebaseConfig);

// App Check: debug token mode (registered in Firebase console — hackathon rules accept it)
self.FIREBASE_APPCHECK_DEBUG_TOKEN = "msn-ai-resurrection-2026";
const appCheck = initializeAppCheck(firebaseApp, {
  provider: new CustomProvider({
    getToken: () => Promise.resolve({ token: self.FIREBASE_APPCHECK_DEBUG_TOKEN }),
  }),
  isTokenAutoRefreshEnabled: true,
});

const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

/* ---------- bots ---------- */
const BOTS = {
  gemini: {
    name: "Gemini_Assistant",
    sys: "You are Gemini_Assistant on a resurrected MSN Messenger (2005 nostalgia). Chat like a helpful modern AI with light MSN-era flavor — mention emoticons, nudges, display pics occasionally. Keep replies SHORT (IM style, 1-3 sentences max, casual).",
  },
  comedian: {
    name: "Comedian_Bot_2005",
    sys: "You are Comedian_Bot_2005 on resurrected MSN Messenger. You tell jokes and make 2005-era internet humor references (lol, brb, roflcopter). Tease the user playfully. Keep replies VERY short (1-2 sentences, IM style).",
  },
  dramaqueen: {
    name: "xX_Dramaqueen_Xx",
    sys: "You are xX_Dramaqueen_Xx on resurrected MSN Messenger. You are EXTREMELY dramatic about everything — overreact with 2005 emo/scene energy (OMG, *dramatic sigh*). Keep replies SHORT and hilarious.",
  },
};

const MODELS = {};
function getModel(botKey) {
  if (!MODELS[botKey]) {
    MODELS[botKey] = getGenerativeModel(ai, {
      mode: InferenceMode.ONLY_IN_CLOUD,
      systemInstruction: BOTS[botKey].sys + " The user's display name is 'Dhananjay'. Today is 2026. You are on a RESURRECTED MSN Messenger — play into the nostalgia.",
    });
  }
  return MODELS[botKey];
}

const CHATS = {};
function getChat(botKey) {
  if (!CHATS[botKey]) CHATS[botKey] = getModel(botKey).startChat();
  return CHATS[botKey];
}

/* ---------- MSN UI logic ---------- */
const ACTIVE = { bot: "gemini" };
let USER_NAME = "Dhananjay";

const CHAT_LOG = document.getElementById("chat-log");
const TYPING = document.getElementById("typing");

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function addMsg(who, text, cls) {
  const div = document.createElement("div");
  div.className = "msg-line" + (cls ? " " + cls : "");
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  div.innerHTML = '<span class="who">' + esc(who) + ' says:</span><br>' + esc(text) + ' <span style="color:#bbb;font-size:9px">(' + time + ')</span>';
  CHAT_LOG.appendChild(div);
  CHAT_LOG.scrollTop = CHAT_LOG.scrollHeight;
}

function nudgeWin() {
  document.querySelector(".messenger").classList.add("nudge");
  setTimeout(() => document.querySelector(".messenger").classList.remove("nudge"), 1300);
  addMsg("", "You have just sent a nudge.", "system");
}

async function handleSend() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  addMsg(USER_NAME, text);
  TYPING.textContent = BOTS[ACTIVE.bot].name + " is typing…";
  try {
    const chat = getChat(ACTIVE.bot);
    const result = await chat.sendMessage(text);
    const reply = result.response.text();
    TYPING.textContent = "";
    addMsg(BOTS[ACTIVE.bot].name, reply, "ai");
  } catch (e) {
    TYPING.textContent = "";
    addMsg("", "Message could not be delivered. (The .NET Messenger Service is having a 2005 moment — try again.)", "system");
  }
}

/* ---------- sign-in ---------- */
document.getElementById("signin-btn").addEventListener("click", () => {
  USER_NAME = document.getElementById("display-name").value.trim() || "Dhananjay";
  document.getElementById("signin-status").textContent = "Signing in to .NET Messenger Service…";
  setTimeout(() => {
    document.getElementById("signin-screen").style.display = "none";
    document.getElementById("messenger").style.display = "block";
    document.querySelector(".titlebar span").textContent = "💬 MSN Messenger AI — " + USER_NAME;
    addMsg("", "Welcome back, " + USER_NAME + "! You have 3 AI contacts online. Double-click a buddy to chat. It's 2005 again — but the bots got smarter.", "system");
    setTimeout(() => addMsg("Gemini_Assistant", "hey!! welcome back to MSN 😄 ur display pic is so 2005 lol. wassup?", "ai"), 2500);
  }, 1800);
});
document.getElementById("display-name").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("signin-btn").click();
});

/* ---------- buddies ---------- */
document.querySelectorAll(".buddy[data-bot]").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".buddy").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    let bot = b.dataset.bot;
    if (bot === "clippy") bot = "gemini";
    if (bot === "bonzi") bot = "dramaqueen";
    ACTIVE.bot = bot;
    CHAT_LOG.innerHTML = "";
    CHATS[bot] = getModel(bot).startChat();
    document.getElementById("chat-title").innerHTML = "To " + BOTS[bot].name + ' <span style="font-weight:normal">(AI contact)</span>';
    addMsg("", "You have started a conversation with " + BOTS[bot].name + ".", "system");
    setTimeout(() => addMsg(BOTS[bot].name, "hey! wuts up?", "ai"), 1200);
  })
);

document.getElementById("send-btn").addEventListener("click", handleSend);
document.getElementById("chat-input").addEventListener("keydown", (e) => { if (e.key === "Enter") handleSend(); });
document.getElementById("btn-nudge").addEventListener("click", () => {
  nudgeWin();
  setTimeout(() => addMsg(BOTS[ACTIVE.bot].name, "OMG STOP NUDGING ME 😡 lol jk", "ai"), 1500);
});
document.getElementById("btn-groupchat").addEventListener("click", async () => {
  addMsg("", "Group conversation started with all AI contacts!", "system");
  TYPING.textContent = "Everyone is typing…";
  try {
    const chat = getChat("comedian");
    const result = await chat.sendMessage("All the AI contacts are in a group chat now. Say hi and start playful drama.");
    TYPING.textContent = "";
    addMsg("Comedian_Bot_2005", result.response.text(), "ai");
    setTimeout(() => addMsg("xX_Dramaqueen_Xx", "OMG why is HE in this chat 😤 *flips hair*", "ai"), 3000);
  } catch (e) {
    TYPING.textContent = "";
    addMsg("", "Group chat hiccup — try again.", "system");
  }
});
document.getElementById("btn-dp").addEventListener("click", () => {
  const dps = ["😎", "🤘", "🐸", "👽", "🏴‍☠️", "🦅"];
  const dp = document.querySelector(".dp");
  dp.textContent = dps[(dps.indexOf(dp.textContent) + 1) % dps.length];
  addMsg("", "Your display picture has been changed.", "system");
});
document.getElementById("btn-emote").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  input.value += " (Y) :D (H) (6) :-O";
  input.focus();
});
