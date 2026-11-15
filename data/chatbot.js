/* =====================================================================
   CHAT WIDGET CONFIG  (live AI via a Cloudflare Worker)

   The widget POSTs  { prompt, messages }  to `workerUrl` and expects
   JSON back:  { response: "...", whatsapp?: "https://wa.me/..." }.
   When `whatsapp` is present the chat shows a "Continue on WhatsApp" card.
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

  /* optional buttons under the welcome message. Left empty on purpose:
     social links appear only when a visitor asks for them. */
  quickLinks: [],

  /* tappable starter questions, shown until the first message is sent */
  suggestions: [
    "Who is Bineesh?",
    "Can he build a website or app for me?",
    "Show me his projects",
    "What are his main skills?",
    "Which certificates does he have?",
    "Where has he worked?",
    "Show his blog posts",
    "How can I contact him?"
  ],

  maxInputChars: 500,     // longest message a visitor can send
  historyTurns: 6,        // how many previous messages are sent for context
  timeoutMs: 30000        // give up on the worker after this long
};
