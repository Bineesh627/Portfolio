/* =====================================================================
   CHAT WIDGET CONFIG  (live AI via a Cloudflare Worker)

   The widget POSTs  { prompt, history }  to `workerUrl` and expects
   JSON back:  { response: "..." }.
   The worker source lives in /worker (it holds the model + the knowledge
   about Bineesh, so no API key ever reaches the browser).
   ===================================================================== */
SITE_DATA.chatbotData = {
  workerUrl: "https://portfolio-llm.bineesh-s.workers.dev/",

  botName: "Portfolio Assistant",
  statusLabel: "AI · Online",
  inputPlaceholder: "Ask anything about Bineesh...",
  disclaimer: "AI-generated answers about Bineesh's work. May contain mistakes, so please verify important details.",

  /* first message shown when the chat opens (simple HTML allowed) */
  welcome: "Hi! I'm an AI assistant trained on Bineesh S's portfolio. Ask me about his projects, skills, experience or how to work with him.",

  /* tappable starter questions, shown until the first message is sent */
  suggestions: [
    "Who is Bineesh?",
    "What projects has he built?",
    "What are his main skills?",
    "How can I contact him?"
  ],

  maxInputChars: 500,     // longest message a visitor can send
  historyTurns: 6,        // how many previous messages are sent for context
  timeoutMs: 30000        // give up on the worker after this long
};
