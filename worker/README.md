# portfolio-llm — Cloudflare Worker (Workers AI)

Backend for the chat widget. Takes `POST { prompt, history }`, returns `{ response }`.
The model + the knowledge about Bineesh live here, so no API key is exposed in the browser.

## Deploy
    cd worker
    npx wrangler login
    npx wrangler deploy          # -> https://portfolio-llm.<your-subdomain>.workers.dev

Put that URL in `data/chatbot.js` (`workerUrl`).

## Update what the bot knows
Edit `../llms.txt`, then `node build-knowledge.js` and `npx wrangler deploy`.

## Lock it down (recommended)
In `wrangler.toml` set `ALLOWED_ORIGINS = "https://bineeshs.vercel.app"` (comma-separate more sites).
Add a Cloudflare rate-limiting rule on the worker to stop abuse of your free AI quota.

## Test
    curl -X POST https://portfolio-llm.bineesh-s.workers.dev/ \
      -H "Content-Type: application/json" -d '{"prompt":"What projects has Bineesh built?"}'
