# portfolio-llm (Cloudflare Worker)

`worker.js` is GENERATED. Never edit it by hand.

| You want to change | Edit | Then |
|---|---|---|
| What the AI knows (projects, blogs, certificates, experience, skills...) | `../data/*` | `node worker/build.js` |
| How it talks / sales skill / rules | `system-prompt.md` | `node worker/build.js` |
| Logic (retrieval, WhatsApp trigger, rate limit) | `src/worker.template.js` | `node worker/build.js` |

SEO data (`data/metadata.js`) and sample testimonials are never included.

## Deploy
- Dashboard: Workers & Pages -> portfolio-llm -> Edit code -> paste `worker.js` -> Deploy (the `AI` binding must exist).
- or CLI: `cd worker && npx wrangler deploy`

## API
`POST { prompt, messages }` -> `{ response, whatsapp? }`. `whatsapp` is a wa.me link (pre-filled with the visitor's need) returned when the conversation reaches the closing step; the site shows it as a button.

Optional variables: `ALLOWED_ORIGINS` (comma list), `MODEL` (default `@cf/meta/llama-3.1-8b-instruct`; `@cf/meta/llama-3.3-70b-instruct-fp8-fast` is smarter).
